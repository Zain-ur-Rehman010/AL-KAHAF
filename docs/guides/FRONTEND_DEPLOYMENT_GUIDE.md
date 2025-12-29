# 🚀 Frontend Deployment Guide - AlKahaf LMS

Complete guide to deploy your AlKahaf LMS frontend to cPanel and connect it with the backend API.

---

## 📋 Prerequisites

Before deploying, ensure:
- ✅ Backend is deployed and running on cPanel
- ✅ Backend URL: `https://alkahafonlineacademy.com/api/v1`
- ✅ Database is configured and migrations completed
- ✅ You have cPanel File Manager access

---

## 🎯 Deployment Overview

We'll deploy the frontend to the `public_html` folder in cPanel so it's accessible at your main domain.

**Result:**
- Frontend: `https://alkahafonlineacademy.com`
- Backend API: `https://alkahafonlineacademy.com/api/v1`

---

## 📁 Step 1: Prepare Frontend Files

### What's Already Done ✅

I've created two new JavaScript files for API integration:

1. **`frontend/assets/js/api-config.js`**
   - Contains API endpoint configurations
   - Production API URL: `https://alkahafonlineacademy.com/api/v1`

2. **`frontend/assets/js/auth.js`**
   - Handles user registration
   - Handles user login
   - Manages authentication tokens
   - Redirects users based on role (admin/instructor/student)

### Files to Upload

You need to upload ALL files from the `frontend` folder:

```
frontend/
├── assets/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript (including NEW auth.js & api-config.js)
│   ├── img/           # Images
│   ├── fonts/         # Web fonts
│   └── plugins/       # Third-party libraries
├── src/
│   └── pages/         # All HTML pages
│       ├── auth/      # login.html, register.html
│       ├── student/   # Student dashboards
│       ├── instructor/# Instructor dashboards
│       └── admin/     # Admin pages
├── index.html         # Homepage
└── ... (all other HTML files)
```

---

## 📤 Step 2: Upload Frontend to cPanel

### Method 1: Using File Manager (Recommended)

#### Option A: Upload as ZIP (Faster)

1. **Compress frontend folder locally:**
   - On Windows: Right-click `frontend` folder → Send to → Compressed (zipped) folder
   - Name it: `frontend.zip`

2. **Upload to cPanel:**
   - Login to cPanel
   - Go to **File Manager**
   - Navigate to `public_html/` folder
   - Click **Upload**
   - Select `frontend.zip`
   - Wait for upload to complete

3. **Extract the ZIP:**
   - Right-click `frontend.zip` in File Manager
   - Click **Extract**
   - Extract to: `public_html/`
   - Click **Extract Files**
   - Delete `frontend.zip` after extraction

4. **Move files to root:**
   - After extraction, you'll have `public_html/frontend/`
   - You need to move everything FROM `frontend/` TO `public_html/`
   - Select all files inside `frontend/` folder
   - Click **Move**
   - Move to: `public_html/`
   - Delete the empty `frontend/` folder

#### Option B: Upload Files Directly

1. **Login to cPanel**
2. **Go to File Manager**
3. **Navigate to `public_html/`**
4. **Upload all files from your local `frontend/` folder:**
   - Upload `assets/` folder
   - Upload `src/` folder
   - Upload all HTML files (`index.html`, etc.)

### Method 2: Using FTP (FileZilla)

1. **Connect via FTP:**
   - Host: Your domain or cPanel server IP
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21

2. **Navigate to `public_html/`**

3. **Upload all frontend files**

---

## 🔧 Step 3: Integrate API with HTML Pages

You need to add the new JavaScript files to your HTML pages for API integration to work.

### Update Register Page

**File:** `src/pages/auth/register.html`

Add these scripts **BEFORE** the closing `</body>` tag:

```html
<!-- API Configuration -->
<script src="/assets/js/api-config.js"></script>

<!-- Authentication Handler -->
<script src="/assets/js/auth.js"></script>
```

**Full script section should look like:**

```html
<!-- jQuery -->
<script src="/assets/js/jquery-3.7.1.min.js"></script>

<!-- Bootstrap JS -->
<script src="/assets/js/bootstrap.bundle.min.js"></script>

<!-- Select2 JS -->
<script src="/assets/plugins/select2/js/select2.min.js"></script>

<!-- Slick Slider -->
<script src="/assets/plugins/slick/slick.js"></script>

<!-- Validation -->
<script src="/assets/js/validation.js"></script>

<!-- Custom Script -->
<script src="/assets/js/script.js"></script>

<!-- API Configuration -->
<script src="/assets/js/api-config.js"></script>

<!-- Authentication Handler -->
<script src="/assets/js/auth.js"></script>
</body>
</html>
```

### Update Login Page

**File:** `src/pages/auth/login.html`

Add the same scripts before `</body>`:

```html
<!-- API Configuration -->
<script src="/assets/js/api-config.js"></script>

<!-- Authentication Handler -->
<script src="/assets/js/auth.js"></script>
```

### Update Registration Form

**File:** `src/pages/auth/register.html`

Add `id` attributes to your form and inputs:

```html
<form id="register-form" method="POST">
    <div class="mb-3">
        <label class="form-label">First Name <span class="text-danger">*</span></label>
        <input type="text" id="firstName" name="firstName" class="form-control" placeholder="Enter your first name" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Last Name <span class="text-danger">*</span></label>
        <input type="text" id="lastName" name="lastName" class="form-control" placeholder="Enter your last name" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Email <span class="text-danger">*</span></label>
        <input type="email" id="email" name="email" class="form-control" placeholder="Enter your email" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Password <span class="text-danger">*</span></label>
        <input type="password" id="password" name="password" class="form-control pass-input" placeholder="Enter your password" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Confirm Password <span class="text-danger">*</span></label>
        <input type="password" id="confirmPassword" name="confirmPassword" class="form-control" placeholder="Confirm your password" required>
    </div>

    <!-- Hidden field for role (defaults to student) -->
    <input type="hidden" id="role" name="role" value="student">

    <button type="submit" class="btn btn-primary w-100">Sign Up</button>
</form>
```

### Update Login Form

**File:** `src/pages/auth/login.html`

Add `id` attributes:

```html
<form id="login-form" method="POST">
    <div class="mb-3">
        <label class="form-label">Email <span class="text-danger">*</span></label>
        <input type="email" id="email" name="email" class="form-control" placeholder="Enter your email" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Password <span class="text-danger">*</span></label>
        <input type="password" id="password" name="password" class="form-control pass-input" placeholder="Enter your password" required>
    </div>

    <button type="submit" class="btn btn-primary w-100">Sign In</button>
</form>
```

---

## ✅ Step 4: Verify Deployment

### Check Files are Uploaded

1. **Go to cPanel File Manager**
2. **Navigate to `public_html/`**
3. **Verify these files exist:**
   ```
   public_html/
   ├── assets/
   │   └── js/
   │       ├── api-config.js  ✅ NEW
   │       ├── auth.js        ✅ NEW
   │       ├── script.js
   │       ├── validation.js
   │       └── ... (other JS files)
   ├── src/
   │   └── pages/
   │       └── auth/
   │           ├── login.html
   │           └── register.html
   ├── index.html
   └── ... (other files)
   ```

### Test the Website

1. **Open your browser**
2. **Visit:** `https://alkahafonlineacademy.com`
3. **Homepage should load correctly**

### Test Registration

1. **Go to:** `https://alkahafonlineacademy.com/src/pages/auth/register.html`
2. **Fill in the registration form:**
   - First Name: Test
   - Last Name: User
   - Email: testuser@example.com
   - Password: Test123456!
   - Confirm Password: Test123456!
3. **Click "Sign Up"**
4. **Expected Result:**
   - Loading spinner appears on button
   - Success message appears (green alert)
   - Redirected to student dashboard after 1.5 seconds

### Verify in Database

1. **Go to cPanel → phpMyAdmin**
2. **Select database:** `tsjilueh_alkahaf_lms`
3. **Click on `Users` table**
4. **You should see:**
   - New user with email `testuser@example.com`
   - Password is hashed
   - Role is `student`
   - Timestamps are filled

### Test Login

1. **Go to:** `https://alkahafonlineacademy.com/src/pages/auth/login.html`
2. **Enter credentials:**
   - Email: testuser@example.com
   - Password: Test123456!
3. **Click "Sign In"**
4. **Expected Result:**
   - Loading spinner appears
   - Success message
   - Redirected to student dashboard

---

## 🐛 Troubleshooting

### Issue: "Cannot reach API" error

**Possible Causes:**
1. Backend not running
2. CORS configuration issue
3. Wrong API URL

**Solutions:**
1. **Check backend status:**
   - cPanel → Setup Node.js App
   - Status should be "Running"
   - If stopped, click "Restart"

2. **Verify API URL:**
   - Open `assets/js/api-config.js`
   - Check `BASE_URL` is: `https://alkahafonlineacademy.com/api/v1`

3. **Test API directly:**
   - Visit: `https://alkahafonlineacademy.com/api/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

### Issue: Form submission doesn't work

**Possible Causes:**
1. JavaScript files not loaded
2. Form doesn't have correct IDs
3. Script loading order issue

**Solutions:**
1. **Check browser console (F12):**
   - Look for JavaScript errors
   - Fix any missing files

2. **Verify script order:**
   - jQuery must load first
   - api-config.js before auth.js
   - All scripts before `</body>`

3. **Check form IDs:**
   - Form: `id="register-form"` or `id="login-form"`
   - Inputs must have correct IDs

### Issue: "CORS error" in console

**Possible Cause:**
Backend CORS not configured for frontend domain

**Solution:**
1. **Check backend `.env` file:**
   ```
   CORS_ORIGIN=https://alkahafonlineacademy.com
   ```

2. **Restart backend:**
   - cPanel → Setup Node.js App → Restart

### Issue: User registered but can't see in database

**Possible Causes:**
1. Wrong database selected
2. Users table doesn't exist
3. Database connection issue

**Solutions:**
1. **Verify database:**
   - cPanel → phpMyAdmin
   - Select correct database: `tsjilueh_alkahaf_lms`

2. **Check Users table exists:**
   - Should see `Users` in table list
   - If not, run migrations on backend

3. **Check backend logs:**
   - cPanel → Setup Node.js App → View Log
   - Look for database errors

### Issue: Redirect goes to wrong page

**Possible Cause:**
Dashboard pages don't exist at expected paths

**Solution:**
1. **Verify dashboard files exist:**
   - `src/pages/student/student-dashboard.html`
   - `src/pages/instructor/instructor-dashboard.html`
   - `src/pages/admin/admin-dashboard.html`

2. **Create temporary redirect:**
   - Edit `auth.js`
   - Temporarily redirect all users to a test page

---

## 📱 Testing Checklist

After deployment, test these scenarios:

- [ ] Homepage loads correctly
- [ ] Registration page loads
- [ ] Can register a new user
- [ ] Success message appears after registration
- [ ] User appears in database
- [ ] Password is hashed in database
- [ ] Login page loads
- [ ] Can login with registered credentials
- [ ] Login shows success message
- [ ] Redirects to correct dashboard based on role
- [ ] Logout works (if you have logout button)
- [ ] CSS styles load correctly
- [ ] Images display properly
- [ ] All links work

---

## 🔐 Security Notes

### Important Security Measures

1. **HTTPS Only:**
   - Your site should use HTTPS (SSL certificate)
   - Install Let's Encrypt SSL in cPanel if not already done
   - Force HTTPS redirects

2. **Password Requirements:**
   - Minimum 6 characters (consider increasing to 8+)
   - Password strength validation already included
   - Passwords are hashed on backend with bcrypt

3. **Token Security:**
   - Tokens stored in localStorage
   - Tokens automatically sent with API requests
   - Tokens expire after 24 hours (configurable in backend)

4. **Input Validation:**
   - Frontend validation for user experience
   - Backend validation for security
   - Never trust frontend data alone

### Recommended Enhancements

1. **Add email verification**
2. **Implement "Forgot Password" flow**
3. **Add CAPTCHA to prevent bots**
4. **Rate limiting on login attempts**
5. **Two-factor authentication (2FA)**

---

## 📚 Next Steps

After successful deployment:

1. **Test Complete User Flow:**
   - Register → Login → Browse Courses → Enroll → Track Progress

2. **Customize Branding:**
   - Update logo images
   - Change color scheme
   - Update text content

3. **Add More Features:**
   - Course enrollment from frontend
   - Student progress tracking
   - Instructor course creation
   - Admin user management

4. **Performance Optimization:**
   - Enable caching in cPanel
   - Compress images
   - Minify CSS/JS files
   - Use CDN for assets

5. **SEO Optimization:**
   - Add meta descriptions
   - Configure sitemap
   - Set up Google Analytics

---

## 📞 Quick Reference

### Important URLs

- **Frontend:** `https://alkahafonlineacademy.com`
- **Backend API:** `https://alkahafonlineacademy.com/api/v1`
- **Login Page:** `https://alkahafonlineacademy.com/src/pages/auth/login.html`
- **Register Page:** `https://alkahafonlineacademy.com/src/pages/auth/register.html`
- **Health Check:** `https://alkahafonlineacademy.com/api/health`

### cPanel Access

- **File Manager:** cPanel → File Manager → public_html
- **phpMyAdmin:** cPanel → Databases → phpMyAdmin
- **Node.js App:** cPanel → Software → Setup Node.js App
- **SSL/TLS:** cPanel → Security → SSL/TLS

### File Locations

- **Frontend:** `public_html/`
- **Backend:** `alkahaf-lms/alkahaf-backend/`
- **New JS Files:**
  - `public_html/assets/js/api-config.js`
  - `public_html/assets/js/auth.js`

---

## ✨ Summary

**What You'll Do:**

1. ✅ Upload frontend files to `public_html/`
2. ✅ Add script tags to login.html and register.html
3. ✅ Add IDs to form elements
4. ✅ Test user registration
5. ✅ Verify data in database
6. ✅ Test user login

**Expected Result:**

✅ Fully functional LMS website
✅ Users can register and login
✅ Data saves to database
✅ Authentication works end-to-end
✅ Frontend connected to backend

---

**Ready to deploy?** Follow the steps above and your AlKahaf LMS will be live! 🚀

For detailed HTML modifications, see: `HTML_INTEGRATION_GUIDE.md`