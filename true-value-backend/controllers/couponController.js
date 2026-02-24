const { AppDataSource } = require('../config/database');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');

// Helper to get repositories
const getCouponRepo = () => AppDataSource.getRepository('Coupon');

// @desc    Validate and Apply Coupon
// @route   POST /api/marketing/coupons/validate
// @access  Private
exports.validateCoupon = asyncHandler(async (req, res, next) => {
    const { code, orderItems, subtotal } = req.body;
    const couponRepo = getCouponRepo();

    const coupon = await couponRepo.findOne({
        where: { code, isActive: true },
        relations: ['vendor']
    });

    if (!coupon) {
        return next(new ErrorResponse('Invalid coupon code', 404));
    }

    // Check validity logic
    const now = new Date();
    if (now > coupon.expiryDate) {
        return next(new ErrorResponse('Coupon has expired', 400));
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        return next(new ErrorResponse('Coupon usage limit reached', 400));
    }

    // Check minimum order value
    if (parseFloat(subtotal) < parseFloat(coupon.minOrderValue)) {
        return next(new ErrorResponse(`Minimum order value of ₹${coupon.minOrderValue} required for this coupon`, 400));
    }

    // Check if coupon is vendor-specific
    if (coupon.vendorId) {
        const vendorItems = orderItems.filter(item => {
            // Check if item.vendor matches coupon.vendorId
            // item.vendor might be an ID string or object depending on frontend payload
            // Assuming item.vendor is ID
            return (item.vendor === coupon.vendorId || item.vendorId === coupon.vendorId);
        });

        if (vendorItems.length === 0) {
            return next(new ErrorResponse('This coupon is only valid for specific vendor products', 400));
        }
    }

    // Calculate discount
    let discount = 0;
    const orderSubtotal = parseFloat(subtotal);
    const discountVal = parseFloat(coupon.discountValue);

    if (coupon.discountType === 'percentage') {
        discount = (orderSubtotal * discountVal) / 100;
        if (coupon.maxDiscount) {
            const maxDisc = parseFloat(coupon.maxDiscount);
            if (discount > maxDisc) {
                discount = maxDisc;
            }
        }
    } else {
        discount = discountVal;
    }

    res.status(200).json({
        success: true,
        data: {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount: discount
        }
    });
});

// @desc    Create a Coupon (Admin/Vendor)
// @route   POST /api/marketing/coupons
// @access  Private (Admin/Vendor)
exports.createCoupon = asyncHandler(async (req, res, next) => {
    const couponRepo = getCouponRepo();

    if (req.user.role === 'vendor') {
        req.body.vendorId = req.user.vendorId;
    }

    const coupon = couponRepo.create(req.body);
    await couponRepo.save(coupon);

    res.status(201).json({
        success: true,
        data: coupon
    });
});

// @desc    Get all coupons
// @route   GET /api/marketing/coupons
// @access  Private (Admin/Vendor)
exports.getCoupons = asyncHandler(async (req, res, next) => {
    const couponRepo = getCouponRepo();
    let where = {};

    if (req.user.role === 'admin') {
        where = {};
    } else {
        where = { vendorId: req.user.vendorId };
    }

    const coupons = await couponRepo.find({
        where,
        order: { createdAt: 'DESC' }
    });

    res.status(200).json({
        success: true,
        count: coupons.length,
        data: coupons
    });
});
