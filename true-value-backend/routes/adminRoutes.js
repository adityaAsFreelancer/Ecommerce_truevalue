const express = require('express');
const {
    getAnalytics,
    updateVendorStatus,
    blockUser,
    getAllUsers,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteUser,
    createAdminUser,
    updateUser
} = require('../controllers/adminController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/vendors/:id/status', updateVendorStatus);
router.put('/users/:id/block', blockUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users', createAdminUser);

module.exports = router;
