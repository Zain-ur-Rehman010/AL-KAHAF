const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const adminOnly = [authMiddleware, roleMiddleware('admin')];

// Public
router.get('/', resourceController.getResources);
router.get('/:id', resourceController.getResourceById);
router.post('/:id/download', resourceController.incrementDownload);

// Admin only
router.post('/', adminOnly, resourceController.createResource);
router.put('/:id', adminOnly, resourceController.updateResource);
router.delete('/:id', adminOnly, resourceController.deleteResource);

module.exports = router;
