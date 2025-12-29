# .env File Setup Guide

Quick guide to configure your `.env` file before uploading to cPanel.

## 🔧 Required Changes Before Upload

### **1. Database Configuration** (CRITICAL)

Get these values from cPanel → MySQL Databases:

```env
DB_NAME=yourusername_alkahaf_lms     # ← Replace with actual DB name from cPanel
DB_USER=yourusername_alkahaf_user    # ← Replace with actual DB user from cPanel
DB_PASSWORD=your_database_password   # ← Replace with actual password you created
```

**How to find your database name:**
1. Login to cPanel
2. Go to MySQL Databases
3. Look at "Current Databases" section
4. Copy the full name (includes prefix)

Example: If your cPanel username is `john123`, database name will be:
```
john123_alkahaf_lms
```

---

### **2. JWT Secrets** (CRITICAL)

Generate two random strings (minimum 32 characters each):

```env
JWT_SECRET=your_random_string_here
JWT_REFRESH_SECRET=another_random_string_here
```

**Quick way to generate:**

**Option A: Online Generator**
- Visit: https://www.random.org/strings/
- Number of strings: 1
- Length: 64 characters
- Click "Get Strings"
- Copy and paste

**Option B: Use this command (if you have Node.js locally)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run it twice to get two different secrets.

**Example values (DON'T use these, generate your own!):**
```env
JWT_SECRET=a3f9d2e8b5c1f4a7d0e3b6c9f2e5b8d1c4f7a0d3e6b9c2f5a8d1e4b7c0f3a6
JWT_REFRESH_SECRET=p8q5r2s9t6u3v0w7x4y1z8a5b2c9d6e3f0g7h4i1j8k5l2m9n6o3p0q7r4s1
```

---

### **3. Domain Configuration** (IMPORTANT)

Replace with your actual domain:

```env
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

**If you have multiple domains:**
```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

**For testing with subdomain:**
```env
CORS_ORIGIN=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

---

### **4. Email Configuration** (OPTIONAL - Can configure later)

If using Gmail for sending emails:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM=noreply@yourdomain.com
```

**⚠️ Important for Gmail:**
- Don't use your regular Gmail password
- Generate an "App Password":
  1. Go to Google Account Settings
  2. Security → 2-Step Verification (enable if not already)
  3. App Passwords → Generate
  4. Use that password in SMTP_PASSWORD

**For other email providers:**
- **Outlook/Office365:**
  ```env
  SMTP_HOST=smtp.office365.com
  SMTP_PORT=587
  ```

- **Yahoo:**
  ```env
  SMTP_HOST=smtp.mail.yahoo.com
  SMTP_PORT=587
  ```

- **Your own domain email (cPanel):**
  ```env
  SMTP_HOST=mail.yourdomain.com
  SMTP_PORT=587
  SMTP_USER=noreply@yourdomain.com
  SMTP_PASSWORD=your_email_password
  ```

---

## ✅ Quick Checklist Before Upload

- [ ] Updated `DB_NAME` with cPanel database name (includes prefix)
- [ ] Updated `DB_USER` with cPanel database user (includes prefix)
- [ ] Updated `DB_PASSWORD` with actual database password
- [ ] Generated and set `JWT_SECRET` (32+ characters)
- [ ] Generated and set `JWT_REFRESH_SECRET` (32+ characters, different from JWT_SECRET)
- [ ] Updated `CORS_ORIGIN` with your domain
- [ ] Updated `FRONTEND_URL` with your domain
- [ ] (Optional) Configured email settings if needed
- [ ] (Optional) Added Stripe keys if using payments

---

## 📦 Upload Instructions

### **Method 1: Upload via File Manager**

1. In cPanel, go to **File Manager**
2. Navigate to `alkahaf-backend` folder
3. Click **Upload**
4. Select `.env` file from your local backend folder
5. Upload completes
6. Set file permissions: Right-click → Permissions → Set to **644**

### **Method 2: Create Directly in cPanel**

1. In cPanel, go to **File Manager**
2. Navigate to `alkahaf-backend` folder
3. Click **+ File**
4. Name it: `.env`
5. Right-click → Edit
6. Copy and paste all content from your local `.env` file
7. Save
8. Set permissions to **644**

### **Method 3: Use FTP**

1. Connect via FTP (FileZilla)
2. Navigate to `alkahaf-backend` folder
3. Upload `.env` file
4. Set permissions to **644**

---

## 🔒 Security Notes

### **CRITICAL:**

1. **Never commit .env to Git**
   - Already added to `.gitignore`
   - Double-check before pushing code

2. **Use strong secrets in production**
   - JWT secrets must be random and long (32+ chars)
   - Never use example/default values

3. **Protect database credentials**
   - Use strong database passwords
   - Don't share your `.env` file

4. **File permissions**
   - Set `.env` to **644** (read/write for owner only)
   - Never set to **777**

---

## 🧪 Testing Your Configuration

After uploading `.env` file to cPanel:

### **1. Test Database Connection**

SSH into server or use cPanel Terminal:
```bash
cd alkahaf-backend
node test-connection.js
```

Expected output:
```
✅ Database connection established successfully!
✅ MySQL Version: 8.x.x
```

### **2. Check Environment Variables Loaded**

Create test file `test-env.js`:
```javascript
require('dotenv').config();
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);
```

Run:
```bash
node test-env.js
```

Should show your values (password will be hidden).

### **3. Restart Application**

After uploading `.env`:
1. Go to **Setup Node.js App** in cPanel
2. Click **Restart**
3. Check status shows **"Running"**

---

## 🆘 Troubleshooting

### **Problem: Database connection failed**

**Check:**
- Database name includes cPanel prefix
- User has ALL PRIVILEGES
- Password is correct (no extra spaces)

### **Problem: JWT errors**

**Check:**
- JWT_SECRET and JWT_REFRESH_SECRET are different
- Both are at least 32 characters
- No quotes around the values in .env

### **Problem: CORS errors in frontend**

**Check:**
- CORS_ORIGIN matches your frontend domain exactly
- Include `https://` in the domain
- Restart app after changing CORS settings

### **Problem: .env not loading**

**Check:**
- File is named exactly `.env` (with dot at start)
- File is in application root (`alkahaf-backend` folder)
- File permissions are 644
- Restart application after upload

---

## 📋 Example Filled .env (Reference)

```env
# Production Configuration Example
NODE_ENV=production
PORT=5000

# Database (from cPanel)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=john123_alkahaf_lms
DB_USER=john123_alkahaf_user
DB_PASSWORD=S3cur3P@ssw0rd!2024

# JWT Secrets (generated randomly)
JWT_SECRET=a3f9d2e8b5c1f4a7d0e3b6c9f2e5b8d1c4f7a0d3e6b9c2f5a8d1e4b7c0f3a6
JWT_REFRESH_SECRET=p8q5r2s9t6u3v0w7x4y1z8a5b2c9d6e3f0g7h4i1j8k5l2m9n6o3p0q7r4s1
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Domains
CORS_ORIGIN=https://alkahaf-lms.com,https://www.alkahaf-lms.com
FRONTEND_URL=https://alkahaf-lms.com

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply.alkahaf@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_FROM=noreply@alkahaf-lms.com

# Others (defaults are fine)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

**Remember:** Update the values in your `.env` file before uploading!