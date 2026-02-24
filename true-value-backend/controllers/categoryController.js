const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find().sort('-createdAt');
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
    });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
exports.createCategory = asyncHandler(async (req, res, next) => {
    // If parent is empty string, set it to null
    if (req.body.parent === '') {
        req.body.parent = null;
    }

    const category = await Category.create(req.body);

    res.status(201).json({
        success: true,
        data: category
    });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
exports.updateCategory = asyncHandler(async (req, res, next) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: category
    });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    }

    await category.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
