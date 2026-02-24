const express = require('express');
const router = express.Router();
const {
    validateCoupon,
    createCoupon,
    getCoupons
} = require('../controllers/couponController');
const {
    getFlashSales,
    getDailyDeals
} = require('../controllers/marketingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/flash-sales', getFlashSales);
router.get('/deals', getDailyDeals);
router.post('/validate', protect, validateCoupon);
router.post('/', protect, authorize('admin', 'vendor'), createCoupon);
router.get('/', protect, authorize('admin', 'vendor'), getCoupons);

module.exports = router;
