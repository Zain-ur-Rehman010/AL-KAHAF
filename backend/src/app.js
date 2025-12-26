const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');
const instructorRoutes = require('./routes/instructors');
const enrollmentRoutes = require('./routes/enrollments');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/instructors', instructorRoutes);
app.use('/api/v1/enrollments', enrollmentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
