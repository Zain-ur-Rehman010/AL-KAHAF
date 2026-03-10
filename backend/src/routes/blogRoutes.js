const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

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

// Note: Blog image upload moved to POST /api/v1/upload?folder=blogs

// POST /api/v1/blogs
router.post('/', authMiddleware, roleMiddleware(['admin']), blogController.createBlog);

// PUT /api/v1/blogs/:id
router.put('/:id', authMiddleware, roleMiddleware(['admin']), blogController.updateBlog);

// PATCH /api/v1/blogs/:id/toggle-publish
router.patch('/:id/toggle-publish', authMiddleware, roleMiddleware(['admin']), blogController.togglePublish);

// DELETE /api/v1/blogs/:id
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), blogController.deleteBlog);

module.exports = router;