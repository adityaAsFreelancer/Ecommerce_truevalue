const express = require('express');
const { getDeliverySettings, updateDeliverySettings } = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/delivery')
    .get(getDeliverySettings)
    .put(protect, authorize('admin'), updateDeliverySettings);

module.exports = router;
