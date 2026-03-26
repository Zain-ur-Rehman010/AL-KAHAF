# AlKahaf LMS — Claude Code Project Guide

This file gives Claude Code full context about the project so every conversation starts informed.

---

## Project Overview

**AlKahaf Online Academy** — a Learning Management System (LMS) with three user roles: `student`, `instructor`, `admin`.

- **Live site:** https://alkahafonlineacademy.com
- **Currency:** PKR (Pakistani Rupee) — never use USD/$ anywhere
- **Repo structure:** Monorepo with `frontend/` and `backend/` as separate apps

---

## Tech Stack

### Backend (`/backend/`)
| Layer | Technology |
|---|---|
| Framework | Express.js 4.18 |
| Database | MySQL via Sequelize 6 ORM |
| Auth | JWT (24h access token + 7d refresh token) |
| Password | bcryptjs |
| Email | Nodemailer 6.9 (SMTP) |
| Payments | Stripe + JazzCash |
| File Storage | Cloudinary CDN (not local uploads) |
| Cache | Redis |
| Validation | Joi |
| Port | 5000 |

**API base:** `http://localhost:5000/api/v1`

### Frontend (`/frontend/`)
| Layer | Technology |
|---|---|
| Type | Vanilla JS + HTML (no framework) |
| Styling | Sass → CSS |
| API calls | Centralized `ApiService` class in `src/js/api-service.js` |
| Auth storage | `localStorage` (Bearer token in Authorization header) |
| Config | `src/config.js` sets API base URL |
| Port | 3001 |

---

## Folder Structure

```
AlKahaf/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, SMTP, app config
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # auth, role, error, upload
│   │   ├── models/          # Sequelize models (16 total)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # emailService, notificationService, authService
│   │   └── settings.json    # Site settings (SMTP toggles, etc.)
│   ├── .env                 # Dev environment variables
│   ├── .env.example         # Template for all env vars
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/       # 15 admin pages
│   │   │   ├── student/     # 21 student pages
│   │   │   ├── instructor/  # 26 instructor pages
│   │   │   ├── auth/        # login, register, forgot-password
│   │   │   ├── courses/     # public course listing
│   │   │   ├── blog/        # blog pages
│   │   │   └── shared/      # contact-us, about, etc.
│   │   ├── js/
│   │   │   ├── api-service.js   # Central API class
│   │   │   ├── auth.js          # Auth logic
│   │   │   └── courses.js       # Course logic
│   │   ├── config.js        # API base URL config
│   │   └── assets/          # CSS, SCSS, images, plugins
│   └── package.json
├── CLAUDE.md                # This file
└── seed-admin.js            # Admin user seeding script
```

---

## Key Architecture Decisions

### Auth Flow
- JWT issued on login with `userId` + `role`
- Stored in `localStorage` on frontend
- All protected requests send `Authorization: Bearer <token>`
- `authMiddleware` decodes token and sets `req.user`
- Users with `status !== 'active'` are blocked at middleware level

### Roles
- `student` — enroll, learn, earn certificates
- `instructor` — create courses (need admin approval), manage students
- `admin` — full control, approve courses, manage users, configure site

### Notifications
- **In-app only** (database-stored, shown in notification inbox)
- `notifyAdmins()` — alerts all admins when students register, enroll, etc.
- `notifyUser()` — alerts specific user
- Failures are non-blocking (won't crash requests)

### Course Workflow
- Instructor creates course → status: `draft`
- Submitted for review → status: `pending_approval`
- Admin approves → status: `published`
- Admin can archive → status: `archived`

### Payments
- **Stripe** (card payments)
- **JazzCash** (local Pakistani payment)
- Currency always **PKR**
- Payment model stores history, admin can view revenue

### File Uploads
- All images/files go to **Cloudinary** (not local disk)
- Upload via `POST /api/v1/upload`
- Max size: 52MB

---

## Database Models (Sequelize)

`User`, `Course`, `Enrollment`, `Payment`, `Assignment`, `Blog`, `Certificate`, `Lesson`, `Message`, `Module`, `Notification`, `Quiz`, `FreeTrialRequest`, `InstructorCourse`, `InstructorStudent`, `PredefinedCourse`

---

## Environment Variables (Key ones)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD

# JWT
JWT_SECRET / JWT_REFRESH_SECRET
JWT_EXPIRATION=24h / JWT_REFRESH_EXPIRATION=7d

# Email (SMTP)
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD / SMTP_FROM

# Payments
STRIPE_SECRET_KEY / STRIPE_PUBLISHABLE_KEY

# Cloudinary
CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET

# Redis
REDIS_HOST / REDIS_PORT
```

---

## Known Incomplete Features (as of March 2026)

These are features that need to be built or wired up:

| Feature | Status | Notes |
|---|---|---|
| Password Reset | Not implemented | Frontend page exists, backend is TODO in `authService.js` |
| Welcome Email | Wired halfway | `sendWelcomeEmail()` exists in emailService but never called in `authController.js` |
| Enrollment Confirmation Email | Wired halfway | `sendEnrollmentConfirmation()` exists but never called in `enrollmentController.js` |
| Certificate Email | Wired halfway | `sendCertificateEmail()` exists but never called in `enrollmentController.js` |
| Contact Us Form | Not implemented | Frontend form exists, no backend route |
| Email Verification | Not implemented | Toggle in settings.json, no code |
| Free Trial Email | Partial | Only in-app notification, no email to admin or requester |

---

## Workflow: Claude Code + Cursor Split

The team uses **Claude Code for frontend** and **Cursor for backend** work.

- When starting a Claude Code session after backend work in Cursor: briefly describe what changed in the backend (new routes, changed response shapes, new fields)
- Claude Code handles: HTML pages, JS in `api-service.js`, frontend logic, Sass/CSS
- Cursor handles: controllers, models, routes, services, migrations

When a feature spans both layers (e.g., email, password reset), it's best to do it in a single tool session rather than splitting across both tools.

---

## Running the Project

```bash
# Backend
cd backend && npm run dev     # starts on port 5000

# Frontend
cd frontend && npm run dev    # starts on port 3001
```

---

## Important Rules for Claude

- **Always use PKR**, never USD or $ anywhere in code or UI
- **Never use local file storage** for uploads — always Cloudinary
- **Don't mock the database** — the project uses real MySQL connections
- When adding new API calls in frontend, always use the `ApiService` class in `src/js/api-service.js`
- When adding new routes in backend, register them in `src/app.js` or the main router file
- The `settings.json` in backend is used for site-wide toggles — don't hardcode settings that belong there
- Keep notifications non-blocking — wrap `notifyAdmins()` calls in try/catch that doesn't throw
