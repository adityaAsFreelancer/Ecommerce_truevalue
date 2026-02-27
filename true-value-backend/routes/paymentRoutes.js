const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    razorpayWebhook
} = require('../controllers/paymentController');

router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.post('/razorpay/webhook', razorpayWebhook);

module.exports = router;
