// Auth Controller - Authentication operations

const authService = require('../services/authService');

const authController = {
  register: async (req, res, next) => {
    try {
      const { email, password, name, userType } = req.body;
      
      const result = await authService.register({
        email,
        password,
        name,
        userType
      });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      const result = await authService.login(email, password);
      
      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      // Invalidate token (optional)
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      
      const token = await authService.refreshToken(refreshToken);
      
      res.json({
        success: true,
        data: { token }
      });
    } catch (error) {
      next(error);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      
      await authService.sendPasswordResetEmail(email);
      
      res.json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      
      await authService.resetPassword(token, newPassword);
      
      res.json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
