# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AlKahaf is a Learning Management System (LMS) with a production-ready backend and a frontend. The project is structured as a monolithic application with clear separation between frontend and backend components.

**Tech Stack:**
- **Backend**: Node.js + Express.js + PostgreSQL + Sequelize ORM
- **Frontend**: HTML/CSS/JS with SCSS preprocessing
- **Authentication**: JWT with refresh tokens
- **Security**: bcrypt, helmet, CORS, rate limiting
- **Payment**: Stripe integration
- **Email**: Nodemailer

## Project Structure

```
AlKahaf/
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── config/       # Database and server config
│   │   ├── controllers/  # Request handlers (auth, course, enrollment, user)
│   │   ├── middleware/   # Auth, role-based access, error handling, rate limiting
│   │   ├── models/       # Sequelize models (11 models total)
│   │   ├── routes/       # API route definitions
│   │   ├── services/     # Business logic (token, email)
│   │   └── server.js     # Express app entry point
│   ├── migrations/       # Database migrations
│   ├── config/           # Sequelize configuration
│   └── package.json
├── frontend/             # Static HTML/CSS/JS site
│   ├── assets/
│   │   ├── css/          # Compiled CSS
│   │   ├── scss/         # Source SCSS files
│   │   ├── js/           # JavaScript files
│   │   ├── img/          # Images
│   │   ├── fonts/        # Web fonts
│   │   └── plugins/      # Third-party libraries
│   ├── *.html            # 80+ HTML pages
│   └── package.json
└── .git/
```

## Common Commands

### Backend Development

```bash
# Initial setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Database setup
createdb alkahaf_lms  # PostgreSQL database creation
npm run migrate        # Run database migrations
npm run seed          # Seed with sample data (optional)

# Development
npm run dev           # Start with nodemon (auto-restart)
npm start             # Start production server

# Testing
npm test              # Run Jest tests
npm test -- --watch   # Watch mode

# Database operations
npm run migrate:rollback  # Rollback last migration
```

### Frontend Development

```bash
cd frontend
npm install

# Development server (port 3000)
npm start             # Start live-server only
npm run sass          # Watch and compile SCSS
npm run dev           # Run both live-server and SCSS watch

# SCSS compilation
npx sass assets/scss/main.scss assets/css/style.css --style=compressed  # Production build
```

### Docker (Backend)

```bash
cd backend
docker-compose up -d   # Start PostgreSQL + backend
docker-compose down    # Stop services
```

## Database Architecture

### Core Models & Relationships

The backend uses Sequelize ORM with 11 interconnected models:

**User** (auth, profiles)
- Roles: admin, instructor, student
- Status: active, inactive, banned
- Relations: instructorCourses, enrollments, sentMessages, receivedMessages, notifications

**Course** (course catalog)
- Status: draft, published, archived
- Level: beginner, intermediate, advanced
- Relations: instructor, modules, enrollments, quizzes, assignments, payments, certificates

**Module** → **Lesson** (course structure hierarchy)
- Courses contain Modules, Modules contain Lessons

**Enrollment** (student-course relationship)
- Status: enrolled, in_progress, completed, dropped
- Tracks progress (0-100%)
- Relations: student, course, payments, certificate

**Quiz, Assignment** (assessments)
- Linked to courses and lessons

**Payment** (transactions)
- Status: pending, completed, failed, refunded
- Linked to enrollments, users, courses

**Certificate** (completion certificates)
- Issued upon course completion

**Message** (inter-user messaging)
- Sender/recipient relationships

**Notification** (system notifications)

### Key Sequelize Associations

All model associations are defined in `backend/src/models/index.js`. Pay attention to:
- `hasMany` / `belongsTo` relationships
- Foreign key naming conventions
- Aliased associations (e.g., `as: 'instructor'`, `as: 'student'`)

## API Architecture

### Base URL
`http://localhost:5000/api/v1`

### Route Organization

```
/auth         # Authentication (register, login, logout, refresh, me)
/courses      # Course CRUD, publish, search
/enrollments  # Enroll, progress tracking, drop
/users        # Profile, stats, settings
```

### Authentication Flow

1. User registers/logs in → receives `accessToken` + `refreshToken`
2. All protected routes require `Authorization: Bearer <accessToken>`
3. JWT verification happens in `authMiddleware.js`
4. Role-based access control in `roleMiddleware.js`
5. Tokens are managed by `tokenService.js`

### Middleware Chain

Typical protected route:
```javascript
router.post('/courses', authMiddleware, roleMiddleware(['instructor', 'admin']), courseController.create);
```

### Error Handling

- Global error handler in `middleware/errorHandler.js`
- Standardized response format:
  ```json
  {
    "success": true/false,
    "message": "...",
    "data": {...}
  }
  ```

## Security Considerations

### Environment Variables

NEVER commit `.env` files. Required variables:
- `JWT_SECRET` / `JWT_REFRESH_SECRET` (use strong random strings in production)
- `DB_PASSWORD` (PostgreSQL password)
- `STRIPE_SECRET_KEY` (if using payments)
- `ALLOWED_ORIGINS` (CORS whitelist)

### Authentication

- Passwords hashed with bcrypt (10 rounds minimum)
- JWT tokens with expiration
- Refresh token rotation
- Rate limiting on auth endpoints

### Input Validation

- Use Joi schemas for request validation
- Sequelize prevents SQL injection
- CORS configured to whitelist specific origins

## Frontend Architecture

### Page Types

The frontend contains 80+ HTML pages organized by role:

- **Public**: index.html, course-grid.html, course-details.html, login.html, register.html
- **Student**: student-dashboard.html, student-courses.html, student-quiz.html, etc.
- **Instructor**: instructor-dashboard.html, instructor-course.html, add-course.html, etc.
- **Admin**: (use instructor pages with elevated permissions)

### Asset Structure

- **SCSS**: Source stylesheets in `assets/scss/`, compiled to `assets/css/style.css`
- **JS**: Scripts in `assets/js/` (no bundler, direct browser execution)
- **Images**: `assets/img/`
- **Plugins**: Third-party libraries in `assets/plugins/`

### SCSS Workflow

The main SCSS file is `assets/scss/main.scss`. When making style changes:
1. Edit SCSS files in `assets/scss/`
2. Run `npm run sass` to watch and auto-compile
3. The compiled CSS goes to `assets/css/style.css`
4. HTML files reference the compiled CSS

## Testing the API

### Using Postman

Import `backend/postman-collection.json` (if available) or use these endpoints:

```bash
# Register
POST /api/v1/auth/register
Content-Type: application/json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "role": "student"
}

# Login
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

# Get current user
GET /api/v1/auth/me
Authorization: Bearer <token>

# Get courses
GET /api/v1/courses?page=1&limit=10&category=programming&level=beginner

# Create course (instructor/admin only)
POST /api/v1/courses
Authorization: Bearer <instructor_token>
{
  "title": "JavaScript Fundamentals",
  "description": "Learn JavaScript basics...",
  "category": "programming",
  "price": 49.99,
  "level": "beginner"
}

# Enroll in course
POST /api/v1/enrollments
Authorization: Bearer <student_token>
{
  "courseId": "uuid-of-course"
}

# Update progress
PATCH /api/v1/enrollments/:enrollmentId/progress
Authorization: Bearer <student_token>
{
  "progress": 50
}
```

## Common Development Tasks

### Adding a New API Endpoint

1. **Define the route** in `backend/src/routes/`
   ```javascript
   router.get('/new-endpoint', authMiddleware, controller.method);
   ```

2. **Create controller method** in `backend/src/controllers/`
   ```javascript
   exports.method = async (req, res, next) => {
     try {
       // Business logic
       res.json({ success: true, data: result });
     } catch (error) {
       next(error);
     }
   };
   ```

3. **Add model if needed** in `backend/src/models/`
4. **Update associations** in `backend/src/models/index.js`
5. **Create migration** if database changes required

### Adding a New Model

1. Create `backend/src/models/NewModel.js` following existing patterns
2. Define Sequelize schema with proper data types
3. Add associations in `backend/src/models/index.js`
4. Export from index.js
5. Create migration in `backend/migrations/`

### Modifying Frontend Pages

1. Locate the relevant HTML file (e.g., `student-dashboard.html`)
2. Edit HTML structure
3. If styling changes needed:
   - Edit SCSS in `assets/scss/`
   - Run `npm run sass` to compile
4. If JavaScript needed, add to `assets/js/` or inline

### Database Migrations

When changing database schema:
1. Create migration file in `backend/migrations/`
2. Define `up` (apply changes) and `down` (rollback) functions
3. Run `npm run migrate` to apply
4. Update corresponding Sequelize model

## Troubleshooting

### Backend Issues

**"Cannot connect to database"**
- Verify PostgreSQL is running
- Check `.env` has correct `DB_*` credentials
- Ensure database `alkahaf_lms` exists

**"Port 5000 already in use"**
- Change `PORT` in `.env`
- Or kill process: `lsof -i :5000` (Linux/Mac) or `netstat -ano | findstr :5000` (Windows)

**"JWT_SECRET not set"**
- Copy `.env.example` to `.env`
- Set `JWT_SECRET` and `JWT_REFRESH_SECRET`

**"Module not found"**
- Run `npm install` in backend directory
- Check `node_modules` exists

### Frontend Issues

**SCSS not compiling**
- Run `npm install` in frontend directory
- Check `assets/scss/main.scss` exists
- Run `npm run sass` manually

**Live server not starting**
- Check port 3000 is available
- Run `npm install` if `live-server` missing

**Pages not loading styles**
- Ensure `assets/css/style.css` exists (compiled from SCSS)
- Check HTML `<link>` tags reference correct CSS path

## Important Documentation

- `START_HERE.md` - Project overview and navigation
- `backend/README.md` - Complete API documentation
- `backend/QUICKSTART.md` - 5-minute setup guide
- `backend/DEPLOYMENT.md` - Production deployment
- `backend/QUICK_REFERENCE.md` - Developer quick reference
- `LMS_DEVELOPMENT_GUIDE.md` - Industry best practices

## Code Style & Conventions

### Backend (JavaScript/Node.js)

- Use async/await for asynchronous operations
- Use try-catch in controllers, pass errors to `next(error)`
- Consistent response format: `{ success, message, data }`
- Validate input with Joi before processing
- Use meaningful variable names (camelCase)
- Keep controllers thin, move complex logic to services
- Always use parameterized queries (Sequelize handles this)

### Database

- UUIDs as primary keys
- Timestamps on all tables (createdAt, updatedAt)
- Use enums for status fields
- Index foreign keys and frequently queried fields
- Follow naming: `tableName`, `columnName`, `foreignKeyId`

### Frontend

- Semantic HTML5
- BEM-like naming for CSS classes
- Keep JavaScript modular
- Comment complex logic
- Responsive design (mobile-first)

## Git Workflow

Current branch: `main`

When making changes:
1. Create feature branch: `git checkout -b feature/description`
2. Make changes and commit with clear messages
3. Push and create pull request to `main`
4. After merge, pull latest: `git pull origin main`

## Production Deployment

Refer to `backend/DEPLOYMENT.md` for comprehensive deployment guide. Key steps:

1. Set `NODE_ENV=production`
2. Use strong secrets in `.env`
3. Setup PostgreSQL database
4. Run migrations
5. Use process manager (PM2)
6. Configure reverse proxy (Nginx)
7. Enable HTTPS (Let's Encrypt)
8. Setup automated backups
9. Configure monitoring and logging

## Notes on Project Status

- Backend is production-ready with 30+ API endpoints
- Frontend is a static HTML/CSS/JS site with 80+ pages
- Database has 11 models with full associations
- Security features implemented (JWT, RBAC, rate limiting, input validation)
- Payment integration (Stripe) ready for configuration
- Email service (Nodemailer) ready for configuration
- Docker setup available for quick local development

## When Adding New Features

1. **Plan the feature**: Identify affected models, routes, controllers
2. **Backend first**: Create models → migrations → controllers → routes
3. **Test API**: Use Postman or curl to verify endpoints
4. **Frontend**: Update HTML pages to consume API
5. **Documentation**: Update relevant README files
6. **Testing**: Add unit/integration tests
7. **Security**: Validate input, check authorization
