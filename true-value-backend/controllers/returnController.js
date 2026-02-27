const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Vendor = require('../models/Vendor');
const Return = require('../models/Return');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret'
});

// @desc    Submit a return request
// @route   POST /api/returns
// @access  Private
exports.submitReturnRequest = asyncHandler(async (req, res, next) => {
    const { orderId, items, reason } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    // 1. Validation: Time Window (7 Days)
    const returnWindowDays = 7;
    const deliveryDate = order.deliveredAt || order.updatedAt;
    const daysSinceDelivery = (Date.now() - new Date(deliveryDate).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceDelivery > returnWindowDays) {
        return next(new ErrorResponse(`Return window of ${returnWindowDays} days has expired`, 400));
    }

    // 2. Validation: Status must be Delivered
    if (order.status !== 'Delivered') {
        return next(new ErrorResponse('Only delivered orders can be returned', 400));
    }

    // 3. Calculate refund amount for selected items
    let refundAmount = 0;
    const itemsToReturn = [];

    items.forEach(item => {
        const orderItem = order.orderItems.find(oi => oi.product.toString() === item.productId.toString());
        if (orderItem) {
            refundAmount += parseFloat(orderItem.price) * item.qty;
            itemsToReturn.push({
                product: orderItem.product,
                qty: item.qty,
                price: parseFloat(orderItem.price),
                vendor: orderItem.vendor // This assumes vendor ID is stored in orderItems
            });
        }
    });

    const returnRequest = await Return.create({
        order: order._id,
        user: req.user._id,
        items: itemsToReturn,
        reason,
        refundAmount
    });

    res.status(201).json({
        success: true,
        data: returnRequest
    });
});

// @desc    Approve/Reject Return (Admin/Vendor)
// @route   PUT /api/returns/:id/status
// @access  Private (Admin/Vendor)
exports.updateReturnStatus = asyncHandler(async (req, res, next) => {
    const { status, notes } = req.body;

    const returnRequest = await Return.findById(req.params.id).populate('order');

    if (!returnRequest) {
        return next(new ErrorResponse('Return request not found', 404));
    }

    returnRequest.status = status;
    if (req.user.role === 'admin') returnRequest.adminNotes = notes;
    if (req.user.role === 'vendor') returnRequest.vendorNotes = notes;

    // IF APPROVED AND READY FOR REFUND
    if (status === 'Refund Initiated') {
        const order = returnRequest.order;

        // Note: Check if order has razorpayPaymentId. 
        // This might be in a nested field or separate payment model depending on implementation.
        // Assuming it's in order for now as per previous logic.
        if (!order.razorpayPaymentId) {
            return next(new ErrorResponse('Original payment ID not found for refund', 400));
        }

        try {
            // Initiate Razorpay Refund
            const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
                amount: Math.round(returnRequest.refundAmount * 100), // paise
                notes: {
                    reason: returnRequest.reason,
                    return_id: returnRequest._id.toString()
                }
            });

            returnRequest.refundId = refund.id;

            // FINANCIAL ADJUSTMENT
            for (const item of returnRequest.items) {
                const vendor = await Vendor.findById(item.vendor);
                if (vendor) {
                    const orderItem = order.orderItems.find(oi => oi.product.toString() === item.product.toString());
                    const commissionRate = vendor.commissionRate || 10;
                    const itemTotal = item.price * item.qty;
                    const commissionAmount = itemTotal * (commissionRate / 100);
                    const vendorShare = itemTotal - commissionAmount;

                    vendor.accountBalance = (vendor.accountBalance || 0) - vendorShare;
                    vendor.totalRefunded = (vendor.totalRefunded || 0) + vendorShare;
                    await vendor.save();
                }
            }
        } catch (error) {
            console.error('Razorpay Refund Error:', error.message);
            return next(new ErrorResponse('Failed to initiate Razorpay refund', 500));
        }
    }

    if (status === 'Completed') {
        returnRequest.order.status = 'Refunded';
        await returnRequest.order.save();
    }

    await returnRequest.save();

    res.status(200).json({
        success: true,
        data: returnRequest
    });
});

// @desc    Get all returns
// @route   GET /api/returns
// @access  Private (Admin/Vendor/User)
exports.getReturns = asyncHandler(async (req, res, next) => {
    let query = {};

    if (req.user.role === 'admin') {
        query = {};
    } else if (req.user.role === 'vendor') {
        // Vendors only see returns containing their items
        const vendor = await Vendor.findOne({ user: req.user._id });
        if (!vendor) return next(new ErrorResponse('Vendor profile not found', 404));
        query = { "items.vendor": vendor._id };
    } else {
        query = { user: req.user._id };
    }

    const returns = await Return.find(query)
        .populate('order', 'status totalPrice createdAt')
        .sort('-createdAt');

    res.status(200).json({ success: true, count: returns.length, data: returns });
});
