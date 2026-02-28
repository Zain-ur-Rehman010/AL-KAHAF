const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const freeTrialController = require('../controllers/freeTrialController');

// POST — public, anyone can submit
router.post('/', freeTrialController.create);

// GET all requests — admin only
router.get('/', authMiddleware, roleMiddleware(['admin']), freeTrialController.getAll);

// PATCH status — admin only
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin']), freeTrialController.updateStatus);

module.exports = router;
