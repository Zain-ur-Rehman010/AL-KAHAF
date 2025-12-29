# Authentication System Completion Guide

This guide provides a comprehensive plan to complete the AlKahaf LMS authentication system.

## 📊 Current Status Analysis

### ✅ What You Have:
- Basic registration & login
- JWT token generation & refresh
- Password hashing (bcrypt)
- Profile updates
- Password change
- Email service structure
- User model with fields for: `emailVerified`, `twoFactorEnabled`

### ❌ What's Missing:
- Forgot password / Reset password (referenced in routes but not implemented)
- Email verification
- Password reset tokens
- Two-factor authentication (2FA/OTP)
- Social login (Google, Facebook)
- Token blacklisting for logout
- Input validation middleware
- Frontend-backend integration

---

## 🎯 Completion Suggestions (Priority Order)

### **Priority 1: Critical Missing Features**

#### **1. Implement Forgot/Reset Password**

**Backend tasks:**
- Add `resetPasswordToken` and `resetPasswordExpires` fields to User model
- Create `forgotPassword` method in authController
- Create `resetPassword` method in authController
- Add `sendPasswordResetEmail` to emailService

**Frontend tasks:**
- Connect `frontend/src/pages/auth/forgot-password.html` to API
- Connect `frontend/src/pages/auth/set-password.html` to reset endpoint

**Files to modify:**
- `backend/src/models/User.js` - Add reset token fields
- `backend/src/controllers/authController.js` - Add methods (lines 11-12 in routes reference these)
- `backend/src/services/emailService.js` - Add email template

**Implementation Example:**
```javascript
// Add to User model
resetPasswordToken: {
  type: DataTypes.STRING,
  allowNull: true,
},
resetPasswordExpires: {
  type: DataTypes.DATE,
  allowNull: true,
}

// authController.js
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetEmail(user.email, user.firstName, resetUrl);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

#### **2. Email Verification System**

**Backend tasks:**
- Add `emailVerificationToken` and `emailVerificationExpires` to User model
- Create `sendVerificationEmail` endpoint
- Create `verifyEmail` endpoint
- Add email template to emailService

**Frontend tasks:**
- Create verification success page or use existing pages
- Add "Resend verification email" button
- Show verification status in user profile

**Why important:** Security best practice, prevents fake registrations

**Implementation:**
```javascript
// Add to User model
emailVerificationToken: {
  type: DataTypes.STRING,
  allowNull: true,
},
emailVerificationExpires: {
  type: DataTypes.DATE,
  allowNull: true,
}

// authController.js
exports.sendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + 86400000); // 24 hours
    await user.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    await emailService.sendVerificationEmail(user.email, user.firstName, verificationUrl);

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      where: {
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

#### **3. Input Validation & Error Handling**

**Backend tasks:**
- Install `joi` or `express-validator`
- Create validation schemas for all auth endpoints
- Add validation middleware
- Standardize error responses

**Install:**
```bash
npm install joi
```

**Create validation schemas:**
```javascript
// backend/src/validation/authValidation.js
const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, and number'
    }),
  confirmPassword: Joi.ref('password'),
  role: Joi.string().valid('student', 'instructor')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
};
```

**Create validation middleware:**
```javascript
// backend/src/middleware/validate.js
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

module.exports = validate;
```

**Use in routes:**
```javascript
// backend/src/routes/auth.js
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validation/authValidation');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
```

---

### **Priority 2: Enhanced Security**

#### **4. Token Blacklisting for Logout**

Currently logout does nothing (authController.js lines 81-88).

**Options:**
- **Redis blacklist** (recommended) - Store invalidated tokens
- **Database table** - Create `RevokedTokens` model
- **Short-lived tokens** - Use 15min access tokens + refresh tokens

**Install Redis:**
```bash
npm install redis ioredis
```

**Implementation with Redis:**
```javascript
// backend/src/config/redis.js
const Redis = require('ioredis');
const config = require('./config');

const redisClient = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword
});

module.exports = redisClient;

// authController.js
const redisClient = require('../config/redis');

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    // Calculate remaining TTL
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    // Add to blacklist
    await redisClient.setex(`blacklist:${token}`, expiresIn, 'true');

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modify authMiddleware to check blacklist
// backend/src/middleware/authMiddleware.js
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

---

#### **5. OTP/Two-Factor Authentication (2FA)**

Your User model has `twoFactorEnabled` field (User.js lines 56-58).

**Install packages:**
```bash
npm install speakeasy qrcode
```

**Backend tasks:**
- Create endpoints: `/auth/enable-2fa`, `/auth/verify-2fa`, `/auth/disable-2fa`
- Modify login to check 2FA status
- Store 2FA secret in User model

**Frontend tasks:**
- Connect `frontend/src/pages/auth/otp.html` to API
- Add 2FA settings in user profile pages

**Add to User model:**
```javascript
twoFactorSecret: {
  type: DataTypes.STRING,
  allowNull: true,
}
```

**Implementation:**
```javascript
// authController.js
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

exports.enable2FA = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `AlKahaf LMS (${user.email})`
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Save secret temporarily (confirm after verification)
    user.twoFactorSecret = secret.base32;
    await user.save();

    res.json({
      message: '2FA setup initiated',
      qrCode: qrCodeUrl,
      secret: secret.base32
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findByPk(req.user.id);

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.disable2FA = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findByPk(req.user.id);

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modify login to handle 2FA
exports.login = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      if (!otp) {
        return res.status(200).json({
          message: 'OTP required',
          requires2FA: true
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: otp
      });

      if (!verified) {
        return res.status(401).json({ message: 'Invalid OTP' });
      }
    }

    await user.update({ lastLogin: new Date() });

    const tokens = tokenService.generateTokens(user.id, user.role);
    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      ...tokens,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

### **Priority 3: Frontend Integration**

#### **6. Connect Frontend Auth Pages to Backend**

**Create authentication JavaScript module:**

```javascript
// frontend/assets/js/auth.js
const API_URL = 'http://localhost:5000/api/v1';

class AuthService {
  // Login
  async login(email, password, otp = null) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp })
      });

      const data = await response.json();

      if (data.requires2FA) {
        return { requires2FA: true };
      }

      if (data.accessToken) {
        this.setTokens(data.accessToken, data.refreshToken);
        this.setUser(data.user);
      }

      return data;
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  }

  // Register
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.accessToken) {
        this.setTokens(data.accessToken, data.refreshToken);
        this.setUser(data.user);
      }

      return data;
    } catch (error) {
      throw new Error('Registration failed: ' + error.message);
    }
  }

  // Forgot Password
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      return await response.json();
    } catch (error) {
      throw new Error('Password reset request failed: ' + error.message);
    }
  }

  // Reset Password
  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      return await response.json();
    } catch (error) {
      throw new Error('Password reset failed: ' + error.message);
    }
  }

  // Logout
  async logout() {
    try {
      const token = this.getAccessToken();

      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      this.clearTokens();
      window.location.href = '/src/pages/auth/login.html';
    } catch (error) {
      throw new Error('Logout failed: ' + error.message);
    }
  }

  // Token management
  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // User management
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getAccessToken();
  }

  // Refresh token
  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken();

      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      const data = await response.json();

      if (data.accessToken) {
        this.setTokens(data.accessToken, data.refreshToken);
      }

      return data;
    } catch (error) {
      this.clearTokens();
      window.location.href = '/src/pages/auth/login.html';
    }
  }
}

// Create global instance
const authService = new AuthService();

// API interceptor for authenticated requests
async function authenticatedFetch(url, options = {}) {
  const token = authService.getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, { ...options, headers });

  // If 401, try to refresh token
  if (response.status === 401) {
    await authService.refreshAccessToken();
    const newToken = authService.getAccessToken();
    headers['Authorization'] = `Bearer ${newToken}`;
    response = await fetch(url, { ...options, headers });
  }

  return response;
}

// Export for use in other files
window.authService = authService;
window.authenticatedFetch = authenticatedFetch;
```

**Example: Connect login.html**

```javascript
// Add to frontend/src/pages/auth/login.html
<script src="/assets/js/auth.js"></script>
<script>
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const result = await authService.login(email, password);

    if (result.requires2FA) {
      // Show OTP input
      document.getElementById('otpSection').style.display = 'block';
    } else {
      // Redirect based on role
      const user = authService.getUser();
      if (user.role === 'student') {
        window.location.href = '/src/pages/student/student-dashboard.html';
      } else if (user.role === 'instructor') {
        window.location.href = '/src/pages/instructor/instructor-dashboard.html';
      }
    }
  } catch (error) {
    alert(error.message);
  }
});
</script>
```

**Pages to connect:**
- `frontend/src/pages/auth/login.html` → `/auth/login`
- `frontend/src/pages/auth/register.html` → `/auth/register`
- `frontend/src/pages/auth/forgot-password.html` → `/auth/forgot-password`
- `frontend/src/pages/auth/set-password.html` → `/auth/reset-password`
- `frontend/src/pages/auth/otp.html` → `/auth/verify-2fa`

---

### **Priority 4: Optional Enhancements**

#### **7. Social Authentication (OAuth)**

**Providers:** Google, Facebook, GitHub

**Install:**
```bash
npm install passport passport-google-oauth20 passport-facebook passport-github2
```

**Implementation:**
```javascript
// backend/src/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ where: { email: profile.emails[0].value } });

      if (!user) {
        user = await User.create({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          emailVerified: true,
          profileImage: profile.photos[0].value,
          password: crypto.randomBytes(16).toString('hex') // Random password
        });
      }

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

// Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const tokens = tokenService.generateTokens(req.user.id, req.user.role);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}`);
  }
);
```

---

#### **8. Account Lock After Failed Attempts**

**Add to User model:**
```javascript
failedLoginAttempts: {
  type: DataTypes.INTEGER,
  defaultValue: 0
},
lockedUntil: {
  type: DataTypes.DATE,
  allowNull: true
}
```

**Modify login controller:**
```javascript
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil - new Date()) / 60000);
      return res.status(403).json({
        message: `Account locked. Try again in ${minutesLeft} minutes`
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment failed attempts
      user.failedLoginAttempts += 1;

      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }

      await user.save();

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset failed attempts on successful login
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
      await user.save();
    }

    // Continue with normal login...
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

#### **9. Session Management**

**Features:**
- View active sessions
- Logout from specific devices
- Logout from all devices

**Create Session model:**
```javascript
// backend/src/models/Session.js
const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deviceInfo: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
});

// Associations
User.hasMany(Session);
Session.belongsTo(User);
```

**Implementation:**
```javascript
// Store session on login
const sessionData = {
  userId: user.id,
  token: accessToken,
  deviceInfo: {
    userAgent: req.headers['user-agent'],
    device: 'Web Browser'
  },
  ipAddress: req.ip,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
};

await Session.create(sessionData);

// Get all sessions
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout from specific device
exports.logoutDevice = async (req, res) => {
  try {
    const { sessionId } = req.params;

    await Session.destroy({
      where: {
        id: sessionId,
        userId: req.user.id
      }
    });

    res.json({ message: 'Session terminated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout from all devices
exports.logoutAllDevices = async (req, res) => {
  try {
    await Session.destroy({
      where: { userId: req.user.id }
    });

    res.json({ message: 'All sessions terminated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## 📋 Step-by-Step Action Plan

### **Week 1: Core Features**
1. ✅ Add forgot/reset password functionality
2. ✅ Add email verification
3. ✅ Add input validation middleware
4. ✅ Test all backend endpoints with Postman

### **Week 2: Security**
1. ✅ Implement token blacklisting (Redis)
2. ✅ Add 2FA/OTP system
3. ✅ Add rate limiting to auth endpoints
4. ✅ Security audit

### **Week 3: Frontend Integration**
1. ✅ Create auth.js utility module
2. ✅ Connect all auth pages to API
3. ✅ Add JWT interceptor for authenticated requests
4. ✅ Handle token refresh automatically

### **Week 4: Testing & Polish**
1. ✅ Write integration tests
2. ✅ Add error handling UI
3. ✅ Add loading states
4. ✅ Documentation

---

## 🛠️ Required npm Packages

```bash
# Validation
npm install joi

# 2FA
npm install speakeasy qrcode

# Token management
npm install redis ioredis

# Password reset tokens
npm install crypto

# Social auth (optional)
npm install passport passport-google-oauth20 passport-facebook passport-github2

# Email templates (optional)
npm install handlebars mjml
```

---

## 📝 Quick Win Tasks (Start Here)

1. **Implement Forgot Password** (2-3 hours)
2. **Add Input Validation** (1-2 hours)
3. **Connect Login Page to Backend** (1 hour)
4. **Connect Register Page to Backend** (1 hour)
5. **Add Token Storage in Frontend** (30 mins)

---

## 🔗 Related Files

**Backend:**
- `backend/src/controllers/authController.js` - Authentication logic
- `backend/src/routes/auth.js` - Auth routes (has forgot/reset references)
- `backend/src/services/emailService.js` - Email templates
- `backend/src/models/User.js` - User model
- `backend/src/middleware/authMiddleware.js` - JWT verification
- `backend/src/config/config.js` - App configuration

**Frontend:**
- `frontend/src/pages/auth/login.html` - Login page
- `frontend/src/pages/auth/register.html` - Registration page
- `frontend/src/pages/auth/forgot-password.html` - Password reset request
- `frontend/src/pages/auth/set-password.html` - Password reset form
- `frontend/src/pages/auth/otp.html` - OTP verification
- `frontend/src/pages/auth/lock-screen.html` - Lock screen

---

## 📚 Additional Resources

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Joi Validation Guide](https://joi.dev/api/)
- [Speakeasy 2FA Guide](https://github.com/speakeasyjs/speakeasy)

---

**Last Updated:** December 27, 2024