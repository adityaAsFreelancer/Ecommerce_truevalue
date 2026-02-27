const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
    const notifications = await Notification.find({
        $or: [
            { user: req.user.id },
            { user: null } // Broadcasts
        ]
    }).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({
        success: true,
        data: notifications
    });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
    let notification = await Notification.findById(req.params.id);

    if (!notification) {
        return next(new ErrorResponse('Notification not found', 404));
    }

    // Check if notification belongs to user or is broadcast
    if (notification.user && notification.user.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized', 401));
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
        success: true,
        data: notification
    });
});

// @desc    Create broadcast notification (Admin)
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
exports.createBroadcast = asyncHandler(async (req, res, next) => {
    const { title, message, type } = req.body;

    const notification = await Notification.create({
        title,
        message,
        type: type || 'admin',
        user: null // Broadcast to all
    });

    res.status(201).json({
        success: true,
        data: notification
    });
});

// @desc    Clear all user notifications
// @route   DELETE /api/notifications
// @access  Private
exports.clearNotifications = asyncHandler(async (req, res, next) => {
    await Notification.deleteMany({ user: req.user.id });

    res.status(200).json({
        success: true,
        message: 'Notifications cleared'
    });
});
