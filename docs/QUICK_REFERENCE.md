# AlKahaf LMS - Quick Reference Guide

**Last Updated:** December 28, 2025
**Status:** ✅ Production - Live

---

## 🌐 Production URLs

| Resource | URL |
|----------|-----|
| **Homepage** | https://alkahafonlineacademy.com |
| **Register** | https://alkahafonlineacademy.com/src/pages/auth/register.html |
| **Login** | https://alkahafonlineacademy.com/src/pages/auth/login.html |
| **API Base** | https://alkahafonlineacademy.com/api/v1 |
| **Health Check** | https://alkahafonlineacademy.com/api/health |

---

## 🔑 API Endpoints

### Authentication
```
POST   /api/v1/auth/register       # Register new user
POST   /api/v1/auth/login          # Login user
POST   /api/v1/auth/logout         # Logout user
POST   /api/v1/auth/refresh        # Refresh access token
GET    /api/v1/auth/me             # Get current user (requires auth)
```

### Courses
```
GET    /api/v1/courses             # Get all courses
POST   /api/v1/courses             # Create course (instructor/admin)
GET    /api/v1/courses/:id         # Get course by ID
PUT    /api/v1/courses/:id         # Update course (instructor/admin)
DELETE /api/v1/courses/:id         # Delete course (admin)
```

### Enrollments
```
GET    /api/v1/enrollments         # Get user's enrollments (requires auth)
POST   /api/v1/enrollments         # Enroll in course (requires auth)
PATCH  /api/v1/enrollments/:id/progress  # Update progress (requires auth)
DELETE /api/v1/enrollments/:id     # Drop course (requires auth)
```

### Users
```
GET    /api/v1/users/profile       # Get user profile (requires auth)
PUT    /api/v1/users/profile       # Update profile (requires auth)
GET    /api/v1/users/stats         # Get user stats (requires auth)
```

---

## 📋 cPanel Quick Tasks

### Restart Node.js App
1. cPanel → **Setup Node.js App**
2. Find your app
3. Click **Restart** (circular arrow icon)

### Check App Status
1. cPanel → **Setup Node.js App**
2. Status should show: **"started (v22.18.0)"**

### View App Logs
1. cPanel → **Setup Node.js App**
2. Click on app name
3. View **Application Logs**

### Check Database
1. cPanel → **phpMyAdmin**
2. Database: `tsjilueh_alkahaf_lms`
3. Browse tables: Users, Courses, Enrollments, etc.

### Upload Files
1. cPanel → **File Manager**
2. Navigate to: `alkahafonlineacademy.com/`
3. Click **Upload**

---

## 🗂️ File Locations

### Backend (cPanel)
```
/home2/tsjilueh/alkahafonlineacademy.com/api/
```

### Frontend (cPanel)
```
/home2/tsjilueh/alkahafonlineacademy.com/
```

### Database
```
Database Name: tsjilueh_alkahaf_lms
Host: localhost
Tables: 11 total
```

---

## 🧪 Test User Registration

### Via Browser:
1. Go to: https://alkahafonlineacademy.com/src/pages/auth/register.html
2. Fill form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: Test123456!
   - Confirm: Test123456!
3. Click "Sign Up"
4. Should redirect to login
5. Email auto-fills
6. Enter password and login
7. Redirects to student dashboard

### Via cURL:
```bash
curl -X POST https://alkahafonlineacademy.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "Test123456!",
    "confirmPassword": "Test123456!",
    "role": "student"
  }'
```

### Via Postman:
```
Method: POST
URL: https://alkahafonlineacademy.com/api/v1/auth/register
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "Test123456!",
  "confirmPassword": "Test123456!",
  "role": "student"
}
```

---

## 🔧 Common Fixes

### "Route not found" Error
**Cause:** App URI configuration or static file serving issue

**Fix:**
1. Check cPanel → Setup Node.js App → App URI should be `/`
2. Verify `server.js` has static file serving (lines 54-57)
3. Restart Node.js app

### Frontend Not Loading
**Cause:** Files in wrong location or cache issue

**Fix:**
1. Clear browser cache (Ctrl + Shift + Delete)
2. Verify files in `/home2/tsjilueh/alkahafonlineacademy.com/`
3. Check file permissions (0644 for files, 0755 for folders)

### Registration Form Not Submitting
**Cause:** JavaScript files not loading or wrong IDs

**Fix:**
1. Press F12 → Console tab
2. Check for errors
3. Verify `api-config.js` and `auth.js` are loading
4. Check form has `id="register-form"`
5. Check inputs have correct IDs

### Backend Not Starting
**Cause:** Missing dependencies or config error

**Fix:**
1. cPanel → Setup Node.js App → Click app name
2. View logs for errors
3. Check `.env` file exists and is correct
4. Run `npm install` if needed

---

## 📊 Database Schema Quick Ref

### Users Table
```sql
id            UUID PRIMARY KEY
firstName     VARCHAR(255)
lastName      VARCHAR(255)
email         VARCHAR(255) UNIQUE
password      VARCHAR(255) -- hashed
role          ENUM('student', 'instructor', 'admin')
status        ENUM('active', 'inactive', 'banned')
createdAt     DATETIME
updatedAt     DATETIME
```

### Courses Table
```sql
id            UUID PRIMARY KEY
title         VARCHAR(255)
description   TEXT
instructorId  UUID (FK → Users)
category      VARCHAR(100)
price         DECIMAL(10,2)
level         ENUM('beginner', 'intermediate', 'advanced')
status        ENUM('draft', 'published', 'archived')
createdAt     DATETIME
updatedAt     DATETIME
```

### Enrollments Table
```sql
id            UUID PRIMARY KEY
studentId     UUID (FK → Users)
courseId      UUID (FK → Courses)
status        ENUM('enrolled', 'in_progress', 'completed', 'dropped')
progress      INTEGER (0-100)
enrolledAt    DATETIME
completedAt   DATETIME
```

---

## 🔐 Security Checklist

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with expiration (15min access, 7 days refresh)
- ✅ HTTPS enforced
- ✅ CORS configured
- ✅ Rate limiting active
- ✅ Input validation (Joi)
- ✅ SQL injection protection (Sequelize)
- ✅ Environment variables for secrets
- ✅ Error handling without exposing internals

---

## 📁 Critical Files

### Backend
```
api/src/server.js          # Main entry point
api/src/controllers/authController.js
api/src/middleware/authMiddleware.js
api/src/models/User.js
api/.env                   # Environment variables
```

### Frontend
```
assets/js/api-config.js    # API configuration
assets/js/auth.js          # Authentication handler
src/pages/auth/register.html
src/pages/auth/login.html
.htaccess                  # Routing config
```

---

## 🚨 Emergency Commands

### Restart Everything
```bash
# Via cPanel
1. Setup Node.js App → Restart
2. Clear browser cache
3. Test URLs
```

### Check if Backend is Running
```bash
curl https://alkahafonlineacademy.com/api/health
```

### View Backend Logs
```
cPanel → Setup Node.js App → Click app name → Application Logs
```

### Reset Database (DANGER!)
```bash
# DON'T DO THIS unless you want to lose all data!
# Via cPanel terminal:
cd ~/alkahafonlineacademy.com/api
source ~/nodevenv/alkahafonlineacademy.com/api/22/bin/activate
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

---

## 📞 Support Information

### Documentation Files:
- `/docs/ENV_SETUP_GUIDE.md` - Environment and deployment configuration
- `/docs/PROJECT_STRUCTURE.md` - Project organization
- `/docs/guides/AUTH_COMPLETION_GUIDE.md` - Authentication guide
- `/backend/README.md` - Backend API documentation

### Git Status:
- **Branch:** main
- **Last Commit:** Frontend deployment complete

---

## ⚡ Quick Commands

### Local Development (Backend):
```bash
cd backend
npm run dev              # Start with nodemon
npm test                 # Run tests
npm run migrate          # Run migrations
```

### Local Development (Frontend):
```bash
cd frontend
npm start                # Start live-server
npm run sass             # Compile SCSS
npm run dev              # Both server + SCSS watch
```

### Production Deployment:
```bash
# Backend
1. Upload files to: ~/alkahafonlineacademy.com/api/
2. cPanel → Setup Node.js App → Restart

# Frontend
1. Upload files to: ~/alkahafonlineacademy.com/
2. Clear browser cache
3. Test
```

---

**⚡ Keep this document handy for quick reference! ⚡**