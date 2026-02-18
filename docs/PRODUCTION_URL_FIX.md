# Production URL Security Fix

## Problem Identified

Your live site at `alkahafonlineacademy.com` is exposing internal file structure in URLs:

❌ **Current (Insecure):**
```
alkahafonlineacademy.com/src/pages/courses/course-grid.html
```

This reveals:
- Internal folder structure
- File organization
- Potential security vulnerabilities
- Unprofessional appearance

✅ **Target (Secure):**
```
alkahafonlineacademy.com/courses
```

Clean, professional, secure URLs that hide your file structure.

---

## Solution Overview

We've created two configuration files for your production server:

1. **Apache Configuration** ([apache-vhost.conf](frontend/apache-vhost.conf)) - For cPanel/Apache hosting
2. **Nginx Configuration** ([nginx.conf](frontend/nginx.conf)) - For VPS/cloud hosting with Nginx

Both configurations provide:
- ✅ Clean URLs (no file structure exposed)
- ✅ 301 redirects from old URLs to new URLs
- ✅ Security headers (XSS, clickjacking protection)
- ✅ Gzip compression
- ✅ Browser caching for performance
- ✅ HTTPS enforcement
- ✅ API proxy to backend server

---

## Implementation Guide

### Option 1: Apache/cPanel Hosting

If you're using **cPanel, shared hosting, or Apache**, follow these steps:

#### Step 1: Access Your Server

**Via SSH:**
```bash
ssh user@alkahafonlineacademy.com
```

**Via cPanel File Manager:**
- Log into cPanel
- Click "File Manager"
- Navigate to public_html or your domain root

#### Step 2: Backup Current Configuration

```bash
# Backup current .htaccess (if exists)
cp .htaccess .htaccess.backup.$(date +%Y%m%d)
```

#### Step 3: Update Apache Virtual Host Configuration

**For VPS/Dedicated Server (Full Access):**

1. Upload `apache-vhost.conf` to your server
2. Edit the file and update these paths:
   ```apache
   DocumentRoot /var/www/alkahaf/frontend
   <Directory /var/www/alkahaf/frontend>
   SSLCertificateFile /etc/letsencrypt/live/alkahafonlineacademy.com/cert.pem
   ```

3. Copy configuration to Apache sites:
   ```bash
   sudo cp apache-vhost.conf /etc/apache2/sites-available/alkahaf.conf
   sudo a2ensite alkahaf.conf
   sudo a2enmod rewrite headers expires deflate ssl proxy proxy_http
   sudo systemctl restart apache2
   ```

**For cPanel/Shared Hosting (Limited Access):**

Since you can't edit virtual host files, you'll need to use `.htaccess`:

1. The existing `.htaccess` in your frontend folder needs to be updated
2. Contact your hosting provider and ask them to enable these Apache modules:
   - mod_rewrite
   - mod_headers
   - mod_expires
   - mod_deflate

3. Replace your current `.htaccess` with the cleaned version (simplified from apache-vhost.conf)

#### Step 4: Test the Configuration

```bash
# Test Apache configuration
sudo apache2ctl configtest

# If OK, reload
sudo systemctl reload apache2
```

#### Step 5: Verify Clean URLs

Visit these URLs and confirm they work:
- ✅ https://alkahafonlineacademy.com/courses
- ✅ https://alkahafonlineacademy.com/login
- ✅ https://alkahafonlineacademy.com/register
- ✅ https://alkahafonlineacademy.com/student/dashboard

Old URLs should redirect:
- https://alkahafonlineacademy.com/src/pages/courses/course-grid.html → redirects to → /courses

---

### Option 2: Nginx (VPS/Cloud Hosting)

If you're using **Nginx** (DigitalOcean, Linode, AWS, etc.):

#### Step 1: Upload Configuration

```bash
# Upload nginx.conf to your server
scp nginx.conf user@alkahafonlineacademy.com:/tmp/

# SSH into server
ssh user@alkahafonlineacademy.com
```

#### Step 2: Update Paths in Configuration

Edit the configuration file:
```bash
sudo nano /tmp/nginx.conf
```

Update these lines:
```nginx
root /var/www/alkahaf/frontend;
ssl_certificate /etc/letsencrypt/live/alkahafonlineacademy.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/alkahafonlineacademy.com/privkey.pem;
```

#### Step 3: Install Configuration

```bash
# Copy to Nginx sites-available
sudo cp /tmp/nginx.conf /etc/nginx/sites-available/alkahaf

# Create symlink to sites-enabled
sudo ln -s /etc/nginx/sites-available/alkahaf /etc/nginx/sites-enabled/

# Remove default site (if needed)
sudo rm /etc/nginx/sites-enabled/default
```

#### Step 4: Test and Reload Nginx

```bash
# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

---

## URL Mapping Reference

After implementation, URLs will work as follows:

| Clean URL (New) | File Path (Hidden) |
|----------------|-------------------|
| `/courses` | `/src/pages/courses/course-grid.html` |
| `/courses/list` | `/src/pages/courses/course-list.html` |
| `/course-details` | `/src/pages/courses/course-details.html` |
| `/login` | `/src/pages/auth/login.html` |
| `/register` | `/src/pages/auth/register.html` |
| `/student` | `/src/pages/student/student-dashboard.html` |
| `/student/courses` | `/src/pages/student/student-courses.html` |
| `/instructor` | `/src/pages/instructor/instructor-dashboard.html` |
| `/admin` | `/src/pages/admin/admin-dashboard.html` |

**Old URLs will automatically redirect** with 301 (permanent redirect) to the new clean URLs.

---

## Frontend Code Updates

After server configuration is deployed, you need to update all internal links in your HTML files:

### Update Navigation Links

**BEFORE:**
```html
<a href="/src/pages/courses/course-grid.html">Courses</a>
```

**AFTER:**
```html
<a href="/courses">Courses</a>
```

### Files to Update

Search and replace in these files:
1. `index.html` - Main navigation
2. All header/navigation components
3. Dashboard menu items
4. Footer links

### Quick Find & Replace Commands

```bash
# Find all HTML files with old URLs
grep -r "src/pages/" *.html

# Replace course URLs (example)
find . -name "*.html" -exec sed -i 's|/src/pages/courses/course-grid.html|/courses|g' {} +
find . -name "*.html" -exec sed -i 's|/src/pages/auth/login.html|/login|g' {} +
```

---

## Testing Checklist

After deployment, test these scenarios:

### ✅ Clean URLs Work
- [ ] `/courses` loads course grid
- [ ] `/login` loads login page
- [ ] `/register` loads registration
- [ ] `/student` loads student dashboard (when logged in)
- [ ] `/admin` loads admin dashboard (when logged in as admin)

### ✅ Old URLs Redirect
- [ ] `/src/pages/courses/course-grid.html` → redirects to `/courses`
- [ ] `/src/pages/auth/login.html` → redirects to `/login`
- [ ] Status code is **301** (permanent redirect)

### ✅ Static Assets Load
- [ ] CSS files load correctly
- [ ] JavaScript files load
- [ ] Images display
- [ ] Fonts render properly

### ✅ API Calls Work
- [ ] Login API call succeeds
- [ ] Registration API call succeeds
- [ ] Dashboard loads user data from API

### ✅ Security Headers Present
Check with browser DevTools (Network tab):
- [ ] `X-Frame-Options: SAMEORIGIN`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-XSS-Protection: 1; mode=block`

### ✅ HTTPS Enforced
- [ ] `http://alkahafonlineacademy.com` → redirects to `https://`

---

## Troubleshooting

### Issue: 404 Not Found on Clean URLs

**Cause:** Rewrite rules not active

**Fix:**
```bash
# Apache
sudo a2enmod rewrite
sudo systemctl restart apache2

# Nginx
sudo nginx -t  # Check for syntax errors
```

### Issue: CSS/JS Not Loading

**Cause:** Relative paths broken by URL rewriting

**Fix:** Use absolute paths in HTML:
```html
<!-- BEFORE -->
<link rel="stylesheet" href="assets/css/style.css">

<!-- AFTER -->
<link rel="stylesheet" href="/assets/css/style.css">
```

### Issue: Old URLs Still Accessible

**Cause:** 301 redirects not configured

**Fix:** Verify redirect rules are present in configuration and restart web server.

### Issue: API Calls Failing

**Cause:** Backend proxy not configured

**Fix:** Update ProxyPass (Apache) or proxy_pass (Nginx) with correct backend URL.

---

## Performance Notes

### Why Virtual Host Config > .htaccess

**Apache .htaccess:**
- ❌ Checked on EVERY request (slower)
- ❌ Applies to subdirectories (overhead)
- ✅ Works on shared hosting (no root access needed)

**Apache Virtual Host (httpd.conf):**
- ✅ Compiled once at server startup (faster)
- ✅ Better performance for high traffic
- ❌ Requires root/sudo access
- ❌ Requires server restart to apply changes

**Nginx:**
- ✅ Fastest option (event-driven architecture)
- ✅ Better concurrency handling
- ✅ Lower memory usage
- ✅ Perfect for high-traffic sites

### Recommended Approach

1. **Development:** Use Express server (current local setup)
2. **Shared Hosting:** Use optimized `.htaccess`
3. **VPS/Dedicated:** Use Apache Virtual Host or Nginx config

---

## Next Steps

1. ✅ Configuration files created
2. ⏳ Deploy configuration to production server (follow Option 1 or 2 above)
3. ⏳ Update internal HTML links to use clean URLs
4. ⏳ Test all pages and functionality
5. ⏳ Update sitemap.xml with new clean URLs (if you have one)
6. ⏳ Submit updated sitemap to Google Search Console

---

## Support

If you encounter issues during deployment:

1. **Check web server error logs:**
   ```bash
   # Apache
   sudo tail -f /var/log/apache2/error.log

   # Nginx
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Verify file permissions:**
   ```bash
   # Files should be readable by web server
   sudo chown -R www-data:www-data /var/www/alkahaf
   sudo chmod -R 755 /var/www/alkahaf
   ```

3. **Contact your hosting provider** if you need help enabling Apache modules or configuring SSL.

---

**Created:** 2025-12-29
**Project:** AlKahaf Online Academy
**Security Priority:** HIGH - Implement ASAP to hide file structure