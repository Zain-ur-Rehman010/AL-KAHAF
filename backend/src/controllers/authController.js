const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');
const tokenService = require('../services/tokenService');
const { notifyAdmins } = require('../services/notificationService');
const emailService = require('../services/emailService');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const { phone, bio, profileImage, designation, specialization, experience } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'student',
      phone: phone || null,
      bio: bio || null,
      profileImage: profileImage || null,
      designation: designation || null,
      specialization: specialization || null,
      experience: experience || null,
      emailVerified: false,
      verificationOtp: otp,
      otpExpiresAt,
    });

    const otpSent = await emailService.sendOtpEmail(user.email, user.firstName, otp);
    if (!otpSent) {
      return res.status(500).json({
        success: false,
        message: 'Registration created but failed to send OTP email. Please try again.',
      });
    }

    notifyAdmins({
      type: 'general',
      title: 'New User Registered',
      message: `${user.firstName} ${user.lastName} (${user.email}) registered as ${user.role}.`,
      actionUrl: '/admin/users-list',
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for the OTP to verify your account.',
      data: {
        email: user.email,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }
    const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    return res.json({ success: true, available: !existingUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.emailVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await user.update({ verificationOtp: otp, otpExpiresAt });
      const otpSent = await emailService.sendOtpEmail(user.email, user.firstName, otp);

      return res.status(403).json({
        success: false,
        message: 'First verify your account via OTP to continue.',
        code: 'EMAIL_NOT_VERIFIED',
        data: { email: user.email, otpSent },
      });
    }

    await user.update({ lastLogin: new Date() });

    const trialData = user.isTrial ? { isTrial: true, trialExpiresAt: user.trialExpiresAt } : null;
    const tokens = tokenService.generateTokens(user.id, user.role, trialData);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        ...tokens,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);

    // Re-load user from DB to get current trial state — JWT payload may be stale
    const user = await User.findByPk(decoded.userId);
    if (!user || user.status !== 'active') {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }

    let trialData = null;
    if (user.isTrial) {
      trialData = { isTrial: true, trialExpiresAt: user.trialExpiresAt };
    }

    const tokens = tokenService.generateTokens(decoded.userId, decoded.role, trialData);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens,
      ...tokens, // Backward compatibility for existing clients reading top-level tokens
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

exports.logout = async (req, res) => {
  try {
    // In production, you'd blacklist the token here
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userData = user.toJSON();
    res.json({
      success: true,
      message: 'User fetched successfully',
      data: { user: userData },
      ...userData, // Backward compatibility for existing clients reading direct user fields
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio, profileImage, designation, specialization, education, workExperience } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone !== undefined ? phone : user.phone,
      bio: bio !== undefined ? bio : user.bio,
      profileImage: profileImage !== undefined ? profileImage : user.profileImage,
      designation: designation !== undefined ? designation : user.designation,
      specialization: specialization !== undefined ? specialization : user.specialization,
      education: education !== undefined ? education : user.education,
      workExperience: workExperience !== undefined ? workExperience : user.workExperience,
    });

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ where: { email } });
    // Always respond success to avoid email enumeration
    if (!user) return res.json({ success: true, message: 'If that email exists, an OTP has been sent.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await user.update({ verificationOtp: otp, otpExpiresAt });
    const otpSent = await emailService.sendOtpEmail(user.email, user.firstName, otp);
    if (!otpSent) {
      return res.status(500).json({ success: false, message: 'Failed to send OTP email. Please try again.' });
    }

    res.json({ success: true, message: 'OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.verificationOtp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await user.update({ verificationOtp: null, otpExpiresAt: null, passwordResetToken: resetToken, passwordResetExpiry });

    res.json({ success: true, message: 'OTP verified.', data: { resetToken } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required' });
    }

    const user = await User.findOne({ where: { passwordResetToken: resetToken } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    if (!user.passwordResetExpiry || new Date() > user.passwordResetExpiry) {
      return res.status(400).json({ success: false, message: 'Reset token has expired. Please start over.' });
    }

    await user.update({ password: newPassword, passwordResetToken: null, passwordResetExpiry: null });

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    if (user.verificationOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    await user.update({
      emailVerified: true,
      verificationOtp: null,
      otpExpiresAt: null,
    });

    const tokens = tokenService.generateTokens(user.id, user.role);
    emailService.sendWelcomeEmail(user.email, user.firstName);

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: user.toJSON(),
        ...tokens,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await user.update({ verificationOtp: otp, otpExpiresAt });
    const otpSent = await emailService.sendOtpEmail(user.email, user.firstName, otp);
    if (!otpSent) {
      return res.status(500).json({ success: false, message: 'Failed to resend OTP email. Please try again.' });
    }

    res.json({ success: true, message: 'OTP resent successfully. Please check your email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    await user.update({ password: newPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
