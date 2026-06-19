const { Contact } = require('../models');
const emailService = require('../services/emailService');
const { notifyAdmins } = require('../services/notificationService');

// POST /api/v1/contact — public
exports.submit = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // Save to database
    await Contact.create({ name, email, phone: phone || null, subject: subject || null, message });

    // Notify admins in-app
    try {
      notifyAdmins({
        type: 'general',
        title: 'New Contact Us Message',
        message: `${name} (${email}) sent a message: "${subject || 'No subject'}"`,
        actionUrl: '/admin/admin-dashboard',
      });
    } catch (_) {}

    // Send email notification to admin if email service is configured
    try {
      await emailService.sendContactFormEmail({ name, email, phone, subject, message });
    } catch (emailErr) {
      console.error('Contact form email error:', emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Your message has been received. We will get back to you shortly.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/contact — admin only
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Contact.findAndCountAll({
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

// PATCH /api/v1/contact/:id/status — admin only
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Not found.' });
    await contact.update({ status });
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
