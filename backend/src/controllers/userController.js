const {
  User, Course, Enrollment, Payment, Notification, Certificate,
  Review, InstructorCourse, InstructorStudent, InstructorApplication, TrialEmailLog,
} = require('../models');
const { notifyAdmins } = require('../services/notificationService');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInstructors = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: { role: 'instructor', status: 'active' },
      attributes: { exclude: ['password'] },
      include: [{ model: Course, as: 'instructedCourses' }],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      instructors: rows,
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

exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const enrollmentCount = await Enrollment.count({
      where: { studentId: req.user.userId },
    });

    const completedCount = await Enrollment.count({
      where: { studentId: req.user.userId, status: 'completed' },
    });

    const instructedCourses = user.role === 'instructor'
      ? await Course.count({ where: { instructorId: req.user.userId } })
      : 0;

    res.json({
      totalEnrollments: enrollmentCount,
      completedEnrollments: completedCount,
      instructedCourses,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyInstructedCourses = async (req, res) => {
  try {
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only instructors can view taught courses' });
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = req.user.role === 'admin' ? {} : { instructorId: req.user.userId };

    const { count, rows } = await Course.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      courses: rows,
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

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { page = 1, limit = 10, role, status, emailVerified, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (emailVerified !== undefined && emailVerified !== '') where.emailVerified = emailVerified === 'true';
    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Enrollment,
          as: 'enrollments',
          attributes: ['id', 'progress', 'status'],
          required: false,
        },
      ],
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

    res.json({
      success: true,
      data: rows,
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

exports.updateUserStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { status, role, emailVerified } = req.body;
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = {};
    if (status !== undefined) {
      if (!['active', 'inactive', 'banned'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      updateData.status = status;
    }
    if (role !== undefined) {
      if (!['admin', 'instructor', 'student'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      updateData.role = role;
    }
    if (emailVerified !== undefined) {
      updateData.emailVerified = Boolean(emailVerified);
      // If admin marks unverified, clear any previous OTP to force fresh verification flow
      if (!updateData.emailVerified) {
        updateData.verificationOtp = null;
        updateData.otpExpiresAt = null;
      }
    }

    await user.update(updateData);

    notifyAdmins({
      type: 'general',
      title: 'User Status Updated',
      message: `${user.firstName} ${user.lastName}'s account was updated by admin.`,
      actionUrl: '/admin/users-list',
    });

    res.json({
      message: 'User status updated',
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userName = `${user.firstName} ${user.lastName}`;
    const uid = user.id;

    // Delete all related records before removing the user to avoid FK constraint errors.
    // Order matters: dependents of dependents first.
    await Enrollment.destroy({ where: { studentId: uid } });
    await Payment.destroy({ where: { studentId: uid } });
    await Certificate.destroy({ where: { studentId: uid } });
    await Review.destroy({ where: { userId: uid } });
    await Notification.destroy({ where: { userId: uid } });
    await InstructorStudent.destroy({ where: { studentId: uid } });
    await InstructorStudent.destroy({ where: { instructorId: uid } });
    await InstructorCourse.destroy({ where: { instructorId: uid } });
    if (TrialEmailLog) await TrialEmailLog.destroy({ where: { userId: uid } });
    if (InstructorApplication) await InstructorApplication.destroy({ where: { userId: uid } });
    // If instructor: delete their courses and related course enrollments first
    if (user.role === 'instructor') {
      const instructorCourses = await Course.findAll({ where: { instructorId: uid }, attributes: ['id'] });
      const courseIds = instructorCourses.map(c => c.id);
      if (courseIds.length) {
        await Enrollment.destroy({ where: { courseId: courseIds } });
        await Course.destroy({ where: { id: courseIds } });
      }
    }

    await user.destroy();

    notifyAdmins({
      type: 'general',
      title: 'User Deleted',
      message: `User "${userName}" (${user.email}) was deleted from the system.`,
      actionUrl: '/admin/users-list',
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
