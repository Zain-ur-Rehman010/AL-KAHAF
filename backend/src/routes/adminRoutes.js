const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// All admin routes require authentication
router.use(authMiddleware);

// Dashboard Statistics
router.get('/statistics', adminController.getDashboardStatistics);
router.get('/recent-enrollments', adminController.getRecentEnrollments);
router.get('/enrollment-trends', adminController.getEnrollmentTrends);
router.get('/top-courses', adminController.getTopCourses);
router.get('/recent-registrations', adminController.getRecentRegistrations);

// Instructor Management
router.get('/instructors', adminController.getAllInstructors);
router.get('/instructors/:id', adminController.getInstructorById);
router.put('/instructors/:id', adminController.updateInstructor);
router.delete('/instructors/:id', adminController.deleteInstructor);

// Course Management
router.get('/courses', adminController.getAllCourses);
router.get('/courses/statistics', adminController.getCourseStatistics);
router.patch('/courses/:id/status', adminController.updateCourseStatus);

// Enrollment Management
router.get('/enrollments', adminController.getAllEnrollments);
router.get('/enrollments/statistics', adminController.getEnrollmentStatistics);
router.get('/enrollments/:id', adminController.getEnrollmentById);
router.post('/enrollments', adminController.createEnrollment);
router.put('/enrollments/:id', adminController.updateEnrollment);
router.delete('/enrollments/:id', adminController.deleteEnrollment);

// Site Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

// Predefined Course Catalog
router.get('/predefined-courses', adminController.getPredefinedCourses);

// Instructor ↔ Course Assignments
router.get('/instructors/:id/courses', adminController.getInstructorCourses);
router.post('/instructors/:id/courses', adminController.syncInstructorCourses);
router.delete('/instructors/:id/courses/:courseId', adminController.removeInstructorCourse);

module.exports = router;