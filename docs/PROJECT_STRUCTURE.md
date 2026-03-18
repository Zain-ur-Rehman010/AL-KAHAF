# AlKahaf LMS - Complete Project Structure

**Last Updated:** December 28, 2025

---

## 📂 Local Development Structure

```
AlKahaf/
├── backend/                           # Node.js + Express Backend
│   ├── config/
│   │   └── config.json               # Sequelize database config
│   ├── migrations/                    # Database migrations
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # Database connection
│   │   ├── controllers/              # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── courseController.js
│   │   │   ├── enrollmentController.js
│   │   │   └── userController.js
│   │   ├── middleware/               # Express middleware
│   │   │   ├── authMiddleware.js     # JWT verification
│   │   │   ├── errorHandler.js       # Error handling
│   │   │   ├── rateLimitMiddleware.js
│   │   │   └── roleMiddleware.js     # Role-based access
│   │   ├── models/                   # Sequelize models (11 total)
│   │   │   ├── Assignment.js
│   │   │   ├── Certificate.js
│   │   │   ├── Course.js
│   │   │   ├── Enrollment.js
│   │   │   ├── index.js              # Model associations
│   │   │   ├── Lesson.js
│   │   │   ├── Message.js
│   │   │   ├── Module.js
│   │   │   ├── Notification.js
│   │   │   ├── Payment.js
│   │   │   ├── Quiz.js
│   │   │   └── User.js
│   │   ├── routes/                   # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── enrollmentRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/                 # Business logic
│   │   │   ├── emailService.js
│   │   │   └── tokenService.js
│   │   └── server.js                 # ⭐ Main entry point
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Environment template
│   ├── package.json
│   ├── package-lock.json
│   ├── QUICKSTART.md
│   └── README.md
│
├── frontend/                          # Static HTML/CSS/JS Frontend
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css             # Compiled CSS
│   │   │   └── (other CSS files)
│   │   ├── scss/                     # SCSS source
│   │   │   ├── main.scss
│   │   │   └── (component files)
│   │   ├── js/
│   │   │   ├── api-config.js         # ⭐ API endpoint configuration
│   │   │   ├── auth.js               # ⭐ Authentication handler
│   │   │   ├── jquery-3.7.1.min.js
│   │   │   ├── bootstrap.bundle.min.js
│   │   │   ├── script.js
│   │   │   └── (other JS files)
│   │   ├── img/
│   │   │   ├── favicon.png
│   │   │   ├── white-logo.png
│   │   │   ├── logo.svg
│   │   │   └── (other images)
│   │   ├── fonts/
│   │   └── plugins/
│   │       ├── fontawesome/
│   │       ├── select2/
│   │       ├── slick/
│   │       ├── feather/
│   │       └── (other plugins)
│   ├── src/
│   │   └── pages/
│   │       ├── auth/
│   │       │   ├── login.html         # ⭐ Integrated
│   │       │   ├── register.html      # ⭐ Integrated
│   │       │   ├── forgot-password.html
│   │       │   ├── otp.html
│   │       │   ├── set-password.html
│   │       │   └── lock-screen.html
│   │       ├── student/               # 21 pages
│   │       │   ├── student-dashboard.html
│   │       │   ├── student-courses.html
│   │       │   ├── student-profile.html
│   │       │   └── (other student pages)
│   │       ├── instructor/            # Instructor pages
│   │       │   ├── instructor-dashboard.html
│   │       │   └── (other instructor pages)
│   │       ├── blog/
│   │       ├── courses/
│   │       └── shared/
│   ├── .htaccess                      # ⭐ Apache routing config
│   ├── index.html                     # Homepage
│   ├── hero-slider.html
│   ├── package.json
│   ├── INTEGRATION_QUICK_START.md
│   └── PRE_DEPLOYMENT_CHECKLIST.md
│
├── docs/                              # Documentation
│   ├── guides/
│   │   ├── AUTH_COMPLETION_GUIDE.md
│   │   ├── FRONTEND_DEPLOYMENT_GUIDE.md
│   │   └── (other guides)
│   ├── QUICK_REFERENCE.md             # ⭐ Current quick reference
│   └── PROJECT_STRUCTURE.md           # ⭐ This file
│
├── .git/                              # Git repository
├── .gitignore
├── CLAUDE.md                          # AI assistant instructions
├── QUICK_REFERENCE.md
├── LMS_DEVELOPMENT_GUIDE.md
├── README.md
└── START_HERE.md
```

---

## 🌐 Production Server Structure (cPanel)

```
/home2/tsjilueh/alkahafonlineacademy.com/
│
├── .htaccess                          # ⭐ Apache configuration
│
├── api/                               # Backend (Node.js)
│   ├── config/
│   │   └── config.json
│   ├── migrations/
│   ├── node_modules/                  # Installed via cPanel npm
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js                  # Entry point
│   ├── .env                           # Production environment vars
│   └── package.json
│
├── assets/                            # Frontend assets (from frontend/assets)
│   ├── css/
│   ├── js/
│   │   ├── api-config.js
│   │   └── auth.js
│   ├── img/
│   ├── fonts/
│   └── plugins/
│
├── src/                               # Frontend pages (from frontend/src)
│   └── pages/
│       ├── auth/
│       ├── student/
│       ├── instructor/
│       └── (other pages)
│
├── index.html                         # Homepage
├── hero-slider.html
└── tmp/                               # Temp files
```

---

## 🗄️ Database Structure

### Database: `tsjilueh_alkahaf_lms` (MySQL)

**Tables (11 total):**

1. **Users**
   - Primary: Students, Instructors, Admins
   - Fields: id (UUID), firstName, lastName, email, password (hashed), role, status

2. **Courses**
   - Course catalog
   - Fields: id, title, description, instructorId, category, price, level, status

3. **Modules**
   - Course structure (belongs to Course)
   - Fields: id, courseId, title, description, order

4. **Lessons**
   - Content units (belongs to Module)
   - Fields: id, moduleId, title, content, videoUrl, duration

5. **Enrollments**
   - Student-Course relationship
   - Fields: id, studentId, courseId, status, progress, enrolledAt

6. **Quizzes**
   - Assessments
   - Fields: id, courseId, title, questions, passingScore

7. **Assignments**
   - Course assignments
   - Fields: id, courseId, title, description, dueDate

8. **Payments**
   - Transaction records
   - Fields: id, userId, courseId, amount, status, stripePaymentId

9. **Certificates**
   - Completion certificates
   - Fields: id, enrollmentId, issuedAt, certificateUrl

10. **Messages**
    - User-to-user messaging
    - Fields: id, senderId, recipientId, subject, body

11. **Notifications**
    - System notifications
    - Fields: id, userId, type, message, isRead

---

## 🔑 Environment Variables

### Backend (.env file)

```env
# Server
NODE_ENV=production
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tsjilueh_alkahaf_lms
DB_USER=tsjilueh_alkahaf_user
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# CORS
CORS_ORIGIN=https://alkahafonlineacademy.com

# Email (Optional - for future use)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Stripe (Optional - for future use)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 📊 Key File Purposes

### Backend Files:

| File | Purpose |
|------|---------|
| `server.js` | Express app initialization, middleware setup, route mounting, static file serving |
| `authController.js` | Register, login, logout, token refresh, get current user |
| `courseController.js` | CRUD operations for courses, search, publish |
| `enrollmentController.js` | Enroll, update progress, drop course, get enrollments |
| `userController.js` | Profile management, user stats, settings |
| `authMiddleware.js` | JWT verification, protect routes |
| `roleMiddleware.js` | Role-based access control (RBAC) |
| `errorHandler.js` | Centralized error handling |
| `tokenService.js` | Generate JWT tokens, verify tokens |
| `User.js` (model) | User schema, password hashing, validation |

### Frontend Files:

| File | Purpose |
|------|---------|
| `api-config.js` | API base URL, endpoints, headers configuration |
| `auth.js` | Registration handler, login handler, token management, redirects |
| `register.html` | User registration form with firstName, lastName, email, password |
| `login.html` | User login form with email auto-fill after registration |
| `script.js` | General frontend JavaScript (UI interactions, etc.) |
| `.htaccess` | Apache routing (API to backend, static files to Apache) |

---

## 🔄 Data Flow

### Registration Flow:
```
User (Browser)
  ↓ fills form
register.html
  ↓ submits (auth.js)
POST /api/v1/auth/register
  ↓ validates (authController.js)
User Model
  ↓ bcrypt.hash()
MySQL Database (Users table)
  ↓ returns user + tokens
LocalStorage (tokens saved)
  ↓ redirect
login.html (email auto-filled)
```

### Login Flow:
```
User (Browser)
  ↓ enters credentials
login.html
  ↓ submits (auth.js)
POST /api/v1/auth/login
  ↓ validates (authController.js)
bcrypt.compare(password, hash)
  ↓ generates tokens (tokenService.js)
JWT Access Token + Refresh Token
  ↓ saved to localStorage
Redirect to dashboard (role-based)
```

### API Request Flow:
```
Frontend (auth.js)
  ↓ fetch() with Authorization header
Express App (server.js)
  ↓ authMiddleware.js
Verify JWT Token
  ↓ roleMiddleware.js (if needed)
Check user role
  ↓ Controller
Business logic
  ↓ Model
Database query (Sequelize)
  ↓ Response
JSON data back to frontend
```

---

## 🎯 URL Routing

### How URLs Are Handled:

1. **API Requests (`/api/*`)**:
   - Caught by Express.js
   - Routed to appropriate controller
   - Example: `https://alkahafonlineacademy.com/api/v1/auth/login`

2. **Static Files (everything else)**:
   - Served by Express static middleware (line 57 in server.js)
   - Example: `https://alkahafonlineacademy.com/assets/css/style.css`
   - Example: `https://alkahafonlineacademy.com/src/pages/auth/register.html`

3. **404 Handling**:
   - If route not found in Express → 404 handler (line 74 in server.js)
   - Returns: `{"message":"Route not found"}`

---

## 📦 Dependencies

### Backend (package.json):
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.35.0",
    "mysql2": "^3.6.5",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "express-rate-limit": "^7.1.5",
    "joi": "^17.11.0",
    "nodemailer": "^6.9.7",
    "stripe": "^14.9.0"
  }
}
```

### Frontend:
- Bootstrap 5
- jQuery 3.7.1
- FontAwesome
- Select2
- Slick Slider
- Feather Icons
- Tabler Icons
- Iconsax

---

## 🛠️ Build & Deploy Process

### Backend:
1. **Local Development:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Production Deployment:**
   - Upload `backend/` contents to `/home2/tsjilueh/alkahafonlineacademy.com/api/`
   - Configure `.env` file
   - Run `npm install` via cPanel
   - Setup Node.js App in cPanel
   - Start the app

### Frontend:
1. **Local Development:**
   ```bash
   cd frontend
   npm install
   npm run dev  # Starts live-server + SCSS watch
   ```

2. **Production Deployment:**
   - Upload `frontend/` contents to `/home2/tsjilueh/alkahafonlineacademy.com/`
   - No build step required (static files)
   - Clear browser cache and test

---

**📖 For more details, see:**
- `/docs/QUICK_REFERENCE.md` - Deployment and maintenance quick reference
- `/docs/guides/AUTH_COMPLETION_GUIDE.md` - Authentication implementation
- `/backend/README.md` - Backend API documentation