const express = require('express');
const router = express.Router();
const {
    submitReturnRequest,
    updateReturnStatus,
    getReturns
} = require('../controllers/returnController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', submitReturnRequest);
router.get('/', getReturns);
router.put('/:id/status', authorize('admin', 'vendor'), updateReturnStatus);

module.exports = router;
