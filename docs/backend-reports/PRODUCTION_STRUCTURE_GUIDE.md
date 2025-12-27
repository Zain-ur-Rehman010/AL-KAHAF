# AlKahaf Production Structure Guide

## Overview

This document outlines the production-standard folder structure and organization for the AlKahaf LMS project.

---

## Backend Structure

```
backend/
├── src/
│   ├── config/              # Configuration files (database, env setup)
│   ├── controllers/         # Request handlers (business logic delegators)
│   ├── models/              # Database models and schemas
│   ├── routes/              # API route definitions
│   ├── middleware/          # Authentication, validation, error handling
│   ├── services/            # Business logic layer
│   ├── validators/          # Input validation schemas
│   ├── utils/               # Helper utilities
│   └── app.js               # Express app setup
├── migrations/              # Database migration scripts
├── .env                     # Environment variables (not in git)
├── .env.example             # Example env file
├── server.js                # Entry point
└── package.json
```

### Backend Layers Explained

**Routes** → **Controllers** → **Services** → **Models**
- **Routes**: Define endpoints and HTTP methods
- **Controllers**: Handle requests, call services, return responses
- **Services**: Contain business logic
- **Models**: Database operations and schemas

### Example Workflow

```
POST /api/v1/courses/
  ↓
routes/courses.js (route definition)
  ↓
controllers/courseController.js (receives request, validates)
  ↓
services/courseService.js (business logic, data processing)
  ↓
models/courseModel.js (save to database)
```

---

## Frontend Structure

```
frontend/
├── index.html               # Main entry point (or move to public/)
├── src/
│   ├── pages/
│   │   ├── auth/           # Login, register, forgot-password
│   │   ├── courses/        # Course listing, details, browsing
│   │   ├── instructor/     # Instructor dashboard and related pages
│   │   ├── student/        # Student dashboard and course pages
│   │   ├── blog/           # Blog pages
│   │   └── shared/         # Common pages (home, about, contact, etc.)
│   ├── components/         # Reusable HTML components
│   ├── layouts/            # Layout templates (header, footer, sidebar)
│   ├── assets/             # Images, icons, fonts
│   ├── js/                 # JavaScript modules
│   │   ├── api-service.js     # Centralized API calls
│   │   ├── auth.js            # Authentication logic
│   │   ├── courses.js         # Course operations
│   │   └── utils.js           # Helper functions
│   ├── css/                # Stylesheets
│   └── config.js           # Frontend configuration
├── public/                 # Static files (unchanged by build)
└── package.json
```

### HTML Page Organization

Group pages by feature in appropriate folders:

**Auth Pages** (`src/pages/auth/`)
- login.html
- register.html
- forgot-password.html
- set-password.html
- otp.html
- lock-screen.html

**Course Pages** (`src/pages/courses/`)
- course-details.html
- course-list.html
- course-grid.html
- course-category.html
- course-watch.html
- add-course.html

**Instructor Pages** (`src/pages/instructor/`)
- instructor-dashboard.html
- instructor-course.html
- instructor-earnings.html
- instructor-students.html
- instructor-announcements.html
- instructor-quiz.html
- etc.

**Student Pages** (`src/pages/student/`)
- student-dashboard.html
- student-courses.html
- student-certificates.html
- student-messages.html
- etc.

**Blog Pages** (`src/pages/blog/`)
- blog-grid.html
- blog-details.html
- blog-masonry.html
- etc.

**Shared/Common Pages** (`src/pages/shared/`)
- index.html (homepage)
- about-us.html
- contact-us.html
- faq.html
- pricing-plan.html
- privacy-policy.html
- terms-and-conditions.html
- error-404.html
- error-500.html
- hero-slider.html
- etc.

---

## API Route Structure

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Routes
```
POST   /auth/register          - User registration
POST   /auth/login             - User login
POST   /auth/logout            - User logout
POST   /auth/refresh-token     - Refresh access token
POST   /auth/forgot-password   - Request password reset
POST   /auth/reset-password    - Reset password
```

### Course Routes
```
GET    /courses                - Get all courses
GET    /courses/:id            - Get course details
POST   /courses                - Create course (instructor only)
PUT    /courses/:id            - Update course (instructor only)
DELETE /courses/:id            - Delete course (instructor only)
GET    /courses/:id/lessons    - Get course lessons
```

### User Routes
```
GET    /users/:id              - Get user details
PUT    /users/:id              - Update user profile
GET    /users/:id/profile      - Get user full profile
GET    /users/:id/courses      - Get user's courses
```

### Instructor Routes
```
GET    /instructors            - Get all instructors
GET    /instructors/:id        - Get instructor details
GET    /instructors/:id/courses      - Get instructor's courses
GET    /instructors/:id/earnings     - Get instructor earnings
GET    /instructors/:id/students     - Get instructor's students
```

### Enrollment Routes
```
POST   /enrollments            - Enroll in course
GET    /enrollments            - Get user's enrollments
GET    /enrollments/:courseId/students - Get course students
DELETE /enrollments/:id        - Unenroll from course
```

---

## Naming Conventions

### Files & Folders
- Use **kebab-case** for folder names: `auth-module`, `course-details`
- Use **camelCase** for JavaScript files: `apiService.js`, `courseController.js`
- Use **kebab-case** for HTML files: `course-details.html`, `instructor-dashboard.html`

### Variables & Functions
- Use **camelCase** for variables: `courseData`, `userId`
- Use **UPPER_SNAKE_CASE** for constants: `API_BASE_URL`, `MAX_UPLOAD_SIZE`
- Use **PascalCase** for classes: `CourseService`, `AuthModule`

### Database & API
- Use **plural nouns** for resources: `/courses`, `/users`, `/instructors`
- Use **snake_case** for database fields: `user_id`, `course_name`, `created_at`
- Use **camelCase** for JSON responses: `{ userId: 1, courseName: "..." }`

---

## Error Handling

### API Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": [ ]
}
```

### HTTP Status Codes
- **200**: OK - Request successful
- **201**: Created - Resource created
- **400**: Bad Request - Invalid input
- **401**: Unauthorized - Not authenticated
- **403**: Forbidden - No permission
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server error

---

## Frontend Usage Examples

### Using API Service

```javascript
// Import modules
const apiService = require('./src/js/api-service');
const auth = require('./src/js/auth');
const courses = require('./src/js/courses');

// Login
await auth.login('user@example.com', 'password');

// Get all courses
const coursesData = await courses.getAllCourses({ category: 'web-development' });

// Enroll in course
await courses.enrollCourse(courseId);

// Logout
await auth.logout();
```

### Using Config

```javascript
const { API_BASE_URL, API_ENDPOINTS } = require('./src/config');

console.log(API_BASE_URL); // http://localhost:5000/api/v1
console.log(API_ENDPOINTS.GET_COURSE(5)); // /courses/5
```

---

## Migration Checklist

To migrate your existing HTML files to this structure:

- [ ] Move all auth-related HTML files to `frontend/src/pages/auth/`
- [ ] Move course-related HTML files to `frontend/src/pages/courses/`
- [ ] Move instructor HTML files to `frontend/src/pages/instructor/`
- [ ] Move student HTML files to `frontend/src/pages/student/`
- [ ] Move blog HTML files to `frontend/src/pages/blog/`
- [ ] Move common pages to `frontend/src/pages/shared/`
- [ ] Update all `<a>` tags to use correct relative paths
- [ ] Create `frontend/src/components/` and extract reusable components
- [ ] Move JavaScript to `frontend/src/js/`
- [ ] Move CSS to `frontend/src/css/`
- [ ] Create `frontend/src/layouts/` for header, footer, sidebar templates

---

## Best Practices

✅ **Separation of Concerns** - Each file has a single responsibility
✅ **DRY (Don't Repeat Yourself)** - Reuse components and utilities
✅ **Modularity** - Independent, loosely coupled modules
✅ **Consistency** - Follow naming conventions throughout
✅ **Documentation** - Comment complex logic and document APIs
✅ **Error Handling** - Handle errors gracefully in all layers
✅ **Security** - Validate inputs, protect sensitive data
✅ **Performance** - Optimize database queries, minimize API calls
✅ **Testing** - Write tests for critical functionality
✅ **Version Control** - Use meaningful commit messages

---

## Next Steps

1. Set up environment variables (`.env`)
2. Configure database connection
3. Implement database models
4. Implement service logic
5. Add route handlers
6. Test API endpoints
7. Build frontend components
8. Integrate frontend with API
9. Add validation and error handling
10. Deploy to production

---

For questions or updates, refer to the main project documentation.
