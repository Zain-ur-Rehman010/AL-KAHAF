const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['student', 'admin']),
  enrollmentController.enrollCourse
);

router.get('/my-enrollments', authMiddleware, enrollmentController.getMyEnrollments);
router.get('/:enrollmentId', authMiddleware, enrollmentController.getEnrollmentById);

router.put(
  '/:enrollmentId/progress',
  authMiddleware,
  enrollmentController.updateProgress
);

router.post(
  '/:enrollmentId/drop',
  authMiddleware,
  enrollmentController.dropCourse
);

router.get(
  '/course/:courseId/enrollments',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  enrollmentController.getCourseEnrollments
);

router.post(
  '/:enrollmentId/certificate',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  enrollmentController.issueCertificate
);

module.exports = router;
