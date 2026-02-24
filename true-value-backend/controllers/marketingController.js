const { AppDataSource } = require('../config/database');
const asyncHandler = require('../middleware/asyncHandler');

// Helper to get repository
const getProductRepo = () => AppDataSource.getRepository('Product');

// @desc    Get Flash Sale Products
// @route   GET /api/marketing/flash-sales
// @access  Public
const getFlashSales = asyncHandler(async (req, res) => {
    const productRepo = getProductRepo();

    const products = await productRepo.find({
        where: {
            salePrice: { $ne: null },
            isActive: true
        },
        relations: ['vendor', 'category'],
        order: { createdAt: 'DESC' },
        take: 10
    });

    res.status(200).json({
        success: true,
        data: products
    });
});

// @desc    Get Daily Deals
// @route   GET /api/marketing/daily-deals
// @access  Public
const getDailyDeals = asyncHandler(async (req, res) => {
    const productRepo = getProductRepo();

    const products = await productRepo.find({
        where: {
            discountPrice: { $ne: null },
            isActive: true
        },
        relations: ['vendor', 'category'],
        order: { rating: 'DESC' },
        take: 10
    });

    // Calculate discount percentage on server
    const productsWithDiscount = products.map(product => ({
        ...product,
        discountPercentage: product.discountPrice
            ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
            : 0
    }));

    res.status(200).json({
        success: true,
        data: productsWithDiscount
    });
});

module.exports = {
    getFlashSales,
    getDailyDeals
};
