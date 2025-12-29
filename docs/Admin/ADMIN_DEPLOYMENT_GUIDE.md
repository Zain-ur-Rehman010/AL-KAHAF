# 🚀 Admin Dashboard Deployment Guide

**Project:** AlKahaf LMS Admin Dashboard
**Date:** December 28, 2025
**Status:** Ready for Deployment

---

## 📋 Pre-Deployment Checklist

### ✅ Completed
- [x] Admin dashboard frontend pages created
- [x] Admin API endpoints created
- [x] Database migrations prepared
- [x] User model updated
- [x] API documentation complete
- [x] Routes registered in server.js

### 🔄 To Do
- [ ] Run database migrations
- [ ] Upload backend files to server
- [ ] Upload frontend admin pages to server
- [ ] Test API endpoints
- [ ] Create first admin user
- [ ] Test admin dashboard access

---

## 🗂️ Files to Deploy

### Backend Files (New)
```
backend/
├── src/
│   ├── controllers/
│   │   └── adminController.js          ⭐ NEW
│   ├── routes/
│   │   └── adminRoutes.js              ⭐ NEW
│   ├── models/
│   │   └── User.js                     📝 UPDATED
│   └── server.js                       📝 UPDATED
└── migrations/
    └── 02-add-instructor-fields.js     ⭐ NEW
```

### Frontend Files (New)
```
frontend/src/pages/admin/
├── admin-dashboard.html                ⭐ NEW
├── instructors-list.html               ⭐ NEW
├── instructor-add.html                 ⭐ NEW
└── courses-list.html                   ⭐ NEW
```

---

## 📤 Step 1: Upload Backend Files

### Via cPanel File Manager

1. **Navigate to backend directory:**
   ```
   /home2/tsjilueh/alkahafonlineacademy.com/api/
   ```

2. **Upload adminController.js:**
   - Go to `src/controllers/`
   - Upload `adminController.js`
   - Path: `d:\Client Projects\AlKahaf\backend\src\controllers\adminController.js`

3. **Upload adminRoutes.js:**
   - Go to `src/routes/`
   - Upload `adminRoutes.js`
   - Path: `d:\Client Projects\AlKahaf\backend\src\routes\adminRoutes.js`

4. **Update User.js:**
   - Go to `src/models/`
   - Replace existing `User.js`
   - Path: `d:\Client Projects\AlKahaf\backend\src\models\User.js`

5. **Update server.js:**
   - Go to `src/`
   - Replace existing `server.js`
   - Path: `d:\Client Projects\AlKahaf\backend\src\server.js`

6. **Upload migration file:**
   - Go to `migrations/`
   - Upload `02-add-instructor-fields.js`
   - Path: `d:\Client Projects\AlKahaf\backend\migrations\02-add-instructor-fields.js`

---

## 📤 Step 2: Upload Frontend Files

### Via cPanel File Manager

1. **Navigate to frontend directory:**
   ```
   /home2/tsjilueh/alkahafonlineacademy.com/
   ```

2. **Create admin folder:**
   - Navigate to `src/pages/`
   - Create new folder: `admin`

3. **Upload admin pages:**
   - Enter the `admin` folder
   - Upload all 4 HTML files:
     - `admin-dashboard.html`
     - `instructors-list.html`
     - `instructor-add.html`
     - `courses-list.html`
   - Source: `d:\Client Projects\AlKahaf\frontend\src\pages\admin\`

---

## 🗄️ Step 3: Run Database Migration

### Option A: Using cPanel Terminal

1. **Open Terminal in cPanel**
2. **Navigate to backend:**
   ```bash
   cd /home2/tsjilueh/alkahafonlineacademy.com/api
   ```

3. **Activate Node.js environment:**
   ```bash
   source /home2/tsjilueh/nodevenv/alkahafonlineacademy.com/api/22/bin/activate
   ```

4. **Run migration:**
   ```bash
   node migrations/migrate.js
   ```

### Option B: Using SQL Directly

If terminal doesn't work, run this SQL in phpMyAdmin:

```sql
-- Add instructor fields to Users table
ALTER TABLE Users
ADD COLUMN designation VARCHAR(100) COMMENT 'Job title or designation',
ADD COLUMN specialization JSON COMMENT 'Array of specializations',
ADD COLUMN experience INT COMMENT 'Years of experience',
ADD COLUMN rating DECIMAL(2,1) DEFAULT 5.0 COMMENT 'Instructor rating',
ADD COLUMN isVerified BOOLEAN DEFAULT FALSE COMMENT 'Verified instructor badge',
ADD COLUMN socialLinks JSON COMMENT 'Social media links',
ADD COLUMN totalCourses INT DEFAULT 0 COMMENT 'Cached course count',
ADD COLUMN totalStudents INT DEFAULT 0 COMMENT 'Cached student count';
```

**Verification:**
```sql
DESCRIBE Users;
```

You should see the new columns listed.

---

## 🔄 Step 4: Restart Node.js Application

1. **Go to cPanel → Setup Node.js App**
2. **Find your app:** `alkahafonlineacademy.com/api`
3. **Click "Stop"**
4. **Wait 5 seconds**
5. **Click "Start"**
6. **Verify Status:** Should show "started (v22.18.0)"

---

## 👤 Step 5: Create First Admin User

### Option A: Via Registration (Then Update)

1. **Register a new user:**
   ```
   https://alkahafonlineacademy.com/src/pages/auth/register.html
   ```

2. **Use these details:**
   - First Name: Admin
   - Last Name: User
   - Email: admin@alkahafonlineacademy.com
   - Password: (choose a strong password)

3. **Update role to admin in database:**
   - cPanel → phpMyAdmin
   - Database: `tsjilueh_alkahaf_lms`
   - Table: `Users`
   - Find the user you just created
   - Click "Edit"
   - Change `role` from `student` to `admin`
   - Click "Go"

### Option B: Direct SQL Insert

Run this in phpMyAdmin (replace password with hashed version):

```sql
-- Generate hashed password first using bcrypt
-- Then insert:
INSERT INTO Users (
    id,
    firstName,
    lastName,
    email,
    password,
    role,
    status,
    emailVerified,
    createdAt,
    updatedAt
)
VALUES (
    UUID(),
    'Admin',
    'User',
    'admin@alkahafonlineacademy.com',
    '$2a$10$YOUR_HASHED_PASSWORD_HERE',  -- Replace with actual bcrypt hash
    'admin',
    'active',
    TRUE,
    NOW(),
    NOW()
);
```

**To generate password hash:**
Use bcryptjs online tool or Node.js:
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('YourPassword123!', 10);
console.log(hash);
```

---

## 🧪 Step 6: Test API Endpoints

### 1. Test Health Check
```bash
curl https://alkahafonlineacademy.com/api/health
```

**Expected:**
```json
{"status":"OK","timestamp":"..."}
```

### 2. Test Admin Login

**Via Browser Console (F12):**
```javascript
fetch('https://alkahafonlineacademy.com/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'admin@alkahafonlineacademy.com',
        password: 'YourPassword123!'
    })
})
.then(res => res.json())
.then(data => {
    console.log('Login Response:', data);
    if(data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
    }
});
```

### 3. Test Admin Statistics

**After logging in, test admin endpoint:**
```javascript
const token = localStorage.getItem('accessToken');

fetch('https://alkahafonlineacademy.com/api/v1/admin/statistics', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
.then(res => res.json())
.then(data => console.log('Admin Stats:', data));
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 0,
      "totalCourses": 0,
      "totalEnrollments": 0,
      ...
    }
  }
}
```

---

## 🎯 Step 7: Access Admin Dashboard

1. **Login as admin:**
   ```
   https://alkahafonlineacademy.com/src/pages/auth/login.html
   ```

2. **Navigate to admin dashboard:**
   ```
   https://alkahafonlineacademy.com/src/pages/admin/admin-dashboard.html
   ```

3. **You should see:**
   - Statistics cards with current data
   - User distribution chart
   - Enrollment overview chart
   - Recent enrollments (if any)
   - Quick action buttons

---

## ✅ Verification Checklist

### Backend API
- [ ] `/api/health` returns OK
- [ ] `/api/v1/admin/statistics` works (with admin token)
- [ ] `/api/v1/admin/instructors` works
- [ ] `/api/v1/admin/courses` works
- [ ] Node.js app running in cPanel

### Frontend Pages
- [ ] Admin dashboard loads without errors
- [ ] Statistics display correctly
- [ ] Navigation works
- [ ] Logout button works
- [ ] Instructors list page loads
- [ ] Add instructor page loads
- [ ] Courses list page loads

### Database
- [ ] New columns exist in Users table
- [ ] Admin user exists with role = 'admin'
- [ ] Can query database without errors

---

## 🔧 Troubleshooting

### Issue: 404 on Admin Routes

**Cause:** Routes not registered or server not restarted

**Fix:**
1. Check `server.js` has `apiV1.use('/admin', adminRoutes);`
2. Restart Node.js app in cPanel
3. Clear browser cache

### Issue: 403 Unauthorized

**Cause:** User doesn't have admin role

**Fix:**
1. Check user role in database:
   ```sql
   SELECT id, email, role FROM Users WHERE email = 'your@email.com';
   ```
2. Update if needed:
   ```sql
   UPDATE Users SET role = 'admin' WHERE email = 'your@email.com';
   ```

### Issue: Cannot read properties of undefined

**Cause:** API response structure mismatch

**Fix:**
1. Check browser console for errors
2. Verify API is returning `success: true`
3. Check response.data structure

### Issue: Charts not rendering

**Cause:** ApexCharts script not loaded

**Fix:**
1. Check Network tab in browser DevTools
2. Ensure `/assets/plugins/apexchart/apexcharts.js` loads
3. Clear browser cache

### Issue: Migration fails

**Cause:** Column already exists or syntax error

**Fix:**
1. Check if columns already exist:
   ```sql
   DESCRIBE Users;
   ```
2. If exists, skip migration
3. If error, run SQL manually in phpMyAdmin

---

## 📊 Post-Deployment Tasks

### 1. Add Sample Data (Optional)

**Create sample instructors:**
```sql
UPDATE Users
SET designation = 'Lead Designer',
    rating = 4.8,
    isVerified = TRUE,
    experience = 10,
    specialization = JSON_ARRAY('Web Development', 'UI/UX Design')
WHERE role = 'instructor'
LIMIT 5;
```

### 2. Test All Admin Features

- [ ] View instructors list
- [ ] Add new instructor
- [ ] Edit instructor
- [ ] Delete instructor
- [ ] View courses list
- [ ] Publish/unpublish course
- [ ] View dashboard statistics

### 3. Monitor Logs

**Check Node.js application logs:**
1. cPanel → Setup Node.js App
2. Click on app name
3. View "Application Logs"
4. Look for any errors

### 4. Setup Monitoring

**Consider adding:**
- Error logging (Sentry, LogRocket)
- Performance monitoring
- Database backups
- Uptime monitoring

---

## 🔐 Security Checklist

- [ ] Admin user has strong password
- [ ] JWT secrets are random and secure
- [ ] HTTPS is enabled
- [ ] Rate limiting is active
- [ ] CORS is properly configured
- [ ] SQL injection protection (Sequelize handles this)
- [ ] XSS protection (input sanitization)
- [ ] Password hashing with bcrypt

---

## 📱 Quick Access URLs

**Frontend:**
- Admin Dashboard: `https://alkahafonlineacademy.com/src/pages/admin/admin-dashboard.html`
- Instructors List: `https://alkahafonlineacademy.com/src/pages/admin/instructors-list.html`
- Add Instructor: `https://alkahafonlineacademy.com/src/pages/admin/instructor-add.html`
- Courses List: `https://alkahafonlineacademy.com/src/pages/admin/courses-list.html`

**API:**
- Statistics: `https://alkahafonlineacademy.com/api/v1/admin/statistics`
- Instructors: `https://alkahafonlineacademy.com/api/v1/admin/instructors`
- Courses: `https://alkahafonlineacademy.com/api/v1/admin/courses`

---

## 🎉 Success Criteria

**Deployment is successful when:**
1. ✅ You can login as admin
2. ✅ Admin dashboard loads and shows data
3. ✅ All API endpoints return expected responses
4. ✅ Charts and statistics display correctly
5. ✅ You can manage instructors (view, add, edit, delete)
6. ✅ You can manage courses (view, publish/unpublish)
7. ✅ No errors in browser console
8. ✅ No errors in server logs

---

## 📞 Support

**If you encounter issues:**
1. Check browser console (F12)
2. Check Node.js application logs in cPanel
3. Verify database structure
4. Check file permissions
5. Ensure all files uploaded correctly

**Documentation:**
- API Endpoints: `docs/ADMIN_API_ENDPOINTS.md`
- Admin Dashboard: `docs/ADMIN_DASHBOARD_COMPLETE.md`
- Project Structure: `docs/PROJECT_STRUCTURE.md`

---

**Last Updated:** December 28, 2025
**Deployment Status:** Ready ✅
**Estimated Time:** 30-60 minutes

Good luck with deployment! 🚀