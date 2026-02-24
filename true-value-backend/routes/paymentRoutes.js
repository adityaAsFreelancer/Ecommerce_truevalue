const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const getController = () => require('../controllers/paymentController');

router.post('/stripe/checkout', protect, (req, res, next) => {
    getController().processStripePayment(req, res, next);
});

router.post('/razorpay/order', protect, (req, res, next) => {
    getController().createRazorpayOrder(req, res, next);
});

module.exports = router;
