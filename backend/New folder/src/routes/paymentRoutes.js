const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Initiate JazzCash payment (student must be logged in)
router.post('/jazzcash/initiate', authMiddleware, paymentController.initiateJazzCash);

// JazzCash callback — no auth (JazzCash posts here directly)
router.post('/jazzcash/callback', paymentController.jazzcashCallback);

// My payment history
router.get('/my-payments', authMiddleware, paymentController.getMyPayments);

module.exports = router;
