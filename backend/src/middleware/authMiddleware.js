const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    // Trial expiry check — runs on every protected request
    if (decoded.isTrial && decoded.trialExpiresAt) {
      if (new Date() > new Date(decoded.trialExpiresAt)) {
        return res.status(403).json({
          success: false,
          code: 'TRIAL_EXPIRED',
          message: 'Your free trial has expired. Please enroll in a course to continue.',
        });
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};
