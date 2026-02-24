const express = require('express');
const router = express.Router();
const {
    handleLogisticsWebhook,
    createShipmentManually,
    getOrderStatus,
    requestReturn
} = require('../controllers/logisticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public Webhook (Secured by Shiprocket Token in request)
router.post('/webhook', handleLogisticsWebhook);

// Public Status Search
router.get('/status/:orderId', getOrderStatus);

// Return Request
router.post('/returns', protect, requestReturn);

// Admin manual trigger
router.post('/ship/:orderId', protect, authorize('admin'), createShipmentManually);

module.exports = router;
