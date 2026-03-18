# Quick Start Guide - 5 Minutes

Get your Al-Kahaf LMS backend running in 5 minutes.

## Option 1: Docker (Easiest)

### 1. Start services
```bash
cd backend
docker-compose up -d
```

That's it! Your backend is running:
- **Backend API**: http://localhost:5000
- **Database**: MySQL on localhost:3306
- **Redis Cache**: localhost:6379

### 2. Test it
```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123",
    "role": "student"
  }'
```

### 3. View logs
```bash
docker-compose logs -f app
```

## Option 2: Local Installation

### 1. Setup
```bash
cd backend
npm install
```

### 2. Configure
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
# Make sure MySQL is running on localhost:3306
```

### 3. Run migrations
```bash
npm run migrate
npm run seed  # Optional: populate sample data
```

### 4. Start
```bash
npm run dev
```

Backend runs on http://localhost:5000

## Testing the API

### 1. Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123",
    "role": "student"
  }'
```

### 2. Login and get token
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'

# Copy the accessToken from response
```

### 3. Get user profile (replace TOKEN)
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Key Features Ready to Use

| Feature | Endpoint | Usage |
|---------|----------|-------|
| User Registration | `POST /auth/register` | Create account |
| Login | `POST /auth/login` | Get JWT token |
| Create Course | `POST /courses` | Instructor only |
| List Courses | `GET /courses` | Browse all courses |
| Enroll | `POST /enrollments` | Student joins course |
| Get Enrollments | `GET /enrollments/my-enrollments` | View my courses |
| Issue Certificate | `POST /enrollments/:id/certificate` | On course completion |

## Useful Commands

```bash
# Stop services
docker-compose down

# View database
docker-compose exec db mysql -u root -p alkahaf_lms_dev

# Reset everything
docker-compose down -v
docker-compose up -d

# Run tests
npm test

# Check API health
curl http://localhost:5000/api/health
```

## Environment Variables (Key Ones)

| Variable | Default | Notes |
|----------|---------|-------|
| `DB_HOST` | localhost | MySQL host |
| `DB_NAME` | alkahaf_lms_dev | Database name |
| `JWT_SECRET` | (required) | Change in production! |
| `CORS_ORIGIN` | http://localhost:3000 | Frontend URL |
| `STRIPE_SECRET_KEY` | (optional) | For payments |
| `SMTP_HOST` | (optional) | For email notifications |

## Troubleshooting

### Database connection error
```bash
# Check MySQL running
docker-compose ps

# Reset database
docker-compose down -v && docker-compose up -d
```

### Port already in use
```bash
# Check what's using port 5000
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Change PORT in .env or docker-compose.yml
```

### JWT authentication failing
```bash
# Make sure token is in Authorization header
Authorization: Bearer YOUR_TOKEN_HERE

# Token should be copied exactly from login response
```

## Next Steps

1. ✅ Backend running
2. → Import `postman-collection.json` into Postman for full API testing
3. → Read [README.md](README.md) for complete documentation
4. → Review database models in `src/models/`
5. → Check API routes in `src/routes/`
6. → Connect your frontend to `http://localhost:5000/api/v1`

## Need Help?

- Check [README.md](README.md) for full documentation
- Review `.env.example` for all configuration options
- Check logs: `docker-compose logs -f`
- API responses include error messages for debugging

**Happy coding! 🚀**
