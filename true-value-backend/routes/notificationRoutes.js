const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAsRead,
    createBroadcast,
    clearNotifications
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getNotifications)
    .delete(protect, clearNotifications);

router.put('/:id/read', protect, markAsRead);

router.post('/broadcast', protect, authorize('admin'), createBroadcast);

module.exports = router;
