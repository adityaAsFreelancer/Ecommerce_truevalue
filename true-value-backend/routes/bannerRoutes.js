const express = require('express');
const {
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner
} = require('../controllers/bannerController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getBanners);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;
