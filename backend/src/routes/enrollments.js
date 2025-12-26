const express = require('express');
const { auth } = require('../middleware/auth');
const enrollmentController = require('../controllers/enrollmentController');

const router = express.Router();

router.post('/', auth, enrollmentController.enrollCourse);
router.get('/', auth, enrollmentController.getStudentEnrollments);
router.get('/:courseId/students', auth, enrollmentController.getCourseStudents);
router.delete('/:id', auth, enrollmentController.unenrollCourse);

module.exports = router;
