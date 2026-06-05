'use strict';

/**
 * AlKahaf LMS — OpenAPI 3.0 Specification
 * Served at  GET /api-docs
 */

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'AlKahaf LMS API',
    version: '1.0.0',
    description:
      'REST API for AlKahaf Online Academy — an LMS with student, instructor, and admin roles.\n\n' +
      '**Base URL:** `http://localhost:5000/api/v1`\n\n' +
      '**Auth:** Click **Authorize** and paste your JWT access token (from `/auth/login`) in the `Bearer <token>` field.',
    contact: { name: 'AlKahaf Dev', email: 'dev@alkahafonlineacademy.com' },
  },
  servers: [
    { url: 'http://localhost:5000/api/v1', description: 'Local development' },
    { url: 'https://alkahafonlineacademy.com/api/v1', description: 'Production' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token obtained from POST /auth/login',
      },
    },
    schemas: {
      // ── Generic ─────────────────────────────────────────────────────────────
      SuccessMessage: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation successful' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error description' },
        },
      },
      // ── Auth ─────────────────────────────────────────────────────────────────
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password', 'role'],
        properties: {
          name:     { type: 'string', example: 'Ahmad Khan' },
          email:    { type: 'string', format: 'email', example: 'ahmad@example.com' },
          password: { type: 'string', format: 'password', example: 'Secret@123' },
          role:     { type: 'string', enum: ['student', 'instructor'], example: 'student' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email:    { type: 'string', format: 'email', example: 'admin@alkahaf.com' },
          password: { type: 'string', format: 'password', example: 'Secret@123' },
        },
      },
      TokenResponse: {
        type: 'object',
        properties: {
          success:      { type: 'boolean', example: true },
          accessToken:  { type: 'string' },
          refreshToken: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id:    { type: 'integer', example: 1 },
              name:  { type: 'string', example: 'Ahmad Khan' },
              email: { type: 'string', example: 'ahmad@example.com' },
              role:  { type: 'string', example: 'student' },
            },
          },
        },
      },
      OtpRequest: {
        type: 'object',
        required: ['email', 'otp'],
        properties: {
          email: { type: 'string', format: 'email' },
          otp:   { type: 'string', example: '123456' },
        },
      },
      // ── User ─────────────────────────────────────────────────────────────────
      UserProfile: {
        type: 'object',
        properties: {
          id:        { type: 'integer' },
          name:      { type: 'string' },
          email:     { type: 'string' },
          role:      { type: 'string', enum: ['student', 'instructor', 'admin'] },
          status:    { type: 'string', enum: ['active', 'inactive', 'suspended'] },
          avatarUrl: { type: 'string', nullable: true },
          bio:       { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      // ── Course ───────────────────────────────────────────────────────────────
      Course: {
        type: 'object',
        properties: {
          id:          { type: 'integer' },
          title:       { type: 'string', example: 'Quranic Arabic — Beginner' },
          description: { type: 'string' },
          category:    { type: 'string', example: 'Arabic' },
          price:       { type: 'number', example: 2500, description: 'Amount in PKR' },
          status:      { type: 'string', enum: ['draft', 'pending_approval', 'published', 'archived'] },
          imageUrl:    { type: 'string', nullable: true },
          instructorId:{ type: 'integer' },
          createdAt:   { type: 'string', format: 'date-time' },
        },
      },
      CourseInput: {
        type: 'object',
        required: ['title', 'description', 'price', 'category'],
        properties: {
          title:       { type: 'string', example: 'Quranic Arabic — Beginner' },
          description: { type: 'string' },
          category:    { type: 'string', example: 'Arabic' },
          price:       { type: 'number', example: 2500, description: 'Amount in PKR' },
          imageUrl:    { type: 'string', nullable: true },
        },
      },
      // ── Module ───────────────────────────────────────────────────────────────
      Module: {
        type: 'object',
        properties: {
          id:       { type: 'integer' },
          title:    { type: 'string', example: 'Week 1 — Introduction' },
          order:    { type: 'integer' },
          courseId: { type: 'integer' },
        },
      },
      ModuleInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'Week 1 — Introduction' },
          order: { type: 'integer', example: 1 },
        },
      },
      // ── Lesson ───────────────────────────────────────────────────────────────
      LessonInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title:    { type: 'string', example: 'Lesson 1 — Alphabets' },
          videoUrl: { type: 'string', nullable: true },
          content:  { type: 'string', nullable: true },
          order:    { type: 'integer', example: 1 },
        },
      },
      // ── Enrollment ───────────────────────────────────────────────────────────
      Enrollment: {
        type: 'object',
        properties: {
          id:         { type: 'integer' },
          userId:     { type: 'integer' },
          courseId:   { type: 'integer' },
          progress:   { type: 'number', example: 45.5, description: 'Percentage 0–100' },
          status:     { type: 'string', enum: ['active', 'completed', 'dropped'] },
          enrolledAt: { type: 'string', format: 'date-time' },
        },
      },
      EnrollRequest: {
        type: 'object',
        required: ['courseId'],
        properties: {
          courseId:      { type: 'integer', example: 5 },
          paymentMethod: { type: 'string', enum: ['jazzcash', 'free'], example: 'free' },
        },
      },
      // ── Blog ─────────────────────────────────────────────────────────────────
      Blog: {
        type: 'object',
        properties: {
          id:          { type: 'integer' },
          title:       { type: 'string' },
          slug:        { type: 'string' },
          content:     { type: 'string' },
          category:    { type: 'string' },
          imageUrl:    { type: 'string', nullable: true },
          isPublished: { type: 'boolean' },
          createdAt:   { type: 'string', format: 'date-time' },
        },
      },
      BlogInput: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title:    { type: 'string', example: 'How to Learn Arabic Fast' },
          content:  { type: 'string' },
          category: { type: 'string', example: 'Arabic' },
          imageUrl: { type: 'string', nullable: true },
        },
      },
      // ── Free Trial ───────────────────────────────────────────────────────────
      FreeTrialRequest: {
        type: 'object',
        required: ['name', 'email', 'courseId'],
        properties: {
          name:     { type: 'string', example: 'Zainab Ahmed' },
          email:    { type: 'string', format: 'email' },
          phone:    { type: 'string', example: '+92300000000' },
          courseId: { type: 'integer', example: 2 },
          message:  { type: 'string', nullable: true },
        },
      },
      // ── Payment ──────────────────────────────────────────────────────────────
      JazzCashInitiateRequest: {
        type: 'object',
        required: ['courseId', 'amount'],
        properties: {
          courseId:    { type: 'integer', example: 5 },
          amount:      { type: 'number', example: 2500, description: 'Amount in PKR' },
          mobileNumber:{ type: 'string', example: '03001234567' },
        },
      },
      // ── Welfare ──────────────────────────────────────────────────────────────
      WelfareProgramInput: {
        type: 'object',
        required: ['title', 'description', 'targetAmount'],
        properties: {
          title:         { type: 'string', example: 'Orphan Education Fund' },
          description:   { type: 'string' },
          targetAmount:  { type: 'number', example: 500000, description: 'PKR' },
          imageUrl:      { type: 'string', nullable: true },
        },
      },
      DonationRequest: {
        type: 'object',
        required: ['programId', 'donorName', 'donorEmail', 'amount'],
        properties: {
          programId:   { type: 'integer', example: 1 },
          donorName:   { type: 'string', example: 'Anonymous' },
          donorEmail:  { type: 'string', format: 'email' },
          amount:      { type: 'number', example: 5000, description: 'PKR' },
          message:     { type: 'string', nullable: true },
        },
      },
      // ── Instructor Application ────────────────────────────────────────────────
      InstructorApplicationInput: {
        type: 'object',
        required: ['name', 'email', 'subject', 'experience'],
        properties: {
          name:        { type: 'string', example: 'Umar Farooq' },
          email:       { type: 'string', format: 'email' },
          phone:       { type: 'string', example: '+92301000000' },
          subject:     { type: 'string', example: 'Tajweed' },
          experience:  { type: 'string', example: '5 years teaching Quran' },
          cvUrl:       { type: 'string', nullable: true },
          message:     { type: 'string', nullable: true },
        },
      },
      // ── Contact ──────────────────────────────────────────────────────────────
      ContactRequest: {
        type: 'object',
        required: ['name', 'email', 'message'],
        properties: {
          name:    { type: 'string', example: 'Ali Hassan' },
          email:   { type: 'string', format: 'email' },
          subject: { type: 'string', example: 'Course inquiry' },
          message: { type: 'string', example: 'I want to know more about your Arabic course.' },
        },
      },
    },
  },
  // ── Security (global default) ─────────────────────────────────────────────
  security: [],   // endpoints override per-route

  // ── Tags (groups) ─────────────────────────────────────────────────────────
  tags: [
    { name: 'Auth',                    description: 'Registration, login, OTP, token management' },
    { name: 'Users',                   description: 'User profiles and admin user management' },
    { name: 'Courses',                 description: 'Course CRUD, modules, lessons' },
    { name: 'Enrollments',             description: 'Enrolment, progress, certificates' },
    { name: 'Admin',                   description: 'Admin dashboard, instructors, settings' },
    { name: 'Notifications',           description: 'In-app notification inbox' },
    { name: 'Blogs',                   description: 'Blog posts (public read, admin write)' },
    { name: 'Free Trial',              description: 'Free trial requests' },
    { name: 'Payments',                description: 'JazzCash payments (PKR)' },
    { name: 'Welfare',                 description: 'Welfare programs and donations' },
    { name: 'Instructor Applications', description: 'Become-an-instructor applications' },
    { name: 'Instructor Students',     description: 'Instructor ↔ student assignments' },
    { name: 'Contact',                 description: 'Contact-us form' },
    { name: 'Upload',                  description: 'Cloudinary image upload' },
  ],

  // ── Paths ──────────────────────────────────────────────────────────────────
  paths: {

    // ════════════════════════════════════════════════════════════════════
    //  AUTH
    // ════════════════════════════════════════════════════════════════════
    '/auth/check-email': {
      get: {
        tags: ['Auth'], summary: 'Check if email is registered',
        parameters: [{ in: 'query', name: 'email', required: true, schema: { type: 'string', format: 'email' } }],
        responses: { 200: { description: 'Result', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } } },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'], summary: 'Register a new user',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } } },
        responses: {
          201: { description: 'Registered — OTP sent to email', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          400: { description: 'Validation error' },
          409: { description: 'Email already exists' },
        },
      },
    },
    '/auth/verify-otp': {
      post: {
        tags: ['Auth'], summary: 'Verify email OTP after registration',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OtpRequest' } } } },
        responses: { 200: { description: 'Email verified', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } } },
      },
    },
    '/auth/resend-otp': {
      post: {
        tags: ['Auth'], summary: 'Resend email verification OTP',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } } },
        responses: { 200: { description: 'OTP resent' } },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'], summary: 'Initiate forgot-password flow',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } } },
        responses: { 200: { description: 'Reset OTP sent to email' } },
      },
    },
    '/auth/verify-reset-otp': {
      post: {
        tags: ['Auth'], summary: 'Verify password-reset OTP',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OtpRequest' } } } },
        responses: { 200: { description: 'OTP valid — proceed to reset' } },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'], summary: 'Set new password after OTP verified',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['email', 'otp', 'newPassword'], properties: { email: { type: 'string', format: 'email' }, otp: { type: 'string' }, newPassword: { type: 'string', format: 'password' } } } } },
        },
        responses: { 200: { description: 'Password reset successful' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Login with email + password',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
        responses: {
          200: { description: 'Access + refresh tokens returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/verify-login-otp': {
      post: {
        tags: ['Auth'], summary: 'Verify 2FA OTP on login',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OtpRequest' } } } },
        responses: { 200: { description: 'Tokens returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } } },
      },
    },
    '/auth/resend-login-otp': {
      post: {
        tags: ['Auth'], summary: 'Resend login OTP',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } } },
        responses: { 200: { description: 'OTP resent' } },
      },
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Auth'], summary: 'Exchange refresh token for new access token',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['refreshToken'], properties: { refreshToken: { type: 'string' } } } } } },
        responses: { 200: { description: 'New access token', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } } },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'], summary: 'Logout and invalidate refresh token',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Logged out' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'], summary: 'Get currently authenticated user',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Current user', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfile' } } } } },
      },
    },
    '/auth/profile': {
      put: {
        tags: ['Auth'], summary: 'Update own profile',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { name: { type: 'string' }, bio: { type: 'string' }, avatarUrl: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Profile updated' } },
      },
    },
    '/auth/change-password': {
      post: {
        tags: ['Auth'], summary: 'Change own password',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: { currentPassword: { type: 'string', format: 'password' }, newPassword: { type: 'string', format: 'password' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Password changed' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  USERS
    // ════════════════════════════════════════════════════════════════════
    '/users/{userId}/profile': {
      get: {
        tags: ['Users'], summary: 'Get public profile of any user',
        parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfile' } } } } },
      },
    },
    '/users/instructors': {
      get: {
        tags: ['Users'], summary: 'List all active instructors',
        responses: { 200: { description: 'Array of instructor profiles' } },
      },
    },
    '/users/stats': {
      get: {
        tags: ['Users'], summary: 'Get stats for the current user',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Stats object' } },
      },
    },
    '/users/taught-courses': {
      get: {
        tags: ['Users'], summary: 'Courses taught by the current instructor',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Array of courses' } },
      },
    },
    '/users': {
      get: {
        tags: ['Users'], summary: 'List all users — Admin only',
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'role',   schema: { type: 'string', enum: ['student', 'instructor', 'admin'] } },
          { in: 'query', name: 'status', schema: { type: 'string', enum: ['active', 'inactive', 'suspended'] } },
          { in: 'query', name: 'page',   schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit',  schema: { type: 'integer', default: 20 } },
        ],
        responses: { 200: { description: 'Paginated user list' } },
      },
    },
    '/users/{userId}/status': {
      put: {
        tags: ['Users'], summary: 'Activate or deactivate a user — Admin only',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['active', 'inactive', 'suspended'] } } } } },
        },
        responses: { 200: { description: 'Status updated' } },
      },
    },
    '/users/{userId}': {
      delete: {
        tags: ['Users'], summary: 'Permanently delete a user — Admin only',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'User deleted' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  COURSES
    // ════════════════════════════════════════════════════════════════════
    '/courses': {
      get: {
        tags: ['Courses'], summary: 'List published courses',
        parameters: [
          { in: 'query', name: 'category', schema: { type: 'string' } },
          { in: 'query', name: 'page',     schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit',    schema: { type: 'integer', default: 10 } },
        ],
        responses: { 200: { description: 'Paginated courses', content: { 'application/json': { schema: { type: 'object', properties: { courses: { type: 'array', items: { $ref: '#/components/schemas/Course' } }, total: { type: 'integer' } } } } } } },
      },
      post: {
        tags: ['Courses'], summary: 'Create a new course — Instructor / Admin',
        security: [{ BearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseInput' } } } },
        responses: { 201: { description: 'Course created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Course' } } } } },
      },
    },
    '/courses/categories': {
      get: {
        tags: ['Courses'], summary: 'Get available course categories',
        responses: { 200: { description: 'Array of category strings' } },
      },
    },
    '/courses/search': {
      get: {
        tags: ['Courses'], summary: 'Search courses by keyword',
        parameters: [
          { in: 'query', name: 'q',     required: true, schema: { type: 'string' } },
          { in: 'query', name: 'page',  schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
        ],
        responses: { 200: { description: 'Matching courses' } },
      },
    },
    '/courses/my/courses': {
      get: {
        tags: ['Courses'], summary: 'Get courses created by the current instructor',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Array of courses' } },
      },
    },
    '/courses/{id}': {
      get: {
        tags: ['Courses'], summary: 'Get full detail of a single course',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Course detail', content: { 'application/json': { schema: { $ref: '#/components/schemas/Course' } } } } },
      },
      put: {
        tags: ['Courses'], summary: 'Update a course',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseInput' } } } },
        responses: { 200: { description: 'Updated course' } },
      },
      delete: {
        tags: ['Courses'], summary: 'Delete a course',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Course deleted' } },
      },
    },
    '/courses/{id}/publish': {
      post: {
        tags: ['Courses'], summary: 'Publish / approve a course — Admin only',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Course published' } },
      },
    },
    '/courses/{id}/submit-for-approval': {
      post: {
        tags: ['Courses'], summary: 'Submit course for admin review — Instructor / Admin',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Submitted for approval' } },
      },
    },
    '/courses/{id}/stats': {
      get: {
        tags: ['Courses'], summary: 'Get enrolment & revenue stats for a course',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Stats object' } },
      },
    },
    '/courses/{courseId}/modules': {
      get: {
        tags: ['Courses'], summary: 'List modules of a course',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'courseId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Array of modules', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Module' } } } } } },
      },
      post: {
        tags: ['Courses'], summary: 'Add a new module to a course — Instructor / Admin',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'courseId', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ModuleInput' } } } },
        responses: { 201: { description: 'Module created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Module' } } } } },
      },
    },
    '/courses/{courseId}/modules/{moduleId}/lessons': {
      post: {
        tags: ['Courses'], summary: 'Add a lesson to a module — Instructor / Admin',
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'courseId',  required: true, schema: { type: 'integer' } },
          { in: 'path', name: 'moduleId',  required: true, schema: { type: 'integer' } },
        ],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LessonInput' } } } },
        responses: { 201: { description: 'Lesson created' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  ENROLLMENTS
    // ════════════════════════════════════════════════════════════════════
    '/enrollments': {
      post: {
        tags: ['Enrollments'], summary: 'Enrol a student in a course — Student / Admin',
        security: [{ BearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EnrollRequest' } } } },
        responses: { 201: { description: 'Enrolled', content: { 'application/json': { schema: { $ref: '#/components/schemas/Enrollment' } } } } },
      },
    },
    '/enrollments/my-enrollments': {
      get: {
        tags: ['Enrollments'], summary: 'Get own enrolments',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Array of enrolments' } },
      },
    },
    '/enrollments/my-certificates': {
      get: {
        tags: ['Enrollments'], summary: 'Get own certificates',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Array of certificates' } },
      },
    },
    '/enrollments/{enrollmentId}': {
      get: {
        tags: ['Enrollments'], summary: 'Get single enrolment detail',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'enrollmentId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Enrolment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Enrollment' } } } } },
      },
    },
    '/enrollments/{enrollmentId}/progress': {
      put: {
        tags: ['Enrollments'], summary: 'Update lesson completion progress',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'enrollmentId', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['lessonId', 'completed'], properties: { lessonId: { type: 'integer' }, completed: { type: 'boolean' } } } } },
        },
        responses: { 200: { description: 'Progress updated' } },
      },
    },
    '/enrollments/{enrollmentId}/drop': {
      post: {
        tags: ['Enrollments'], summary: 'Drop / withdraw from a course',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'enrollmentId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Course dropped' } },
      },
    },
    '/enrollments/course/{courseId}/enrollments': {
      get: {
        tags: ['Enrollments'], summary: 'List all students in a course — Instructor / Admin',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'courseId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Array of enrolments' } },
      },
    },
    '/enrollments/{enrollmentId}/certificate': {
      post: {
        tags: ['Enrollments'], summary: 'Issue completion certificate — Instructor / Admin',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'enrollmentId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Certificate issued' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  ADMIN
    // ════════════════════════════════════════════════════════════════════
    '/admin/statistics': {
      get: { tags: ['Admin'], summary: 'Dashboard KPIs & statistics', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Stats object' } } },
    },
    '/admin/recent-enrollments': {
      get: { tags: ['Admin'], summary: 'Latest enrolments', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Array' } } },
    },
    '/admin/enrollment-trends': {
      get: { tags: ['Admin'], summary: 'Enrolment trend over time', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Array of { date, count }' } } },
    },
    '/admin/top-courses': {
      get: { tags: ['Admin'], summary: 'Most enrolled courses', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Array of courses' } } },
    },
    '/admin/recent-registrations': {
      get: { tags: ['Admin'], summary: 'Newest registered users', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Array of users' } } },
    },
    '/admin/instructors': {
      get:  { tags: ['Admin'], summary: 'List all instructors', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Array' } } },
    },
    '/admin/instructors/{id}': {
      get: {
        tags: ['Admin'], summary: 'Get instructor detail', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Instructor object' } },
      },
      put: {
        tags: ['Admin'], summary: 'Update instructor profile', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, bio: { type: 'string' }, status: { type: 'string' } } } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Admin'], summary: 'Delete an instructor', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/admin/courses': {
      get: { tags: ['Admin'], summary: 'List all courses (any status)', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Array of courses' } } },
    },
    '/admin/courses/statistics': {
      get: { tags: ['Admin'], summary: 'Course-level statistics', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Stats' } } },
    },
    '/admin/courses/{id}/status': {
      patch: {
        tags: ['Admin'], summary: 'Change course status (approve / archive)', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['draft', 'pending_approval', 'published', 'archived'] } } } } },
        },
        responses: { 200: { description: 'Status changed' } },
      },
    },
    '/admin/enrollments': {
      get: {
        tags: ['Admin'], summary: 'List all enrolments', security: [{ BearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'courseId', schema: { type: 'integer' } },
          { in: 'query', name: 'userId',   schema: { type: 'integer' } },
          { in: 'query', name: 'page',     schema: { type: 'integer', default: 1 } },
        ],
        responses: { 200: { description: 'Array' } },
      },
      post: {
        tags: ['Admin'], summary: 'Manually create an enrolment', security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['userId', 'courseId'], properties: { userId: { type: 'integer' }, courseId: { type: 'integer' } } } } },
        },
        responses: { 201: { description: 'Enrolment created' } },
      },
    },
    '/admin/enrollments/statistics': {
      get: { tags: ['Admin'], summary: 'Enrolment statistics', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Stats' } } },
    },
    '/admin/enrollments/{id}': {
      get: {
        tags: ['Admin'], summary: 'Get enrolment detail', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Enrolment' } },
      },
      put: {
        tags: ['Admin'], summary: 'Update enrolment record', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, progress: { type: 'number' } } } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Admin'], summary: 'Delete an enrolment', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/admin/settings': {
      get: { tags: ['Admin'], summary: 'Get site-wide settings', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Settings object' } } },
      put: {
        tags: ['Admin'], summary: 'Update site-wide settings', security: [{ BearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Settings updated' } },
      },
    },
    '/admin/predefined-courses': {
      get:  { tags: ['Admin'], summary: 'List predefined course catalogue', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Array' } } },
      post: {
        tags: ['Admin'], summary: 'Add a predefined course', security: [{ BearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['title'], properties: { title: { type: 'string' }, description: { type: 'string' } } } } } },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/admin/predefined-courses/{id}': {
      put: {
        tags: ['Admin'], summary: 'Update a predefined course', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' } } } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Admin'], summary: 'Delete a predefined course', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/admin/instructors/{id}/courses': {
      get: {
        tags: ['Admin'], summary: 'Get courses assigned to an instructor', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Array of courses' } },
      },
      post: {
        tags: ['Admin'], summary: 'Sync / assign courses to an instructor', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['courseIds'], properties: { courseIds: { type: 'array', items: { type: 'integer' } } } } } } },
        responses: { 200: { description: 'Synced' } },
      },
    },
    '/admin/instructors/{id}/courses/{courseId}': {
      delete: {
        tags: ['Admin'], summary: 'Remove a course from an instructor', security: [{ BearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id',       required: true, schema: { type: 'integer' } },
          { in: 'path', name: 'courseId', required: true, schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Removed' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  NOTIFICATIONS
    // ════════════════════════════════════════════════════════════════════
    '/notifications': {
      get: {
        tags: ['Notifications'], summary: 'Get notifications for the current user',
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'unreadOnly', schema: { type: 'boolean', default: false } },
          { in: 'query', name: 'page',       schema: { type: 'integer', default: 1 } },
        ],
        responses: { 200: { description: 'Array of notifications' } },
      },
      post: {
        tags: ['Notifications'], summary: 'Create a notification (internal use)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['userId', 'message'], properties: { userId: { type: 'integer' }, message: { type: 'string' }, type: { type: 'string' } } } } },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/notifications/read-all': {
      patch: {
        tags: ['Notifications'], summary: 'Mark all notifications as read',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'All marked read' } },
      },
    },
    '/notifications/{id}/read': {
      patch: {
        tags: ['Notifications'], summary: 'Mark a single notification as read',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Marked read' } },
      },
    },
    '/notifications/{id}': {
      delete: {
        tags: ['Notifications'], summary: 'Delete a notification',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  BLOGS
    // ════════════════════════════════════════════════════════════════════
    '/blogs': {
      get: {
        tags: ['Blogs'], summary: 'List published blog posts',
        parameters: [
          { in: 'query', name: 'category', schema: { type: 'string' } },
          { in: 'query', name: 'page',     schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit',    schema: { type: 'integer', default: 3 } },
        ],
        responses: { 200: { description: 'Paginated blogs' } },
      },
      post: {
        tags: ['Blogs'], summary: 'Create a blog post — Admin only',
        security: [{ BearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/BlogInput' } } } },
        responses: { 201: { description: 'Blog created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Blog' } } } } },
      },
    },
    '/blogs/slug/{slug}': {
      get: {
        tags: ['Blogs'], summary: 'Get a blog post by URL slug',
        parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Blog post', content: { 'application/json': { schema: { $ref: '#/components/schemas/Blog' } } } } },
      },
    },
    '/blogs/admin/all': {
      get: {
        tags: ['Blogs'], summary: 'Admin — list all blogs (any status)', security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Array' } },
      },
    },
    '/blogs/admin/{id}': {
      get: {
        tags: ['Blogs'], summary: 'Admin — get single blog by ID', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Blog post' } },
      },
    },
    '/blogs/{id}': {
      put: {
        tags: ['Blogs'], summary: 'Update a blog post — Admin only', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/BlogInput' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Blogs'], summary: 'Delete a blog post — Admin only', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/blogs/{id}/toggle-publish': {
      patch: {
        tags: ['Blogs'], summary: 'Toggle blog publish status — Admin only', security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Publish state toggled' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  FREE TRIAL
    // ════════════════════════════════════════════════════════════════════
    '/free-trial/courses': {
      get: {
        tags: ['Free Trial'], summary: 'Get courses available for free trial (public)',
        responses: { 200: { description: 'Array of predefined courses' } },
      },
    },
    '/free-trial': {
      get: {
        tags: ['Free Trial'], summary: 'Admin — list all free trial requests',
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'status', schema: { type: 'string', enum: ['pending', 'approved', 'rejected'] } },
          { in: 'query', name: 'page',   schema: { type: 'integer', default: 1 } },
        ],
        responses: { 200: { description: 'Array' } },
      },
      post: {
        tags: ['Free Trial'], summary: 'Submit a free trial request (public)',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/FreeTrialRequest' } } } },
        responses: { 201: { description: 'Request submitted' } },
      },
    },
    '/free-trial/{id}/status': {
      patch: {
        tags: ['Free Trial'], summary: 'Admin — update free trial request status',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['approved', 'rejected'] } } } } },
        },
        responses: { 200: { description: 'Status updated' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  PAYMENTS
    // ════════════════════════════════════════════════════════════════════
    '/payments/jazzcash/initiate': {
      post: {
        tags: ['Payments'], summary: 'Initiate a JazzCash payment (PKR)',
        security: [{ BearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/JazzCashInitiateRequest' } } } },
        responses: { 200: { description: 'JazzCash redirect URL + hash' } },
      },
    },
    '/payments/jazzcash/callback': {
      post: {
        tags: ['Payments'], summary: 'JazzCash IPN callback — called by JazzCash, no user auth',
        requestBody: { required: true, content: { 'application/x-www-form-urlencoded': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Callback handled' } },
      },
    },
    '/payments/my-payments': {
      get: {
        tags: ['Payments'], summary: 'Get own payment history',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Array of payment records' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  WELFARE
    // ════════════════════════════════════════════════════════════════════
    '/welfare/programs': {
      get: {
        tags: ['Welfare'], summary: 'List active welfare programs (public)',
        responses: { 200: { description: 'Array of programs' } },
      },
      post: {
        tags: ['Welfare'], summary: 'Create a welfare program — Admin only',
        security: [{ BearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/WelfareProgramInput' } } } },
        responses: { 201: { description: 'Program created' } },
      },
    },
    '/welfare/programs/{id}': {
      get: {
        tags: ['Welfare'], summary: 'Get welfare program detail (public)',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Program detail' } },
      },
      put: {
        tags: ['Welfare'], summary: 'Update a welfare program — Admin only',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/WelfareProgramInput' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Welfare'], summary: 'Delete a welfare program — Admin only',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/welfare/donations': {
      get: {
        tags: ['Welfare'], summary: 'List all donations — Admin only',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Array of donations' } },
      },
      post: {
        tags: ['Welfare'], summary: 'Submit a donation (public)',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/DonationRequest' } } } },
        responses: { 201: { description: 'Donation submitted' } },
      },
    },
    '/welfare/donations/{id}/status': {
      patch: {
        tags: ['Welfare'], summary: 'Update donation status — Admin only',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['pending', 'confirmed', 'rejected'] } } } } },
        },
        responses: { 200: { description: 'Status updated' } },
      },
    },
    '/welfare/stats': {
      get: {
        tags: ['Welfare'], summary: 'Welfare stats summary — Admin only',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Stats' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  INSTRUCTOR APPLICATIONS
    // ════════════════════════════════════════════════════════════════════
    '/instructor-applications': {
      get: {
        tags: ['Instructor Applications'], summary: 'Admin — list all applications',
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'status', schema: { type: 'string', enum: ['pending', 'approved', 'rejected'] } },
          { in: 'query', name: 'page',   schema: { type: 'integer', default: 1 } },
        ],
        responses: { 200: { description: 'Array' } },
      },
      post: {
        tags: ['Instructor Applications'], summary: 'Submit become-an-instructor application (public)',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/InstructorApplicationInput' } } } },
        responses: { 201: { description: 'Application submitted' } },
      },
    },
    '/instructor-applications/{id}': {
      get: {
        tags: ['Instructor Applications'], summary: 'Admin — get single application',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Application detail' } },
      },
      delete: {
        tags: ['Instructor Applications'], summary: 'Admin — delete an application',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/instructor-applications/{id}/approve': {
      patch: {
        tags: ['Instructor Applications'], summary: 'Admin — approve an application',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Approved' } },
      },
    },
    '/instructor-applications/{id}/reject': {
      patch: {
        tags: ['Instructor Applications'], summary: 'Admin — reject an application',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { reason: { type: 'string' } } } } },
        },
        responses: { 200: { description: 'Rejected' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  INSTRUCTOR STUDENTS
    // ════════════════════════════════════════════════════════════════════
    '/instructor-students/my/students': {
      get: {
        tags: ['Instructor Students'], summary: 'Get students assigned to current instructor',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Array of students' } },
      },
    },
    '/instructor-students/assign': {
      post: {
        tags: ['Instructor Students'], summary: 'Assign students to an instructor — Admin only',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['instructorId', 'studentIds'],
                properties: { instructorId: { type: 'integer' }, studentIds: { type: 'array', items: { type: 'integer' } } },
              },
            },
          },
        },
        responses: { 200: { description: 'Assigned' } },
      },
    },
    '/instructor-students/{instructorId}': {
      get: {
        tags: ['Instructor Students'], summary: 'Get students assigned to a specific instructor',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'instructorId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Array of students' } },
      },
    },
    '/instructor-students/{instructorId}/{studentId}': {
      delete: {
        tags: ['Instructor Students'], summary: 'Remove a student from an instructor — Admin only',
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'instructorId', required: true, schema: { type: 'integer' } },
          { in: 'path', name: 'studentId',    required: true, schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Removed' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  CONTACT
    // ════════════════════════════════════════════════════════════════════
    '/contact': {
      post: {
        tags: ['Contact'], summary: 'Submit contact-us form (public)',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactRequest' } } } },
        responses: { 200: { description: 'Message received' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    //  UPLOAD
    // ════════════════════════════════════════════════════════════════════
    '/upload': {
      post: {
        tags: ['Upload'], summary: 'Upload an image to Cloudinary',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'query', name: 'folder', required: true,
            schema: { type: 'string', enum: ['courses', 'instructors', 'blogs', 'welfare'] },
            description: 'Target Cloudinary folder',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: { image: { type: 'string', format: 'binary', description: 'Image file (jpg/png/webp/gif, max 5 MB)' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Upload successful', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, url: { type: 'string' } } } } } },
          400: { description: 'No file or invalid type' },
        },
      },
    },
  },
};

module.exports = swaggerDefinition;
