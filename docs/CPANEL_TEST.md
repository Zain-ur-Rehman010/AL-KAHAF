# cPanel Backend Testing Guide

## The Error You're Seeing:

```
bash: node: command not found
```

This happens because in cPanel, Node.js is installed via **Setup Node.js App** and requires environment activation.

## ✅ How to Test in cPanel:

### Option 1: Use cPanel's Node.js Interface (EASIEST)

1. **Go to:** cPanel → Setup Node.js App
2. **Find your app** (alkahaf backend)
3. **Check Status:** Should show "started (v22.18.0)"
4. **Click "Restart"** to apply any changes
5. **View logs** by clicking on the app

### Option 2: Activate Node.js Environment in SSH

If you need to run commands via SSH:

```bash
# 1. Navigate to your app directory
cd /home2/tsjilueh/alkahafonlineacademy.com/api

# 2. Source the Node.js environment (this activates node)
source /home2/tsjilueh/nodevenv/alkahafonlineacademy.com/api/22/bin/activate

# 3. Now you can use node commands
node -v
npm -v

# 4. Test your backend
node src/server.js
```

### Option 3: Use the App's Built-in Scripts

The cPanel Node.js app automatically runs your server. You don't need to manually start it!

## 🧪 How to Test Your Backend (Without SSH):

### 1. Test API Health Check

Open your browser and visit:
```
https://alkahafonlineacademy.com/api/health
```

**Expected Response:**
```json
{"status":"OK","timestamp":"2025-12-28T..."}
```

### 2. Test Registration Endpoint

Use **Postman** or **curl**:

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

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {...}
  }
}
```

### 3. Test from Browser Console

Open your registration page:
```
https://alkahafonlineacademy.com/src/pages/auth/register.html
```

Press F12 → Console tab, and paste:

```javascript
fetch('https://alkahafonlineacademy.com/api/health')
  .then(res => res.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

## 🔧 Your Current Issues:

Based on the error and our conversation, here's what needs to be fixed:

### Issue 1: Node.js App URI Configuration

**Current:** App URI is set to `/` (catches all requests)

**Fix:** Change to `/api` in cPanel → Setup Node.js App

**Steps:**
1. cPanel → Setup Node.js App
2. Click Edit (pencil icon)
3. Change **App URI** from `alkahafonlineacademy.com/` to `alkahafonlineacademy.com/api`
4. Click Save
5. Click Restart

### Issue 2: Upload Updated server.js

You modified `server.js` to add static file serving. Upload it:

1. Go to cPanel → File Manager
2. Navigate to: `alkahafonlineacademy.com/api/src/`
3. Upload `server.js` from: `d:\Client Projects\AlKahaf\backend\src\server.js`
4. Confirm overwrite
5. Go to Setup Node.js App → Restart

## 🎯 Quick Checklist:

- [ ] Change App URI to `/api` in cPanel Setup Node.js App
- [ ] Upload updated `server.js` to `alkahafonlineacademy.com/api/src/`
- [ ] Restart the Node.js app
- [ ] Test: `https://alkahafonlineacademy.com/api/health`
- [ ] Test: `https://alkahafonlineacademy.com/index.html`
- [ ] Test: `https://alkahafonlineacademy.com/src/pages/auth/register.html`

## 📊 Expected URLs After Fix:

| URL | What Should Happen |
|-----|-------------------|
| `https://alkahafonlineacademy.com/` | Homepage loads with styles |
| `https://alkahafonlineacademy.com/index.html` | Homepage loads |
| `https://alkahafonlineacademy.com/src/pages/auth/register.html` | Registration page loads |
| `https://alkahafonlineacademy.com/api/health` | `{"status":"OK"}` |
| `https://alkahafonlineacademy.com/api/v1/auth/register` | Registration endpoint (POST) |

## 🆘 If Still Not Working:

### Check Node.js App Status:

1. cPanel → Setup Node.js App
2. Status should show: **"started (v22.18.0)"**
3. If stopped, click "Start"
4. Click on app name to view **Application Logs**

### Common Errors in Logs:

**"Cannot find module"**
→ Run `npm install` in the app directory (use cPanel terminal)

**"Database connection error"**
→ Check `.env` file has correct database credentials

**"Port already in use"**
→ Restart the app via cPanel interface

## 💡 Remember:

You **DON'T** need to manually run `node src/server.js` in cPanel. The **Setup Node.js App** interface handles this automatically!

Just:
1. Configure the app correctly
2. Make sure it's "started"
3. It runs automatically on app restart