const Razorpay = require('razorpay');
const crypto = require('crypto');
const { AppDataSource } = require('../config/database');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');
const { sendEmail, getOrderConfirmationTemplate } = require('../utils/emailService');
const { generateInvoice } = require('../utils/invoiceGenerator');
const logisticsService = require('../utils/logisticsService');
const path = require('path');
const fs = require('fs');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret'
});

// Helper to get repository
const getOrderRepo = () => AppDataSource.getRepository('Order');

// @desc    Create Razorpay Order
// @route   POST /api/payments/razorpay/order
// @access  Private
exports.createRazorpayOrder = asyncHandler(async (req, res, next) => {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
        amount: Math.round(amount * 100), // Amount in paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return next(new ErrorResponse('Razorpay Order creation failed', 500));
    }
});

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/razorpay/verify
// @access  Private
exports.verifyRazorpayPayment = asyncHandler(async (req, res, next) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId // Internal DB Order ID
    } = req.body;

    const internalOrderId = parseInt(orderId);
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret')
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // Payment is verified
        const orderRepo = getOrderRepo();
        const order = await orderRepo.findOne({
            where: { id: internalOrderId },
            relations: ['user', 'orderItems', 'orderItems.product']
        });

        if (!order) {
            return next(new ErrorResponse('Internal Order not found', 404));
        }

        // --- TRANSACTION FOR PAYMENT UPDATE ---
        const updatedOrder = await AppDataSource.manager.transaction(async (manager) => {
            // Update Order Payment status
            order.isPaid = true;
            order.paidAt = new Date();
            order.status = 'Processing';

            await manager.save(order);

            // Create timeline entry
            const timelineEntry = manager.create('OrderTimeline', {
                orderId: internalOrderId,
                status: 'Paid',
                description: `Payment verified via Razorpay. ID: ${razorpay_payment_id}`
            });
            await manager.save(timelineEntry);

            // Create or update payment record
            const paymentRepo = manager.getRepository('Payment');
            let payment = await paymentRepo.findOne({ where: { orderId: internalOrderId } });

            if (payment) {
                payment.razorpayPaymentId = razorpay_payment_id;
                payment.razorpayOrderId = razorpay_order_id;
                payment.razorpaySignature = razorpay_signature;
                payment.status = 'captured';
            } else {
                payment = manager.create('Payment', {
                    orderId: internalOrderId,
                    razorpayPaymentId: razorpay_payment_id,
                    razorpayOrderId: razorpay_order_id,
                    razorpaySignature: razorpay_signature,
                    status: 'captured'
                });
            }
            await manager.save(payment);

            return order;
        });

        // --- AUTOMATED LOGISTICS INTEGRATION ---
        try {
            const shipmentResult = await logisticsService.createShipment(updatedOrder);

            if (shipmentResult.success) {
                await AppDataSource.manager.update('Order',
                    { id: internalOrderId },
                    {
                        shipmentId: shipmentResult.shipment_id,
                        shiprocketOrderId: shipmentResult.order_id,
                        awbCode: shipmentResult.awb_code,
                        courierName: shipmentResult.courier_name,
                        status: 'Shipped'
                    }
                );

                // Add shipping timeline
                await AppDataSource.manager.save('OrderTimeline', {
                    orderId: internalOrderId,
                    status: 'Shipped',
                    description: `Shipment created with ${shipmentResult.courier_name}. AWB: ${shipmentResult.awb_code}`
                });
            }
        } catch (logisticsError) {
            console.error('Logistics automation failed:', logisticsError);
        }

        // --- GENERATE INVOICE ---
        const invoicesDir = path.join(__dirname, '../invoices');
        if (!fs.existsSync(invoicesDir)) {
            fs.mkdirSync(invoicesDir, { recursive: true });
        }
        const invoicePath = path.join(invoicesDir, `invoice_${internalOrderId}.pdf`);
        await generateInvoice(updatedOrder, invoicePath);

        // --- SEND EMAIL CONFIRMATION ---
        try {
            const emailTemplate = getOrderConfirmationTemplate(updatedOrder);
            await sendEmail({
                to: updatedOrder.email,
                subject: 'Order Confirmation - True Value',
                html: emailTemplate,
                attachments: [
                    {
                        filename: `invoice_${internalOrderId}.pdf`,
                        path: invoicePath
                    }
                ]
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            order: updatedOrder
        });
    } else {
        return next(new ErrorResponse('Payment verification failed', 400));
    }
}); // @desc    Razorpay Webhook Handler
// @route   POST /api/payments/razorpay/webhook
// @access  Public (Webhook)
exports.razorpayWebhook = asyncHandler(async (req, res, next) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_test_webhook_secret';
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        if (event === 'payment.captured') {
            console.log('Payment captured:', payload.id);

            // Find order and update via orderId in notes/receipt
            const orderRepo = getOrderRepo();
            await orderRepo.update(
                { /* Find by razorpay order id if stored */ },
                { isPaid: true, paidAt: new Date() }
            );

            // Add timeline
            await AppDataSource.manager.save('OrderTimeline', {
                status: 'Paid',
                description: `Payment captured via webhook. ID: ${payload.id}`
            });
        }

        if (event === 'payment.failed') {
            console.log('Payment failed:', payload.id);

            await AppDataSource.manager.save('OrderTimeline', {
                status: 'Payment Failed',
                description: `Payment failed. Reason: ${payload.error_description}`
            });
        }

        res.status(200).json({ status: 'ok' });
    } else {
        return next(new ErrorResponse('Invalid webhook signature', 400));
    }
});
