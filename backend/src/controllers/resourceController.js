const { Op } = require('sequelize');
const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status)   where.status   = status;
    if (category) where.category = category;
    if (search) where.title = { [Op.like]: `%${search}%` };

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Resource.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      total: count,
      resources: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (err) {
    console.error('getResources error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, resource });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { title, category, description, fileUrl, fileName, fileSize, fileType, thumbnail, status } = req.body;
    if (!title || !fileUrl) {
      return res.status(400).json({ success: false, message: 'title and fileUrl are required' });
    }

    const resource = await Resource.create({
      title,
      category: category || 'other',
      description: description || null,
      fileUrl,
      fileName: fileName || null,
      fileSize: fileSize || null,
      fileType: fileType || null,
      thumbnail: thumbnail || null,
      status: status || 'active',
      uploadedBy: req.user.userId,
    });

    res.status(201).json({ success: true, resource });
  } catch (err) {
    console.error('createResource error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    const allowed = ['title', 'category', 'description', 'fileUrl', 'fileName', 'fileSize', 'fileType', 'thumbnail', 'status'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) resource[key] = req.body[key];
    }

    await resource.save();
    res.json({ success: true, resource });
  } catch (err) {
    console.error('updateResource error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    await resource.destroy();
    res.json({ success: true, message: 'Resource deleted' });
  } catch (err) {
    console.error('deleteResource error:', err);
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ success: false, message: 'This resource is still referenced by other records and can\'t be deleted.' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.incrementDownload = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    await resource.increment('downloads');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
