const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const adminOnly = [authMiddleware, roleMiddleware('admin')];

// Public
router.get('/active', announcementController.getActiveAnnouncement);

// Admin only
router.get('/', adminOnly, announcementController.getAnnouncements);
router.post('/', adminOnly, announcementController.createAnnouncement);
router.put('/:id', adminOnly, announcementController.updateAnnouncement);
router.delete('/:id', adminOnly, announcementController.deleteAnnouncement);

module.exports = router;
