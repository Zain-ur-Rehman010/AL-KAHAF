const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/instructorApplicationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const adminOnly = [authMiddleware, roleMiddleware('admin')];

// Public — submit application (no auth required)
router.post('/', ctrl.submitApplication);

// Admin only
router.get('/',          adminOnly, ctrl.getApplications);
router.get('/:id',       adminOnly, ctrl.getApplicationById);
router.patch('/:id/approve', adminOnly, ctrl.approveApplication);
router.patch('/:id/reject',  adminOnly, ctrl.rejectApplication);
router.delete('/:id',    adminOnly, ctrl.deleteApplication);

module.exports = router;