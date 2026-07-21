const { Op } = require('sequelize');
const Announcement = require('../models/Announcement');

exports.getActiveAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOne({
      where: {
        isActive: true,
        [Op.or]: [
          { expiresAt: null },
          { expiresAt: { [Op.gt]: new Date() } },
        ],
      },
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, announcement: announcement || null });
  } catch (err) {
    console.error('getActiveAnnouncement error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Announcement.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({ success: true, total: count, announcements: rows });
  } catch (err) {
    console.error('getAnnouncements error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { message, imageUrl, linkUrl, linkText, style, isActive, expiresAt } = req.body;
    if (!message && !imageUrl) {
      return res.status(400).json({ success: false, message: 'Either a message or an image is required' });
    }

    const announcement = await Announcement.create({
      message: message || null,
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
      linkText: linkText || 'Learn More',
      style: style || 'info',
      isActive: !!isActive,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({ success: true, announcement });
  } catch (err) {
    console.error('createAnnouncement error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });

    const allowed = ['message', 'imageUrl', 'linkUrl', 'linkText', 'style', 'isActive', 'expiresAt'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) announcement[key] = req.body[key];
    }

    await announcement.save();
    res.json({ success: true, announcement });
  } catch (err) {
    console.error('updateAnnouncement error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });

    await announcement.destroy();
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (err) {
    console.error('deleteAnnouncement error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
