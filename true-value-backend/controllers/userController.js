const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

// Helper to generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
    console.log('REGISTER DEBUG: Body received:', req.body);
    const { name, fullName, email, password, role } = req.body;

    const userName = name || fullName;

    if (!userName) {
        return next(new ErrorResponse('Please add a name', 400));
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorResponse('User already exists', 400));
    }

    // Create user
    try {
        const user = await User.create({
            name: userName,
            email,
            password,
            role: role || 'user'
        });

        if (user) {
            console.log(`✅ User registered: ${user.email}`);
            res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (err) {
        console.error(`❌ Registration failed for ${email}: ${err.message}`);
        return next(err);
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
    console.log('LOGIN DEBUG: Body received:', req.body);
    const { email, password } = req.body;

    // Check for email and password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        const count = await User.countDocuments();
        console.log(`LOGIN DEBUG: User NOT found. Total users in DB: ${count}`);
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    console.log(`LOGIN DEBUG: User found. Comparing passwords...`);

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if user is blocked
    if (user.isBlocked) {
        return next(new ErrorResponse('Your account has been suspended. Please contact support.', 403));
    }

    res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
    });
});

// @desc    Get current user
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        phone: user.phone,
        data: user
    });
});
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {};
    if (req.body.name) fieldsToUpdate.name = req.body.name;
    if (req.body.email) fieldsToUpdate.email = req.body.email;
    if (req.body.avatar) fieldsToUpdate.avatar = req.body.avatar;
    if (req.body.phone) fieldsToUpdate.phone = req.body.phone;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});
// @desc    Update user addresses
// @route   PUT /api/auth/addresses
// @access  Private
exports.updateAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { addresses: req.body.addresses },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: user
    });
});
