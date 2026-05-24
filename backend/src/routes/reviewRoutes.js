const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public
router.get('/', ctrl.getApprovedReviews);

// Student
router.get('/my', authMiddleware, ctrl.getMyReviews);
router.post('/', authMiddleware, roleMiddleware(['student']), ctrl.createReview);
router.put('/:id', authMiddleware, roleMiddleware(['student']), ctrl.updateReview);
router.delete('/:id', authMiddleware, roleMiddleware(['student', 'admin']), ctrl.deleteReview);

// Admin
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), ctrl.getAllReviews);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin']), ctrl.updateReviewStatus);

module.exports = router;