# AlKahaf Postman Collection Guide

Use this guide to organize Postman so it matches `docs/cursor-doc/testing/TEST_PLAN.md` and is easy to run repeatedly.

---

## 1) Create a Postman Environment

Create an environment named `AlKahaf Local` with these variables:

- `baseUrl` = `http://localhost:5000/api/v1`
- `studentEmail` = `student1@example.com`
- `studentPassword` = `SecurePass123!`
- `instructorEmail` = `instructor1@example.com`
- `instructorPassword` = `SecurePass123!`
- `adminEmail` = `admin@example.com`
- `adminPassword` = `SecurePass123!`
- `studentAccessToken` = *(empty initially)*
- `instructorAccessToken` = *(empty initially)*
- `adminAccessToken` = *(empty initially)*
- `courseId` = *(empty initially)*
- `enrollmentId` = *(empty initially)*

---

## 2) Suggested Collection Structure

Create one collection: `AlKahaf API (Local)`  
Create these folders and requests:

### Folder: `00 - Health`
- `API Reachability`
  - `GET {{baseUrl}}`

### Folder: `01 - Auth`
- `Register Student`
  - `POST {{baseUrl}}/auth/register`
- `Login Student`
  - `POST {{baseUrl}}/auth/login`
- `Login Instructor`
  - `POST {{baseUrl}}/auth/login`
- `Login Admin`
  - `POST {{baseUrl}}/auth/login`
- `Get Me (Student)`
  - `GET {{baseUrl}}/auth/me`
- `Get Me Invalid Token`
  - `GET {{baseUrl}}/auth/me`

### Folder: `02 - Courses`
- `List Courses`
  - `GET {{baseUrl}}/courses?page=1&limit=10`
- `Create Course (Instructor/Admin)`
  - `POST {{baseUrl}}/courses`
- `Create Course (Student Forbidden)`
  - `POST {{baseUrl}}/courses`

### Folder: `03 - Enrollments`
- `Enroll Student`
  - `POST {{baseUrl}}/enrollments`
- `Update Enrollment Progress`
  - `PATCH {{baseUrl}}/enrollments/{{enrollmentId}}/progress`
- `Invalid Progress (Should Fail)`
  - `PATCH {{baseUrl}}/enrollments/{{enrollmentId}}/progress`

### Folder: `04 - Role Access`
- `Student Access Check`
- `Instructor Access Check`
- `Admin Access Check`

---

## 3) Request Details (Quick Templates)

## `Register Student`

**Method:** `POST`  
**URL:** `{{baseUrl}}/auth/register`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**

```json
{
  "firstName": "Test",
  "lastName": "Student",
  "email": "{{studentEmail}}",
  "password": "{{studentPassword}}",
  "confirmPassword": "{{studentPassword}}",
  "role": "student"
}
```

## `Login Student`

**Method:** `POST`  
**URL:** `{{baseUrl}}/auth/login`

**Body:**

```json
{
  "email": "{{studentEmail}}",
  "password": "{{studentPassword}}"
}
```

**Tests tab script:**

```javascript
const json = pm.response.json();
if (json && json.data && json.data.accessToken) {
  pm.environment.set("studentAccessToken", json.data.accessToken);
} else if (json && json.accessToken) {
  pm.environment.set("studentAccessToken", json.accessToken);
}
pm.test("Login succeeded", function () {
  pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});
```

## `Get Me (Student)`

**Method:** `GET`  
**URL:** `{{baseUrl}}/auth/me`  
**Headers:** `Authorization: Bearer {{studentAccessToken}}`

---

## `Create Course (Instructor/Admin)`

**Method:** `POST`  
**URL:** `{{baseUrl}}/courses`  
**Headers:**  
- `Content-Type: application/json`  
- `Authorization: Bearer {{instructorAccessToken}}`

**Body:**

```json
{
  "title": "JavaScript Fundamentals",
  "description": "Learn JS basics",
  "category": "programming",
  "price": 49.99,
  "level": "beginner"
}
```

**Tests tab script (capture `courseId`):**

```javascript
const json = pm.response.json();
const id = json?.data?.id || json?.data?.course?.id || json?.id;
if (id) pm.environment.set("courseId", id);
pm.test("Course created", function () {
  pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});
```

---

## `Enroll Student`

**Method:** `POST`  
**URL:** `{{baseUrl}}/enrollments`  
**Headers:**  
- `Content-Type: application/json`  
- `Authorization: Bearer {{studentAccessToken}}`

**Body:**

```json
{
  "courseId": "{{courseId}}"
}
```

**Tests tab script (capture `enrollmentId`):**

```javascript
const json = pm.response.json();
const id = json?.data?.id || json?.data?.enrollment?.id || json?.id;
if (id) pm.environment.set("enrollmentId", id);
pm.test("Enrollment created", function () {
  pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});
```

---

## `Update Enrollment Progress`

**Method:** `PATCH`  
**URL:** `{{baseUrl}}/enrollments/{{enrollmentId}}/progress`  
**Headers:**  
- `Content-Type: application/json`  
- `Authorization: Bearer {{studentAccessToken}}`

**Body:**

```json
{
  "progress": 50
}
```

---

## 4) Collection Runner Order

Recommended run order:

1. `API Reachability`
2. `Register Student` (optional after first run)
3. `Login Student`
4. `Login Instructor`
5. `Login Admin`
6. `Get Me (Student)`
7. `List Courses`
8. `Create Course (Instructor/Admin)`
9. `Enroll Student`
10. `Update Enrollment Progress`
11. Negative tests (`Get Me Invalid Token`, forbidden create, invalid progress)

---

## 5) Expected Status Codes

Use these as a quick validation baseline:

- Success: `200` / `201`
- Validation error: `400`
- Unauthorized token/missing token: `401`
- Forbidden role: `403`
- Not found (invalid resource id): `404`

---

## 6) Practical Notes

- If your response structure differs, adjust test scripts to match your API payload keys.
- If login returns tokens in cookies instead of JSON, use Postman cookie handling.
- Keep one environment per target (`Local`, `Staging`, `Production`) and only change `baseUrl` + credentials.
- Never export/share environments with real secrets.

