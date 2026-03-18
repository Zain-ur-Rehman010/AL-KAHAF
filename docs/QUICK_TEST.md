# 🚀 Quick Testing Guide

Use this guide to quickly test your deployed API on cPanel.

---

## 📝 Quick Test via cPanel Terminal

### Step 1: Access Terminal
1. Login to cPanel
2. Go to **Advanced** → **Terminal**
3. A black terminal window will open

### Step 2: Activate Node.js Environment
```bash
source /home2/tsjilueh/nodevenv/alkahafonlineacademy.com/api/22/bin/activate
```

### Step 3: Navigate to Backend Folder
```bash
cd ~/alkahafonlineacademy.com/api
```

### Step 4: Run Test Connection
```bash
node test-connection.js
```

**Expected Output:**
```
🔍 Testing Database Connection...
✅ Database connection established successfully!
✅ MySQL Version: 8.x.x
✅ Users table exists
✅ Total users in database: 0 (or number of users)
✅ All tests passed!
```

### Step 5: Run API Tests (Optional)
```bash
node test-api.js
```

This will test:
- Health check endpoint
- User registration
- User login
- Protected routes

---

## 🌐 Quick Test via Browser

### Test 1: Health Check
Open this URL in your browser:
```
https://alkahafonlineacademy.com/api/health
```

**Expected:** JSON response with status "OK"

---

## 📱 Quick Test via Postman

### Setup
1. Download Postman: https://www.postman.com/downloads/
2. Open Postman
3. Create a new request

### Test 1: Register User

**Method:** POST
**URL:** `https://alkahafonlineacademy.com/api/v1/auth/register`
**Headers:**
- Content-Type: `application/json`

**Body (raw JSON):**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "Test123456!",
  "confirmPassword": "Test123456!",
  "role": "student"
}
```

**Click:** Send

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "some-uuid",
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "role": "student"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Test 2: Login

**Method:** POST
**URL:** `https://alkahafonlineacademy.com/api/v1/auth/login`
**Headers:**
- Content-Type: `application/json`

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "Test123456!"
}
```

**Click:** Send

**Expected:** Similar response with user data and tokens

### Test 3: Get Current User (Protected)

**Method:** GET
**URL:** `https://alkahafonlineacademy.com/api/v1/auth/me`
**Headers:**
- Authorization: `Bearer YOUR_ACCESS_TOKEN_FROM_STEP_1`

**Click:** Send

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "some-uuid",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "role": "student"
  }
}
```

---

## 🔍 Verify in Database

### Via phpMyAdmin
1. Login to cPanel
2. Go to **Databases** → **phpMyAdmin**
3. Select database: `tsjilueh_alkahaf_lms`
4. Click on **Users** table
5. Click **Browse**
6. You should see your registered user(s)

**What to check:**
- ✅ User exists
- ✅ Email is correct
- ✅ Password is hashed (long encrypted string)
- ✅ Role is set correctly
- ✅ createdAt timestamp is recent

---

## ⚡ Quick Commands Reference

### Restart Node.js App
1. cPanel → **Setup Node.js App**
2. Click **Restart**
3. Wait 10-15 seconds

### View Application Logs
1. cPanel → **Setup Node.js App**
2. Scroll down to **Log** section
3. Click to expand and view logs

### Check App Status
1. cPanel → **Setup Node.js App**
2. Status should show: **Running** (green)
3. If stopped, click **Restart**

---

## 🐛 Common Issues & Quick Fixes

### Issue: "Cannot GET /api/v1/auth/register"
**Fix:** Use POST method, not GET

### Issue: "Access denied for database"
**Fix:**
1. cPanel → MySQL Databases
2. Add user to database with ALL PRIVILEGES
3. Restart Node.js app

### Issue: "JWT_SECRET not set"
**Fix:**
1. Check `.env` file exists in `alkahaf-backend/`
2. Enable "Show Hidden Files" in File Manager
3. Verify JWT_SECRET has a value
4. Restart app

### Issue: "Node command not found"
**Fix:** Activate Node.js environment first:
```bash
source /home2/tsjilueh/nodevenv/alkahaf-lms/alkahaf-backend/22/bin/activate
```

### Issue: CORS Error
**Fix:** CORS is configured for production domain. Use:
- Postman (no CORS restrictions)
- cURL (no CORS restrictions)
- Server terminal (no CORS restrictions)

---

## ✅ Success Checklist

After testing, you should have:

- [ ] Health check responds with "OK"
- [ ] User registration creates new user
- [ ] User appears in database (phpMyAdmin)
- [ ] Password is hashed in database
- [ ] Login returns access token
- [ ] Protected routes work with token
- [ ] Node.js app shows "Running" status

If all checked, **your API is fully functional!** 🎉

---

## 📚 More Information

For detailed guides, see:
- `docs/guides/CPANEL_DEPLOYMENT_GUIDE.md` - Full deployment guide
- `docs/guides/CPANEL_DEPLOYMENT_GUIDE.md` - cPanel deployment steps
- `docs/guides/AUTH_COMPLETION_GUIDE.md` - Complete auth features
- `backend/README.md` - Full API documentation

---

**Need help?** Check the troubleshooting section in `docs/guides/CPANEL_DEPLOYMENT_GUIDE.md`