const Banner = require('../models/Banner');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
exports.getBanners = asyncHandler(async (req, res, next) => {
    const banners = await Banner.find().sort({ priority: -1 });

    res.status(200).json({
        success: true,
        data: banners
    });
});

// @desc    Create banner
// @route   POST /api/banners
// @access  Private (Admin)
exports.createBanner = asyncHandler(async (req, res, next) => {
    const banner = await Banner.create(req.body);

    res.status(201).json({
        success: true,
        data: banner
    });
});

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private (Admin)
exports.updateBanner = asyncHandler(async (req, res, next) => {
    let banner = await Banner.findById(req.params.id);

    if (!banner) {
        return next(new ErrorResponse(`Banner not found with id of ${req.params.id}`, 404));
    }

    banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: banner
    });
});

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private (Admin)
exports.deleteBanner = asyncHandler(async (req, res, next) => {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
        return next(new ErrorResponse(`Banner not found with id of ${req.params.id}`, 404));
    }

    await banner.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
