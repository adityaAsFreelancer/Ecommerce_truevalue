const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const { sendEmail, getOrderConfirmationTemplate } = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = asyncHandler(async (req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        discountAmount,
        couponCode
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        return next(new ErrorResponse('No order items', 400));
    }

    // Recalculate prices server-side to prevent manipulation
    let itemsPrice = 0;
    const finalOrderItems = [];

    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            return next(new ErrorResponse(`Product not found: ${item.product}`, 404));
        }

        const price = product.salePrice || product.price;
        itemsPrice += price * item.qty;

        finalOrderItems.push({
            name: product.name,
            qty: item.qty,
            image: product.images && product.images.length > 0 ? product.images[0] : item.image,
            price: price,
            product: product._id
        });
    }

    const GlobalSetting = require('../models/GlobalSetting');
    const deliveryConfig = await GlobalSetting.findOne({ key: 'delivery_config' });
    const config = deliveryConfig ? deliveryConfig.value : {
        isFreeDeliveryActive: false,
        minOrderForFreeDelivery: 500,
        baseCharge: 50,
        chargePerKm: 0,
        peakHourSurcharge: 0,
        peakHours: [],
        baseZip: '110',
        taxRate: 18
    };

    const taxRate = config.taxRate || 18;
    const taxPrice = Number(((taxRate / 100) * itemsPrice).toFixed(2));

    // Delivery Calculation
    let shippingPrice = 0;
    let deliveryDetails = {
        baseCharge: 0,
        distanceCharge: 0,
        peakHourSurcharge: 0,
        distanceKm: 0,
        isPeakHour: false
    };

    if (config.isFreeDeliveryActive || itemsPrice >= config.minOrderForFreeDelivery) {
        shippingPrice = 0;
    } else {
        // Flat Base Charge for 10-20 min delivery
        deliveryDetails.baseCharge = config.baseCharge;

        // Peak Hour Surcharge still applies (optional, keeping it for flexibility)
        const currentHour = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).getUTCHours(); // IST
        if (config.peakHours.includes(currentHour)) {
            deliveryDetails.isPeakHour = true;
            deliveryDetails.peakHourSurcharge = config.peakHourSurcharge;
        }

        shippingPrice = deliveryDetails.baseCharge + deliveryDetails.peakHourSurcharge;
    }

    // Apply Discount
    const finalDiscount = Number(discountAmount || 0);
    const totalPrice = Number((itemsPrice + taxPrice + shippingPrice - finalDiscount).toFixed(2));

    const order = new Order({
        orderItems: finalOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountAmount: finalDiscount,
        couponCode: couponCode,
        totalPrice: Math.max(0, totalPrice), // Ensure price is never negative
        deliveryDetails: {
            ...deliveryDetails,
            promise: "10-20 Minutes"
        }
    });

    const createdOrder = await (await order.save()).populate('user', 'name email');

    // 1. Send Email Notification
    try {
        await sendEmail({
            email: createdOrder.user.email,
            subject: `Order Confirmed - #${createdOrder._id}`,
            html: getOrderConfirmationTemplate(createdOrder)
        });
    } catch (err) {
        console.error(`ERROR: Failed to send order confirmation email: ${err.message}`);
    }

    // 2. Create User Notification
    await Notification.create({
        user: createdOrder.user._id,
        title: 'Order Placed!',
        message: `Your order #${createdOrder._id} has been placed and is being processed (10-20 min delivery).`,
        type: 'order'
    });

    // 3. Create Admin Notification
    await Notification.create({
        user: null, // Broadcast/Admin visible
        title: 'New Order Received',
        message: `New order #${createdOrder._id} received from ${createdOrder.user.name}. Total: ₹${createdOrder.totalPrice}`,
        type: 'admin'
    });

    res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        return next(new ErrorResponse('Order not found', 404));
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});
