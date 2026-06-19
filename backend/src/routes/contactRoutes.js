const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// POST /api/v1/contact — public
router.post('/', contactController.submit);

// GET /api/v1/contact — admin only
router.get('/', authMiddleware, roleMiddleware(['admin']), contactController.getAll);

// PATCH /api/v1/contact/:id/status — admin only
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin']), contactController.updateStatus);

module.exports = router;
