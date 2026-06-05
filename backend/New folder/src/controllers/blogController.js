const { Blog, User } = require('../models');
const { Op } = require('sequelize');

// ── Helper: generate slug from title ─────────────────────────────────────
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    + '-' + Date.now();
}

// ── PUBLIC: Get published blogs (with pagination) ─────────────────────────
exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { status: 'published' };
    if (category) where.category = category;

    const { count, rows } = await Blog.findAndCountAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'profileImage'] }],
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: {
        blogs: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUBLIC: Get single blog by slug ───────────────────────────────────────
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: { slug: req.params.slug, status: 'published' },
      include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'profileImage'] }],
    });

    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    // increment views
    await blog.increment('views');

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADMIN: Get all blogs (any status) ────────────────────────────────────
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const { count, rows } = await Blog.findAndCountAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: {
        blogs: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADMIN: Get single blog by ID ──────────────────────────────────────────
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName'] }],
    });

    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADMIN: Create blog ────────────────────────────────────────────────────
exports.createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, thumbnail, status, tags } = req.body;

    const slug = generateSlug(title);

    const blog = await Blog.create({
      authorId: req.user.userId,
      title,
      slug,
      excerpt,
      content,
      category: category || 'General',
      thumbnail,
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null,
      tags: tags || [],
    });

    res.status(201).json({ success: true, message: 'Blog created successfully', data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADMIN: Update blog ────────────────────────────────────────────────────
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    const { title, excerpt, content, category, thumbnail, status, tags } = req.body;

    const updates = { excerpt, content, category, thumbnail, tags };
    if (title) {
      updates.title = title;
      updates.slug = generateSlug(title);
    }
    if (status) {
      updates.status = status;
      if (status === 'published' && blog.status !== 'published') {
        updates.publishedAt = new Date();
      }
    }

    await blog.update(updates);
    res.json({ success: true, message: 'Blog updated successfully', data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADMIN: Delete blog ────────────────────────────────────────────────────
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    await blog.destroy();
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADMIN: Publish / Unpublish blog ──────────────────────────────────────
exports.togglePublish = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    await blog.update({
      status: newStatus,
      publishedAt: newStatus === 'published' ? new Date() : blog.publishedAt,
    });

    res.json({ success: true, message: `Blog ${newStatus}`, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};