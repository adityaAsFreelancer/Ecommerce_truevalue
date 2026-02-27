const { protect } = require('./authMiddleware');
const ErrorResponse = require('../utils/errorHandler');
const fs = require('fs');
const path = require('path');

const logAuth = (message) => {
    const logPath = path.join(__dirname, '../auth_debug.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
};

// Grant access to specific roles
const authorize = (...roles) => {
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

module.exports = { protect, authorize };
