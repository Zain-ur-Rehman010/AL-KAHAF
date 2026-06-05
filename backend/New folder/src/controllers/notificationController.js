const { Notification, User } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/v1/notifications
 * Get notifications for the logged-in user
 */
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const parsedLimit = parseInt(limit);
    const offset = (parseInt(page) - 1) * parsedLimit;

    const where = { userId: req.user.userId };
    if (unreadOnly === 'true') where.isRead = false;

    const { count, rows } = await Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parsedLimit,
      offset,
    });

    const unreadCount = await Notification.count({
      where: { userId: req.user.userId, isRead: false },
    });

    res.json({
      success: true,
      data: rows,
      unreadCount,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parsedLimit,
        pages: Math.ceil(count / parsedLimit),
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/v1/notifications/:id/read
 * Mark a single notification as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.update({ isRead: true, readAt: new Date() });

    res.json({ success: true, message: 'Marked as read', data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/v1/notifications/read-all
 * Mark all notifications as read for the logged-in user
 */
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true, readAt: new Date() },
      { where: { userId: req.user.userId, isRead: false } }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/v1/notifications/:id
 * Delete a notification
 */
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.destroy();
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/v1/notifications  (Admin only)
 * Create a notification for a user
 */
exports.createNotification = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { userId, type, title, message, actionUrl, data } = req.body;

    const notification = await Notification.create({
      userId,
      type: type || 'general',
      title,
      message,
      actionUrl: actionUrl || null,
      data: data || null,
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
