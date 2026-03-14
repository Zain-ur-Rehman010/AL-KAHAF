const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const moduleController = require('../controllers/moduleController');
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  courseController.createCourse
);

router.get('/', courseController.getCourses);
router.get('/categories', courseController.getCategories);
router.get('/search', courseController.searchCourses);
router.get('/my/courses', authMiddleware, roleMiddleware(['instructor', 'admin']), courseController.getMyCourses);
router.get('/:id', courseController.getCourseById);

router.put(
  '/:id',
  authMiddleware,
  courseController.updateCourse
);

router.delete(
  '/:id',
  authMiddleware,
  courseController.deleteCourse
);

router.post(
  '/:id/publish',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  courseController.publishCourse
);

router.get('/:id/stats', authMiddleware, courseController.getCourseStats);

// Module routes
router.post(
  '/:courseId/modules',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  moduleController.createModule
);
router.get('/:courseId/modules', authMiddleware, moduleController.getModules);

// Lesson routes
router.post(
  '/:courseId/modules/:moduleId/lessons',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  lessonController.createLesson
);

module.exports = router;
