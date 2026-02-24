const { AppDataSource } = require('../config/database');
const Razorpay = require('razorpay');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret'
});

// Helper to get repositories
const getReturnRepo = () => AppDataSource.getRepository('Return');
const getOrderRepo = () => AppDataSource.getRepository('Order');
const getVendorRepo = () => AppDataSource.getRepository('Vendor');

// @desc    Submit a return request
// @route   POST /api/returns
// @access  Private
exports.submitReturnRequest = asyncHandler(async (req, res, next) => {
    const { orderId, items, reason } = req.body;
    const orderRepo = getOrderRepo();
    const returnRepo = getReturnRepo();

    // Use query builder to fetch order with items
    const order = await orderRepo.findOne({
        where: { id: parseInt(orderId) },
        relations: ['orderItems', 'orderItems.product']
    });

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
    // Note: Checking for 'Delivered' status. Ensure this matches your order status logic.
    if (order.status !== 'Delivered') {
        return next(new ErrorResponse('Only delivered orders can be returned', 400));
    }

    // 3. Calculate refund amount for selected items
    let refundAmount = 0;
    const itemsToReturn = [];

    items.forEach(item => {
        // item.productId is passed from frontend, ensure type match (string/int)
        const orderItem = order.orderItems.find(oi => oi.productId === parseInt(item.productId));
        if (orderItem) {
            refundAmount += parseFloat(orderItem.price) * item.qty;
            itemsToReturn.push({
                product: orderItem.productId,
                qty: item.qty,
                price: parseFloat(orderItem.price),
                vendor: orderItem.vendorId
            });
        }
    });

    const returnRequest = returnRepo.create({
        orderId: order.id,
        userId: req.user.id,
        items: itemsToReturn, // Stored as JSONB
        reason,
        refundAmount
    });

    await AppDataSource.manager.transaction(async (manager) => {
        await manager.save(returnRequest);

        // Add to order timeline
        const timelineEntry = manager.create('OrderTimeline', {
            orderId: order.id,
            status: 'Return Requested',
            description: `Return request submitted for ${itemsToReturn.length} items. Reason: ${reason}`
        });
        await manager.save(timelineEntry);

        // Update order status if needed, though usually handled after approval
        // order.status = 'Return Requested';
        // await manager.save(order);
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
    const returnRepo = getReturnRepo();

    const returnRequest = await returnRepo.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['order', 'order.payment', 'order.orderItems']
    });

    if (!returnRequest) {
        return next(new ErrorResponse('Return request not found', 404));
    }

    returnRequest.status = status;
    if (req.user.role === 'admin') returnRequest.adminNotes = notes;
    if (req.user.role === 'vendor') returnRequest.vendorNotes = notes;

    // IF APPROVED AND READY FOR REFUND
    if (status === 'Refund Initiated') {
        const order = returnRequest.order;

        if (!order.payment || !order.payment.razorpayPaymentId) {
            return next(new ErrorResponse('Original payment ID not found for refund', 400));
        }

        try {
            // Initiate Razorpay Refund
            const refund = await razorpay.payments.refund(order.payment.razorpayPaymentId, {
                amount: Math.round(returnRequest.refundAmount * 100), // paise
                notes: {
                    reason: returnRequest.reason,
                    return_id: returnRequest.id.toString()
                }
            });

            returnRequest.refundId = refund.id;

            // FINANCIAL ADJUSTMENT (Atomic update usually preferred)
            // Reverse Vendor Earnings & Admin Commission
            // Note: returnRequest.items is JSONB, so we iterate directly
            const vendorRepo = getVendorRepo();

            for (const item of returnRequest.items) {
                const vendor = await vendorRepo.findOne({ where: { id: item.vendor } });
                if (vendor) {
                    const orderItem = order.orderItems.find(oi => oi.productId === item.product);
                    const commission = orderItem ? parseFloat(orderItem.commission) : 0;
                    // Calculate vendor share for this specific quantity being returned
                    // Logic assumes commission is per unit or total for line item. 
                    // Simplified: (ItemPrice * Qty) - (Commission * (Qty / OrderItemTotalQty))
                    // For now using simplified linear calc
                    const itemTotal = item.price * item.qty;
                    // Approximate commission reversal
                    const commissionReversal = (commission / orderItem.qty) * item.qty;

                    const vendorShare = itemTotal - commissionReversal;

                    vendor.accountBalance = parseFloat(vendor.accountBalance) - vendorShare;
                    vendor.totalRefunded = parseFloat(vendor.totalRefunded || 0) + vendorShare;
                    await vendorRepo.save(vendor);
                }
            }
        } catch (error) {
            console.error('Razorpay Refund Error:', error.message);
            return next(new ErrorResponse('Failed to initiate Razorpay refund', 500));
        }
    }

    if (status === 'Completed') {
        // Update order status using transaction
        await AppDataSource.manager.transaction(async (manager) => {
            await manager.update('Order', { id: returnRequest.orderId }, { status: 'Refunded' });
        });
    }

    await returnRepo.save(returnRequest);

    res.status(200).json({
        success: true,
        data: returnRequest
    });
});

// @desc    Get all returns
// @route   GET /api/returns
// @access  Private (Admin/Vendor/User)
exports.getReturns = asyncHandler(async (req, res, next) => {
    const returnRepo = getReturnRepo();
    let where = {};

    if (req.user.role === 'admin') {
        // Admin sees all
        where = {};
    } else if (req.user.role === 'vendor') {
        // Complex query needed for JSONB search, or simplified to just show all returns 
        // that contain items from this vendor. 
        // TypeORM JSONB querying can be database specific. PostgreSQL supports it.
        // For simplicity in this migration, we might fetch all and filter or use query builder
        return next(new ErrorResponse('Vendor return listing not fully implemented in migration', 501));
    } else {
        // User sees their own returns
        where = { userId: req.user.id };
    }

    const returns = await returnRepo.find({
        where,
        relations: ['order'],
        order: { createdAt: 'DESC' }
    });

    res.status(200).json({ success: true, count: returns.length, data: returns });
});
