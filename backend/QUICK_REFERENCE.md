# API Quick Reference

Quick lookup for all API endpoints, request/response formats, and common patterns.

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.alkahaf.com/api/v1
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

## Response Format

Success (2xx):
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

Error (4xx, 5xx):
```json
{
  "message": "Error description"
}
```

## Endpoints by Module

### Auth Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login user, get tokens |
| POST | `/auth/refresh-token` | ❌ | Get new access token |
| POST | `/auth/logout` | ✅ | Logout (blacklist token) |
| GET | `/auth/me` | ✅ | Get current user |
| PUT | `/auth/profile` | ✅ | Update profile |
| POST | `/auth/change-password` | ✅ | Change password |

### Course Endpoints

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| POST | `/courses` | ✅ | instructor, admin | Create course |
| GET | `/courses` | ❌ | - | List courses |
| GET | `/courses/:id` | ❌ | - | Get course details |
| PUT | `/courses/:id` | ✅ | owner, admin | Update course |
| DELETE | `/courses/:id` | ✅ | owner, admin | Delete course |
| POST | `/courses/:id/publish` | ✅ | owner, admin | Publish course |
| GET | `/courses/:id/stats` | ✅ | owner, admin | Course statistics |
| GET | `/courses/search` | ❌ | - | Search courses |

### Enrollment Endpoints

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| POST | `/enrollments` | ✅ | student | Enroll in course |
| GET | `/enrollments/my-enrollments` | ✅ | student | My courses |
| GET | `/enrollments/:enrollmentId` | ✅ | student, instructor, admin | Enrollment details |
| PUT | `/enrollments/:enrollmentId/progress` | ✅ | student, admin | Update progress |
| POST | `/enrollments/:enrollmentId/drop` | ✅ | student, admin | Drop course |
| GET | `/enrollments/course/:courseId/enrollments` | ✅ | instructor, admin | List enrollments |
| POST | `/enrollments/:enrollmentId/certificate` | ✅ | instructor, admin | Issue certificate |

### User Endpoints

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| GET | `/users/:userId/profile` | ❌ | - | Get user profile |
| GET | `/users/instructors` | ❌ | - | List instructors |
| GET | `/users/stats` | ✅ | student, instructor | User statistics |
| GET | `/users/taught-courses` | ✅ | instructor | My courses |
| GET | `/users` | ✅ | admin | List all users |
| PUT | `/users/:userId/status` | ✅ | admin | Change user status |
| DELETE | `/users/:userId` | ✅ | admin | Delete user |

## Common Request Examples

### Register User
```javascript
POST /auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "student"  // or "instructor"
}

Response (201):
{
  "message": "Registration successful",
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Login
```javascript
POST /auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "message": "Login successful",
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Create Course (Instructor)
```javascript
POST /courses
Authorization: Bearer <token>
{
  "title": "Learn React",
  "description": "Complete React course",
  "category": "Web Development",
  "price": 49.99,
  "level": "beginner",
  "requirements": ["Basic JavaScript"],
  "outcomes": ["Build React apps", "Use Hooks"]
}

Response (201):
{
  "message": "Course created successfully",
  "course": {
    "id": "...",
    "title": "Learn React",
    "status": "draft",
    ...
  }
}
```

### Get Courses (with pagination)
```javascript
GET /courses?page=1&limit=10&category=Web%20Development&level=beginner

Response (200):
{
  "courses": [ ... ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15
  }
}
```

### Enroll in Course
```javascript
POST /enrollments
Authorization: Bearer <token>
{
  "courseId": "..."
}

Response (201):
{
  "message": "Enrolled successfully",
  "enrollment": {
    "id": "...",
    "status": "enrolled",
    "progress": 0,
    ...
  }
}
```

### Update Progress
```javascript
PUT /enrollments/:enrollmentId/progress
Authorization: Bearer <token>
{
  "progress": 50
}

Response (200):
{
  "message": "Progress updated",
  "enrollment": {
    "id": "...",
    "progress": 50,
    "status": "in_progress"
  }
}
```

### Issue Certificate
```javascript
POST /enrollments/:enrollmentId/certificate
Authorization: Bearer <token>

Response (201):
{
  "message": "Certificate issued",
  "certificate": {
    "id": "...",
    "verificationCode": "...",
    "status": "issued"
  }
}
```

## Status Codes

| Code | Meaning | When to Use |
|------|---------|------------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Valid token, insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Already enrolled, duplicate email |
| 500 | Server Error | Internal server error |

## Pagination

List endpoints support pagination:
```javascript
GET /courses?page=1&limit=10

Response:
{
  "courses": [ ... ],
  "pagination": {
    "total": 100,      // Total items
    "page": 1,         // Current page
    "limit": 10,       // Items per page
    "pages": 10        // Total pages
  }
}
```

Navigate:
- First page: `?page=1`
- Next page: `?page=2`
- Last page: `?page=10`

## Filtering

Courses endpoint:
```javascript
// By category
GET /courses?category=Web%20Development

// By level
GET /courses?level=beginner

// By status
GET /courses?status=published

// Combined
GET /courses?category=Web%20Development&level=intermediate&page=1&limit=20
```

## Error Handling

Common errors and solutions:

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```
Solution: Add `Authorization: Bearer <token>` header

### 401 Token Expired
```json
{
  "message": "Token expired"
}
```
Solution: Use refresh token to get new access token:
```javascript
POST /auth/refresh-token
{
  "refreshToken": "your-refresh-token"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```
Solution: Only instructors/admins can create courses

### 409 Conflict
```json
{
  "message": "Already enrolled in this course"
}
```
Solution: Check enrollment before enrolling again

### 404 Not Found
```json
{
  "message": "Course not found"
}
```
Solution: Verify course ID exists

## Performance Tips

1. **Use pagination** for list endpoints
2. **Filter** instead of getting all data
3. **Cache** responses locally when possible
4. **Batch** multiple requests if possible
5. **Compress** request/response (gzip)

## Rate Limiting

Default limits:
- 100 requests per 15 minutes per IP
- Returns `429 Too Many Requests` when exceeded

To check limits:
```javascript
// Response headers include:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## File Upload

Coming soon - multipart/form-data support for:
- Course thumbnails
- Assignment submissions
- User profile images

## Webhooks (Premium)

Receive notifications for:
- `enrollment.created`
- `enrollment.completed`
- `payment.completed`
- `course.published`
- `certificate.issued`

## Testing

### With cURL
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@test.com","password":"Test123"}'

# Login and save token
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test123"}' | jq -r '.accessToken')

# Get authenticated endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/v1/auth/me
```

### With Postman
1. Import provided `postman-collection.json`
2. Set `base_url` variable: `http://localhost:5000/api/v1`
3. Set `token` variable after login
4. Use `{{token}}` in Authorization headers

### With JavaScript/Fetch
```javascript
// Register
const response = await fetch('http://localhost:5000/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    password: 'Test123'
  })
});

const { accessToken } = await response.json();

// Use token
const userResponse = await fetch('http://localhost:5000/api/v1/auth/me', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

---

**For complete documentation, see [README.md](README.md)**
