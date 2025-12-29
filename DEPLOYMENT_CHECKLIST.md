# Quick Deployment Checklist - User Registration Testing

This is a minimal deployment to test user registration functionality on cPanel.

## 📦 Files to Upload to cPanel

### **Essential Files Only:**

```
alkahaf-backend/
├── src/
│   ├── config/
│   │   ├── config.js
│   │   └── database.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── rateLimitMiddleware.js
│   ├── models/
│   │   ├── index.js
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── services/
│   │   ├── tokenService.js
│   │   └── emailService.js
│   └── server.js
├── config/
│   └── config.js
├── migrations/
│   ├── 01-create-users.js
│   └── migrate.js
├── package.json
├── package-lock.json
└── .sequelizerc
```

**DO NOT upload** (not needed for testing):
- ❌ node_modules/ (will be installed on server)
- ❌ .git/ (version control, not needed)
- ❌ .env (create directly on server)
- ❌ Other model files (Course, Enrollment, etc.) - not needed yet

---

## ✅ Step-by-Step Deployment

### **Step 1: Setup Node.js App in cPanel (5 minutes)**

1. Login to cPanel
2. Go to **"Setup Node.js App"**
3. Click **"Create Application"**
4. Fill in:
   ```
   Node.js version: 18.20.8
   Application mode: Production
   Application root: alkahaf-backend
   Application URL: yourdomain.com (or api.yourdomain.com)
   Application startup file: src/server.js
   ```
5. Click **"Create"**

### **Step 2: Create MySQL Database (3 minutes)**

1. Go to **"MySQL Databases"**
2. Create database: `alkahaf_lms`
3. Create user: `alkahaf_user` with strong password
4. Add user to database with **ALL PRIVILEGES**
5. **Write down credentials:**
   ```
   Database: yourusername_alkahaf_lms
   User: yourusername_alkahaf_user
   Password: [your_password]
   ```

### **Step 3: Upload Files (5 minutes)**

**Option A: Using File Manager (Easiest)**

1. Go to **File Manager** in cPanel
2. Navigate to `alkahaf-backend` folder
3. Upload files maintaining folder structure:
   - Upload `src` folder (with all subfolders)
   - Upload `config` folder
   - Upload `migrations` folder
   - Upload `package.json`
   - Upload `package-lock.json`
   - Upload `.sequelizerc`

**Option B: Using FTP**

Use FileZilla to upload all files to `alkahaf-backend` folder

**Option C: Zip and Upload**

1. Zip your backend folder locally (excluding node_modules)
2. Upload zip to cPanel
3. Extract in `alkahaf-backend` folder

### **Step 4: Create .env File (2 minutes)**

In File Manager, create `.env` file in `alkahaf-backend` folder:

```env
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yourusername_alkahaf_lms
DB_USER=yourusername_alkahaf_user
DB_PASSWORD=your_actual_database_password

# JWT Configuration
JWT_SECRET=change_this_to_random_string_minimum_32_chars
JWT_REFRESH_SECRET=another_random_string_minimum_32_chars
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# CORS
CORS_ORIGIN=https://yourdomain.com

# Email (optional for testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@yourdomain.com
```

**⚠️ IMPORTANT:**
- Replace `yourusername_alkahaf_lms` with your actual database name from cPanel
- Replace `yourusername_alkahaf_user` with your actual database user
- Replace `your_actual_database_password` with the password you created
- Change JWT secrets to random strings

### **Step 5: Install Dependencies (2 minutes)**

1. Go to **"Setup Node.js App"**
2. Click on your application
3. Click **"Run NPM Install"** button
4. Wait for installation (2-3 minutes)
5. Check for success message

### **Step 6: Run Migrations (1 minute)**

**Option A: Using cPanel Terminal (if available)**

```bash
cd alkahaf-backend
node migrations/migrate.js
```

**Option B: Using SSH**

```bash
ssh yourusername@yourserver.com
cd alkahaf-backend
node migrations/migrate.js
```

**Option C: Using phpMyAdmin (manual - last resort)**

If you can't run migrations, manually create Users table using the SQL from migration file.

### **Step 7: Restart Application (1 minute)**

1. Go to **"Setup Node.js App"**
2. Click **"Restart"**
3. Check status shows **"Running"**

---

## 🧪 Testing User Registration

### **Test 1: Check API is Running**

Open browser and visit:
```
https://yourdomain.com/api/v1/
```

You should see a response (or error if no root route - that's ok)

### **Test 2: Test Registration Endpoint**

Use **Postman** or **curl**:

```bash
curl -X POST https://yourdomain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Test123456",
    "role": "student"
  }'
```

**Expected Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "uuid-here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student"
  },
  "accessToken": "token-here",
  "refreshToken": "refresh-token-here"
}
```

### **Test 3: Verify in Database**

1. Go to **phpMyAdmin** in cPanel
2. Select your database: `yourusername_alkahaf_lms`
3. Click on `Users` table
4. You should see the registered user

### **Test 4: Test Login**

```bash
curl -X POST https://yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test123456"
  }'
```

---

## 🐛 Troubleshooting

### **Application Not Starting**

**Check logs:**
1. In "Setup Node.js App", view **Passenger log file**
2. Look for errors

**Common fixes:**
- Verify `.env` file exists and has correct values
- Check database credentials are correct
- Ensure all files uploaded correctly
- Run NPM Install again

### **Database Connection Error**

**Error:** `ER_ACCESS_DENIED_ERROR` or `ECONNREFUSED`

**Fix:**
- Double-check database credentials in `.env`
- Ensure database user has ALL PRIVILEGES
- Verify database name includes cPanel username prefix

### **Migration Failed**

**Run manually in terminal:**
```bash
cd alkahaf-backend
node migrations/migrate.js
```

**Or create table manually in phpMyAdmin:**
See `migrations/01-create-users.js` for SQL schema

### **CORS Error**

**Error:** `Access-Control-Allow-Origin`

**Fix:**
Add your domain to CORS_ORIGIN in `.env`:
```env
CORS_ORIGIN=https://yourdomain.com
```

Then restart application

### **500 Internal Server Error**

**Check:**
1. Application logs
2. `.env` configuration
3. Database connection
4. File permissions (755 for folders, 644 for files)

---

## 📊 Post-Testing Checklist

- [ ] Node.js app created and running
- [ ] MySQL database created
- [ ] All files uploaded
- [ ] .env file created with correct credentials
- [ ] Dependencies installed (NPM Install)
- [ ] Migrations completed (Users table created)
- [ ] Application restarted and showing "Running"
- [ ] Registration endpoint tested successfully
- [ ] User data visible in phpMyAdmin
- [ ] Login endpoint tested successfully

---

## 🎯 What's Next After Testing?

Once user registration is working:

1. **Upload remaining models** (Course, Enrollment, etc.)
2. **Add more migrations** for other tables
3. **Deploy frontend** to `public_html`
4. **Connect frontend to backend API**
5. **Complete authentication features** (see AUTH_COMPLETION_GUIDE.md)
6. **Add course management features**
7. **Setup email service**
8. **Configure Stripe payments**

---

## 📞 Need Help?

**Check these files:**
- `docs/guides/CPANEL_DEPLOYMENT_GUIDE.md` - Full deployment guide
- `docs/guides/AUTH_COMPLETION_GUIDE.md` - Authentication features
- `backend/src/server.js` - Server configuration
- `backend/migrations/01-create-users.js` - Database schema

**Common cPanel Locations:**
- Application logs: Setup Node.js App → View Passenger Log
- Database: phpMyAdmin → Select your database
- Files: File Manager → alkahaf-backend folder

---

**Good luck with your deployment! 🚀**

Once registration is working, you can gradually add more features.