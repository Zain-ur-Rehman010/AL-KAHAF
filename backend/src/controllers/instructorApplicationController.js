const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const InstructorApplication = require('../models/InstructorApplication');
const User = require('../models/User');
const emailService = require('../services/emailService');

function uploadCvToCloudinary(file) {
  const ext = '.' + file.originalname.split('.').pop().toLowerCase();
  const baseName = file.originalname
    .slice(0, -ext.length)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 80) || 'cv';
  const publicId = `${baseName}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'alkahaf/instructor-cvs', resource_type: 'raw', public_id: publicId },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}

// ── Public: Submit application ────────────────────────────────────────────────
exports.submitApplication = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, specialization, experience, motivation, linkedinUrl } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, message: 'First name, last name and email are required.' });
    }

    // Prevent duplicate pending applications
    const existing = await InstructorApplication.findOne({ where: { email, status: 'pending' } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An application with this email is already pending review.' });
    }

    let cvUrl = null;
    if (req.file) {
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
        return res.status(500).json({ success: false, message: 'File upload is not configured on the server.' });
      }
      try {
        const result = await uploadCvToCloudinary(req.file);
        cvUrl = result.secure_url;
      } catch (err) {
        console.error('CV upload error:', err);
        return res.status(500).json({ success: false, message: 'CV upload failed. Please try again.' });
      }
    }

    const application = await InstructorApplication.create({
      firstName, lastName, email, phone,
      specialization, experience, motivation, linkedinUrl, cvUrl,
    });

    // Non-blocking: notify admins
    try {
      const { notifyAdmins } = require('../services/notificationService');
      await notifyAdmins(
        'new_instructor_application',
        'New Instructor Application',
        `${firstName} ${lastName} (${email}) has applied to become an instructor.`,
        { applicationId: application.id }
      );
    } catch (_) {}

    res.status(201).json({ success: true, message: 'Application submitted successfully. We will contact you soon.' });
  } catch (err) {
    console.error('submitApplication error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── Admin: Get all applications ───────────────────────────────────────────────
exports.getApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await InstructorApplication.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({ success: true, total: count, applications: rows });
  } catch (err) {
    console.error('getApplications error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Admin: Get single application ─────────────────────────────────────────────
exports.getApplicationById = async (req, res) => {
  try {
    const app = await InstructorApplication.findByPk(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Generates a cryptographically strong random password
function generateStrongPassword() {
  const upper   = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower   = 'abcdefghjkmnpqrstuvwxyz';
  const digits  = '23456789';
  const special = '!@#$%&*';
  const all     = upper + lower + digits + special;
  // Guarantee at least one of each character class
  let pwd =
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    digits[Math.floor(Math.random() * digits.length)] +
    special[Math.floor(Math.random() * special.length)];
  for (let i = 4; i < 14; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  // Shuffle so the guaranteed chars aren't always at the start
  return pwd.split('').sort(() => Math.random() - 0.5).join('');
}

// ── Admin: Approve — creates or upgrades instructor user account ──────────────
exports.approveApplication = async (req, res) => {
  try {
    const application = await InstructorApplication.findByPk(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Application already approved.' });
    }

    const { adminNote } = req.body;
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/auth/login`;

    // Check if a user with this email already exists
    let user = await User.findOne({ where: { email: application.email } });
    let plainPassword = null; // only set for newly created accounts

    if (user) {
      // Existing user — upgrade role only, keep their password
      user.role = 'instructor';
      if (application.specialization) user.specialization = application.specialization;
      await user.save();
    } else {
      // New user — generate strong password and create account
      // NOTE: do NOT hash here — the User model's beforeCreate hook hashes automatically
      plainPassword = generateStrongPassword();
      user = await User.create({
        firstName:      application.firstName,
        lastName:       application.lastName,
        email:          application.email,
        phone:          application.phone || '',
        password:       plainPassword,
        role:           'instructor',
        status:         'active',
        emailVerified:  false,   // must verify email via OTP on first login
        specialization: application.specialization || '',
      });
    }

    application.status    = 'approved';
    application.adminNote = adminNote || null;
    application.userId    = user.id;
    await application.save();

    // Send approval email with credentials (non-blocking)
    try {
      await emailService.sendInstructorApprovalEmail(
        user.email,
        user.firstName,
        loginUrl,
        plainPassword   // null for existing users → email shows "use your existing credentials"
      );
    } catch (_) {}

    // In-app notification (non-blocking)
    try {
      const { notifyUser } = require('../services/notificationService');
      await notifyUser(
        user.id,
        'instructor_approved',
        'Application Approved!',
        'Congratulations! Your instructor application has been approved. Check your email for login details.',
        {}
      );
    } catch (_) {}

    res.json({ success: true, message: 'Application approved. Approval email sent to instructor.', userId: user.id });
  } catch (err) {
    console.error('approveApplication error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Admin: Reject ─────────────────────────────────────────────────────────────
exports.rejectApplication = async (req, res) => {
  try {
    const application = await InstructorApplication.findByPk(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    application.status    = 'rejected';
    application.adminNote = req.body.adminNote || null;
    await application.save();

    res.json({ success: true, message: 'Application rejected.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Admin: Delete ─────────────────────────────────────────────────────────────
exports.deleteApplication = async (req, res) => {
  try {
    const application = await InstructorApplication.findByPk(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    await application.destroy();
    res.json({ success: true, message: 'Application deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};