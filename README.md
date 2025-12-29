# 🎓 AlKahaf LMS - Learning Management System

**Status:** ✅ **LIVE IN PRODUCTION**
**Version:** 1.0.0
**Last Updated:** December 28, 2025

---

## 🌐 Live Application

- **Website:** https://alkahafonlineacademy.com
- **API:** https://alkahafonlineacademy.com/api/v1
- **Health Check:** https://alkahafonlineacademy.com/api/health

---

## 📖 Quick Start

### For Users:
1. **Register:** https://alkahafonlineacademy.com/src/pages/auth/register.html
2. **Login:** https://alkahafonlineacademy.com/src/pages/auth/login.html
3. **Access Dashboard** based on your role (Student/Instructor/Admin)

### For Developers:
```bash
# Clone repository
git clone <repository-url>
cd AlKahaf

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev

# Frontend setup (separate terminal)
cd frontend
npm install
npm run dev
```

---

## 🏗️ Project Structure

```
AlKahaf/
├── backend/          # Node.js + Express API
├── frontend/         # HTML/CSS/JS Frontend
├── docs/             # Documentation
│   ├── DEPLOYMENT_COMPLETE.md
│   ├── PROJECT_STRUCTURE.md
│   ├── QUICK_REFERENCE.md
│   └── guides/
└── README.md         # This file
```

---

## ✨ Features

### Implemented & Live:
- ✅ User Authentication (Register, Login, Logout)
- ✅ JWT Token Management (Access + Refresh tokens)
- ✅ Role-Based Access Control (Student, Instructor, Admin)
- ✅ Password Hashing (bcrypt)
- ✅ Responsive Frontend (Bootstrap 5)
- ✅ RESTful API (30+ endpoints)
- ✅ MySQL Database (11 tables)
- ✅ CORS & Security (Helmet, Rate Limiting)

### Planned:
- 🔄 Course Management (CRUD)
- 🔄 Course Enrollment
- 🔄 Progress Tracking
- 🔄 Quizzes & Assignments
- 🔄 Certificates
- 🔄 Payment Integration (Stripe)
- 🔄 Email Notifications
- 🔄 User Profiles with Avatars

---

## 🛠️ Tech Stack

### Backend:
- **Runtime:** Node.js (v22.18.0)
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcrypt, helmet, CORS, rate-limiting
- **Validation:** Joi

### Frontend:
- **HTML5** + **CSS3** + **JavaScript (ES6+)**
- **CSS Framework:** Bootstrap 5
- **Icons:** FontAwesome, Feather, Tabler, Iconsax
- **Plugins:** jQuery, Select2, Slick Slider

### Deployment:
- **Hosting:** cPanel (Shared Hosting)
- **Server:** Apache + Node.js
- **SSL:** HTTPS Enabled
- **Environment:** Production

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DEPLOYMENT_COMPLETE.md](docs/DEPLOYMENT_COMPLETE.md) | Complete deployment status and configuration |
| [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) | Detailed project file organization |
| [QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) | Quick reference for common tasks |
| [AUTH_COMPLETION_GUIDE.md](docs/guides/AUTH_COMPLETION_GUIDE.md) | Authentication implementation guide |
| [Backend README](backend/README.md) | Backend API documentation |

---

## 🚀 API Endpoints

### Authentication:
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

### Courses:
```
GET    /api/v1/courses
POST   /api/v1/courses
GET    /api/v1/courses/:id
PUT    /api/v1/courses/:id
DELETE /api/v1/courses/:id
```

### Enrollments:
```
GET    /api/v1/enrollments
POST   /api/v1/enrollments
PATCH  /api/v1/enrollments/:id/progress
DELETE /api/v1/enrollments/:id
```

---

## 🗄️ Database Schema

**Tables (11 total):**
- Users
- Courses
- Modules
- Lessons
- Enrollments
- Quizzes
- Assignments
- Payments
- Certificates
- Messages
- Notifications

See [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed schema.

---

## 🔐 Security

- Password hashing with bcrypt (10 rounds)
- JWT-based authentication
- HTTPS enforced
- CORS configured
- Rate limiting
- Input validation
- SQL injection protection (Sequelize ORM)
- Environment variables for secrets

---

## 📦 Installation

### Prerequisites:
- Node.js (v18+)
- MySQL (v8+)
- npm or yarn

### Backend Setup:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run dev
```

### Frontend Setup:
```bash
cd frontend
npm install
npm run dev  # Starts live-server + SCSS compiler
```

---

## 🧪 Testing

### Test Backend API:
```bash
curl https://alkahafonlineacademy.com/api/health
```

### Test Registration:
1. Visit: https://alkahafonlineacademy.com/src/pages/auth/register.html
2. Fill form and submit
3. Check database for new user
4. Login with credentials

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is proprietary and confidential.

---

## 👥 Team

- **Development:** AlKahaf Team
- **Deployment:** December 2025

---

## 📞 Support

For questions or issues:
1. Check documentation in `/docs/`
2. Review API documentation in `/backend/README.md`
3. Check deployment status in `/docs/DEPLOYMENT_COMPLETE.md`

---

## 🎯 Current Status

### ✅ Completed:
- Backend API deployed and running
- Frontend deployed and accessible
- User authentication working end-to-end
- Database configured and connected
- Security measures implemented
- Documentation complete

### 🔄 In Progress:
- Course management features
- Payment integration
- Email notifications

### 📋 Planned:
- Mobile app (React Native)
- Advanced analytics
- Live video classes
- Discussion forums

---

**🎊 AlKahaf LMS is live and ready for users! 🎊**

Visit: https://alkahafonlineacademy.com