const express = require('express');
const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    updateAddresses
} = require('../controllers/userController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/addresses', protect, updateAddresses);

module.exports = router;
