const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Vendor = require('../models/Vendor');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');

// @desc    Register a new vendor
// @route   POST /api/vendors/register
// @access  Private (Registered User)
exports.registerVendor = asyncHandler(async (req, res, next) => {
    // Check if user already has a vendor profile
    const existingVendor = await Vendor.findOne({ user: req.user._id });

    if (existingVendor) {
        return next(new ErrorResponse('User already has a vendor account', 400));
    }

    const { storeName, storeDescription, businessAddress, gstNumber, panNumber } = req.body;

    const vendor = await Vendor.create({
        user: req.user._id,
        storeName,
        description: storeDescription,
        businessAddress: {
            address: businessAddress?.address,
            city: businessAddress?.city,
            state: businessAddress?.state,
            zipCode: businessAddress?.zipCode
        },
        // gst and pan are not in current Vendor schema but can be added or ignored for now
        status: 'pending'
    });

    res.status(201).json({
        success: true,
        data: vendor
    });
});

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
// @access  Private (Vendor)
exports.getVendorProfile = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.findOne({ user: req.user._id });

    if (!vendor) {
        return next(new ErrorResponse('Vendor profile not found', 404));
    }

    res.status(200).json({
        success: true,
        data: vendor
    });
});

// @desc    Verify/approve vendor (Admin only)
// @route   PUT /api/vendors/:id/verify
// @access  Private (Admin)
exports.verifyVendor = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
        return next(new ErrorResponse('Vendor not found', 404));
    }

    vendor.status = 'active';
    vendor.isVerified = true;
    await vendor.save();

    res.status(200).json({
        success: true,
        data: vendor
    });
});

// @desc    Get vendor stats
// @route   GET /api/vendors/stats
// @access  Private (Vendor)
exports.getVendorStats = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.findOne({ user: req.user._id });

    if (!vendor) {
        return next(new ErrorResponse('Vendor profile not found', 404));
    }

    // Get total products
    const totalProducts = await Product.countDocuments({ vendor: vendor._id });

    // In this Mongoose schema, total income matches totalSpent in order items
    // We'd need to aggregate orders to get actual revenue
    const revenueData = await Order.aggregate([
        { $unwind: "$orderItems" },
        { $match: { "orderItems.vendor": vendor._id, status: 'Delivered' } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: {
            totalProducts,
            totalRevenue: revenueData.length > 0 ? revenueData[0].totalRevenue : 0,
            totalCommission: (revenueData.length > 0 ? revenueData[0].totalRevenue : 0) * (vendor.commissionRate / 100),
            balance: vendor.accountBalance
        }
    });
});

// @desc    Get vendor orders
// @route   GET /api/vendors/orders
// @access  Private (Vendor)
exports.getVendorOrders = asyncHandler(async (req, res, next) => {
    const vendor = await Vendor.findOne({ user: req.user._id });

    if (!vendor) {
        return next(new ErrorResponse('Vendor profile not found', 404));
    }

    // Get orders containing vendor's products
    const orders = await Order.find({
        "orderItems.vendor": vendor._id
    }).sort('-createdAt');

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});
