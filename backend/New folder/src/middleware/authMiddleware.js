const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    // Trial expiry check — blocks expired trial users except on endpoints needed to recover
    if (decoded.isTrial && decoded.trialExpiresAt) {
      if (new Date() > new Date(decoded.trialExpiresAt)) {
        const url = req.originalUrl.split('?')[0];
        const allowed =
          (req.method === 'POST' && /\/enrollments\/?$/.test(url)) ||   // enroll
          (req.method === 'GET'  && /\/enrollments/.test(url))        || // view enrollments
          (req.method === 'GET'  && /\/auth\/me\/?$/.test(url))       || // profile
          (req.method === 'POST' && /\/auth\/refresh\/?$/.test(url))  || // token refresh
          (req.method === 'POST' && /\/reviews\/?$/.test(url));          // submit review
        if (!allowed) {
          return res.status(403).json({
            success: false,
            code: 'TRIAL_EXPIRED',
            message: 'Your free trial has expired. Please enroll in a course to continue.',
          });
        }
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
