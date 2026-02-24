const { AppDataSource } = require('../config/database');
const logisticsService = require('../utils/logisticsService');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');
const { sendEmail, getShippingUpdateTemplate } = require('../utils/emailService');

// Helper to get repositories
const getOrderRepo = () => AppDataSource.getRepository('Order');
const getTimelineRepo = () => AppDataSource.getRepository('OrderTimeline');

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
    const orderRepo = getOrderRepo();

    // Find order by Shiprocket order_id or AWB
    const order = await orderRepo.findOne({
        where: [
            { shiprocketOrderId: order_id },
            { awbCode: awb }
        ],
        relations: ['user', 'timeline']
    });

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

        // Send Email if Shipped
        if (internalStatus === 'Shipped') {
            try {
                await sendEmail({
                    email: order.user ? order.user.email : order.email,
                    subject: `Your Order #${order.id} has been Shipped!`,
                    html: getShippingUpdateTemplate(order)
                });
            } catch (emailErr) {
                console.error('Shipping Email Failed:', emailErr.message);
            }
        }

        await AppDataSource.manager.transaction(async (manager) => {
            await manager.save(order);

            // Add to timeline
            const timelineEntry = manager.create('OrderTimeline', {
                orderId: order.id,
                status: internalStatus,
                description: `Courier status update: ${current_status}`
            });
            await manager.save(timelineEntry);
        });
    }

    res.status(200).json({ success: true });
});

// @desc    Trigger Manual Shipment (Backup)
// @route   POST /api/logistics/ship/:orderId
// @access  Private (Admin)
exports.createShipmentManually = asyncHandler(async (req, res, next) => {
    const orderRepo = getOrderRepo();
    const orderId = parseInt(req.params.orderId);

    const order = await orderRepo.findOne({
        where: { id: orderId },
        relations: ['user', 'orderItems', 'orderItems.product']
    });

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    // Logic to prepare Shiprocket Payload
    const shiprocketPayload = {
        order_id: order.id,
        order_date: order.createdAt,
        pickup_location: "Primary", // Should be vendor address in future
        billing_customer_name: order.name,
        billing_last_name: "",
        billing_address: order.address,
        billing_city: order.city,
        billing_pincode: order.postalCode,
        billing_state: order.state,
        billing_country: order.country,
        billing_email: order.email,
        billing_phone: order.phone,
        shipping_is_billing: true,
        order_items: order.orderItems.map(item => ({
            name: item.name,
            sku: item.product ? item.product.id.toString() : 'UNKNOWN',
            units: item.qty,
            selling_price: parseFloat(item.price)
        })),
        payment_method: "Prepaid",
        sub_total: parseFloat(order.totalPrice),
        length: parseFloat(order.length || 0.5),
        width: parseFloat(order.width || 0.5),
        height: parseFloat(order.height || 0.5),
        weight: parseFloat(order.weight || 0.5)
    };

    const shiprocketOrder = await logisticsService.createOrder(shiprocketPayload);

    // Assign AWB
    const awbData = await logisticsService.generateAWB(shiprocketOrder.shipment_id);

    // Update order with logistics info
    order.shipmentId = shiprocketOrder.shipment_id;
    order.shiprocketOrderId = shiprocketOrder.order_id;
    order.awbCode = awbData.awb_assign_status?.body?.awb_code || "";
    order.courierName = awbData.awb_assign_status?.body?.courier_name || "";
    order.status = 'Shipped';

    await AppDataSource.manager.transaction(async (manager) => {
        await manager.save(order);

        const timelineEntry = manager.create('OrderTimeline', {
            orderId: order.id,
            status: 'Shipped',
            description: 'Shipment created and AWB assigned via automation.'
        });
        await manager.save(timelineEntry);
    });

    res.status(200).json({
        success: true,
        data: {
            shipmentId: order.shipmentId,
            orderId: order.shiprocketOrderId,
            awbCode: order.awbCode,
            courierName: order.courierName
        }
    });
});

// @desc    Get Order Status/Tracking Data
// @route   GET /api/logistics/status/:orderId
// @access  Public (for tracking search)
exports.getOrderStatus = asyncHandler(async (req, res, next) => {
    const orderRepo = getOrderRepo();
    const orderId = parseInt(req.params.orderId);

    const order = await orderRepo.findOne({
        where: { id: orderId },
        relations: ['timeline', 'orderItems']
    });

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        data: {
            _id: order.id,
            status: order.status,
            timeline: order.timeline,
            shippingAddress: {
                address: order.address,
                city: order.city,
                state: order.state,
                postalCode: order.postalCode,
                country: order.country
            },
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
    const orderRepo = getOrderRepo();
    const cleanOrderId = parseInt(orderId);

    const order = await orderRepo.findOne({ where: { id: cleanOrderId } });

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    if (order.status !== 'Delivered') {
        return next(new ErrorResponse('Return only possible for delivered assets.', 400));
    }

    order.status = 'Return Requested';

    await AppDataSource.manager.transaction(async (manager) => {
        await manager.save(order);

        const timelineEntry = manager.create('OrderTimeline', {
            orderId: order.id,
            status: 'Return Requested',
            description: `Customer initiated return. Reason: ${reason}`
        });
        await manager.save(timelineEntry);
    });

    res.status(200).json({
        success: true,
        message: 'Return request logged in manifest.'
    });
});
