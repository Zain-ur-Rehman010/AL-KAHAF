const express = require('express');
const { auth } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.get('/:id/profile', auth, userController.getUserProfile);
router.get('/:id/courses', auth, userController.getUserCourses);

module.exports = router;
