# AlKahaf - Next Steps After Setup

Project setup is complete. Use this checklist to validate the system and start productive feature work.

## 1) Start the backend

From `backend/`:

```bash
npm run dev
```

Verify API base URL:

- `http://localhost:5000/api/v1`

---

## 2) Start the frontend

From `frontend/`:

```bash
npm run dev
```

Verify frontend is reachable:

- Usually `http://localhost:3000`

---

## 3) Smoke-test core flows

Validate these minimum flows before building more features:

- [ ] Register and login
- [ ] Call `GET /auth/me` with Bearer token
- [ ] List courses
- [ ] Enroll in a course
- [ ] Update enrollment progress
- [ ] Test role-based access (`student`, `instructor`, `admin`)

---

## 4) Database readiness checks

- [ ] Run/confirm all migrations are applied
- [ ] Seed admin/test users if needed
- [ ] Confirm expected tables and relationships exist

---

## 5) Security and environment checks

- [ ] Use strong values for `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Confirm `.env` is ignored by git
- [ ] Keep `CORS_ORIGIN` restricted to your frontend origin
- [ ] Verify DB credentials and other secrets are correct

---

## 6) Build one complete milestone (end-to-end)

Pick one vertical slice and complete it fully:

- [ ] Auth pages connected to backend
- [ ] Course create/publish flow
- [ ] Student enrollment dashboard flow

---

## Recommended immediate task (today)

Run one full user journey:

1. Admin creates instructor
2. Instructor creates and publishes a course
3. Student enrolls in the course
4. Student progress gets updated successfully

---

## Optional: 7-day execution roadmap

### Day 1 - Validation
- Backend + frontend startup checks
- Core smoke tests
- Fix any blockers discovered

### Day 2 - Auth hardening
- Validate token refresh/logout behavior
- Improve auth error handling
- Finalize role checks in routes

### Day 3 - Course management
- Instructor create/edit/publish course flow
- Add missing input validations

### Day 4 - Enrollment and progress
- Student enrollment flow
- Progress tracking and completion states

### Day 5 - Admin operations
- Admin user/course oversight pages
- Basic analytics or status reporting

### Day 6 - QA and stability
- End-to-end retesting
- Bug fixes and regression checks

### Day 7 - Release prep
- Update docs
- Environment sanity review
- Tag first internal milestone/release

