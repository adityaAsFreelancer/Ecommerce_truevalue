const Coupon = require('../models/Coupon');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');

// @desc    Validate and Apply Coupon
// @route   POST /api/marketing/coupons/validate
// @access  Private
exports.validateCoupon = asyncHandler(async (req, res, next) => {
    const { code, subtotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
        return next(new ErrorResponse('Invalid or inactive coupon code', 404));
    }

    const now = new Date();
    if (now > coupon.expiryDate) {
        return next(new ErrorResponse('Coupon has expired', 400));
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        return next(new ErrorResponse('Coupon usage limit reached', 400));
    }

    if (parseFloat(subtotal) < coupon.minOrderValue) {
        return next(new ErrorResponse(`Minimum order value of ₹${coupon.minOrderValue} required`, 400));
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
        discountAmount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
        }
    } else {
        discountAmount = coupon.discountValue;
    }

    res.status(200).json({
        success: true,
        data: {
            code: coupon.code,
            description: coupon.description, // Added description field
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount: Number(discountAmount.toFixed(2))
        }
    });
});

// @desc    Get active coupons for users
// @route   GET /api/marketing/active
// @access  Private
exports.getActiveCoupons = asyncHandler(async (req, res, next) => {
    // Current date at midnight for inclusive comparison
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

    // Find coupons that are active, not expired, and haven't reached usage limit
    const coupons = await Coupon.find({
        isActive: true,
        expiryDate: { $gte: startOfToday },
        $or: [
            { usageLimit: null },
            { usageLimit: { $exists: false } },
            { $expr: { $lt: ["$usedCount", "$usageLimit"] } }
        ]
    }).select('code discountType discountValue minOrderValue maxDiscount description usageLimit usedCount');

    res.status(200).json({
        success: true,
        count: coupons.length,
        data: coupons
    });
});

// @desc    Create a Coupon (Admin)
// @route   POST /api/marketing/coupons
// @access  Private (Admin)
exports.createCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
        success: true,
        data: coupon
    });
});

// @desc    Get all coupons
// @route   GET /api/marketing/coupons
// @access  Private (Admin)
exports.getCoupons = asyncHandler(async (req, res, next) => {
    const coupons = await Coupon.find().sort('-createdAt');

    res.status(200).json({
        success: true,
        count: coupons.length,
        data: coupons
    });
});

// @desc    Toggle Coupon Active Status
// @route   PUT /api/marketing/coupons/:id/toggle
// @access  Private (Admin)
exports.toggleCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
        return next(new ErrorResponse('Coupon not found', 404));
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({
        success: true,
        data: coupon
    });
});

// @desc    Delete Coupon
// @route   DELETE /api/marketing/coupons/:id
// @access  Private (Admin)
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
        return next(new ErrorResponse('Coupon not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully'
    });
});
