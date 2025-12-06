# API & API Documentation - Complete Guide

## 1. WHAT IS AN API?

### Simple Definition
**API** = Application Programming Interface

Think of it as a **contract between your frontend and backend**. It defines:
- **What data** can be requested
- **How to request it** (endpoints, methods)
- **What data** will be returned
- **What errors** might occur

### Real-World Analogy
```
Restaurant Ordering System:
├─ Menu = API Documentation (what you can order)
├─ Waiter = API (takes your order)
├─ Kitchen = Backend/Server (processes the order)
└─ Food = Response (what you get back)
```

---

## 2. HOW DOES AN API WORK?

### Client-Server Communication Flow
```
1. FRONTEND (Client)
   ↓ (Sends HTTP Request)
   → "Get me course with ID 123"
   
2. BACKEND (Server)
   ↓ (Receives & Processes)
   → Looks up database
   → Validates permission
   → Retrieves data
   
3. RESPONSE (Backend sends back)
   ↓ (Returns JSON or Error)
   → Course details in JSON format
   
4. FRONTEND (Client)
   ↓ (Receives & Displays)
   → Shows course on webpage
```

### Example Request-Response

**Frontend sends:**
```
GET /api/v1/courses/123
Headers: Authorization: Bearer token123
```

**Backend responds:**
```json
{
  "id": 123,
  "title": "JavaScript Basics",
  "instructor": "Ahmed Ali",
  "duration": "10 hours",
  "price": 29.99
}
```

---

## 3. API FUNDAMENTALS

### HTTP Methods (What action to perform)

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Retrieve data | Get course details |
| **POST** | Create new data | Register new student |
| **PUT** | Update entire resource | Update course info |
| **PATCH** | Partial update | Mark lesson as complete |
| **DELETE** | Remove data | Delete course |

### HTTP Status Codes (Server's response)

| Code | Meaning | Example |
|------|---------|---------|
| **200** | Success ✅ | Request completed successfully |
| **201** | Created ✅ | New resource created |
| **400** | Bad Request ❌ | Invalid data sent |
| **401** | Unauthorized ❌ | Not logged in |
| **403** | Forbidden ❌ | No permission |
| **404** | Not Found ❌ | Resource doesn't exist |
| **500** | Server Error ❌ | Backend crashed |

---

## 4. LMS API ENDPOINTS EXAMPLE

### User Management APIs

```
POST /api/v1/auth/register
Purpose: Register new user
Request Body:
{
  "name": "Ali Khan",
  "email": "ali@example.com",
  "password": "securepass123",
  "role": "student"
}
Response (201):
{
  "id": 1,
  "email": "ali@example.com",
  "token": "jwt_token_here"
}
```

```
POST /api/v1/auth/login
Purpose: Login user
Request Body:
{
  "email": "ali@example.com",
  "password": "securepass123"
}
Response (200):
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Ali Khan",
    "role": "student"
  }
}
```

### Course Management APIs

```
GET /api/v1/courses
Purpose: Get all courses
Response (200):
[
  {
    "id": 1,
    "title": "JavaScript Basics",
    "instructor_id": 5,
    "students_count": 150,
    "price": 29.99
  },
  {
    "id": 2,
    "title": "React Advanced",
    "instructor_id": 6,
    "students_count": 89,
    "price": 39.99
  }
]
```

```
GET /api/v1/courses/123
Purpose: Get single course details
Response (200):
{
  "id": 123,
  "title": "JavaScript Basics",
  "description": "Learn JavaScript from scratch",
  "instructor_id": 5,
  "duration": "10 hours",
  "price": 29.99,
  "lessons": [
    { "id": 1, "title": "Introduction" },
    { "id": 2, "title": "Variables & Data Types" }
  ]
}
```

```
POST /api/v1/courses
Purpose: Create new course (Instructor only)
Headers: Authorization: Bearer token_here
Request Body:
{
  "title": "Python for Beginners",
  "description": "Learn Python basics",
  "price": 19.99
}
Response (201):
{
  "id": 456,
  "title": "Python for Beginners",
  "instructor_id": 5,
  "created_at": "2024-12-06T10:30:00Z"
}
```

### Enrollment APIs

```
POST /api/v1/enrollments
Purpose: Student enrolls in course
Headers: Authorization: Bearer token_here
Request Body:
{
  "course_id": 123
}
Response (201):
{
  "id": 789,
  "user_id": 1,
  "course_id": 123,
  "enrolled_at": "2024-12-06T10:30:00Z",
  "status": "active"
}
```

```
GET /api/v1/enrollments/123/progress
Purpose: Get student progress in course
Headers: Authorization: Bearer token_here
Response (200):
{
  "course_id": 123,
  "user_id": 1,
  "completion_percentage": 45,
  "lessons_completed": 5,
  "total_lessons": 11,
  "last_accessed": "2024-12-06T09:15:00Z"
}
```

---

## 5. API DOCUMENTATION - WHAT & WHY

### What is API Documentation?

**API Documentation** = User manual for your API

It tells developers:
- ✅ What endpoints exist
- ✅ What data to send
- ✅ What data you get back
- ✅ What errors can occur
- ✅ How to authenticate
- ✅ Code examples

### Why Is It Important?

```
Without Documentation:
- Developers waste time guessing
- More bugs & misunderstandings
- Hard to maintain
- Slow onboarding

With Documentation:
- Clear expectations
- Fewer bugs
- Easy to maintain
- Quick developer onboarding
```

---

## 6. HOW TO WRITE GOOD API DOCUMENTATION

### Essential Components

#### 1. **Overview**
```
Learning Management System API v1.0

This API allows you to:
- Manage user accounts
- Create and enroll in courses
- Track learning progress
- Submit assignments
- View grades
```

#### 2. **Authentication Section**
```
Authentication: Bearer Token (JWT)

All endpoints (except /register, /login) require:
Authorization: Bearer your_token_here

How to get token:
1. POST /auth/login with email/password
2. Receive token in response
3. Include in Authorization header for subsequent requests

Token expiration: 24 hours
Refresh endpoint: POST /auth/refresh
```

#### 3. **Endpoint Documentation**

Each endpoint should have:

```
Method: GET
Endpoint: /api/v1/courses/{id}
Description: Retrieve a specific course by ID

Parameters:
- id (path, required): Course ID (integer)
- include_lessons (query, optional): Set to 'true' to include lessons

Request Headers:
- Authorization: Bearer token (optional, for enrolled students)
- Content-Type: application/json

Response (200):
{
  "id": 123,
  "title": "JavaScript Basics",
  "description": "Learn JS fundamentals",
  "instructor_id": 5,
  "duration": "10 hours",
  "price": 29.99
}

Response (404):
{
  "error": "Course not found",
  "error_code": "COURSE_NOT_FOUND"
}

Example Request:
curl -X GET "https://api.lms.com/api/v1/courses/123" \
  -H "Authorization: Bearer eyJhbGciOi..."

Example Response:
{
  "id": 123,
  "title": "JavaScript Basics",
  ...
}
```

#### 4. **Error Handling Documentation**
```
Common Errors:

400 Bad Request
- Missing required fields
- Invalid data format
Example: {"error": "Email is required", "field": "email"}

401 Unauthorized
- No token provided
- Invalid/expired token
Example: {"error": "Invalid token"}

403 Forbidden
- Insufficient permissions
- Student trying to edit course (instructor only)
Example: {"error": "Only instructors can create courses"}

404 Not Found
- Resource doesn't exist
Example: {"error": "Course with ID 999 not found"}

500 Internal Server Error
- Backend error
Example: {"error": "Database connection failed"}
```

---

## 7. API DOCUMENTATION TOOLS

### Popular Tools

| Tool | Purpose | Best For |
|------|---------|----------|
| **Swagger/OpenAPI** | Auto-generate API docs | Backend APIs |
| **Postman** | API testing & documentation | Testing & sharing |
| **Redoc** | Beautiful API documentation | Public APIs |
| **API Blueprint** | Markdown-based API docs | Simple APIs |
| **Notion/Confluence** | General documentation | Team collaboration |

### Swagger/OpenAPI Example
```yaml
openapi: 3.0.0
info:
  title: LMS API
  version: 1.0.0
  
paths:
  /api/v1/courses:
    get:
      summary: Get all courses
      tags:
        - Courses
      responses:
        '200':
          description: List of courses
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Course'
    post:
      summary: Create new course
      tags:
        - Courses
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                price:
                  type: number
      responses:
        '201':
          description: Course created
        '401':
          description: Unauthorized

components:
  schemas:
    Course:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
        price:
          type: number
```

---

## 8. API BEST PRACTICES

### Do's ✅
- ✅ Use clear, descriptive endpoint names
- ✅ Version your API (`/api/v1/`, `/api/v2/`)
- ✅ Use HTTP methods correctly (GET, POST, etc.)
- ✅ Return consistent JSON format
- ✅ Use appropriate status codes
- ✅ Document all endpoints
- ✅ Include rate limiting info
- ✅ Support pagination for large datasets

### Don'ts ❌
- ❌ Use GET for creating/deleting data
- ❌ Return inconsistent response formats
- ❌ Forget error messages
- ❌ Include passwords in responses
- ❌ Ignore authentication/authorization
- ❌ Leave API undocumented
- ❌ Mix API versions
- ❌ Return all data without pagination

---

## 9. PRACTICAL LMS API STRUCTURE

### Complete Endpoint List

```
AUTH ENDPOINTS
POST   /api/v1/auth/register         - Register new user
POST   /api/v1/auth/login            - Login user
POST   /api/v1/auth/logout           - Logout user
POST   /api/v1/auth/refresh          - Refresh token

USER ENDPOINTS
GET    /api/v1/users/me              - Get current user
GET    /api/v1/users/{id}            - Get user by ID
PUT    /api/v1/users/{id}            - Update user profile
DELETE /api/v1/users/{id}            - Delete user account

COURSE ENDPOINTS
GET    /api/v1/courses               - List all courses
GET    /api/v1/courses/{id}          - Get course details
POST   /api/v1/courses               - Create course (instructor)
PUT    /api/v1/courses/{id}          - Update course (instructor)
DELETE /api/v1/courses/{id}          - Delete course (instructor)

ENROLLMENT ENDPOINTS
POST   /api/v1/enrollments           - Enroll in course
GET    /api/v1/enrollments           - List user enrollments
GET    /api/v1/courses/{id}/students - List course students (instructor)

PROGRESS ENDPOINTS
GET    /api/v1/progress/{courseId}   - Get course progress
PATCH  /api/v1/progress/{lessonId}   - Mark lesson complete

ASSESSMENT ENDPOINTS
GET    /api/v1/quizzes/{id}          - Get quiz
POST   /api/v1/quizzes/{id}/submit   - Submit quiz answers
GET    /api/v1/assignments/{id}      - Get assignment
POST   /api/v1/assignments/{id}/submit - Submit assignment
```

---

## 10. QUICK START - CREATE YOUR FIRST API ENDPOINT

### Example: Create Course Endpoint

**Endpoint**: `POST /api/v1/courses`

**Documentation**:
```
Purpose: Create a new course (Instructors only)

Authentication: Required (JWT Bearer Token)

Request Body:
{
  "title": "React Advanced",
  "description": "Master advanced React patterns",
  "category": "Web Development",
  "price": 49.99,
  "duration_hours": 15
}

Required Fields:
- title (string)
- description (string)
- price (number)

Optional Fields:
- category (string)
- duration_hours (number)
- thumbnail_url (string)

Success Response (201 Created):
{
  "id": 456,
  "title": "React Advanced",
  "instructor_id": 5,
  "status": "draft",
  "created_at": "2024-12-06T14:30:00Z",
  "updated_at": "2024-12-06T14:30:00Z"
}

Error Responses:
401: {
  "error": "Unauthorized",
  "message": "Token is invalid or expired"
}

403: {
  "error": "Forbidden",
  "message": "Only instructors can create courses"
}

400: {
  "error": "Validation Error",
  "fields": {
    "title": "Title is required",
    "price": "Price must be a positive number"
  }
}
```

---

## 11. TESTING YOUR API

### Tools for Testing APIs
- **Postman** - GUI for testing
- **cURL** - Command line tool
- **Thunder Client** - VSCode extension
- **REST Client** - VSCode extension

### Example with cURL
```bash
# Get all courses
curl -X GET "https://api.lms.com/api/v1/courses"

# Create course (with authentication)
curl -X POST "https://api.lms.com/api/v1/courses" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Basics",
    "description": "Learn Python",
    "price": 29.99
  }'

# Get specific course
curl -X GET "https://api.lms.com/api/v1/courses/123"
```

---

## 12. REAL WORKFLOW EXAMPLE

### Student's Perspective - How APIs Work Together

```
1. Student Opens Website
   ↓
2. Frontend: GET /api/v1/courses
   Backend: Returns all courses
   ↓
3. Student Clicks "Enroll Now"
   ↓
4. Frontend: POST /api/v1/enrollments
   Body: { course_id: 123 }
   Backend: Creates enrollment record
   ↓
5. Frontend: GET /api/v1/courses/123/lessons
   Backend: Returns course lessons
   ↓
6. Student Watches Lesson 1
   ↓
7. Frontend: PATCH /api/v1/progress/lessons/1
   Body: { completed: true }
   Backend: Updates progress
   ↓
8. Frontend: GET /api/v1/progress/courses/123
   Backend: Returns 9% completion
   Display updated progress bar
```

---

## SUMMARY

| Concept | Explanation |
|---------|-------------|
| **API** | Bridge between frontend & backend |
| **Endpoint** | Specific URL that performs an action |
| **Method** | Type of action (GET, POST, PUT, DELETE) |
| **Request** | Data sent to backend |
| **Response** | Data backend sends back |
| **Status Code** | Success/error indicator (200, 404, 500) |
| **Authentication** | Verifying user identity (JWT token) |
| **Documentation** | Instructions for using API |

---

**Next Steps for Your LMS:**
1. Define all your API endpoints
2. Document each endpoint with examples
3. Implement backend with these endpoints
4. Connect frontend to call these endpoints
5. Test thoroughly

For your .NET backend, consider using **Swagger/OpenAPI** for auto-generated documentation!
