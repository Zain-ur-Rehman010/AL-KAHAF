const { Enrollment, Course, User, Payment, Certificate } = require('../models');
const crypto = require('crypto');

exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({
      where: { studentId: req.user.id, courseId },
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      studentId: req.user.id,
      courseId,
      status: 'enrolled',
      paymentStatus: course.price === 0 ? 'completed' : 'pending',
    });

    await course.increment('enrollmentCount');

    res.status(201).json({
      message: 'Enrolled successfully',
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const where = { studentId: req.user.id };
    if (status) where.status = status;

    const { count, rows } = await Enrollment.findAndCountAll({
      where,
      include: [
        { model: Course, as: 'course' },
        { model: User, as: 'student' },
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      enrollments: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.enrollmentId, {
      include: [
        { model: Course, as: 'course' },
        { model: User, as: 'student' },
        { model: Certificate, as: 'certificate' },
      ],
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.studentId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const enrollment = await Enrollment.findByPk(req.params.enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.studentId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    let newStatus = enrollment.status;
    if (progress >= 100) {
      newStatus = 'completed';
    } else if (progress > 0) {
      newStatus = 'in_progress';
    }

    await enrollment.update({
      progress: Math.min(progress, 100),
      status: newStatus,
      completionDate: newStatus === 'completed' ? new Date() : null,
    });

    res.json({
      message: 'Progress updated',
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.dropCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.studentId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await enrollment.update({ status: 'dropped' });

    res.json({ message: 'Dropped course successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseEnrollments = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const enrollments = await Enrollment.findAll({
      where: { courseId: req.params.courseId },
      include: [{ model: User, as: 'student' }],
    });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.issueCertificate = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.enrollmentId, {
      include: { model: Course, as: 'course' },
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.status !== 'completed') {
      return res.status(400).json({ message: 'Course not completed' });
    }

    const existingCertificate = await Certificate.findOne({
      where: { enrollmentId: req.params.enrollmentId },
    });

    if (existingCertificate) {
      return res.status(400).json({ message: 'Certificate already issued' });
    }

    const verificationCode = crypto.randomBytes(16).toString('hex');

    const certificate = await Certificate.create({
      enrollmentId: enrollment.id,
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      verificationCode,
      status: 'issued',
    });

    await enrollment.update({ certificateIssued: true });

    res.status(201).json({
      message: 'Certificate issued',
      certificate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
