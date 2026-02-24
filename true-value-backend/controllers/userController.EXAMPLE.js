const { AppDataSource } = require('../config/database');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * EXAMPLE: User Controller with TypeORM
 * This demonstrates the TypeORM Repository pattern
 */

// Get TypeORM repositories
const getUserRepository = () => AppDataSource.getRepository('User');
const getAddressRepository = () => AppDataSource.getRepository('UserAddress');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const userRepo = getUserRepository();

    // Check if user exists
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
        return next(new ErrorResponse('User already exists', 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = userRepo.create({
        name,
        email,
        password: hashedPassword
    });

    await userRepo.save(user);

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(201).json({
        success: true,
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const userRepo = getUserRepository();

    // Find user
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private (requires protect middleware)
exports.getProfile = asyncHandler(async (req, res, next) => {
    const userRepo = getUserRepository();
    const addressRepo = getAddressRepository();

    // Get user with addresses
    const user = await userRepo.findOne({
        where: { id: req.user.id },
        select: ['id', 'name', 'email', 'phone', 'avatar', 'role', 'createdAt']
    });

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Get addresses separately
    const addresses = await addressRepo.find({
        where: { userId: user.id }
    });

    res.status(200).json({
        success: true,
        data: {
            ...user,
            addresses
        }
    });
});

// @desc    Update user addresses
// @route   PUT /api/auth/addresses
// @access  Private
exports.updateAddresses = asyncHandler(async (req, res, next) => {
    const { addresses } = req.body;
    const addressRepo = getAddressRepository();

    // Use transaction for atomic operation
    await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        // Delete existing addresses
        await transactionalEntityManager.delete('UserAddress', { userId: req.user.id });

        // Create new addresses
        const newAddresses = addresses.map(addr =>
            transactionalEntityManager.create('UserAddress', {
                userId: req.user.id,
                ...addr
            })
        );

        await transactionalEntityManager.save(newAddresses);
    });

    res.status(200).json({
        success: true,
        message: 'Addresses updated successfully'
    });
});

// @desc    Get all users (admin)
// @route   GET /api/auth/users
// @access  Private (Admin)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const userRepo = getUserRepository();

    // Find with pagination
    const [users, total] = await userRepo.findAndCount({
        select: ['id', 'name', 'email', 'phone', 'role', 'createdAt'],
        order: { createdAt: 'DESC' },
        take: 50
    });

    res.status(200).json({
        success: true,
        count: users.length,
        total,
        data: users
    });
});
