const { Course, User, Enrollment, Module, Lesson } = require('../models');
const { Op } = require('sequelize');
const { notifyAdmins } = require('../services/notificationService');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, price, level } = req.body;

    const course = await Course.create({
      instructorId: req.user.userId,
      title,
      description,
      category,
      price,
      level,
      status: 'pending_approval',
    });

    notifyAdmins({
      type: 'course_update',
      title: 'New Course Pending Approval',
      message: `A new course "${course.title}" has been submitted by an instructor and is awaiting your approval.`,
      actionUrl: '/admin/courses-list',
    });

    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, level, status } = req.query;
    const offset = (page - 1) * limit;

    const where = status === 'published' ? { status: 'published' } : {};
    if (category) where.category = category;
    if (level) where.level = level;

    const { count, rows } = await Course.findAndCountAll({
      where,
      include: [{ model: User, as: 'instructor', attributes: ['id', 'firstName', 'lastName'] }],
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

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: User, as: 'instructor', attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage', 'bio', 'designation'] },
        { model: Enrollment, as: 'enrollments', attributes: ['id', 'status'] },
        {
          model: Module, as: 'modules',
          include: [{ model: Lesson, as: 'lessons', order: [['order', 'ASC']] }],
          order: [['order', 'ASC']],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const data = course.toJSON();
    data.enrollmentCount = data.enrollments ? data.enrollments.length : 0;

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await course.update(req.body);
    res.json({
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const courseTitle = course.title;
    await course.destroy();

    notifyAdmins({
      type: 'course_update',
      title: 'Course Deleted',
      message: `Course "${courseTitle}" was deleted.`,
      actionUrl: '/admin/courses-list',
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.publishCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await course.update({ status: 'published' });

    notifyAdmins({
      type: 'course_update',
      title: 'Course Published',
      message: `Course "${course.title}" is now live and published.`,
      actionUrl: '/admin/courses-list',
    });

    res.json({
      message: 'Course published successfully',
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseStats = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const enrollmentCount = await Enrollment.count({
      where: { courseId: req.params.id },
    });

    const completedCount = await Enrollment.count({
      where: { courseId: req.params.id, status: 'completed' },
    });

    res.json({
      totalEnrollments: enrollmentCount,
      completedEnrollments: completedCount,
      completionRate: ((completedCount / enrollmentCount) * 100).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchCourses = async (req, res) => {
  try {
    const { query, category } = req.query;

    const where = {
      status: 'published',
      [Op.or]: [
        { title: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
      ],
    };

    if (category) where.category = category;

    const courses = await Course.findAll({
      where,
      include: [{ model: User, as: 'instructor', attributes: ['id', 'firstName', 'lastName'] }],
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
