const express = require('express');
const multer = require('multer');
const router = express.Router();
const ctrl = require('../controllers/instructorApplicationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const adminOnly = [authMiddleware, roleMiddleware('admin')];

const CV_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const uploadCv = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = '.' + file.originalname.split('.').pop().toLowerCase();
    if (CV_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, or DOCX files are allowed'), false);
    }
  },
});

// Public — submit application (no auth required)
router.post('/', uploadCv.single('cv'), ctrl.submitApplication);

// Admin only
router.get('/',          adminOnly, ctrl.getApplications);
router.get('/:id',       adminOnly, ctrl.getApplicationById);
router.patch('/:id/approve', adminOnly, ctrl.approveApplication);
router.patch('/:id/reject',  adminOnly, ctrl.rejectApplication);
router.delete('/:id',    adminOnly, ctrl.deleteApplication);

module.exports = router;