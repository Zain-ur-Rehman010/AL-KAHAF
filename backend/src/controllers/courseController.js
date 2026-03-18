const { Course, User, Enrollment, Module, Lesson } = require('../models');
const { Op } = require('sequelize');
const { notifyAdmins, notifyUser } = require('../services/notificationService');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, detailedDescription, category, price, discountPrice, level, language, duration, thumbnail, learningOutcomes, outcomes, requirements, tags, faqs, isFeatured, certificateAvailable, maxStudents, accessDuration, visibility, instructorId } = req.body;
    const isAdminCreator = req.user.role === 'admin';
    const assignedInstructorId = instructorId || req.user.userId;
    const isAssignedToAnotherInstructor = Boolean(isAdminCreator && instructorId && instructorId !== req.user.userId);
    const initialStatus = isAssignedToAnotherInstructor ? 'draft' : 'pending_approval';

    const course = await Course.create({
      instructorId: assignedInstructorId,
      title,
      description,
      detailedDescription,
      category,
      price,
      discountPrice: discountPrice || null,
      level,
      language,
      duration,
      thumbnail,
      outcomes: outcomes || learningOutcomes,
      requirements,
      tags,
      faqs,
      isFeatured: isFeatured || false,
      certificateAvailable: certificateAvailable !== undefined ? certificateAvailable : true,
      maxStudents: maxStudents || null,
      accessDuration: accessDuration || null,
      visibility: visibility || 'public',
      status: initialStatus,
    });

    if (course.status === 'pending_approval') {
      notifyAdmins({
        type: 'course_update',
        title: 'New Course Pending Approval',
        message: `A new course "${course.title}" has been submitted by an instructor and is awaiting your approval.`,
        actionUrl: '/admin/courses-list',
      });
    }

    // If admin assigned this course to a specific instructor, notify them
    if (isAssignedToAnotherInstructor) {
      notifyUser(assignedInstructorId, {
        type: 'course_update',
        title: 'New Course Assigned to You',
        message: `Admin of Al-Kahaf Online Academy has assigned you the course "${course.title}". Please review it and add all course details including modules and lessons.`,
        actionUrl: `/instructor/course-edit?id=${course.id}`,
      });
    }

    res.status(201).json({
      message: isAssignedToAnotherInstructor
        ? 'Course assigned to instructor successfully'
        : 'Course created successfully',
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { instructorId: req.user.userId };
    if (status) where.status = status;

    const courses = await Course.findAll({
      where,
      include: [
        { model: Module, as: 'modules', attributes: ['id'], include: [{ model: Lesson, as: 'lessons', attributes: ['id'] }] },
        { model: Enrollment, as: 'enrollments', attributes: ['id'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const formatted = courses.map(c => ({
      id: c.id,
      title: c.title,
      thumbnail: c.thumbnail,
      category: c.category,
      level: c.level,
      price: c.price,
      status: c.status,
      createdAt: c.createdAt,
      totalModules: c.modules?.length || 0,
      totalLessons: c.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0,
      totalStudents: c.enrollments?.length || 0,
    }));

    // Stats counts
    const all = await Course.findAll({ where: { instructorId: req.user.userId }, attributes: ['status', 'price'] });
    const stats = {
      active: all.filter(c => c.status === 'published').length,
      pending: all.filter(c => c.status === 'pending_approval').length,
      draft: all.filter(c => c.status === 'draft').length,
      free: all.filter(c => c.price === 0).length,
      paid: all.filter(c => c.price > 0).length,
    };

    res.json({ success: true, courses: formatted, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    if (req.user.role !== 'admin' && req.body.status === 'published') {
      return res.status(403).json({ message: 'Only admin can publish courses' });
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

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can publish courses' });
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

exports.submitCourseForApproval = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (course.status === 'published') {
      return res.status(400).json({ message: 'Published course does not require approval submission' });
    }

    await course.update({ status: 'pending_approval' });

    notifyAdmins({
      type: 'course_update',
      title: 'Course Submitted for Approval',
      message: `Course "${course.title}" was submitted for approval by instructor.`,
      actionUrl: '/admin/courses-list',
    });

    res.json({
      success: true,
      message: 'Course submitted for approval successfully',
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

exports.getCategories = async (req, res) => {
  try {
    const { sequelize } = require('../models');
    const { PredefinedCourse } = require('../models');

    // Get distinct categories from actual courses
    const courseRows = await Course.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      where: { category: { [Op.ne]: null } },
      raw: true
    });

    // Get distinct categories from predefined courses catalog
    const predefinedRows = await PredefinedCourse.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      where: { category: { [Op.ne]: null }, isActive: true },
      raw: true
    });

    const all = new Set();
    courseRows.forEach(r => r.category && all.add(r.category.trim()));
    predefinedRows.forEach(r => r.category && all.add(r.category.trim()));

    const categories = Array.from(all).sort();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
