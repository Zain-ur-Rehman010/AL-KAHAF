const express = require('express');
const router = express.Router();
const path = require('path');
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// ── PUBLIC ────────────────────────────────────────────────────────────────
// GET /api/v1/blogs?page=1&limit=3&category=Arabic
router.get('/', blogController.getBlogs);

// GET /api/v1/blogs/slug/:slug
router.get('/slug/:slug', blogController.getBlogBySlug);

// ── ADMIN ONLY ────────────────────────────────────────────────────────────
// GET /api/v1/blogs/admin/all
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), blogController.getAllBlogsAdmin);

// GET /api/v1/blogs/admin/:id
router.get('/admin/:id', authMiddleware, roleMiddleware(['admin']), blogController.getBlogById);

// POST /api/v1/blogs/upload-image  (image upload, returns URL)
router.post(
  '/upload-image',
  authMiddleware,
  roleMiddleware(['admin']),
  upload.single('image'),
  (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = '/uploads/blog/' + req.file.filename;
    res.json({ success: true, url });
  }
);

// POST /api/v1/blogs
router.post('/', authMiddleware, roleMiddleware(['admin']), blogController.createBlog);

// PUT /api/v1/blogs/:id
router.put('/:id', authMiddleware, roleMiddleware(['admin']), blogController.updateBlog);

// PATCH /api/v1/blogs/:id/toggle-publish
router.patch('/:id/toggle-publish', authMiddleware, roleMiddleware(['admin']), blogController.togglePublish);

// DELETE /api/v1/blogs/:id
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), blogController.deleteBlog);

module.exports = router;