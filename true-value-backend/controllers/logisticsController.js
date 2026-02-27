const Order = require('../models/Order');
const logisticsService = require('../utils/logisticsService');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');
const { sendEmail, getShippingUpdateTemplate } = require('../utils/emailService');

// @desc    Handle Shiprocket Webhook (Tracking Updates)
// @route   POST /api/logistics/webhook
// @access  Public
exports.handleLogisticsWebhook = asyncHandler(async (req, res, next) => {
    // Check Shiprocket Webhook Token for security
    const webhookToken = req.headers['x-shiprocket-token'];
    if (webhookToken !== process.env.SHIPROCKET_WEBHOOK_TOKEN) {
        return res.status(401).send('Unauthorized');
    }

    const { awb, current_status, current_status_id, order_id } = req.body;

    // Find order by Shiprocket order_id or AWB
    const order = await Order.findOne({
        $or: [
            { shiprocketOrderId: order_id?.toString() },
            { awbCode: awb }
        ]
    }).populate('user');

    if (order) {
        // Map Shiprocket status to Internal Status
        let internalStatus = order.status;
        if (current_status === 'SHIPPED') internalStatus = 'Shipped';
        if (current_status === 'OUT FOR DELIVERY') internalStatus = 'Out for Delivery';
        if (current_status === 'DELIVERED') {
            internalStatus = 'Delivered';
            order.isDelivered = true;
            order.deliveredAt = new Date();
        }
        if (current_status === 'CANCELLED') internalStatus = 'Cancelled';

        order.status = internalStatus;

        // Add to timeline
        order.timeline.push({
            status: internalStatus,
            description: `Courier status update: ${current_status}`,
            timestamp: new Date()
        });

        // Send Email if Shipped
        if (internalStatus === 'Shipped') {
            try {
                await sendEmail({
                    email: order.user ? order.user.email : order.shippingAddress?.email,
                    subject: `Your Order #${order._id} has been Shipped!`,
                    html: getShippingUpdateTemplate(order)
                });
            } catch (emailErr) {
                console.error('Shipping Email Failed:', emailErr.message);
            }
        }

        await order.save();
    }

    res.status(200).json({ success: true });
});

// @desc    Trigger Manual Shipment (Backup)
// @route   POST /api/logistics/ship/:orderId
// @access  Private (Admin)
exports.createShipmentManually = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId).populate('user');

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    // Logic to prepare Shiprocket Payload
    const shiprocketPayload = {
        order_id: order._id,
        order_date: order.createdAt,
        pickup_location: "Primary",
        billing_customer_name: order.user?.name || "Customer",
        billing_last_name: "",
        billing_address: order.shippingAddress.address,
        billing_city: order.shippingAddress.city,
        billing_pincode: order.shippingAddress.postalCode,
        billing_state: order.shippingAddress.state,
        billing_country: order.shippingAddress.country,
        billing_email: order.user?.email,
        billing_phone: order.user?.phone || "",
        shipping_is_billing: true,
        order_items: order.orderItems.map(item => ({
            name: item.name,
            sku: item.product ? item.product.toString() : 'UNKNOWN',
            units: item.qty,
            selling_price: parseFloat(item.price)
        })),
        payment_method: "Prepaid",
        sub_total: parseFloat(order.totalPrice),
        length: 0.5,
        width: 0.5,
        height: 0.5,
        weight: 0.5
    };

    try {
        const shiprocketOrder = await logisticsService.createOrder(shiprocketPayload);
        const awbData = await logisticsService.generateAWB(shiprocketOrder.shipment_id);

        // Update order with logistics info
        order.shipmentId = shiprocketOrder.shipment_id;
        order.shiprocketOrderId = shiprocketOrder.order_id;
        order.awbCode = awbData.awb_assign_status?.body?.awb_code || "";
        order.courierName = awbData.awb_assign_status?.body?.courier_name || "";
        order.status = 'Shipped';

        order.timeline.push({
            status: 'Shipped',
            description: 'Shipment created and AWB assigned via automation.',
            timestamp: new Date()
        });

        await order.save();

        res.status(200).json({
            success: true,
            data: {
                shipmentId: order.shipmentId,
                orderId: order.shiprocketOrderId,
                awbCode: order.awbCode,
                courierName: order.courierName
            }
        });
    } catch (err) {
        return next(new ErrorResponse(`Shiprocket Integration Error: ${err.message}`, 500));
    }
});

// @desc    Get Order Status/Tracking Data
// @route   GET /api/logistics/status/:orderId
// @access  Public (for tracking search)
exports.getOrderStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        data: {
            _id: order._id,
            status: order.status,
            timeline: order.timeline,
            shippingAddress: order.shippingAddress,
            orderItems: order.orderItems,
            logistics: {
                shipmentId: order.shipmentId,
                awbCode: order.awbCode,
                courierName: order.courierName
            }
        }
    });
});

// @desc    Initiate Return Request
// @route   POST /api/logistics/returns
// @access  Private
exports.requestReturn = asyncHandler(async (req, res, next) => {
    const { orderId, reason } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    if (order.status !== 'Delivered') {
        return next(new ErrorResponse('Return only possible for delivered assets.', 400));
    }

    order.status = 'Return Requested';
    order.timeline.push({
        status: 'Return Requested',
        description: `Customer initiated return. Reason: ${reason}`,
        timestamp: new Date()
    });

    await order.save();

    res.status(200).json({
        success: true,
        message: 'Return request logged in manifest.'
    });
});
