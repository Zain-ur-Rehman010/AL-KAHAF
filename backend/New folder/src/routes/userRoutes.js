const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:userId/profile', userController.getUserProfile);
router.get('/instructors', userController.getInstructors);
router.get('/stats', authMiddleware, userController.getUserStats);
router.get('/taught-courses', authMiddleware, userController.getMyInstructedCourses);

router.get('/', authMiddleware, userController.getAllUsers);
router.put('/:userId/status', authMiddleware, userController.updateUserStatus);
router.delete('/:userId', authMiddleware, userController.deleteUser);

module.exports = router;
