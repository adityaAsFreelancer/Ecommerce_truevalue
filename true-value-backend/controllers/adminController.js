const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');
const bcrypt = require('bcryptjs');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = asyncHandler(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue from paid orders
    const revenueData = await Order.aggregate([
        { $match: { isPaid: true } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" }
            }
        }
    ]);

    // Graph Data: Last 7 days Sales & New Users
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailySales = await Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo }, isPaid: true } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                revenue: { $sum: "$totalPrice" },
                orders: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    const dailyUsers = await User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // Format for frontend (merged by date)
    const graphData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const sale = dailySales.find(s => s._id === dateStr) || { revenue: 0, orders: 0 };
        const user = dailyUsers.find(u => u._id === dateStr) || { count: 0 };

        graphData.push({
            date: dateStr,
            revenue: sale.revenue,
            orders: sale.orders,
            users: user.count
        });
    }

    res.status(200).json({
        success: true,
        data: {
            users: totalUsers,
            products: totalProducts,
            orders: totalOrders,
            revenue: revenueData.length > 0 ? revenueData[0].totalRevenue : 0,
            graphData
        }
    });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find()
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        count: users.length,
        page,
        pages: Math.ceil(total / limit),
        data: users
    });
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getAllOrders = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { status } = req.query;
    const query = {};
    if (status && status !== 'All') {
        query.status = status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
        .populate('user', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        count: orders.length,
        page,
        pages: Math.ceil(total / limit),
        data: orders
    });
});

// @desc    Block/Unblock User
// @route   PUT /api/admin/users/:id/block
// @access  Private (Admin)
exports.blockUser = asyncHandler(async (req, res, next) => {
    const { isBlocked } = req.body;

    if (req.params.id === req.user._id.toString()) {
        console.log('BLOCK DEBUG: Admin attempted to block self');
        return next(new ErrorResponse('You cannot block your own account', 400));
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isBlocked },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
        success: true,
        message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
        data: user
    });
});

// @desc    Delete a User
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
    if (req.params.id === req.user._id.toString()) {
        console.log('DELETE DEBUG: Admin attempted to delete self');
        return next(new ErrorResponse('You cannot delete your own account', 400));
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
});

// @desc    Update a User (name, email, role)
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
    const { name, email, role, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, role, avatar },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({ success: true, data: user });
});

// @desc    Create a new user/admin by admin
// @route   POST /api/admin/users
// @access  Private (Admin)
exports.createAdminUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorResponse('Name, email, and password are required', 400));
    }

    const existing = await User.findOne({ email });
    if (existing) {
        return next(new ErrorResponse('A user with this email already exists', 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'user'
    });

    res.status(201).json({ success: true, data: user });
});

// @desc    Update Vendor Status (Mocking for now as Vendor model is shared with User)
// @route   PUT /api/admin/vendors/:id/status
// @access  Private (Admin)
exports.updateVendorStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;

    // In this implementation, vendors are users with role 'vendor'
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    if (status === 'active') {
        user.role = 'vendor';
    }

    await user.save();

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update Order Status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    order.status = status;
    if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
        success: true,
        data: order
    });
});
// @desc    Get single order details
// @route   GET /api/admin/orders/:id
// @access  Private (Admin)
exports.getOrderById = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone avatar');

    if (!order) {
        return next(new ErrorResponse('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        data: order
    });
});
