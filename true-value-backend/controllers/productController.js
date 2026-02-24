const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');

exports.getProducts = asyncHandler(async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering (not Mongoose fields)
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Field for category name filtering
    if (reqQuery.category) {
        if (!mongoose.Types.ObjectId.isValid(reqQuery.category)) {
            const category = await Category.findOne({ name: reqQuery.category });
            if (category) {
                reqQuery.category = category._id;
            } else {
                return res.status(200).json({ success: true, count: 0, page: 1, pages: 0, data: [] });
            }
        }
    }

    // Build base filter
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    const baseFilter = JSON.parse(queryStr);

    // Apply text search on name and description if provided
    if (req.query.search && req.query.search.trim()) {
        const searchRegex = new RegExp(req.query.search.trim(), 'i');
        baseFilter.$or = [
            { name: searchRegex },
            { description: searchRegex },
            { brand: searchRegex }
        ];
    }

    // Finding resource
    query = Product.find(baseFilter).populate('category');

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments(baseFilter);

    query = query.skip(startIndex).limit(limit);

    const products = await query;

    const pagination = {};
    if (endIndex < total) pagination.next = { page: page + 1, limit };
    if (startIndex > 0) pagination.prev = { page: page - 1, limit };

    res.status(200).json({
        success: true,
        count: products.length,
        page,
        pages: Math.ceil(total / limit),
        data: products
    });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ErrorResponse(`Invalid Product ID: ${req.params.id}`, 400));
    }

    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: product
    });
});
exports.createProduct = asyncHandler(async (req, res, next) => {
    const categoryId = req.body.categoryId || req.body.category;

    if (!categoryId) {
        return next(new ErrorResponse('Please select a category', 400));
    }

    // Check for category
    const category = await Category.findById(categoryId);
    if (!category) {
        return next(new ErrorResponse(`Category not found`, 404));
    }

    // Automatically assign the logged-in admin as the vendor
    req.body.vendor = req.user._id;

    // subCategory is a UI-only field — not in the model schema
    delete req.body.subCategory;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product
    });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: product
    });
});


exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
