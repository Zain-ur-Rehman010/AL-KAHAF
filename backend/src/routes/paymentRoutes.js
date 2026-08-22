const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const adminOnly = [authMiddleware, roleMiddleware(['admin'])];

// Initiate JazzCash payment (student must be logged in)
router.post('/jazzcash/initiate', authMiddleware, paymentController.initiateJazzCash);

// JazzCash callback — no auth (JazzCash posts here directly)
router.post('/jazzcash/callback', paymentController.jazzcashCallback);

// My payment history
router.get('/my-payments', authMiddleware, paymentController.getMyPayments);

// Bank transfer — public bank details, student submission, admin review
router.get('/bank-details', paymentController.getBankDetails);
router.post('/bank-transfer/submit', authMiddleware, paymentController.submitBankTransfer);
router.get('/admin/all', adminOnly, paymentController.getAllPayments);
router.get('/admin/bank-transfers', adminOnly, paymentController.getPendingBankTransfers);
router.patch('/:id/approve-bank-transfer', adminOnly, paymentController.approveBankTransfer);
router.patch('/:id/reject-bank-transfer', adminOnly, paymentController.rejectBankTransfer);

// JazzCash/Easypaisa wallet transfer (manual QR scan-and-pay) — student submission, admin review
router.post('/wallet-transfer/submit', authMiddleware, paymentController.submitWalletTransfer);
router.get('/admin/wallet-transfers', adminOnly, paymentController.getPendingWalletTransfers);
router.patch('/:id/approve-wallet-transfer', adminOnly, paymentController.approveWalletTransfer);
router.patch('/:id/reject-wallet-transfer', adminOnly, paymentController.rejectWalletTransfer);

module.exports = router;
