const express = require('express');
const router = express.Router();
const welfareController = require('../controllers/welfareController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const adminOnly = [authMiddleware, roleMiddleware('admin')];

// Public — programs list (for frontend welfare page)
router.get('/programs', welfareController.getPrograms);
router.get('/programs/:id', welfareController.getProgramById);

// Public — submit a donation (from welfare-program-detail.html checkout)
router.post('/donations', welfareController.createDonation);

// Admin only
router.post('/programs',          adminOnly, welfareController.createProgram);
router.put('/programs/:id',       adminOnly, welfareController.updateProgram);
router.delete('/programs/:id',    adminOnly, welfareController.deleteProgram);
router.get('/donations',          adminOnly, welfareController.getDonations);
router.patch('/donations/:id/status', adminOnly, welfareController.updateDonationStatus);
router.get('/stats',              adminOnly, welfareController.getWelfareStats);

module.exports = router;