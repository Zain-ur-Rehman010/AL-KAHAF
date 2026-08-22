const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Key by authenticated user when possible, so one busy account (e.g. an
// instructor saving a course with many modules/lessons, which fires one
// request per module/lesson) doesn't exhaust the quota for everyone else
// sharing the same IP (common on office/campus networks). Falls back to IP
// for unauthenticated requests.
function keyGenerator(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      if (decoded?.userId) return `user:${decoded.userId}`;
    } catch (_) {
      // invalid/expired token — fall through to IP-based limiting
    }
  }
  return req.ip;
}

module.exports = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  keyGenerator,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
