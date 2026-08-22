const fs = require('fs');
const path = require('path');
const { Enrollment, Course, User, Payment } = require('../models');
const { buildPaymentParams, validateCallback } = require('../services/jazzcashService');
const emailService = require('../services/emailService');
const { notifyAdmins, notifyUser } = require('../services/notificationService');
const config = require('../config/config');

const SETTINGS_FILE = path.join(__dirname, '../settings.json');
function readSettings() {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

// POST /api/v1/payments/jazzcash/initiate
exports.initiateJazzCash = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (course.price === 0) {
      return res.status(400).json({ success: false, message: 'This course is free. Use the enroll endpoint directly.' });
    }

    const existingEnrollment = await Enrollment.findOne({
      where: { studentId: req.user.userId, courseId },
    });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    const txnRefNo = 'T' + Date.now();
    const returnUrl = `${config.frontendUrl.replace('3001', '5000').replace('3000', '5000')}/api/v1/payments/jazzcash/callback`;

    const { paymentUrl, params } = buildPaymentParams({
      txnRefNo,
      amount: parseFloat(course.price),
      billRef: courseId.replace(/-/g, '').substring(0, 20),
      description: `Enrollment: ${course.title}`.substring(0, 100),
      returnUrl,
    });

    // Store pending payment intent in a temp Enrollment
    const enrollment = await Enrollment.create({
      studentId: req.user.userId,
      courseId,
      status: 'enrolled',
      paymentStatus: 'pending',
    });

    await Payment.create({
      enrollmentId: enrollment.id,
      studentId: req.user.userId,
      courseId,
      amount: course.price,
      currency: 'PKR',
      status: 'pending',
      paymentMethod: 'jazzcash',
      transactionId: txnRefNo,
    });

    res.json({
      success: true,
      paymentUrl,
      params,
      txnRefNo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/payments/jazzcash/callback  (JazzCash posts here after payment)
exports.jazzcashCallback = async (req, res) => {
  try {
    const postData = req.body;
    const isValid = validateCallback(postData);

    const txnRefNo = postData.pp_TxnRefNo;
    const payment = await Payment.findOne({ where: { transactionId: txnRefNo } });

    if (!payment) {
      return res.redirect(`${config.frontendUrl}/student/my-courses?payment=failed`);
    }

    if (!isValid) {
      await payment.update({ status: 'failed' });
      await Enrollment.update({ paymentStatus: 'failed' }, { where: { id: payment.enrollmentId } });
      return res.redirect(`${config.frontendUrl}/student/my-courses?payment=failed`);
    }

    // Payment successful — update records
    await payment.update({
      status: 'completed',
      paymentDate: new Date(),
    });

    const enrollment = await Enrollment.findByPk(payment.enrollmentId);
    await enrollment.update({ paymentStatus: 'completed' });

    const course = await Course.findByPk(payment.courseId);
    await course.increment('enrollmentCount');

    const student = await User.findByPk(payment.studentId);

    // Notify admins in-app
    notifyAdmins({
      type: 'enrollment_confirmation',
      title: 'New Paid Enrollment (JazzCash)',
      message: `${student.firstName} ${student.lastName} enrolled in "${course.title}" via JazzCash. Amount: PKR ${payment.amount}`,
      actionUrl: '/admin/enrollments-list',
    });

    // Email all admins
    const admins = await User.findAll({ where: { role: 'admin', status: 'active' } });
    const adminEmails = admins.map((a) => a.email);
    if (adminEmails.length > 0) {
      emailService.sendAdminEnrollmentEmail(
        adminEmails,
        `${student.firstName} ${student.lastName}`,
        student.email,
        course.title,
        payment.amount,
        txnRefNo
      );
    }

    res.redirect(`${config.frontendUrl}/student/my-courses?payment=success&course=${encodeURIComponent(course.title)}`);
  } catch (error) {
    console.error('JazzCash callback error:', error);
    res.redirect(`${config.frontendUrl}/student/my-courses?payment=failed`);
  }
};

// GET /api/v1/payments/admin/all — full payment history for admin, any method/status
exports.getAllPayments = async (req, res) => {
  try {
    const { status, paymentMethod } = req.query;
    const where = {};
    if (status) where.status = status;
    if (paymentMethod) where.paymentMethod = paymentMethod;

    const payments = await Payment.findAll({
      where,
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title', 'price'] },
        { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/payments/my-payments
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { studentId: req.user.userId },
      include: [{ model: Course, as: 'course' }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Bank Transfer ──────────────────────────────────────────────────────────

// GET /api/v1/payments/bank-details — public, shown on checkout
exports.getBankDetails = (req, res) => {
  const s = readSettings();
  res.json({
    success: true,
    data: {
      enabled: !!s.bankTransferEnabled,
      accountTitle: s.bankAccountTitle || '',
      bankName: s.bankName || '',
      accountNumber: s.bankAccountNumber || '',
      iban: s.bankIban || '',
      branchCode: s.bankBranchCode || '',
    },
  });
};

// POST /api/v1/payments/bank-transfer/submit — student submits proof of transfer for review
exports.submitBankTransfer = async (req, res) => {
  try {
    const { courseIds, fromBank, transactionRef, receiptUrl } = req.body;

    if (!Array.isArray(courseIds) || !courseIds.length) {
      return res.status(400).json({ success: false, message: 'No courses provided.' });
    }
    if (!transactionRef || !transactionRef.trim()) {
      return res.status(400).json({ success: false, message: 'Transaction reference is required.' });
    }

    const settings = readSettings();
    if (!settings.bankTransferEnabled) {
      return res.status(400).json({ success: false, message: 'Bank transfer is not currently available.' });
    }

    const student = await User.findByPk(req.user.userId);
    const created = [];

    for (const courseId of courseIds) {
      const course = await Course.findByPk(courseId);
      if (!course) continue;

      const existingEnrollment = await Enrollment.findOne({
        where: { studentId: req.user.userId, courseId },
      });
      if (existingEnrollment) continue;

      const enrollment = await Enrollment.create({
        studentId: req.user.userId,
        courseId,
        status: 'enrolled',
        paymentStatus: 'pending',
      });

      const payment = await Payment.create({
        enrollmentId: enrollment.id,
        studentId: req.user.userId,
        courseId,
        amount: course.price,
        currency: 'PKR',
        status: 'pending',
        paymentMethod: 'bank_transfer',
        // transactionId is unique — one shared reference can cover several
        // courses in a single cart, so suffix it per course to avoid collisions
        transactionId: `${transactionRef.trim()}-${courseId.slice(0, 8)}`,
        receiptUrl: receiptUrl || null,
      });

      created.push(payment);
    }

    if (!created.length) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in the selected course(s), or none were found.' });
    }

    notifyAdmins({
      type: 'general',
      title: 'New Bank Transfer Submitted',
      message: `${student.firstName} ${student.lastName} (${student.email}) submitted a bank transfer${fromBank ? ' from ' + fromBank : ''} for review.`,
      actionUrl: '/admin/bank-transfers',
    });

    res.status(201).json({
      success: true,
      message: 'Submitted for review. You will be notified once an admin verifies your payment.',
    });
  } catch (error) {
    console.error('submitBankTransfer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/payments/admin/bank-transfers — admin list, filterable by status
exports.getPendingBankTransfers = async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const where = { paymentMethod: 'bank_transfer' };
    if (status !== 'all') where.status = status;

    const payments = await Payment.findAll({
      where,
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title', 'price'] },
        { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/v1/payments/:id/approve-bank-transfer
exports.approveBankTransfer = async (req, res) => {
  try {
    const payment = await Payment.findOne({ where: { id: req.params.id, paymentMethod: 'bank_transfer' } });
    if (!payment) return res.status(404).json({ success: false, message: 'Bank transfer payment not found.' });
    if (payment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Already approved.' });
    }

    await payment.update({ status: 'completed', paymentDate: new Date() });
    await Enrollment.update({ paymentStatus: 'completed' }, { where: { id: payment.enrollmentId } });

    const course = await Course.findByPk(payment.courseId);
    if (course) await course.increment('enrollmentCount');

    notifyUser(payment.studentId, {
      type: 'enrollment_confirmation',
      title: 'Bank Transfer Approved',
      message: `Your bank transfer for "${course ? course.title : 'your course'}" has been verified. You now have full access.`,
      actionUrl: '/student/student-courses',
    });

    res.json({ success: true, message: 'Bank transfer approved and student enrolled.' });
  } catch (error) {
    console.error('approveBankTransfer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/v1/payments/:id/reject-bank-transfer
exports.rejectBankTransfer = async (req, res) => {
  try {
    const payment = await Payment.findOne({ where: { id: req.params.id, paymentMethod: 'bank_transfer' } });
    if (!payment) return res.status(404).json({ success: false, message: 'Bank transfer payment not found.' });

    const { reason } = req.body;
    await payment.update({ status: 'failed' });
    await Enrollment.update({ paymentStatus: 'failed' }, { where: { id: payment.enrollmentId } });

    const course = await Course.findByPk(payment.courseId);
    notifyUser(payment.studentId, {
      type: 'general',
      title: 'Bank Transfer Rejected',
      message: `Your bank transfer for "${course ? course.title : 'your course'}" could not be verified.${reason ? ' Reason: ' + reason : ' Please contact support or try again.'}`,
      actionUrl: '/shared/checkout',
    });

    res.json({ success: true, message: 'Bank transfer rejected.' });
  } catch (error) {
    console.error('rejectBankTransfer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── JazzCash / Easypaisa Wallet Transfer (manual, scan-and-pay QR) ─────────
// This is distinct from the automated JazzCash gateway above — here the
// student scans a fixed personal-account QR code and manually submits proof,
// same review flow as bank transfer.

// POST /api/v1/payments/wallet-transfer/submit
exports.submitWalletTransfer = async (req, res) => {
  try {
    const { courseIds, transactionRef, receiptUrl } = req.body;

    if (!Array.isArray(courseIds) || !courseIds.length) {
      return res.status(400).json({ success: false, message: 'No courses provided.' });
    }
    if (!transactionRef || !transactionRef.trim()) {
      return res.status(400).json({ success: false, message: 'Transaction ID / reference is required.' });
    }

    const student = await User.findByPk(req.user.userId);
    const created = [];

    for (const courseId of courseIds) {
      const course = await Course.findByPk(courseId);
      if (!course) continue;

      const existingEnrollment = await Enrollment.findOne({
        where: { studentId: req.user.userId, courseId },
      });
      if (existingEnrollment) continue;

      const enrollment = await Enrollment.create({
        studentId: req.user.userId,
        courseId,
        status: 'enrolled',
        paymentStatus: 'pending',
      });

      const payment = await Payment.create({
        enrollmentId: enrollment.id,
        studentId: req.user.userId,
        courseId,
        amount: course.price,
        currency: 'PKR',
        status: 'pending',
        paymentMethod: 'wallet_transfer',
        // transactionId is unique — one shared reference can cover several
        // courses in a single cart, so suffix it per course to avoid collisions
        transactionId: `${transactionRef.trim()}-${courseId.slice(0, 8)}`,
        receiptUrl: receiptUrl || null,
      });

      created.push(payment);
    }

    if (!created.length) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in the selected course(s), or none were found.' });
    }

    notifyAdmins({
      type: 'general',
      title: 'New JazzCash/Easypaisa Transfer Submitted',
      message: `${student.firstName} ${student.lastName} (${student.email}) submitted a JazzCash/Easypaisa transfer for review.`,
      actionUrl: '/admin/bank-transfers',
    });

    res.status(201).json({
      success: true,
      message: 'Submitted for review. You will be notified once an admin verifies your payment.',
    });
  } catch (error) {
    console.error('submitWalletTransfer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/payments/admin/wallet-transfers — admin list, filterable by status
exports.getPendingWalletTransfers = async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const where = { paymentMethod: 'wallet_transfer' };
    if (status !== 'all') where.status = status;

    const payments = await Payment.findAll({
      where,
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title', 'price'] },
        { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/v1/payments/:id/approve-wallet-transfer
exports.approveWalletTransfer = async (req, res) => {
  try {
    const payment = await Payment.findOne({ where: { id: req.params.id, paymentMethod: 'wallet_transfer' } });
    if (!payment) return res.status(404).json({ success: false, message: 'Wallet transfer payment not found.' });
    if (payment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Already approved.' });
    }

    await payment.update({ status: 'completed', paymentDate: new Date() });
    await Enrollment.update({ paymentStatus: 'completed' }, { where: { id: payment.enrollmentId } });

    const course = await Course.findByPk(payment.courseId);
    if (course) await course.increment('enrollmentCount');

    notifyUser(payment.studentId, {
      type: 'enrollment_confirmation',
      title: 'JazzCash/Easypaisa Transfer Approved',
      message: `Your payment for "${course ? course.title : 'your course'}" has been verified. You now have full access.`,
      actionUrl: '/student/student-courses',
    });

    res.json({ success: true, message: 'Wallet transfer approved and student enrolled.' });
  } catch (error) {
    console.error('approveWalletTransfer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/v1/payments/:id/reject-wallet-transfer
exports.rejectWalletTransfer = async (req, res) => {
  try {
    const payment = await Payment.findOne({ where: { id: req.params.id, paymentMethod: 'wallet_transfer' } });
    if (!payment) return res.status(404).json({ success: false, message: 'Wallet transfer payment not found.' });

    const { reason } = req.body;
    await payment.update({ status: 'failed' });
    await Enrollment.update({ paymentStatus: 'failed' }, { where: { id: payment.enrollmentId } });

    const course = await Course.findByPk(payment.courseId);
    notifyUser(payment.studentId, {
      type: 'general',
      title: 'JazzCash/Easypaisa Transfer Rejected',
      message: `Your payment for "${course ? course.title : 'your course'}" could not be verified.${reason ? ' Reason: ' + reason : ' Please contact support or try again.'}`,
      actionUrl: '/shared/checkout',
    });

    res.json({ success: true, message: 'Wallet transfer rejected.' });
  } catch (error) {
    console.error('rejectWalletTransfer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
