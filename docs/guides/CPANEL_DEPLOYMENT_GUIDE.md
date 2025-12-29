# cPanel Deployment Guide - AlKahaf LMS

Complete step-by-step guide to deploy your AlKahaf LMS project on cPanel hosting with MySQL database and Node.js support.

## 📋 Prerequisites

✅ Your backend is now configured for MySQL (instead of PostgreSQL)
✅ cPanel account with:
- MySQL database access
- Node.js App support
- SSH access (optional but recommended)

---

## 🎯 Deployment Overview

1. **Setup MySQL Database** in cPanel
2. **Deploy Backend** (Node.js App)
3. **Deploy Frontend** (Static files to public_html)
4. **Configure Environment Variables**
5. **Run Database Migrations**
6. **Test & Launch**

---

## Step 1: Create MySQL Database in cPanel

### 1.1 Create Database

1. Login to your **cPanel**
2. Go to **"Databases"** section
3. Click **"MySQL Databases"** or **"Manage My Databases"**
4. Under **"Create New Database"**:
   - Database Name: `alkahaf_lms`
   - Click **"Create Database"**

   **Note:** cPanel will prefix your database name with your username.
   Final name will be: `yourusername_alkahaf_lms`

### 1.2 Create Database User

1. Scroll to **"MySQL Users"** section
2. Under **"Add New User"**:
   - Username: `alkahaf_user`
   - Password: Click "Generate Password" (save this password!)
   - Click **"Create User"**

   **Note:** Final username will be: `yourusername_alkahaf_user`

### 1.3 Add User to Database

1. Scroll to **"Add User to Database"**
2. Select:
   - User: `yourusername_alkahaf_user`
   - Database: `yourusername_alkahaf_lms`
3. Click **"Add"**
4. On privileges page, select **"ALL PRIVILEGES"**
5. Click **"Make Changes"**

### 1.4 Note Your Database Credentials

Write down these details (you'll need them later):

```
Database Host: localhost
Database Port: 3306
Database Name: yourusername_alkahaf_lms
Database User: yourusername_alkahaf_user
Database Password: [your generated password]
```

---

## Step 2: Setup Node.js Application in cPanel

### 2.1 Access Node.js Setup

1. In cPanel, go to **"Software"** section
2. Click **"Setup Node.js App"**

### 2.2 Create Node.js Application

Click **"Create Application"** and configure:

**Node.js version:** Select latest available (v18 or higher recommended)

**Application mode:** Production

**Application root:** `alkahaf-backend` (or your preferred folder name)

**Application URL:** Select your domain or subdomain
- Example: `api.yourdomain.com` or `yourdomain.com/api`

**Application startup file:** `src/server.js`

**Passenger log file:** Leave default or specify custom path

Click **"Create"**

### 2.3 Upload Backend Files

**Option A: Using File Manager (Easy)**

1. Go to **"Files"** → **"File Manager"** in cPanel
2. Navigate to the application root folder you created (`alkahaf-backend`)
3. Click **"Upload"**
4. Upload all files from your local `backend` folder:
   - `src/` folder
   - `config/` folder
   - `migrations/` folder
   - `package.json`
   - `package-lock.json`
   - `.sequelizerc`
   - All other backend files

**Option B: Using FTP (Recommended for large projects)**

1. Use FileZilla or any FTP client
2. Connect to your cPanel FTP
3. Navigate to `alkahaf-backend` folder
4. Upload all backend files

**Option C: Using SSH/Git (Best)**

```bash
# SSH into your server
ssh yourusername@yourserver.com

# Navigate to application folder
cd alkahaf-backend

# Clone your repository
git clone https://github.com/yourusername/AlKahaf.git .

# Or upload files via SCP
```

### 2.4 Install Dependencies

1. Go back to **"Setup Node.js App"** in cPanel
2. Click on your application name
3. Scroll to **"Detected configuration files"**
4. You should see `package.json`
5. Click **"Run NPM Install"** button
6. Wait for installation to complete (may take 2-3 minutes)

---

## Step 3: Configure Environment Variables

### 3.1 Create .env File

In your application root folder (`alkahaf-backend`):

1. Go to **File Manager**
2. Navigate to `alkahaf-backend`
3. Click **"+ File"** to create new file
4. Name it: `.env`
5. Edit the file and add:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database Configuration (Use your cPanel database details)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yourusername_alkahaf_lms
DB_USER=yourusername_alkahaf_user
DB_PASSWORD=your_generated_database_password

# JWT Configuration (Generate strong random strings)
JWT_SECRET=your_super_secret_jwt_key_change_this_to_random_string
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_too
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Stripe Payment Gateway (Add your keys if using payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLIC_KEY=pk_test_your_stripe_key

# Email Configuration (Configure with your email provider)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@yourdomain.com

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Frontend URL (for email links)
FRONTEND_URL=https://yourdomain.com

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:**
- Replace `yourusername_alkahaf_lms` with your actual database name
- Replace `yourusername_alkahaf_user` with your actual database user
- Replace `your_generated_database_password` with your actual password
- Generate strong random strings for JWT secrets

### 3.2 Alternative: Set Environment Variables in cPanel

You can also set environment variables directly in Node.js App settings:

1. Go to **"Setup Node.js App"**
2. Click on your application
3. Scroll to **"Environment Variables"**
4. Add each variable:
   - Variable name: `DB_HOST`
   - Value: `localhost`
   - Click "Add Variable"
   - Repeat for all variables

---

## Step 4: Run Database Migrations

You need to create the database tables by running migrations.

### 4.1 Using SSH (Recommended)

```bash
# SSH into your server
ssh yourusername@yourserver.com

# Navigate to application folder
cd alkahaf-backend

# Run migrations
npm run migrate

# Optional: Seed sample data
npm run seed
```

### 4.2 Using cPanel Terminal (if available)

1. Look for **"Terminal"** in cPanel
2. Navigate to your app folder:
   ```bash
   cd alkahaf-backend
   npm run migrate
   ```

### 4.3 Using phpMyAdmin (Manual - Not Recommended)

If you can't access SSH/Terminal, you can manually create tables:

1. Go to **phpMyAdmin** in cPanel
2. Select your database
3. Import SQL file from `backend/migrations/` (you'll need to convert migration files to raw SQL)

---

## Step 5: Deploy Frontend

### 5.1 Upload Frontend Files

1. Go to **File Manager** in cPanel
2. Navigate to `public_html` folder (this is your website root)
3. You can either:
   - **Option A:** Upload frontend directly to `public_html`
   - **Option B:** Create subfolder like `public_html/lms/` and upload there

4. Upload all files from your local `frontend` folder:
   - All `.html` files from root
   - `src/` folder
   - `assets/` folder (css, js, img, etc.)
   - All other frontend files

### 5.2 Update Frontend API Configuration

You need to point your frontend to the backend API.

**Create/Edit:** `frontend/assets/js/config.js`

```javascript
// API Configuration
const API_CONFIG = {
  // Update this to your actual backend URL
  baseURL: 'https://api.yourdomain.com/api/v1',
  // or if backend is on same domain:
  // baseURL: 'https://yourdomain.com:5000/api/v1',
  // or subdirectory:
  // baseURL: 'https://yourdomain.com/api/v1',

  timeout: 10000,
};

// Make available globally
window.API_CONFIG = API_CONFIG;
```

**Then update** `frontend/assets/js/auth.js` (when you create it):

```javascript
const API_URL = window.API_CONFIG?.baseURL || 'http://localhost:5000/api/v1';
```

---

## Step 6: Configure Application URL & Routing

### 6.1 Backend URL Configuration

Depending on your cPanel setup, your backend might be accessible at:

- `https://yourdomain.com:5000` (if ports are open)
- `https://api.yourdomain.com` (if you created subdomain)
- `https://yourdomain.com/api` (if using subdirectory)

**Set up subdomain (Recommended):**

1. In cPanel, go to **"Domains"** → **"Subdomains"**
2. Create subdomain: `api`
3. Document root: Point to your Node.js app folder
4. The Node.js app will handle requests to `api.yourdomain.com`

### 6.2 Update CORS Settings

Make sure your backend allows requests from your frontend domain.

In your `.env`:
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## Step 7: Start & Test Application

### 7.1 Start Node.js Application

1. Go to **"Setup Node.js App"** in cPanel
2. Click on your application
3. Make sure **"Run NPM Install"** is complete
4. Click **"Restart"** button
5. Check status - should show "Running"

### 7.2 Test Backend API

Open browser and test:

```
https://api.yourdomain.com/api/v1/health
```

You should see a response (or create a health check endpoint first).

### 7.3 Test Frontend

Navigate to:
```
https://yourdomain.com
```

Your frontend should load.

### 7.4 Test Full Flow

1. Go to registration page
2. Try to register a new user
3. Check if data is saved in MySQL database (use phpMyAdmin)
4. Try logging in

---

## 🔧 Troubleshooting

### Backend Not Starting

**Check logs:**
1. In "Setup Node.js App", view **"Passenger log file"**
2. Look for errors

**Common issues:**
- Missing `.env` file
- Wrong database credentials
- Port conflicts
- Missing dependencies (run NPM install again)

### Database Connection Failed

**Verify:**
```javascript
// Create test file: backend/test-db.js
require('dotenv').config();
const sequelize = require('./src/config/database');

sequelize.authenticate()
  .then(() => console.log('✅ Database connected!'))
  .catch(err => console.error('❌ Error:', err));
```

Run: `node test-db.js`

### Frontend Can't Connect to Backend

**Check:**
- CORS settings in backend
- Correct API URL in frontend config
- Backend is running (check Node.js app status)
- Firewall/security settings

### Migrations Failed

**Run manually:**
```bash
cd alkahaf-backend
npx sequelize-cli db:migrate
```

### 500 Internal Server Error

**Check:**
- Application logs
- `.env` configuration
- File permissions (should be 755 for folders, 644 for files)

---

## 📊 Post-Deployment Checklist

- [ ] Database created and configured
- [ ] Node.js app installed and running
- [ ] Frontend files uploaded
- [ ] Environment variables set
- [ ] Migrations completed successfully
- [ ] Test user registration works
- [ ] Test user login works
- [ ] Email configuration tested (if enabled)
- [ ] SSL certificate installed (use cPanel SSL/Let's Encrypt)
- [ ] Custom domain pointed correctly
- [ ] Backup plan in place

---

## 🚀 Performance Optimization

### Enable Caching

Add to your Node.js app:
```javascript
// backend/src/server.js
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});
```

### Compress Responses

```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### Monitor Application

Use cPanel's resource usage monitoring or install tools like PM2 (if you have SSH access).

---

## 🔐 Security Recommendations

1. **SSL Certificate:**
   - Install free Let's Encrypt SSL in cPanel
   - Force HTTPS redirects

2. **Strong Passwords:**
   - Use strong database passwords
   - Use strong JWT secrets (random 64+ character strings)

3. **Environment Variables:**
   - Never commit `.env` to Git
   - Keep production secrets secure

4. **Database Access:**
   - Don't allow remote database connections unless necessary
   - Use strong database user passwords

5. **Rate Limiting:**
   - Already configured in your backend
   - Monitor for unusual activity

6. **Regular Updates:**
   - Keep Node.js version updated
   - Update npm packages regularly
   - Monitor security advisories

---

## 📞 Need Help?

**cPanel Documentation:**
- https://docs.cpanel.net/

**Node.js on cPanel:**
- Search for "Node.js" in your cPanel documentation

**Database Issues:**
- Use phpMyAdmin to inspect database
- Check cPanel error logs

**Your Backend Files:**
- Check `backend/src/server.js` for startup configuration
- Review `backend/config/config.js` for database settings
- Check `backend/migrations/` for database schema

---

## 🎉 Deployment Complete!

Your AlKahaf LMS is now live on cPanel with:
- ✅ MySQL database
- ✅ Node.js backend API
- ✅ Static HTML/CSS/JS frontend
- ✅ User authentication system
- ✅ Ready for production use

**Next Steps:**
- Complete authentication features (see AUTH_COMPLETION_GUIDE.md)
- Add course content
- Configure payment gateway (Stripe)
- Setup email service
- Add analytics
- Promote your LMS!

---

**Last Updated:** December 28, 2024