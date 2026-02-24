const { AppDataSource } = require('../config/database');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');

// Helper to get repositories
const getVendorRepo = () => AppDataSource.getRepository('Vendor');
const getProductRepo = () => AppDataSource.getRepository('Product');
const getOrderItemRepo = () => AppDataSource.getRepository('OrderItem');
const getOrderRepo = () => AppDataSource.getRepository('Order');

// @desc    Register a new vendor
// @route   POST /api/vendors/register
// @access  Private (Registered User)
exports.registerVendor = asyncHandler(async (req, res, next) => {
    const vendorRepo = getVendorRepo();

    // Check if user already has a vendor profile
    const existingVendor = await vendorRepo.findOne({
        where: { userId: req.user.id }
    });

    if (existingVendor) {
        return next(new ErrorResponse('User already has a vendor account', 400));
    }

    const { storeName, storeDescription, businessAddress, gstNumber, panNumber } = req.body;

    const vendor = vendorRepo.create({
        userId: req.user.id,
        storeName,
        storeDescription,
        businessAddress,
        gstNumber,
        panNumber,
        status: 'pending'
    });

    await vendorRepo.save(vendor);

    res.status(201).json({
        success: true,
        data: vendor
    });
});

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
// @access  Private (Vendor)
exports.getVendorProfile = asyncHandler(async (req, res, next) => {
    const vendorRepo = getVendorRepo();

    const vendor = await vendorRepo.findOne({
        where: { userId: req.user.id }
    });

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
    const vendorRepo = getVendorRepo();

    const vendor = await vendorRepo.findOne({
        where: { id: parseInt(req.params.id) }
    });

    if (!vendor) {
        return next(new ErrorResponse('Vendor not found', 404));
    }

    // Use transaction for atomic update
    const updatedVendor = await AppDataSource.manager.transaction(async (manager) => {
        vendor.status = 'active';
        return await manager.save(vendor);
    });

    res.status(200).json({
        success: true,
        data: updatedVendor
    });
});

// @desc    Get vendor stats
// @route   GET /api/vendors/stats
// @access  Private (Vendor)
exports.getVendorStats = asyncHandler(async (req, res, next) => {
    const vendorRepo = getVendorRepo();
    const productRepo = getProductRepo();
    const orderItemRepo = getOrderItemRepo();

    const vendor = await vendorRepo.findOne({
        where: { userId: req.user.id }
    });

    if (!vendor) {
        return next(new ErrorResponse('Vendor profile not found', 404));
    }

    // Get total products
    const totalProducts = await productRepo.count({
        where: { vendorId: vendor.id }
    });

    // Get revenue stats using aggregation
    const revenueData = await orderItemRepo
        .createQueryBuilder('orderItem')
        .select('SUM(orderItem.netAmount)', 'totalRevenue')
        .addSelect('SUM(orderItem.commission)', 'totalCommission')
        .where('orderItem.vendorId = :vendorId', { vendorId: vendor.id })
        .getRawOne();

    res.status(200).json({
        success: true,
        data: {
            totalProducts,
            totalRevenue: parseFloat(revenueData.totalRevenue || 0),
            totalCommission: parseFloat(revenueData.totalCommission || 0),
            balance: vendor.accountBalance
        }
    });
});

// @desc    Get vendor orders
// @route   GET /api/vendors/orders
// @access  Private (Vendor)
exports.getVendorOrders = asyncHandler(async (req, res, next) => {
    const vendorRepo = getVendorRepo();
    const orderRepo = getOrderRepo();

    const vendor = await vendorRepo.findOne({
        where: { userId: req.user.id }
    });

    if (!vendor) {
        return next(new ErrorResponse('Vendor profile not found', 404));
    }

    // Get orders containing vendor's products using query builder
    const orders = await orderRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.orderItems', 'orderItems')
        .where('orderItems.vendorId = :vendorId', { vendorId: vendor.id })
        .orderBy('order.createdAt', 'DESC')
        .getMany();

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});
