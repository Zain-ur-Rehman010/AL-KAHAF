'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/instructorStudentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Instructor gets their own assigned students
router.get('/my/students', roleMiddleware(['instructor', 'admin']), ctrl.getMyStudents);

// Admin assigns students to an instructor
router.post('/assign', roleMiddleware(['admin']), ctrl.assignStudents);

// Get all students assigned to a specific instructor
router.get('/:instructorId', roleMiddleware(['instructor', 'admin']), ctrl.getAssignedStudents);

// Admin removes a student from an instructor
router.delete('/:instructorId/:studentId', roleMiddleware(['admin']), ctrl.removeStudent);

module.exports = router;
