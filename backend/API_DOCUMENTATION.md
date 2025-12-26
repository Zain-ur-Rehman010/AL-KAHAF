# API Documentation Index

Complete API endpoint documentation for Al-Kahaf LMS Backend.

## API Base URL

- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://api.alkahaf.com/api/v1`

## Authentication

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <accessToken>
```

## Health Check

**Endpoint**: `GET /health`
**Auth**: No
**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-12-20T10:30:00Z"
}
```

---

## 🔐 Authentication Module (`/auth`)

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "student"
}
```

**Response** (201):
```json
{
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student",
    "status": "active"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Validation**:
- `firstName`: Required, string
- `lastName`: Required, string
- `email`: Required, valid email, unique
- `password`: Required, min 8 chars
- `role`: Optional, enum (student|instructor|admin)

---

### Login User
**POST** `/auth/login`

Authenticate and get JWT tokens.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student",
    "lastLogin": "2024-12-20T10:30:00Z"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Errors**:
- 401: Invalid credentials

---

### Refresh Token
**POST** `/auth/refresh-token`

Get new access token using refresh token.

**Request Body**:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response** (200):
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Errors**:
- 401: Invalid or expired refresh token

---

### Get Current User
**GET** `/auth/me`

Get authenticated user profile.

**Auth**: Required ✓

**Response** (200):
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "bio": "I love learning",
  "role": "student",
  "status": "active",
  "emailVerified": true,
  "createdAt": "2024-12-20T10:00:00Z"
}
```

---

### Update Profile
**PUT** `/auth/profile`

Update user profile information.

**Auth**: Required ✓

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "bio": "Updated bio",
  "profileImage": "https://example.com/image.jpg"
}
```

**Response** (200):
```json
{
  "message": "Profile updated successfully",
  "user": { /* updated user */ }
}
```

---

### Change Password
**POST** `/auth/change-password`

Change user password.

**Auth**: Required ✓

**Request Body**:
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

**Response** (200):
```json
{
  "message": "Password changed successfully"
}
```

**Errors**:
- 401: Current password incorrect

---

## 📚 Courses Module (`/courses`)

### Create Course
**POST** `/courses`

Create new course (Instructor/Admin only).

**Auth**: Required ✓
**Role**: instructor, admin

**Request Body**:
```json
{
  "title": "Learn React",
  "description": "Complete React course from basics to advanced",
  "category": "Web Development",
  "price": 49.99,
  "level": "beginner",
  "requirements": ["Basic JavaScript", "HTML/CSS"],
  "outcomes": ["Build React apps", "Use Hooks", "State management"]
}
```

**Response** (201):
```json
{
  "message": "Course created successfully",
  "course": {
    "id": "uuid",
    "instructorId": "uuid",
    "title": "Learn React",
    "status": "draft",
    "price": 49.99,
    "level": "beginner",
    "rating": 0,
    "enrollmentCount": 0,
    "createdAt": "2024-12-20T10:30:00Z"
  }
}
```

---

### Get All Courses
**GET** `/courses`

List all published courses with pagination.

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 10)
- `category`: String (optional)
- `level`: String (optional: beginner|intermediate|advanced)
- `status`: String (optional: published)

**Response** (200):
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "Learn React",
      "description": "...",
      "category": "Web Development",
      "price": 49.99,
      "level": "beginner",
      "status": "published",
      "rating": 4.8,
      "enrollmentCount": 150,
      "instructor": {
        "id": "uuid",
        "firstName": "Jane",
        "lastName": "Smith"
      }
    }
  ],
  "pagination": {
    "total": 250,
    "page": 1,
    "limit": 10,
    "pages": 25
  }
}
```

---

### Get Course by ID
**GET** `/courses/:id`

Get detailed course information.

**Response** (200):
```json
{
  "id": "uuid",
  "title": "Learn React",
  "description": "...",
  "category": "Web Development",
  "price": 49.99,
  "level": "beginner",
  "duration": 42,
  "language": "en",
  "rating": 4.8,
  "enrollmentCount": 150,
  "requirements": [...],
  "outcomes": [...],
  "instructor": { /* instructor info */ },
  "enrollments": [...]
}
```

---

### Update Course
**PUT** `/courses/:id`

Update course details (Owner/Admin only).

**Auth**: Required ✓

**Request Body** (All optional):
```json
{
  "title": "Advanced React",
  "description": "...",
  "price": 79.99,
  "category": "Web Development"
}
```

**Response** (200):
```json
{
  "message": "Course updated successfully",
  "course": { /* updated course */ }
}
```

**Errors**:
- 403: Not course owner
- 404: Course not found

---

### Delete Course
**DELETE** `/courses/:id`

Delete a course (Owner/Admin only).

**Auth**: Required ✓

**Response** (200):
```json
{
  "message": "Course deleted successfully"
}
```

---

### Publish Course
**POST** `/courses/:id/publish`

Publish a course (make it visible to students).

**Auth**: Required ✓
**Role**: instructor, admin

**Response** (200):
```json
{
  "message": "Course published successfully",
  "course": { /* with status: "published" */ }
}
```

---

### Get Course Statistics
**GET** `/courses/:id/stats`

Get course enrollment and completion statistics.

**Auth**: Required ✓
**Role**: Owner or Admin

**Response** (200):
```json
{
  "totalEnrollments": 150,
  "completedEnrollments": 45,
  "completionRate": "30.00"
}
```

---

### Search Courses
**GET** `/courses/search`

Search courses by title or description.

**Query Parameters**:
- `query`: String (search term)
- `category`: String (optional)

**Response** (200):
```json
[
  {
    "id": "uuid",
    "title": "Learn React",
    /* ... course data ... */
  }
]
```

---

## 📝 Enrollments Module (`/enrollments`)

### Enroll in Course
**POST** `/enrollments`

Enroll student in a course.

**Auth**: Required ✓
**Role**: student, admin

**Request Body**:
```json
{
  "courseId": "uuid"
}
```

**Response** (201):
```json
{
  "message": "Enrolled successfully",
  "enrollment": {
    "id": "uuid",
    "studentId": "uuid",
    "courseId": "uuid",
    "status": "enrolled",
    "progress": 0,
    "paymentStatus": "completed",
    "enrollmentDate": "2024-12-20T10:30:00Z"
  }
}
```

**Errors**:
- 400: Already enrolled
- 404: Course not found

---

### Get My Enrollments
**GET** `/enrollments/my-enrollments`

Get all courses enrolled by current student.

**Auth**: Required ✓

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 10)
- `status`: String (optional: enrolled|in_progress|completed|dropped)

**Response** (200):
```json
{
  "enrollments": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "courseId": "uuid",
      "status": "in_progress",
      "progress": 45,
      "completionDate": null,
      "course": {
        "id": "uuid",
        "title": "Learn React"
        /* ... */
      }
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### Get Enrollment by ID
**GET** `/enrollments/:enrollmentId`

Get specific enrollment details.

**Auth**: Required ✓

**Response** (200):
```json
{
  "id": "uuid",
  "studentId": "uuid",
  "courseId": "uuid",
  "status": "in_progress",
  "progress": 45,
  "completionDate": null,
  "certificateIssued": false,
  "paymentStatus": "completed",
  "enrollmentDate": "2024-12-20T10:00:00Z",
  "student": { /* student info */ },
  "course": { /* course info */ },
  "certificate": null
}
```

---

### Update Progress
**PUT** `/enrollments/:enrollmentId/progress`

Update course progress.

**Auth**: Required ✓

**Request Body**:
```json
{
  "progress": 75
}
```

**Response** (200):
```json
{
  "message": "Progress updated",
  "enrollment": {
    "id": "uuid",
    "progress": 75,
    "status": "in_progress"
  }
}
```

**Notes**:
- Progress 0-100%
- Status auto-updates to "completed" when progress = 100

---

### Drop Course
**POST** `/enrollments/:enrollmentId/drop`

Drop/withdraw from a course.

**Auth**: Required ✓

**Response** (200):
```json
{
  "message": "Dropped course successfully"
}
```

---

### Get Course Enrollments
**GET** `/enrollments/course/:courseId/enrollments`

Get all students enrolled in a course (Instructor/Admin).

**Auth**: Required ✓
**Role**: instructor, admin

**Response** (200):
```json
[
  {
    "id": "uuid",
    "studentId": "uuid",
    "courseId": "uuid",
    "status": "in_progress",
    "progress": 45,
    "student": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
]
```

---

### Issue Certificate
**POST** `/enrollments/:enrollmentId/certificate`

Issue certificate on course completion.

**Auth**: Required ✓
**Role**: instructor, admin

**Response** (201):
```json
{
  "message": "Certificate issued",
  "certificate": {
    "id": "uuid",
    "enrollmentId": "uuid",
    "verificationCode": "abc123def456",
    "status": "issued",
    "issuedDate": "2024-12-20T10:30:00Z"
  }
}
```

**Errors**:
- 400: Course not completed

---

## 👥 Users Module (`/users`)

### Get User Profile
**GET** `/users/:userId/profile`

Get public user profile.

**Response** (200):
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "profileImage": "url",
  "bio": "I love learning",
  "role": "student",
  "status": "active",
  "createdAt": "2024-12-20T10:00:00Z"
}
```

---

### Get Instructors
**GET** `/users/instructors`

List all active instructors.

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 10)

**Response** (200):
```json
{
  "instructors": [
    {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Smith",
      "bio": "Experienced instructor",
      "instructedCourses": [
        { /* course data */ }
      ]
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### Get User Statistics
**GET** `/users/stats`

Get current user's learning statistics.

**Auth**: Required ✓

**Response** (200):
```json
{
  "totalEnrollments": 5,
  "completedEnrollments": 2,
  "instructedCourses": 0,
  "role": "student"
}
```

---

### Get My Taught Courses
**GET** `/users/taught-courses`

Get courses taught by current instructor.

**Auth**: Required ✓
**Role**: instructor, admin

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 10)

**Response** (200):
```json
{
  "courses": [
    { /* course data */ }
  ],
  "pagination": { /* ... */ }
}
```

---

### Get All Users
**GET** `/users`

List all users (Admin only).

**Auth**: Required ✓
**Role**: admin

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 10)
- `role`: String (optional: admin|instructor|student)
- `status`: String (optional: active|inactive|banned)

**Response** (200):
```json
{
  "users": [
    { /* user data */ }
  ],
  "pagination": { /* ... */ }
}
```

---

### Update User Status
**PUT** `/users/:userId/status`

Change user account status (Admin only).

**Auth**: Required ✓
**Role**: admin

**Request Body**:
```json
{
  "status": "inactive"
}
```

**Response** (200):
```json
{
  "message": "User status updated",
  "user": { /* updated user */ }
}
```

**Allowed statuses**: active, inactive, banned

---

### Delete User
**DELETE** `/users/:userId`

Delete user account (Admin only).

**Auth**: Required ✓
**Role**: admin

**Response** (200):
```json
{
  "message": "User deleted successfully"
}
```

---

## 📊 Response Status Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input/validation error |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## 🔒 Authorization Levels

### Public (No Auth Required)
- GET /courses
- GET /courses/:id
- GET /courses/search
- GET /users/:userId/profile
- GET /users/instructors
- POST /auth/register
- POST /auth/login
- POST /auth/refresh-token

### Authenticated (Any logged-in user)
- GET /auth/me
- PUT /auth/profile
- POST /auth/change-password
- GET /enrollments/my-enrollments
- POST /enrollments
- GET /users/stats

### Student Only
- POST /enrollments
- GET /enrollments/my-enrollments
- PUT /enrollments/:enrollmentId/progress

### Instructor Only
- POST /courses
- PUT /courses/:id
- DELETE /courses/:id
- POST /courses/:id/publish
- GET /courses/:id/stats
- GET /enrollments/course/:courseId/enrollments

### Admin Only
- GET /users
- PUT /users/:userId/status
- DELETE /users/:userId
- POST /enrollments/:enrollmentId/certificate (with override)

---

## 📝 Error Handling

All errors return JSON with message:

```json
{
  "message": "Error description"
}
```

In development, includes error details:
```json
{
  "message": "Error description",
  "error": { /* stack trace */ }
}
```

---

## 🔄 Pagination

List endpoints support pagination:

**Query Parameters**:
- `page`: Current page (default: 1)
- `limit`: Items per page (default: 10)

**Response**:
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "total": 250,
    "page": 1,
    "limit": 10,
    "pages": 25
  }
}
```

Navigate:
- First: `?page=1`
- Next: `?page=2`
- Last: `?page=25`

---

## 📞 Testing

### With Postman
1. Import `postman-collection.json`
2. Set `base_url` variable
3. Use `{{token}}` for auth

### With cURL
```bash
# Get courses
curl http://localhost:5000/api/v1/courses

# With auth
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/v1/auth/me
```

### With JavaScript
```javascript
const response = await fetch('http://localhost:5000/api/v1/courses');
const data = await response.json();
```

---

**Last Updated**: December 20, 2024
**API Version**: 1.0.0
**Status**: Production-Ready ✅
