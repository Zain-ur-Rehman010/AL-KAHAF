const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = {
  generateTokens(userId, role, trialData = null) {
    const payload = { userId, role };
    if (trialData && trialData.isTrial) {
      payload.isTrial = true;
      payload.trialExpiresAt = trialData.trialExpiresAt;
    }

    const accessToken = jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    const refreshToken = jwt.sign(
      { userId, role },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiration }
    );

    return { accessToken, refreshToken };
  },

  verifyToken(token, secret) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  },
};
