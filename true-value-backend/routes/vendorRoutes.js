const express = require('express');
const {
    registerVendor,
    getVendorProfile,
    verifyVendor,
    getVendorStats,
    getVendorOrders
} = require('../controllers/vendorController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/register', protect, registerVendor);
router.get('/profile', protect, authorize('vendor', 'admin'), getVendorProfile);
router.get('/stats', protect, authorize('vendor', 'admin'), getVendorStats);
router.get('/orders', protect, authorize('vendor', 'admin'), getVendorOrders);
router.put('/:id/verify', protect, authorize('admin'), verifyVendor);

module.exports = router;
