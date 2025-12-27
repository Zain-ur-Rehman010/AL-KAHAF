# Al-Kahaf LMS Backend API

Production-ready Node.js/Express backend for Learning Management System with PostgreSQL, JWT authentication, and comprehensive course/student management.

## Features

- **Authentication**: JWT-based with refresh tokens, password hashing (bcryptjs)
- **Database**: PostgreSQL with Sequelize ORM, 11 models with relationships
- **Security**: Helmet, CORS, rate limiting, input validation (Joi)
- **Role-Based Access**: Admin, Instructor, Student with fine-grained permissions
- **Payment Integration**: Stripe-ready payment processing
- **Email Service**: Nodemailer for notifications and confirmations
- **Caching**: Redis support for session/data caching
- **Containerization**: Docker & Docker Compose for easy deployment
- **Testing**: Jest + Supertest for API testing
- **API Documentation**: OpenAPI/Swagger compatible

## Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18.2
- **Database**: PostgreSQL 12+, Sequelize 6.35.1
- **Authentication**: JWT (jsonwebtoken 9.1.0), bcryptjs 2.4.3
- **Security**: Helmet 7.1.0, CORS 2.8.5, express-rate-limit 7.1.5
- **Validation**: Joi 17.11.0
- **Services**: Nodemailer 6.9.7 (email), Stripe 13.10.0 (payments)
- **Caching**: Redis 4.6.11
- **Logging**: Morgan 1.10.0
- **File Upload**: Multer 1.4.5
- **Testing**: Jest 29.7.0, Supertest 6.3.3
- **Development**: Nodemon 3.0.1

## Quick Start

### Prerequisites
- Node.js 16 or higher
- PostgreSQL 12 or higher
- Redis (optional, for caching)
- Docker & Docker Compose (for containerized setup)

### Installation

1. **Clone and setup**
```bash
cd backend
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

3. **Start PostgreSQL** (if not using Docker)
```bash
# Make sure PostgreSQL is running on localhost:5432
```

4. **Run database migrations and seeds**
```bash
npm run migrate
npm run seed
```

5. **Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Using Docker

```bash
# Start all services (PostgreSQL, Backend, Redis)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## Database Models

### User
- Roles: admin, instructor, student
- Password hashing with bcryptjs
- Email verification, two-factor auth support
- Profile fields: name, phone, bio, image

### Course
- Instructor-created with title, description, category
- Price, level (beginner/intermediate/advanced)
- Status: draft, published, archived
- Enrollment tracking, rating system
- Learning outcomes and requirements

### Enrollment
- Student-to-course relationship
- Status: enrolled, in_progress, completed, dropped
- Progress tracking (0-100%)
- Payment status: pending, completed, failed, refunded
- Certificate issuance

### Module
- Logical grouping within courses
- Ordered lessons
- Description and metadata

### Lesson
- Video content with streaming support
- Text content and attachments
- Duration tracking
- Ordered within modules
- Draft/published/archived status

### Quiz
- Assessment with auto-grading
- Configurable questions count
- Passing score threshold
- Options: shuffle questions, show answers, allow review
- Optional lesson association

### Assignment
- Student submission tracking
- Due dates with late penalty support
- Multiple submission types: file, text, link
- Max score and grading

### Payment
- Stripe integration ready
- Transaction tracking
- Refund management
- Receipt generation
- Status: pending, completed, failed, refunded, cancelled

### Certificate
- Automatic issuance on completion
- Unique verification codes
- Status: generated, issued, revoked

### Message
- User-to-user messaging
- Optional course context
- File attachments
- Read status tracking

### Notification
- 9 notification types: enrollment, course update, quiz reminder, assignment due, grade posted, message, certificate, completion, general
- User-specific delivery
- Read tracking
- Actionable (links to relevant content)

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh-token` - Refresh JWT token
- `POST /logout` - Logout (blacklist token)
- `GET /me` - Get current user (requires auth)
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password

### Courses (`/api/v1/courses`)
- `POST /` - Create course (instructor/admin)
- `GET /` - List courses with pagination
- `GET /search` - Search courses
- `GET /:id` - Get course details
- `PUT /:id` - Update course
- `DELETE /:id` - Delete course
- `POST /:id/publish` - Publish course
- `GET /:id/stats` - Get course statistics

### Enrollments (`/api/v1/enrollments`)
- `POST /` - Enroll in course
- `GET /my-enrollments` - Get student enrollments
- `GET /:enrollmentId` - Get enrollment details
- `PUT /:enrollmentId/progress` - Update progress
- `POST /:enrollmentId/drop` - Drop course
- `GET /course/:courseId/enrollments` - List course enrollments (instructor)
- `POST /:enrollmentId/certificate` - Issue certificate

### Users (`/api/v1/users`)
- `GET /:userId/profile` - Get user profile
- `GET /instructors` - List instructors
- `GET /stats` - Get user statistics
- `GET /taught-courses` - Get taught courses (instructor)
- `GET /` - List all users (admin)
- `PUT /:userId/status` - Update user status (admin)
- `DELETE /:userId` - Delete user (admin)

## Authentication

### JWT Flow

1. **Register/Login** → Get `accessToken` + `refreshToken`
2. **Access Token** → Valid for 24 hours (default)
3. **Refresh Token** → Valid for 7 days, get new access token
4. **Request** → Include in header: `Authorization: Bearer <accessToken>`

### Example Authentication

```javascript
// Login
POST /api/v1/auth/login
{
  "email": "student@example.com",
  "password": "SecurePassword123"
}

// Response
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}

// Use accessToken in requests
GET /api/v1/auth/me
Authorization: Bearer eyJhbGc...
```

## Configuration

Create `.env` file with the following variables:

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alkahaf_lms_dev
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRATION=7d

# Stripe (payment processing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@alkahaf.com

# Redis (optional, for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug

# AWS S3 (optional, for file uploads)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
AWS_S3_REGION=us-east-1
```

## Running Commands

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Database migrations
npm run migrate
npm run migrate:rollback

# Database seeding
npm run seed

# Testing
npm test
npm run test:watch

# Docker
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database & configuration
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utilities & helpers
│   └── server.js        # Express app setup
├── migrations/          # Database migrations
├── config/
│   └── config.js        # Sequelize config
├── package.json         # Dependencies
├── .env.example         # Environment template
├── Dockerfile           # Container image
├── docker-compose.yml   # Multi-container setup
└── README.md            # This file
```

## Error Handling

API returns consistent error responses:

```json
{
  "message": "Error description",
  "error": { }  // Only in development
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

## Security Considerations

1. **JWT Secrets**: Change in production immediately
2. **CORS**: Configure allowed origins
3. **Rate Limiting**: Adjust for your needs
4. **HTTPS**: Use in production
5. **Database**: Use strong passwords, SSL connections
6. **Environment Variables**: Never commit `.env` files
7. **Password Hashing**: Automatically handled by bcryptjs
8. **Input Validation**: Joi validates all inputs

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- authController.test.js

# Watch mode for development
npm run test:watch

# Coverage report
npm test -- --coverage
```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Change all JWT secrets
- [ ] Configure real database (managed PostgreSQL)
- [ ] Set up Stripe keys
- [ ] Configure SMTP for emails
- [ ] Enable HTTPS/SSL
- [ ] Set appropriate CORS origins
- [ ] Configure Redis for caching
- [ ] Set up monitoring/logging
- [ ] Run database migrations
- [ ] Test all API endpoints
- [ ] Set up CI/CD pipeline

### Docker Deployment

```bash
# Build image
docker build -t alkahaf-backend:latest .

# Run container
docker run -p 5000:5000 \
  -e DB_HOST=your-db-host \
  -e DB_NAME=your-db-name \
  -e JWT_SECRET=your-secret \
  alkahaf-backend:latest
```

### Cloud Deployment (Heroku example)

```bash
heroku login
heroku create alkahaf-lms-backend
heroku addons:create heroku-postgresql:standard-0 --app alkahaf-lms-backend
heroku config:set JWT_SECRET=your-secret --app alkahaf-lms-backend
git push heroku main
heroku logs --tail
```

## API Testing

Use the provided Postman collection: `postman-collection.json`

Or test with curl:

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ahmed",
    "lastName": "Student",
    "email": "ahmed@example.com",
    "password": "SecurePassword123",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "SecurePassword123"
  }'

# Get courses (with token)
curl -X GET http://localhost:5000/api/v1/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Monitoring & Logging

- Morgan logs all HTTP requests
- Errors logged to console (configurable)
- Database queries logged in development
- Implement centralized logging (e.g., Winston, ELK) for production

## Support & Contribution

For issues, feature requests, or contributions:
1. Check existing issues
2. Create detailed bug reports
3. Follow code style (existing patterns)
4. Add tests for new features
5. Update documentation

## License

Proprietary - Al-Kahaf Project 2024

## Contact

Development Team - Al-Kahaf LMS Project
