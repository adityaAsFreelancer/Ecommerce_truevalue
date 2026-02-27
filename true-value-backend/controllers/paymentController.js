const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret'
});

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
            order,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        return next(new ErrorResponse('Razorpay Order creation failed', 500));
    }
});

exports.verifyRazorpayPayment = asyncHandler(async (req, res, next) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId // Internal DB Order ID
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret')
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        const order = await Order.findById(orderId);

        if (!order) {
            return next(new ErrorResponse('Order not found', 404));
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'Processing';
        order.paymentResult = {
            id: razorpay_payment_id,
            status: 'captured',
            update_time: Date.now().toString(),
        };

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            order
        });
    } else {
        return next(new ErrorResponse('Payment verification failed', 400));
    }
});


exports.razorpayWebhook = asyncHandler(async (req, res, next) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_test_webhook_secret';
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        if (event === 'payment.captured') {
            const orderId = payload.notes.orderId || payload.description.split('#')[1];
            const order = await Order.findById(orderId);
            if (order && !order.isPaid) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.status = 'Processing';
                order.paymentResult = {
                    id: payload.id,
                    status: 'captured'
                };
                await order.save();
            }
        }

        res.status(200).json({ status: 'ok' });
    } else {
        return next(new ErrorResponse('Invalid webhook signature', 400));
    }
});
