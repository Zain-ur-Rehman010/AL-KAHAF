# 🔐 Admin API Endpoints Documentation

**Base URL:** `https://alkahafonlineacademy.com/api/v1/admin`

**Authentication:** All endpoints require JWT token with `admin` role

**Last Updated:** December 28, 2025

---

## 📊 Dashboard & Statistics

### Get Dashboard Statistics
Get comprehensive statistics for admin dashboard overview.

**Endpoint:** `GET /api/v1/admin/statistics`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1234,
      "totalCourses": 156,
      "totalEnrollments": 3567,
      "totalRevenue": "45678.00",
      "userGrowth": "12.5%",
      "courseGrowth": "8.3%",
      "enrollmentGrowth": "15.7%"
    },
    "userDistribution": {
      "students": 980,
      "instructors": 234,
      "admins": 20
    },
    "courseDistribution": {
      "published": 124,
      "draft": 32,
      "total": 156
    },
    "recentActivity": {
      "newUsersThisMonth": 145,
      "newCoursesThisMonth": 12,
      "newEnrollmentsThisMonth": 456
    }
  }
}
```

---

### Get Recent Enrollments
Get the most recent enrollments for admin dashboard.

**Endpoint:** `GET /api/v1/admin/recent-enrollments`

**Query Parameters:**
- `limit` (optional, default: 10) - Number of enrollments to return

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>"
}
```

**Example Request:**
```
GET /api/v1/admin/recent-enrollments?limit=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "studentId": "uuid-student",
      "courseId": "uuid-course",
      "status": "active",
      "progress": 25,
      "createdAt": "2024-12-28T10:30:00.000Z",
      "student": {
        "id": "uuid-student",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "profileImage": "/assets/img/student.jpg"
      },
      "course": {
        "id": "uuid-course",
        "title": "Web Development Bootcamp",
        "thumbnailImage": "/assets/img/course.jpg"
      }
    }
  ]
}
```

---

## 👨‍🏫 Instructor Management

### Get All Instructors
Get paginated list of all instructors with statistics.

**Endpoint:** `GET /api/v1/admin/instructors`

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `status` (optional) - Filter by status: `active`, `inactive`, `banned`
- `isVerified` (optional) - Filter by verification: `true`, `false`
- `search` (optional) - Search by name or email

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>"
}
```

**Example Request:**
```
GET /api/v1/admin/instructors?page=1&limit=10&status=active&search=john
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "firstName": "Joyce",
      "lastName": "Pence",
      "email": "joyce.pence@example.com",
      "phone": "+1234567890",
      "profileImage": "/assets/img/instructor-09.jpg",
      "bio": "Experienced designer with 10+ years...",
      "role": "instructor",
      "status": "active",
      "emailVerified": true,
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-12-28T00:00:00.000Z",
      "instructedCourses": [
        {
          "id": "course-1",
          "title": "Web Development Bootcamp"
        }
      ],
      "stats": {
        "totalCourses": 12,
        "totalStudents": 456
      }
    }
  ],
  "pagination": {
    "total": 234,
    "page": 1,
    "limit": 10,
    "pages": 24
  }
}
```

---

### Get Instructor by ID
Get detailed information about a specific instructor.

**Endpoint:** `GET /api/v1/admin/instructors/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>"
}
```

**Example Request:**
```
GET /api/v1/admin/instructors/uuid-instructor-1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "firstName": "Joyce",
    "lastName": "Pence",
    "email": "joyce.pence@example.com",
    "phone": "+1234567890",
    "profileImage": "/assets/img/instructor-09.jpg",
    "bio": "Experienced designer...",
    "role": "instructor",
    "status": "active",
    "emailVerified": true,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "instructedCourses": [
      {
        "id": "course-1",
        "title": "Web Development Bootcamp",
        "status": "published",
        "enrollments": [
          { "id": "enrollment-1", "status": "active" },
          { "id": "enrollment-2", "status": "completed" }
        ]
      }
    ],
    "stats": {
      "totalCourses": 12,
      "publishedCourses": 10,
      "totalStudents": 456
    }
  }
}
```

---

### Update Instructor
Update instructor details.

**Endpoint:** `PUT /api/v1/admin/instructors/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "firstName": "Joyce",
  "lastName": "Pence",
  "email": "joyce.updated@example.com",
  "phone": "+1234567890",
  "profileImage": "/assets/img/new-profile.jpg",
  "bio": "Updated bio text...",
  "status": "active",
  "emailVerified": true
}
```

**Allowed Fields:**
- `firstName`
- `lastName`
- `email`
- `phone`
- `profileImage`
- `bio`
- `status`
- `emailVerified`

**Response:**
```json
{
  "success": true,
  "message": "Instructor updated successfully",
  "data": {
    "id": "uuid-1",
    "firstName": "Joyce",
    "lastName": "Pence",
    "email": "joyce.updated@example.com",
    "status": "active",
    "updatedAt": "2024-12-28T12:00:00.000Z"
  }
}
```

---

### Delete Instructor
Delete an instructor (only if they have no courses).

**Endpoint:** `DELETE /api/v1/admin/instructors/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Instructor deleted successfully"
}
```

**Error Response (has courses):**
```json
{
  "success": false,
  "message": "Cannot delete instructor with existing courses. Please reassign or delete courses first.",
  "courseCount": 5
}
```

---

## 📚 Course Management

### Get All Courses
Get paginated list of all courses with statistics.

**Endpoint:** `GET /api/v1/admin/courses`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `status` (optional) - `published`, `draft`, `archived`
- `category` (optional) - Course category
- `level` (optional) - `beginner`, `intermediate`, `advanced`
- `search` (optional) - Search by title or description
- `instructorId` (optional) - Filter by instructor

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>"
}
```

**Example Request:**
```
GET /api/v1/admin/courses?page=1&limit=10&status=published&category=programming
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "course-1",
      "title": "Complete Web Development Bootcamp",
      "description": "Learn web development from scratch...",
      "category": "programming",
      "level": "beginner",
      "price": 49.99,
      "status": "published",
      "thumbnailImage": "/assets/img/course-10.jpg",
      "instructorId": "uuid-instructor",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "instructor": {
        "id": "uuid-instructor",
        "firstName": "Joyce",
        "lastName": "Pence",
        "email": "joyce@example.com"
      },
      "enrollments": [
        { "id": "enrollment-1", "status": "active" },
        { "id": "enrollment-2", "status": "completed" }
      ],
      "enrollmentCount": 234,
      "activeEnrollments": 180,
      "completedEnrollments": 54
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "limit": 10,
    "pages": 16
  }
}
```

---

### Get Course Statistics
Get overall course statistics.

**Endpoint:** `GET /api/v1/admin/courses/statistics`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCourses": 156,
    "publishedCourses": 124,
    "draftCourses": 32,
    "archivedCourses": 0,
    "totalEnrollments": 3567,
    "totalRevenue": "45678.90"
  }
}
```

---

### Update Course Status
Publish, unpublish, or archive a course.

**Endpoint:** `PATCH /api/v1/admin/courses/:id/status`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "status": "published"
}
```

**Valid Status Values:**
- `published` - Make course visible to students
- `draft` - Hide course from public
- `archived` - Archive the course

**Response:**
```json
{
  "success": true,
  "message": "Course published successfully",
  "data": {
    "id": "course-1",
    "title": "Web Development Bootcamp",
    "status": "published",
    "updatedAt": "2024-12-28T12:00:00.000Z"
  }
}
```

---

## 🔒 Authorization

All admin endpoints require:
1. **Valid JWT Token** in Authorization header
2. **Admin Role** - User must have `role: 'admin'`

**Error Responses:**

**401 Unauthorized (No token):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**401 Unauthorized (Invalid token):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**403 Forbidden (Not admin):**
```json
{
  "success": false,
  "message": "Unauthorized. Admin access required."
}
```

---

## 📝 Testing with cURL

### Get Dashboard Statistics
```bash
curl -X GET https://alkahafonlineacademy.com/api/v1/admin/statistics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get All Instructors
```bash
curl -X GET "https://alkahafonlineacademy.com/api/v1/admin/instructors?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Update Instructor
```bash
curl -X PUT https://alkahafonlineacademy.com/api/v1/admin/instructors/INSTRUCTOR_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "status": "active"
  }'
```

### Delete Instructor
```bash
curl -X DELETE https://alkahafonlineacademy.com/api/v1/admin/instructors/INSTRUCTOR_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get All Courses
```bash
curl -X GET "https://alkahafonlineacademy.com/api/v1/admin/courses?status=published" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Update Course Status
```bash
curl -X PATCH https://alkahafonlineacademy.com/api/v1/admin/courses/COURSE_ID/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'
```

---

## 🧪 Testing with Postman

### Setup
1. Create new Collection: "Admin API"
2. Add Collection Variable:
   - `base_url`: `https://alkahafonlineacademy.com/api/v1`
   - `admin_token`: Your admin JWT token

### Authentication Tab
- **Type:** Bearer Token
- **Token:** `{{admin_token}}`

### Sample Requests

**Dashboard Statistics:**
- **Method:** GET
- **URL:** `{{base_url}}/admin/statistics`

**Get Instructors:**
- **Method:** GET
- **URL:** `{{base_url}}/admin/instructors`
- **Params:** `page=1`, `limit=10`, `status=active`

**Update Instructor:**
- **Method:** PUT
- **URL:** `{{base_url}}/admin/instructors/:id`
- **Body (JSON):**
  ```json
  {
    "firstName": "Test",
    "status": "active"
  }
  ```

---

## 🚀 Deployment Notes

### Production URL
```
Base: https://alkahafonlineacademy.com/api/v1/admin
```

### CORS Configuration
Admin endpoints are accessible from:
- Frontend admin panel: `https://alkahafonlineacademy.com`
- Local development: `http://localhost:3000`

### Rate Limiting
- Rate limit: 100 requests per 15 minutes per IP
- Admin endpoints may have higher limits

---

## 📊 Complete Endpoint List

### Dashboard
- `GET /admin/statistics` - Dashboard stats
- `GET /admin/recent-enrollments` - Recent enrollments

### Instructors
- `GET /admin/instructors` - List all instructors
- `GET /admin/instructors/:id` - Get instructor details
- `PUT /admin/instructors/:id` - Update instructor
- `DELETE /admin/instructors/:id` - Delete instructor

### Courses
- `GET /admin/courses` - List all courses
- `GET /admin/courses/statistics` - Course statistics
- `PATCH /admin/courses/:id/status` - Update course status

---

**Total Admin Endpoints:** 9

**Status:** ✅ Production Ready

**Next Steps:**
1. Test all endpoints with Postman
2. Connect frontend admin dashboard
3. Monitor API usage
4. Add more endpoints as needed

---

## 💡 Tips

1. **Always include Authorization header** - All endpoints require admin token
2. **Use pagination** - For large datasets, use page and limit parameters
3. **Filter data** - Use query parameters to filter results
4. **Check response status** - `success: true/false` indicates operation result
5. **Handle errors** - Check for 401, 403, 404, 500 status codes

---

**Last Updated:** December 28, 2025
**API Version:** 1.0
**Documentation:** Complete ✅