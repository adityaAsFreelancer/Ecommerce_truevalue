const express = require('express');
const router = express.Router();
const {
    validateCoupon,
    getActiveCoupons,
    createCoupon,
    getCoupons,
    toggleCoupon,
    deleteCoupon
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
router.get('/active', protect, getActiveCoupons);
router.route('/coupons')
    .post(protect, authorize('admin'), createCoupon)
    .get(protect, authorize('admin'), getCoupons);

router.route('/:id')
    .put(protect, authorize('admin'), toggleCoupon)
    .delete(protect, authorize('admin'), deleteCoupon);

module.exports = router;
