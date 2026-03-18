const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');
const tokenService = require('../services/tokenService');
const { notifyAdmins } = require('../services/notificationService');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const { phone, bio, profileImage, designation, specialization, experience } = req.body;

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
    });

    const tokens = tokenService.generateTokens(user.id, user.role);

    notifyAdmins({
      type: 'general',
      title: 'New User Registered',
      message: `${user.firstName} ${user.lastName} (${user.email}) registered as ${user.role}.`,
      actionUrl: '/admin/users-list',
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.toJSON(),
        ...tokens,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    await user.update({ lastLogin: new Date() });

    const tokens = tokenService.generateTokens(user.id, user.role);
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
    const tokens = tokenService.generateTokens(decoded.userId, decoded.role);

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
