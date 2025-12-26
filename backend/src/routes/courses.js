const express = require('express');
const { auth, isInstructor } = require('../middleware/auth');
const courseController = require('../controllers/courseController');

const router = express.Router();

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.get('/:id/lessons', courseController.getCourseLessons);

// Protected routes (instructor only)
router.post('/', auth, isInstructor, courseController.createCourse);
router.put('/:id', auth, isInstructor, courseController.updateCourse);
router.delete('/:id', auth, isInstructor, courseController.deleteCourse);

module.exports = router;
