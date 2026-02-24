const searchService = require('../utils/searchService');
const redisClient = require('../config/redis');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    High-performance faceted search (Algolia + Redis)
// @route   GET /api/search
// @access  Public
exports.performFacetedSearch = asyncHandler(async (req, res, next) => {
    const {
        q = '',
        page = 0,
        limit = 12,
        category,
        minPrice,
        maxPrice,
        minRating
    } = req.query;

    // 1. Generate Cache Key
    const cacheKey = `search:${JSON.stringify(req.query)}`;

    // 2. Check Redis Cache
    try {
        const cachedResults = await redisClient.get(cacheKey);
        if (cachedResults) {
            return res.status(200).json({
                success: true,
                source: 'cache',
                ...JSON.parse(cachedResults)
            });
        }
    } catch (err) {
        console.warn('Cache Check Failed:', err.message);
    }

    // 3. Build Algolia Filters
    let filters = 'isActive:true';
    if (category) filters += ` AND category:${category}`;
    if (minPrice) filters += ` AND price >= ${minPrice}`;
    if (maxPrice) filters += ` AND price <= ${maxPrice}`;
    if (minRating) filters += ` AND rating >= ${minRating}`;

    // 4. Perform Algolia Search
    const searchResults = await searchService.search({
        query: q,
        filters,
        hitsPerPage: limit,
        page: parseInt(page)
    });

    const responseData = {
        count: searchResults.nbHits,
        page: searchResults.page,
        nbPages: searchResults.nbPages,
        hits: searchResults.hits,
        facets: searchResults.facets
    };

    // 5. Store in Redis (TTL: 10 Minutes)
    try {
        await redisClient.setEx(cacheKey, 600, JSON.stringify(responseData));
    } catch (err) {
        console.warn('Cache Set Failed:', err.message);
    }

    res.status(200).json({
        success: true,
        source: 'live',
        data: responseData
    });
});

// @desc    Real-time Autocomplete
// @route   GET /api/search/autocomplete
// @access  Public
exports.getAutocomplete = asyncHandler(async (req, res, next) => {
    const { q } = req.query;
    if (!q) return res.json({ success: true, hits: [] });

    const results = await searchService.search({
        query: q,
        hitsPerPage: 5,
        attributesToRetrieve: ['name', 'price', 'images']
    });

    res.status(200).json({
        success: true,
        hits: results.hits
    });
});
