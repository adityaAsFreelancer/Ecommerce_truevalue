const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');


const getFlashSales = asyncHandler(async (req, res) => {
    const products = await Product.find({
        salePrice: { $ne: null },
        isActive: true
    })
        .populate('vendor', 'name')
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(10);

    res.status(200).json({
        success: true,
        data: products
    });
});


const getDailyDeals = asyncHandler(async (req, res) => {
    const products = await Product.find({
        discountPrice: { $ne: null },
        isActive: true
    })
        .populate('vendor', 'name')
        .populate('category', 'name')
        .sort({ rating: -1 })
        .limit(10);

    // Calculate discount percentage on server
    const productsWithDiscount = products.map(product => {
        const p = product.toObject();
        return {
            ...p,
            discountPercentage: p.discountPrice
                ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
                : 0
        };
    });

    res.status(200).json({
        success: true,
        data: productsWithDiscount
    });
});

module.exports = {
    getFlashSales,
    getDailyDeals
};
