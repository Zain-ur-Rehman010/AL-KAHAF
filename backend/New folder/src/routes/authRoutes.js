const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/check-email', authController.checkEmail);
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-otp', authController.verifyResetOtp);
router.post('/reset-password', authController.resetPassword);
router.post('/login', authController.login);
router.post('/verify-login-otp', authController.verifyLoginOtp);
router.post('/resend-login-otp', authController.resendLoginOtp);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

router.get('/me', authMiddleware, authController.getCurrentUser);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
