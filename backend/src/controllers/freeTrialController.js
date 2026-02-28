const { FreeTrialRequest } = require('../models');
const { notifyAdmins } = require('../services/notificationService');

// POST /api/v1/free-trial  — public, no auth needed
exports.create = async (req, res) => {
  try {
    const { fullName, email, phone, country, courseInterest, preferredSchedule, message } = req.body;

    if (!fullName || !email || !phone || !courseInterest) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, phone, and course interest are required.',
      });
    }

    const request = await FreeTrialRequest.create({
      fullName,
      email,
      phone,
      country: country || null,
      courseInterest,
      preferredSchedule: preferredSchedule || null,
      message: message || null,
      status: 'pending',
    });

    // Notify all admins about the new free trial request
    notifyAdmins({
      type: 'general',
      title: 'New Free Trial Request',
      message: `${fullName} (${email}) has submitted a free trial request for "${courseInterest}".`,
      actionUrl: '/admin/admin-dashboard',
    });

    res.status(201).json({
      success: true,
      message: 'Free trial request submitted successfully. Our staff will contact you soon.',
      data: { id: request.id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/free-trial  — admin only
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;

    const { count, rows } = await FreeTrialRequest.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/v1/free-trial/:id/status  — admin only
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'contacted', 'enrolled', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const request = await FreeTrialRequest.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    await request.update({ status });

    res.json({ success: true, message: 'Status updated.', data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
