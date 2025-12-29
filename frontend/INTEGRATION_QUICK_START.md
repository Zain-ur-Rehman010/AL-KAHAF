# 🚀 Quick Start - Frontend API Integration

This guide shows you exactly what to change in your HTML files to connect them to the backend API.

---

## ✨ What's Been Added

Two new JavaScript files have been created:

1. **`assets/js/api-config.js`** - API endpoint configuration
2. **`assets/js/auth.js`** - Handles registration, login, authentication

---

## 📝 Step-by-Step Integration

### Step 1: Add Script Tags

Add these two lines to **EVERY** HTML page that needs authentication (register, login, dashboards):

```html
<!-- Add BEFORE </body> tag, AFTER all other scripts -->
<script src="/assets/js/api-config.js"></script>
<script src="/assets/js/auth.js"></script>
```

**Full script section example:**

```html
    <!-- Existing scripts -->
    <script src="/assets/js/jquery-3.7.1.min.js"></script>
    <script src="/assets/js/bootstrap.bundle.min.js"></script>
    <script src="/assets/js/script.js"></script>

    <!-- ⭐ ADD THESE TWO -->
    <script src="/assets/js/api-config.js"></script>
    <script src="/assets/js/auth.js"></script>
</body>
</html>
```

---

### Step 2: Update Register Form

**File:** `src/pages/auth/register.html`

**Find your `<form>` tag and add `id="register-form"`:**

```html
<!-- BEFORE -->
<form method="POST">

<!-- AFTER -->
<form id="register-form" method="POST">
```

**Add IDs to all input fields:**

```html
<!-- First Name -->
<input type="text" id="firstName" name="firstName" class="form-control" required>

<!-- Last Name -->
<input type="text" id="lastName" name="lastName" class="form-control" required>

<!-- Email -->
<input type="email" id="email" name="email" class="form-control" required>

<!-- Password -->
<input type="password" id="password" name="password" class="form-control" required>

<!-- Confirm Password -->
<input type="password" id="confirmPassword" name="confirmPassword" class="form-control" required>

<!-- Role (hidden, defaults to student) -->
<input type="hidden" id="role" name="role" value="student">
```

**That's it!** The `auth.js` script will automatically handle the form submission.

---

### Step 3: Update Login Form

**File:** `src/pages/auth/login.html`

**Add `id="login-form"` to form:**

```html
<!-- BEFORE -->
<form method="POST">

<!-- AFTER -->
<form id="login-form" method="POST">
```

**Add IDs to input fields:**

```html
<!-- Email -->
<input type="email" id="email" name="email" class="form-control" required>

<!-- Password -->
<input type="password" id="password" name="password" class="form-control" required>
```

---

## 🎯 Complete Example - Register Page

Here's a minimal example showing what you need:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Register - AlKahaf LMS</title>
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <div class="main-wrapper">
        <!-- Your existing page structure -->

        <!-- Registration Form -->
        <form id="register-form" method="POST">
            <input type="text" id="firstName" name="firstName" placeholder="First Name" required>
            <input type="text" id="lastName" name="lastName" placeholder="Last Name" required>
            <input type="email" id="email" name="email" placeholder="Email" required>
            <input type="password" id="password" name="password" placeholder="Password" required>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required>
            <input type="hidden" id="role" name="role" value="student">

            <button type="submit" class="btn btn-primary">Sign Up</button>
        </form>
    </div>

    <!-- Scripts -->
    <script src="/assets/js/jquery-3.7.1.min.js"></script>
    <script src="/assets/js/bootstrap.bundle.min.js"></script>
    <script src="/assets/js/script.js"></script>

    <!-- ⭐ ADD THESE -->
    <script src="/assets/js/api-config.js"></script>
    <script src="/assets/js/auth.js"></script>
</body>
</html>
```

---

## 🎯 Complete Example - Login Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Login - AlKahaf LMS</title>
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <div class="main-wrapper">
        <!-- Your existing page structure -->

        <!-- Login Form -->
        <form id="login-form" method="POST">
            <input type="email" id="email" name="email" placeholder="Email" required>
            <input type="password" id="password" name="password" placeholder="Password" required>

            <button type="submit" class="btn btn-primary">Sign In</button>
        </form>
    </div>

    <!-- Scripts -->
    <script src="/assets/js/jquery-3.7.1.min.js"></script>
    <script src="/assets/js/bootstrap.bundle.min.js"></script>
    <script src="/assets/js/script.js"></script>

    <!-- ⭐ ADD THESE -->
    <script src="/assets/js/api-config.js"></script>
    <script src="/assets/js/auth.js"></script>
</body>
</html>
```

---

## 📋 Required IDs Checklist

### Register Form
- [ ] Form has `id="register-form"`
- [ ] First name input has `id="firstName"`
- [ ] Last name input has `id="lastName"`
- [ ] Email input has `id="email"`
- [ ] Password input has `id="password"`
- [ ] Confirm password input has `id="confirmPassword"`
- [ ] Hidden role input has `id="role"` (value="student")
- [ ] Submit button is `type="submit"`
- [ ] Scripts added: api-config.js and auth.js

### Login Form
- [ ] Form has `id="login-form"`
- [ ] Email input has `id="email"`
- [ ] Password input has `id="password"`
- [ ] Submit button is `type="submit"`
- [ ] Scripts added: api-config.js and auth.js

---

## 🎨 What Happens When User Submits?

### Registration Flow:

1. User fills form and clicks "Sign Up"
2. Button shows loading spinner: "Loading..."
3. Data sent to: `https://alkahafonlineacademy.com/api/v1/auth/register`
4. If successful:
   - Green success alert appears
   - User data saved to database
   - Tokens saved to browser localStorage
   - Redirects to dashboard after 1.5 seconds
5. If failed:
   - Red error alert appears
   - Shows error message (e.g., "Email already exists")

### Login Flow:

1. User enters email/password and clicks "Sign In"
2. Button shows loading spinner
3. Data sent to: `https://alkahafonlineacademy.com/api/v1/auth/login`
4. If successful:
   - Green success alert
   - Tokens saved
   - Redirects to dashboard (student/instructor/admin based on role)
5. If failed:
   - Red error alert
   - Shows error message

---

## 🛠️ Customization Options

### Change Success Messages

Edit `assets/js/auth.js`, find:

```javascript
AuthManager.showAlert(result.message, 'success');
```

Change to:

```javascript
AuthManager.showAlert('Welcome to AlKahaf LMS!', 'success');
```

### Change Redirect Delay

Edit `assets/js/auth.js`, find:

```javascript
setTimeout(() => {
    AuthManager.redirectToDashboard(result.user);
}, 1500);  // ← Change this number (milliseconds)
```

### Change Dashboard Paths

Edit `assets/js/auth.js`, find the `redirectToDashboard` function:

```javascript
redirectToDashboard: function(user) {
    switch (user.role) {
        case 'admin':
            window.location.href = '/src/pages/admin/admin-dashboard.html';
            break;
        case 'instructor':
            window.location.href = '/src/pages/instructor/instructor-dashboard.html';
            break;
        case 'student':
        default:
            window.location.href = '/src/pages/student/student-dashboard.html';
            break;
    }
}
```

### Add Role Selection

Add to registration form:

```html
<div class="mb-3">
    <label class="form-label">Register as:</label>
    <select id="role" name="role" class="form-control" required>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
    </select>
</div>
```

---

## ✅ Testing

### Test Registration:

1. Fill all fields correctly
2. Click "Sign Up"
3. Should see: "Loading..." → "Registration successful!"
4. Should redirect to student dashboard
5. Check database - user should appear in Users table

### Test Login:

1. Use registered email/password
2. Click "Sign In"
3. Should see: "Loading..." → "Login successful!"
4. Should redirect to dashboard

### Test Error Handling:

1. Try registering with same email twice → Should show "Email already exists"
2. Try login with wrong password → Should show "Invalid email or password"
3. Leave fields empty → Should show "Please fill in all fields"

---

## 🚀 Deploy & Test

1. **Upload to cPanel:**
   - Upload all frontend files to `public_html/`
   - Make sure `api-config.js` and `auth.js` are in `public_html/assets/js/`

2. **Test on live site:**
   - Go to: `https://alkahafonlineacademy.com/src/pages/auth/register.html`
   - Fill form and submit
   - Check browser console (F12) for any errors
   - Check database for new user

---

## 📞 Need Help?

### Check Browser Console

Press F12, go to "Console" tab:
- Look for JavaScript errors
- Look for API request logs
- Check if files are loading correctly

### Common Issues:

**"API_CONFIG is not defined"**
→ `api-config.js` not loaded or loaded in wrong order

**Form submits but nothing happens**
→ Form or input IDs are missing or incorrect

**"Network error"**
→ Backend not running or wrong API URL

---

**That's it!** Your frontend is now connected to the backend API. 🎉

For full deployment guide, see: `docs/guides/FRONTEND_DEPLOYMENT_GUIDE.md`