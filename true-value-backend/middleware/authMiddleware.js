const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorHandler');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const logAuth = (message) => {
    const logPath = path.join(__dirname, '../auth_debug.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
};

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        logAuth('AUTH DEBUG: No token found in headers');
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logAuth(`AUTH DEBUG: Token verified for ID: ${decoded.id}`);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            logAuth(`AUTH DEBUG: User NOT found in DB for ID: ${decoded.id}`);
            return next(new ErrorResponse('User not found with this id', 404));
        }

        logAuth(`AUTH DEBUG: User loaded: ${req.user.email}, Role: ${req.user.role}`);

        // Check if user is blocked
        if (req.user.isBlocked) {
            logAuth(`AUTH DEBUG: User ${req.user.email} is blocked`);
            return next(new ErrorResponse('Your account has been suspended. Please contact support.', 403));
        }

        next();
    } catch (err) {
        logAuth(`AUTH DEBUG: Token verification failed: ${err.message}`);
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            logAuth(`AUTH DEBUG: Access denied for role: ${req.user.role}. Required: ${roles} | User: ${req.user.email}`);
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};
