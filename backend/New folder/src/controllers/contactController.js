const emailService = require('../services/emailService');
const { notifyAdmins } = require('../services/notificationService');

// POST /api/v1/contact
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
      // Non-blocking — still return success even if email fails
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