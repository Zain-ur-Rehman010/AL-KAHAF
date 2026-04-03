const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { FreeTrialRequest, User, Course, Enrollment } = require('../models');
const { notifyAdmins, notifyUser } = require('../services/notificationService');
const emailService = require('../services/emailService');
const config = require('../config/config');

const TRIAL_DURATION_HOURS = 72;

// GET /api/v1/free-trial/courses  — public, returns active predefined courses for the dropdown
exports.getPublicCourses = async (req, res) => {
  try {
    const { PredefinedCourse } = require('../models');
    const courses = await PredefinedCourse.findAll({
      where: { isActive: true },
      attributes: ['id', 'courseName', 'category'],
      order: [['category', 'ASC'], ['courseName', 'ASC']],
    });
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/free-trial  — public, no auth needed
exports.create = async (req, res) => {
  try {
    const { fullName, email, phone, password, country, courseInterest, preferredSchedule, message } = req.body;

    if (!fullName || !email || !phone || !courseInterest || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, phone, password, and course interest are required.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    // Block if any active (pending/contacted) or already-used request exists for this email/phone
    const existing = await FreeTrialRequest.findOne({
      where: {
        [Op.or]: [
          { email: email.toLowerCase().trim(), status: { [Op.in]: ['pending', 'contacted'] } },
          { email: email.toLowerCase().trim(), trialUsed: true },
          { phone: phone.trim(), trialUsed: true },
        ],
      },
    });
    if (existing) {
      const message =
        existing.trialUsed
          ? 'You have already availed your free trial demo.'
          : 'A free trial request for this email is already pending review.';
      return res.status(409).json({ success: false, code: 'TRIAL_ALREADY_USED', message });
    }

    // Hash password before storing — never persist plaintext credentials
    const hashedPassword = await bcrypt.hash(password, 10);

    const request = await FreeTrialRequest.create({
      fullName,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      country: country || null,
      courseInterest,
      preferredSchedule: preferredSchedule || null,
      message: message || null,
      status: 'pending',
    });

    // Notify all admins about the new free trial request
    try {
      notifyAdmins({
        type: 'general',
        title: 'New Free Trial Request',
        message: `${fullName} (${email}) has submitted a free trial request for "${courseInterest}".`,
        actionUrl: '/admin/admin-dashboard',
      });
    } catch (_) {}

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
      // Never return password hash to API consumers
      attributes: { exclude: ['password'] },
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

    // When admin approves — create account, enroll, send email
    if (status === 'enrolled') {
      try {
        const loginUrl = `${config.frontendUrl}/src/pages/auth/login.html`;
        const nameParts = request.fullName.trim().split(/\s+/);
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || firstName;

        // Find or create user account
        let user = await User.findOne({ where: { email: request.email } });

        const trialStartedAt = new Date();
        const trialExpiresAt = new Date(trialStartedAt.getTime() + TRIAL_DURATION_HOURS * 60 * 60 * 1000);

        if (!user) {
          // Password stored in FreeTrialRequest is already bcrypt-hashed — skip the User beforeCreate hook
          // to prevent double-hashing
          user = await User.create({
            firstName,
            lastName,
            email: request.email,
            phone: request.phone || null,
            password: request.password,
            role: 'student',
            status: 'active',
            emailVerified: true,
            isTrial: true,
            trialStartedAt,
            trialExpiresAt,
            trialEmailsSent: 0,
          }, { hooks: false });
        } else {
          // Existing user — activate trial
          await user.update({
            isTrial: true,
            trialStartedAt,
            trialExpiresAt,
            trialEmailsSent: 0,
          });
        }

        // Find matching course by title (case-insensitive, partial match)
        const course = await Course.findOne({
          where: {
            title: { [Op.like]: `%${request.courseInterest}%` },
            status: 'published',
          },
        });

        if (course) {
          await Enrollment.findOrCreate({
            where: { studentId: user.id, courseId: course.id },
            defaults: {
              studentId: user.id,
              courseId: course.id,
              status: 'enrolled',
              paymentStatus: 'completed',
            },
          });

          // Store course reference for reminder emails
          await user.update({ trialCourseId: course.id });

          // Notify the user in-app
          try {
            notifyUser(user.id, {
              type: 'general',
              title: 'Free Trial Approved',
              message: `Your free trial request for "${request.courseInterest}" has been approved. You now have access to the course.`,
              actionUrl: '/src/pages/student/student-courses.html',
            });
          } catch (_) {}
        }

        // Mark the free trial request as used (prevents re-submission)
        await request.update({ trialUsed: true });

        // Send approval email
        await emailService.sendFreeTrialApprovedEmail(
          request.email,
          request.fullName,
          request.courseInterest,
          loginUrl,
          null,
        );
      } catch (enrollErr) {
        console.error('Free trial enrollment error:', enrollErr);
        // Non-blocking — status update already succeeded
      }
    }

    res.json({ success: true, message: 'Status updated.', data: { ...request.toJSON(), password: undefined } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};