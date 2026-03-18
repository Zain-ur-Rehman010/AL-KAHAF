# AlKahaf API Test Plan

This document provides a practical API validation checklist for local development.

- **Base URL:** `http://localhost:5000/api/v1`
- **Content-Type:** `application/json`
- **Auth:** `Authorization: Bearer <accessToken>`

---

## 0) Pre-test setup

- [ ] Backend server is running
- [ ] Database migrations are applied
- [ ] Seed data exists (or create users manually)
- [ ] You have test accounts for:
  - [ ] `admin`
  - [ ] `instructor`
  - [ ] `student`

---

## 1) Health and connectivity

### 1.1 API reachability

**Request**

```bash
curl -i http://localhost:5000/api/v1
```

**Expected**

- 2xx/3xx/4xx response from server (not connection refused)
- API responds quickly (<2s in local dev)

---

## 2) Authentication flow

### 2.1 Register user

**Request**

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Student",
    "email": "student1@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "role": "student"
  }'
```

**Expected**

- Status `201` (or success status used by your API)
- Response includes created user data (without plaintext password)

### 2.2 Login user

**Request**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@example.com",
    "password": "SecurePass123!"
  }'
```

**Expected**

- Status `200`
- Response includes `accessToken`
- If implemented, response also includes `refreshToken`

> Save `accessToken` for protected-route tests.

### 2.3 Get current user (`/auth/me`)

**Request**

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

**Expected**

- Status `200`
- Returns authenticated user profile
- Role matches logged-in account

### 2.4 Negative auth test (invalid token)

**Request**

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer invalid_token"
```

**Expected**

- Status `401`
- Clear auth error message

---

## 3) Course endpoints

### 3.1 List courses (public or protected based on your routes)

**Request**

```bash
curl -X GET "http://localhost:5000/api/v1/courses?page=1&limit=10"
```

**Expected**

- Status `200`
- Returns array/list with pagination metadata (if implemented)

### 3.2 Create course as instructor/admin

**Request**

```bash
curl -X POST http://localhost:5000/api/v1/courses \
  -H "Authorization: Bearer <instructorOrAdminToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Fundamentals",
    "description": "Learn JS basics",
    "category": "programming",
    "price": 49.99,
    "level": "beginner"
  }'
```

**Expected**

- Status `201` (or success status used)
- Course is persisted and returned with `id`

### 3.3 Negative role test (student creates course)

**Request**

Use student token with same create endpoint.

**Expected**

- Status `403`
- Role/permission denied message

---

## 4) Enrollment and progress

### 4.1 Enroll in course (student)

**Request**

```bash
curl -X POST http://localhost:5000/api/v1/enrollments \
  -H "Authorization: Bearer <studentToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "<courseId>"
  }'
```

**Expected**

- Status `201` (or success status used)
- Enrollment record created with status `enrolled`/`in_progress`

### 4.2 Update enrollment progress

**Request**

```bash
curl -X PATCH http://localhost:5000/api/v1/enrollments/<enrollmentId>/progress \
  -H "Authorization: Bearer <studentToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 50
  }'
```

**Expected**

- Status `200`
- Updated enrollment reflects new progress value

### 4.3 Negative validation test (invalid progress)

**Request**

Set progress to invalid value (e.g. `150`).

**Expected**

- Status `400`
- Validation message explains allowed range

---

## 5) Role-based access checks

Use tokens for each role and verify route access behavior:

- [ ] Student can view own profile and enrollments
- [ ] Instructor can create/manage own courses
- [ ] Admin can access admin-only endpoints
- [ ] Unauthorized roles get `403`

---

## 6) Error handling and consistency

For invalid payloads/missing fields:

- [ ] API returns proper 4xx codes
- [ ] Response format is consistent (`success`, `message`, `data` pattern if used)
- [ ] Sensitive data (password hashes, secrets) never appears in response

---

## 7) Security sanity checks

- [ ] CORS allows only trusted origin(s)
- [ ] Rate limits applied on auth routes
- [ ] JWT expiry/refresh behavior is correct
- [ ] `.env` is ignored in git

---

## 8) End-to-end scenario (recommended)

Run this full path in sequence:

1. Admin creates instructor account
2. Instructor creates and publishes a course
3. Student registers and logs in
4. Student enrolls in that course
5. Student updates progress to completion threshold
6. Verify final enrollment status and user dashboard data

---

## 9) Exit criteria

You can consider backend validation complete when:

- [ ] All critical auth tests pass
- [ ] Core course + enrollment flows pass
- [ ] Role-based restrictions behave correctly
- [ ] No high-severity validation/security issues remain

