const { Enrollment, Course, User, Payment } = require('../models');
const { buildPaymentParams, validateCallback } = require('../services/jazzcashService');
const emailService = require('../services/emailService');
const { notifyAdmins } = require('../services/notificationService');
const config = require('../config/config');

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
