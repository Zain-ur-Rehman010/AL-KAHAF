# Al-Kahaf LMS — Interview Preparation Guide

> **Update this file** after meaningful feature completions, not after every small fix.
> Last updated: March 2026

---

## 1. Project Overview

**What is this project?**
Al-Kahaf Online Academy is a full-stack Learning Management System (LMS) for an Islamic education platform. It allows admins to manage courses, instructors, students, blogs, and enrollments. Students can browse and enroll in courses. Instructors can create and manage their own courses.

**Scale:**
- 38+ REST API endpoints
- 11 database models with associations
- 109 frontend HTML pages
- Runs locally for development, with optional cPanel deployment

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Backend | Node.js + Express.js | Lightweight, async-friendly, large ecosystem |
| ORM | Sequelize | SQL abstraction, migrations, associations |
| Database | MySQL | Relational data suits LMS relationships |
| Auth | JWT (access + refresh tokens) | Stateless, scalable, no session storage needed |
| File Storage | Cloudinary CDN | Avoids relying on local server disk for uploads |
| Frontend | HTML/CSS/JS + Bootstrap 5 | Static site, no bundler complexity |
| SCSS | Sass | Maintainable CSS with variables and nesting |
| Frontend Server | Express.js (clean URL routing) | Maps `/admin/course-add` → `src/pages/admin/course-add.html` |

---

## 3. Architecture Decisions

### Why Cloudinary instead of local disk storage?
Cloudinary provides CDN delivery, persistent storage, and automatic image optimization. Images are uploaded using `multer.memoryStorage()` (no disk write) then piped to Cloudinary via `streamifier` + `cloudinary.uploader.upload_stream`.

### Why JWT with refresh tokens?
- `accessToken` (short-lived, ~15min) is sent with every API request
- `refreshToken` (long-lived) is used only to issue new access tokens
- Reduces risk: if an access token is stolen, it expires quickly
- Tokens stored in `localStorage` on the frontend

### Why `sequelize.sync({ alter: true })` in development?
Auto-applies schema changes (new columns/tables) on every deploy without manual migration commands. Suitable for active development. In production, proper migrations (`sequelize-cli`) would replace this.

### Why a unified `/api/v1/upload?folder=` endpoint?
Single endpoint handles all image types (courses, instructors, blogs) via a query param. Avoids duplicating multer + Cloudinary logic across multiple controllers.

---

## 4. Database Design

### Core Models & Key Relationships
```
User (admin | instructor | student)
  ├── instructorCourses  →  Course (hasMany, as 'instructor')
  └── enrollments        →  Enrollment (hasMany)

Course
  ├── instructor  →  User (belongsTo)
  ├── modules     →  Module (hasMany)
  └── enrollments →  Enrollment (hasMany)

Module
  └── lessons  →  Lesson (hasMany)

Enrollment
  ├── student  →  User (belongsTo)
  └── course   →  Course (belongsTo)
```

### Why UUIDs as primary keys?
- No sequential ID leakage (users can't guess IDs)
- Safe to generate on client side if needed
- Works across distributed systems

### Key fields added during development
`Course` model had 4 fields added mid-project:
- `isFeatured` (BOOLEAN) — highlight courses on homepage
- `certificateAvailable` (BOOLEAN) — controls "Includes certificate" in course details
- `detailedDescription` (TEXT) — long-form course description
- `discountPrice` (DECIMAL) — sale price alongside full price

---

## 5. Authentication & Authorization

### Flow
1. `POST /api/v1/auth/login` → returns `{ accessToken, refreshToken, user }`
2. All protected routes use `authMiddleware` → verifies JWT, attaches `req.user`
3. `roleMiddleware(['admin'])` — checks `req.user.role` against allowed roles
4. Token refresh: `POST /api/v1/auth/refresh` using `refreshToken`

### Role-Based Access Control (RBAC)
Three roles: `admin`, `instructor`, `student`
- Admins: full access to all resources
- Instructors: manage only their own courses
- Students: enroll, view progress, access enrolled content

### Example middleware chain
```js
router.put('/courses/:id', authMiddleware, roleMiddleware(['instructor', 'admin']), courseController.update);
```

---

## 6. File Upload Pipeline

```
Browser selects file
  → FormData POST to /api/v1/upload?folder=courses
  → multer.memoryStorage() buffers file in RAM (no disk write)
  → streamifier.createReadStream(buffer)
  → cloudinary.uploader.upload_stream({ folder: 'alkahaf/courses' })
  → Returns { success: true, url: "https://res.cloudinary.com/..." }
  → Frontend stores URL, sends it in course/instructor create/update payload
  → URL saved to DB as plain string
```

**Why `streamifier`?**
Cloudinary's `upload_stream` requires a Node.js readable stream. `multer.memoryStorage()` gives a Buffer. `streamifier.createReadStream(buffer)` converts the Buffer to a stream without touching the disk.

---

## 7. API Design

### Versioning
All routes are mounted at `/api/v1/` and also `/v1/` for flexibility.

### Response format (consistent across all endpoints)
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Key endpoints
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/v1/auth/login` | Login, get tokens |
| GET | `/api/v1/courses` | Public course listing (paginated, filterable) |
| POST | `/api/v1/courses` | Create course (instructor/admin) |
| PUT | `/api/v1/courses/:id` | Update course |
| GET | `/api/v1/admin/courses` | Admin: all courses with stats |
| PATCH | `/api/v1/admin/courses/:id/status` | Approve/reject/archive course |
| POST | `/api/v1/upload?folder=` | Unified image upload → Cloudinary |
| GET | `/api/v1/courses/:id/modules` | Get course modules + lessons |

---

## 8. Frontend Architecture

### Clean URL Routing
The frontend runs its own Express server (`frontend/server.js`). It maps:
- `/admin/course-add` → `src/pages/admin/course-add.html`
- `/courses/course-details` → `src/pages/courses/course-details.html`

This avoids `.html` extensions in URLs and works like a traditional MPA router.

### No Framework — Why?
Project scope was a static multi-page site with form interactions. Using vanilla JS + Bootstrap avoids build tooling complexity (no webpack, no npm build step for frontend). Pages are independent — changing one page doesn't risk breaking others.

### API Communication Pattern
Each page has inline JS that:
1. Checks `localStorage` for `accessToken` + `user` object on load
2. Redirects to `/auth/login` if not authenticated or wrong role
3. Fetches data from backend API using `fetch()` + `API_CONFIG.BASE_URL`
4. Populates DOM elements by `id`

### Flash-of-Dummy-Data Problem (Fixed)
HTML elements that get populated by JS must NOT have hardcoded placeholder values. If they do, users see fake data for ~500ms before the API responds. Fix: use `—` or empty string as the initial HTML value.

---

## 9. Security Measures

| Measure | Implementation |
|---|---|
| Password hashing | `bcrypt` with 10 salt rounds |
| SQL injection prevention | Sequelize parameterized queries |
| XSS headers | `helmet` middleware |
| CORS | Whitelist of allowed origins |
| Rate limiting | `express-rate-limit` on all routes |
| Auth on sensitive routes | `authMiddleware` + `roleMiddleware` |
| No secrets in code | All credentials in `.env` |

---

## 10. Deployment

### Backend (Local Development)
- Runs on `http://localhost:5000`
- Environment variables are loaded from backend `.env`
- `sequelize.sync({ alter: true })` can auto-apply schema changes during active development
- Uploads are streamed to Cloudinary CDN

### Frontend
- Served via Express.js on port 3001 (local dev)
- Can be hosted on Websouls cPanel as a Node.js app or static export
- `API_CONFIG.BASE_URL` in `assets/js/api-config.js` points to local backend URL during localhost runs

---

## 11. Common Interview Questions

**Q: How do you handle image uploads on a server with no persistent disk?**
A: Use `multer.memoryStorage()` to buffer the file in RAM, then stream it directly to Cloudinary using `streamifier` + `upload_stream`. The server never writes to disk — the Cloudinary URL is what gets saved to the database.

**Q: How does your authentication work?**
A: JWT-based with two tokens. The access token (short-lived) is sent as a Bearer header on every protected request. The refresh token (long-lived) is used only to get a new access token when the current one expires. Both are stored in `localStorage`.

**Q: How do you prevent unauthorized access between roles?**
A: Two middleware layers — `authMiddleware` verifies the JWT and attaches `req.user`, then `roleMiddleware(['admin'])` checks `req.user.role` against the allowed roles array. If either fails, a 401 or 403 is returned before the controller runs.

**Q: Why did you choose MySQL over MongoDB for an LMS?**
A: LMS data is highly relational — courses have modules, modules have lessons, users enroll in courses, enrollments have progress. SQL enforces referential integrity and JOIN queries are natural. MongoDB would require manual relationship management.

**Q: How does the course approval workflow work?**
A: When an instructor creates a course, its status is set to `pending_approval`. Admin sees it in the courses list with an "Approve" button. Clicking approve fires `PATCH /api/v1/admin/courses/:id/status` with `{ status: 'published' }`. The course then appears publicly.

**Q: What is the biggest technical challenge you solved?**
A: The Cloudinary integration. The initial implementation stored instructor photos as base64 strings directly in the database, which bloated the DB and slowed down every query that fetched user data. Course thumbnails weren't being saved at all — the frontend showed a preview but never uploaded the file. Migrating to Cloudinary required changing the upload pipeline from disk storage to in-memory streaming, building a unified upload endpoint, and updating the frontend upload flow on 4 different pages.
