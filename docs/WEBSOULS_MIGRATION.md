# AlKahaf LMS — Railway → Websouls cPanel Migration Guide

Last updated: 2026-03-07

---

## Current State
- Backend: Node.js + Express hosted on Railway
- Database: MySQL on Railway
- Frontend: Static HTML/CSS/JS served via frontend server (port 3001)
- File Storage: Base64 in DB (instructor images), no thumbnails yet

---

## COMPLETED FIXES (already in codebase)

### ✅ FIX 1 — Op.iLike removed
**File:** `backend/src/controllers/courseController.js` (searchCourses function)
- `Op.iLike` is PostgreSQL-only and crashes on MySQL
- Changed to `Op.like` (MySQL is case-insensitive by default — same behavior)

### ✅ FIX 2 — MySQL ONLY_FULL_GROUP_BY strict mode
**File:** `backend/src/controllers/adminController.js` (getTopCourses function)
- MySQL strict mode requires all non-aggregated SELECT columns to be in GROUP BY
- Fixed: `group: ['Course.id', 'Course.title', 'Course.category', 'Course.price', 'Course.status']`

### ✅ FIX 3 — Database dialect already set to MySQL
**Files:** `backend/src/config/database.js`, `backend/config/config.js`
- Both already use `dialect: 'mysql'`
- No changes needed

### ✅ FIX 4 — No DataTypes.ARRAY usage
- Verified: No PostgreSQL-specific ARRAY type used in any model
- All array data uses `DataTypes.JSON` (compatible with MySQL 5.7+)

---

## PENDING TASKS BEFORE WEBSOULS DEPLOYMENT

### ⚠️ TASK 1 — Switch from sequelize.sync() to proper migrations

**Current (dangerous for production):**
```js
// backend/src/server.js
await sequelize.sync({ alter: true }); // ← can modify live tables unexpectedly
```

**Required fix for cPanel production:**
```js
// Change to:
await sequelize.authenticate(); // just test connection, don't auto-alter tables
```

Then run migrations manually via SSH:
```bash
cd backend
npx sequelize-cli db:migrate
```

**Why:** `sync({ alter: true })` on a live production DB can drop columns, change types,
or cause data loss if model definitions change.

---

### ✅ TASK 2 — Cloudinary for image uploads

**Status:** Implemented
**Packages installed:** `cloudinary`, `streamifier`

**Files created:**
- `backend/src/config/cloudinary.js` — Cloudinary v2 config
- `backend/src/routes/uploadRoutes.js` — unified `POST /api/v1/upload?folder=courses|instructors|blogs`

**Cloudinary folders:** `alkahaf/courses`, `alkahaf/instructors`, `alkahaf/blogs`

**Frontend pages updated:**
- `instructor-add.html` / `instructor-edit.html` — upload before submit, store URL
- `course-add.html` (admin) — thumbnail uploaded to Cloudinary, URL sent in payload
- `add-course.html` (instructor) — same

**Environment variables needed (add to Railway + cPanel Node.js app):**
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

### ✅ TASK 3 — multer uploadMiddleware.js writes to disk

**File:** `backend/src/middleware/uploadMiddleware.js`
**Fix:** Switched from `diskStorage` to `multer.memoryStorage()` — no disk writes

---

### ⚠️ TASK 4 — Admin settings use fs.writeFileSync (writes JSON to disk)

**File:** `backend/src/controllers/adminController.js` (top of file)
**Current:** Settings are stored in a local JSON file using `fs.writeFileSync`
**Problem:** File writes on Railway are ephemeral (lost on redeploy). On cPanel may work
but is still fragile.
**Fix:** Move settings to a `Settings` database table

---

### ✅ TASK 5 — uploads/ folder served as static files

**File:** `backend/src/server.js`
**Fix:** Static `/uploads` route removed — all images now served via Cloudinary CDN.

---

## WEBSOULS CPANEL DEPLOYMENT STEPS

### Step 1 — Create MySQL database in cPanel
1. cPanel → MySQL Databases → Create Database
2. Create database user → assign ALL PRIVILEGES
3. Note: DB_HOST on cPanel is usually `localhost` (not an IP)

### Step 2 — Setup Node.js App in cPanel
1. cPanel → Setup Node.js App → Create Application
2. Settings:
   - Node.js version: **18.x** (minimum 16.x)
   - Application mode: **Production**
   - Application root: `backend/` (relative to home dir)
   - Application URL: your domain or subdomain
   - Application startup file: `src/server.js`

### Step 3 — Set Environment Variables in cPanel Node.js App
Add ALL of these in the Node.js app environment variables section:
```
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpanel_dbname
DB_USER=cpanel_dbuser
DB_PASSWORD=cpanel_dbpassword
JWT_SECRET=use_a_strong_random_string_min_64_chars
JWT_REFRESH_SECRET=use_a_different_strong_random_string
CORS_ORIGIN=https://yourdomain.com
CLOUDINARY_CLOUD_NAME=          ← add when Cloudinary is integrated
CLOUDINARY_API_KEY=             ← add when Cloudinary is integrated
CLOUDINARY_API_SECRET=          ← add when Cloudinary is integrated
```

**NEVER upload .env file via File Manager.**

### Step 4 — Upload backend files
Via cPanel File Manager or SSH (FTP also works):
- Upload entire `backend/` folder to your app root
- Do NOT upload `node_modules/` — install on server

### Step 5 — Install dependencies on server
Via cPanel Terminal or SSH:
```bash
cd ~/your-app-root/backend
npm install --production
```

### Step 6 — Run database migrations
```bash
cd ~/your-app-root/backend
npx sequelize-cli db:migrate
```
This creates all tables in the cPanel MySQL database.

### Step 7 — Start the Node.js app
In cPanel → Setup Node.js App → click **Start** (or Restart if already running)

### Step 8 — Upload frontend
Upload contents of `frontend/` to `public_html/`
- The static HTML/CSS/JS files serve directly via Apache

### Step 9 — Update api-config.js for production
**File:** `frontend/assets/js/api-config.js`
```js
BASE_URL: 'https://yourdomain.com/api/v1',
// or if Node.js app runs on a subdomain:
BASE_URL: 'https://api.yourdomain.com/api/v1',
```

### Step 10 — Configure domain/subdomain routing
Option A — Node.js on subdomain (recommended):
- Create subdomain `api.yourdomain.com` → point to Node.js app port
- Frontend on `yourdomain.com` → public_html

Option B — Reverse proxy via .htaccess:
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
```

---

## KNOWN WEBSOULS SHARED HOSTING LIMITATIONS

| Limitation | Impact | Workaround |
|-----------|--------|-----------|
| Ephemeral disk (some plans) | `uploads/` folder lost on restart | Use Cloudinary |
| Memory limit ~256MB per process | Large file uploads may crash | Keep multer limit at 5MB |
| No root access | Can't install global npm packages | Use local `npx` |
| MySQL only (no PostgreSQL) | — | Already using MySQL ✅ |
| cPanel Node.js may restart on inactivity | Cold start delay | Use keep-alive ping or upgrade plan |
| `ONLY_FULL_GROUP_BY` MySQL strict mode | GROUP BY queries fail | Fixed in adminController ✅ |
| No `Op.iLike` in MySQL | Search breaks | Fixed in courseController ✅ |
| SSL certificate required for JWT | HTTPS must be enabled | Use Let's Encrypt via cPanel |

---

## ENVIRONMENT VARIABLE CHECKLIST

| Variable | Railway | cPanel | Notes |
|----------|---------|--------|-------|
| NODE_ENV | production | production | |
| PORT | auto-assigned | 3000 or cPanel-assigned | |
| DB_HOST | Railway MySQL host | localhost | |
| DB_PORT | Railway MySQL port | 3306 | |
| DB_NAME | Railway DB name | cPanel DB name | |
| DB_USER | Railway DB user | cPanel DB user | |
| DB_PASSWORD | Railway DB password | cPanel DB password | |
| JWT_SECRET | set | must re-set | use same value to keep sessions valid |
| JWT_REFRESH_SECRET | set | must re-set | use same value |
| CLOUDINARY_CLOUD_NAME | pending | pending | add when implemented |
| CLOUDINARY_API_KEY | pending | pending | |
| CLOUDINARY_API_SECRET | pending | pending | |

---

## DATA MIGRATION (Railway MySQL → cPanel MySQL)

When ready to migrate live data:

### Method 1 — mysqldump (recommended)
```bash
# Export from Railway
mysqldump -h railway-host -u user -p dbname > alkahaf_backup.sql

# Import to cPanel
mysql -h localhost -u cpanel_user -p cpanel_dbname < alkahaf_backup.sql
```

### Method 2 — phpMyAdmin
1. Railway DB → export as SQL file
2. cPanel phpMyAdmin → import SQL file
3. Check for any errors in the import log

### Important: Run migrations first
Always run `npx sequelize-cli db:migrate` BEFORE importing data so tables exist with correct structure.

---

## FILES CHANGED FOR MIGRATION COMPATIBILITY

| File | Change | Status |
|------|--------|--------|
| `backend/src/controllers/courseController.js` | `Op.iLike` → `Op.like` | ✅ Done |
| `backend/src/controllers/adminController.js` | GROUP BY all selected columns | ✅ Done |
| `backend/src/config/database.js` | dialect already mysql | ✅ Already correct |
| `backend/config/config.js` | dialect already mysql | ✅ Already correct |
| `backend/src/server.js` | Change `sync({ alter: true })` → `authenticate()` | ⚠️ Pending |
| `backend/src/middleware/uploadMiddleware.js` | Switch to memoryStorage (no disk writes) | ✅ Done |
| `backend/src/config/cloudinary.js` | New — Cloudinary v2 config | ✅ Done |
| `backend/src/routes/uploadRoutes.js` | New — unified upload endpoint | ✅ Done |
| `backend/src/controllers/adminController.js` | Move settings from JSON file to DB | ⚠️ Pending |
| `frontend/assets/js/api-config.js` | Update BASE_URL to production domain | ⚠️ Do on deploy day |
