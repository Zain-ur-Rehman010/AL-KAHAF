const express = require('express');
const instructorController = require('../controllers/instructorController');

const router = express.Router();

router.get('/', instructorController.getAllInstructors);
router.get('/:id', instructorController.getInstructorById);
router.get('/:id/courses', instructorController.getInstructorCourses);
router.get('/:id/earnings', instructorController.getInstructorEarnings);
router.get('/:id/students', instructorController.getInstructorStudents);

module.exports = router;
