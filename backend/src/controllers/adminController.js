const { User, Course, Enrollment, Payment, Certificate, PredefinedCourse, InstructorCourse, sequelize } = require('../models');
const { Op } = require('sequelize');
const { notifyUser } = require('../services/notificationService');
const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '../settings.json');

function readSettings() {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeSettings(data) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Get Admin Dashboard Statistics
 * GET /api/v1/admin/statistics
 */
exports.getDashboardStatistics = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Admin access required.'
      });
    }

    // Get total counts
    const totalUsers = await User.count();
    const totalCourses = await Course.count();
    const totalEnrollments = await Enrollment.count();
    const completedEnrollments = await Enrollment.count({ where: { status: 'completed' } });
    const completionRate = totalEnrollments > 0 ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1) : 0;

    // Get user counts by role
    const studentCount = await User.count({ where: { role: 'student' } });
    const instructorCount = await User.count({ where: { role: 'instructor' } });
    const adminCount = await User.count({ where: { role: 'admin' } });

    // Get course counts by status
    const publishedCourses = await Course.count({ where: { status: 'published' } });
    const draftCourses = await Course.count({ where: { status: 'draft' } });

    // Get revenue (if Payment model exists)
    let totalRevenue = 0;
    try {
      const payments = await Payment.findAll({
        where: { status: 'completed' },
        attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']]
      });
      totalRevenue = payments[0]?.dataValues?.total || 0;
    } catch (error) {
      // Payment model might not exist yet
      console.log('Payment model not available');
    }

    // Get growth statistics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersThisMonth = await User.count({
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    const newCoursesThisMonth = await Course.count({
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    const newEnrollmentsThisMonth = await Enrollment.count({
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    // Calculate growth percentages (mock for now, can be enhanced)
    const userGrowth = totalUsers > 0 ? ((newUsersThisMonth / totalUsers) * 100).toFixed(1) : 0;
    const courseGrowth = totalCourses > 0 ? ((newCoursesThisMonth / totalCourses) * 100).toFixed(1) : 0;
    const enrollmentGrowth = totalEnrollments > 0 ? ((newEnrollmentsThisMonth / totalEnrollments) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalCourses,
          totalEnrollments,
          totalRevenue: parseFloat(totalRevenue).toFixed(2),
          completionRate: parseFloat(completionRate),
          draftCourses,
          userGrowth: `${userGrowth}%`,
          courseGrowth: `${courseGrowth}%`,
          enrollmentGrowth: `${enrollmentGrowth}%`
        },
        userDistribution: {
          students: studentCount,
          instructors: instructorCount,
          admins: adminCount
        },
        courseDistribution: {
          published: publishedCourses,
          draft: draftCourses,
          total: totalCourses
        },
        recentActivity: {
          newUsersThisMonth,
          newCoursesThisMonth,
          newEnrollmentsThisMonth
        }
      }
    });

  } catch (error) {
    console.error('Error getting admin statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Get Top Courses by Enrollment
 * GET /api/v1/admin/top-courses
 */
exports.getTopCourses = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Unauthorized' });

    const courses = await Course.findAll({
      attributes: [
        'id', 'title', 'category', 'price', 'status',
        [sequelize.fn('COUNT', sequelize.col('enrollments.id')), 'enrollmentCount']
      ],
      include: [{ model: Enrollment, as: 'enrollments', attributes: [] }],
      group: ['Course.id'],
      order: [[sequelize.literal('enrollmentCount'), 'DESC']],
      limit: 5,
      subQuery: false
    });

    res.json({
      success: true,
      data: courses.map(c => ({
        id: c.id,
        title: c.title,
        category: c.category || 'General',
        price: c.price || 0,
        status: c.status,
        enrollmentCount: parseInt(c.dataValues.enrollmentCount) || 0
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Recent Registrations
 * GET /api/v1/admin/recent-registrations
 */
exports.getRecentRegistrations = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Unauthorized' });

    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 6
    });

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Enrollment Trends (last 7 days)
 * GET /api/v1/admin/enrollment-trends
 */
exports.getEnrollmentTrends = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const labels = [];
    const counts = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end   = new Date(d); end.setHours(23, 59, 59, 999);

      const count = await Enrollment.count({
        where: { createdAt: { [Op.between]: [start, end] } }
      });

      labels.push(start.toLocaleDateString('en-US', { weekday: 'short' }));
      counts.push(count);
    }

    res.json({ success: true, data: { labels, counts } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching trends', error: error.message });
  }
};

/**
 * Get Recent Enrollments for Admin Dashboard
 * GET /api/v1/admin/recent-enrollments
 */
exports.getRecentEnrollments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const { limit = 10 } = req.query;

    const enrollments = await Enrollment.findAll({
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'thumbnail']
        }
      ]
    });

    res.json({
      success: true,
      data: enrollments
    });

  } catch (error) {
    console.error('Error getting recent enrollments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent enrollments',
      error: error.message
    });
  }
};

/**
 * Get All Instructors with Statistics
 * GET /api/v1/admin/instructors
 */
exports.getAllInstructors = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const { page = 1, limit = 10, status, search, isVerified } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = { role: 'instructor' };
    if (status) where.status = status;
    if (isVerified !== undefined) where.emailVerified = isVerified === 'true';
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Course,
          as: 'instructedCourses',
          attributes: ['id', 'title']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    // Add statistics for each instructor
    const instructorsWithStats = await Promise.all(
      rows.map(async (instructor) => {
        const totalCourses = instructor.instructedCourses?.length || 0;

        // Get total students enrolled in instructor's courses
        const instructorCourseIds = (instructor.instructedCourses || []).map(c => c.id);
        const totalStudents = instructorCourseIds.length > 0
          ? await Enrollment.count({
              where: { courseId: instructorCourseIds },
              distinct: true,
              col: 'studentId'
            })
          : 0;

        return {
          ...instructor.toJSON(),
          stats: {
            totalCourses,
            totalStudents
          }
        };
      })
    );

    res.json({
      success: true,
      data: instructorsWithStats,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error getting instructors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching instructors',
      error: error.message
    });
  }
};

/**
 * Get Single Instructor Details
 * GET /api/v1/admin/instructors/:id
 */
exports.getInstructorById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const instructor = await User.findOne({
      where: {
        id: req.params.id,
        role: 'instructor'
      },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Course,
          as: 'instructedCourses',
          include: [
            {
              model: Enrollment,
              as: 'enrollments',
              attributes: ['id', 'status']
            }
          ]
        }
      ]
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    // Calculate statistics
    const totalCourses = instructor.instructedCourses?.length || 0;
    const publishedCourses = instructor.instructedCourses?.filter(c => c.status === 'published').length || 0;

    let totalStudents = 0;
    instructor.instructedCourses?.forEach(course => {
      totalStudents += course.enrollments?.length || 0;
    });

    res.json({
      success: true,
      data: {
        ...instructor.toJSON(),
        stats: {
          totalCourses,
          publishedCourses,
          totalStudents
        }
      }
    });

  } catch (error) {
    console.error('Error getting instructor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching instructor details',
      error: error.message
    });
  }
};

/**
 * Update Instructor Details
 * PUT /api/v1/admin/instructors/:id
 */
exports.updateInstructor = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const instructor = await User.findOne({
      where: {
        id: req.params.id,
        role: 'instructor'
      }
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    // Scalar fields that can be directly updated
    const allowedFields = [
      'firstName', 'lastName', 'email', 'phone',
      'profileImage', 'bio', 'status', 'emailVerified',
      'designation', 'experience', 'rating', 'isVerified'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // JSON fields — keep as-is if provided
    if (req.body.socialLinks !== undefined) {
      updateData.socialLinks = req.body.socialLinks;
    }
    if (req.body.specialization !== undefined) {
      updateData.specialization = Array.isArray(req.body.specialization)
        ? req.body.specialization
        : [req.body.specialization];
    }

    await instructor.update(updateData);

    // Return safe response (exclude password)
    const result = instructor.toJSON();
    delete result.password;

    res.json({
      success: true,
      message: 'Instructor updated successfully',
      data: result
    });

  } catch (error) {
    console.error('Error updating instructor:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating instructor',
      error: error.message
    });
  }
};

/**
 * Delete Instructor
 * DELETE /api/v1/admin/instructors/:id
 */
exports.deleteInstructor = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const instructor = await User.findOne({
      where: {
        id: req.params.id,
        role: 'instructor'
      }
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    // Check if instructor has courses
    const courseCount = await Course.count({
      where: { instructorId: instructor.id }
    });

    if (courseCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete instructor with existing courses. Please reassign or delete courses first.',
        courseCount
      });
    }

    await instructor.destroy();

    res.json({
      success: true,
      message: 'Instructor deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting instructor:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting instructor',
      error: error.message
    });
  }
};

/**
 * Get All Courses with Statistics (Admin)
 * GET /api/v1/admin/courses
 */
exports.getAllCourses = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const {
      page = 1,
      limit = 10,
      status,
      category,
      level,
      search,
      instructorId
    } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (level) where.level = level;
    if (instructorId) where.instructorId = instructorId;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Course.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Enrollment,
          as: 'enrollments',
          attributes: ['id', 'status']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    // Add statistics for each course
    const coursesWithStats = rows.map(course => ({
      ...course.toJSON(),
      enrollmentCount: course.enrollments?.length || 0,
      activeEnrollments: course.enrollments?.filter(e => e.status === 'active').length || 0,
      completedEnrollments: course.enrollments?.filter(e => e.status === 'completed').length || 0
    }));

    res.json({
      success: true,
      data: coursesWithStats,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

/**
 * Update Course Status (Publish/Unpublish/Archive)
 * PATCH /api/v1/admin/courses/:id/status
 */
exports.updateCourseStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const { status } = req.body;

    if (!['published', 'draft', 'archived', 'pending_approval'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: published, draft, archived, or pending_approval'
      });
    }

    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await course.update({ status });

    res.json({
      success: true,
      message: `Course ${status} successfully`,
      data: course
    });

  } catch (error) {
    console.error('Error updating course status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course status',
      error: error.message
    });
  }
};

/**
 * Get Course Statistics
 * GET /api/v1/admin/courses/statistics
 */
exports.getCourseStatistics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const totalCourses = await Course.count();
    const publishedCourses = await Course.count({ where: { status: 'published' } });
    const draftCourses = await Course.count({ where: { status: 'draft' } });
    const archivedCourses = await Course.count({ where: { status: 'archived' } });

    const totalEnrollments = await Enrollment.count();

    let totalRevenue = 0;
    try {
      const courses = await Course.findAll({
        attributes: ['price'],
        include: [{
          model: Enrollment,
          as: 'enrollments',
          attributes: ['id']
        }]
      });

      courses.forEach(course => {
        const enrollmentCount = course.enrollments?.length || 0;
        totalRevenue += (course.price || 0) * enrollmentCount;
      });
    } catch (error) {
      console.log('Error calculating revenue:', error.message);
    }

    res.json({
      success: true,
      data: {
        totalCourses,
        publishedCourses,
        draftCourses,
        archivedCourses,
        totalEnrollments,
        totalRevenue: parseFloat(totalRevenue).toFixed(2)
      }
    });

  } catch (error) {
    console.error('Error getting course statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course statistics',
      error: error.message
    });
  }
};

/**
 * Get All Enrollments (Admin)
 * GET /api/v1/admin/enrollments
 */
exports.getAllEnrollments = async (req, res) => {
  try {
    // Admin check
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Admin access required.'
      });
    }

    const {
      page = 1,
      limit = 10,
      status,
      courseId,
      studentId,
      search,
      startDate,
      endDate,
      minProgress,
      maxProgress
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by course
    if (courseId) {
      where.courseId = courseId;
    }

    // Filter by student
    if (studentId) {
      where.studentId = studentId;
    }

    // Filter by date range
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.createdAt[Op.lte] = new Date(endDate);
      }
    }

    // Filter by progress range
    if (minProgress !== undefined) {
      where.progress = where.progress || {};
      where.progress[Op.gte] = parseInt(minProgress);
    }
    if (maxProgress !== undefined) {
      where.progress = where.progress || {};
      where.progress[Op.lte] = parseInt(maxProgress);
    }

    // Get enrollments with related data
    const { count, rows } = await Enrollment.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage'],
          where: search ? {
            [Op.or]: [
              { firstName: { [Op.like]: `%${search}%` } },
              { lastName: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } }
            ]
          } : undefined
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'thumbnail', 'price']
        },
        {
          model: Certificate,
          as: 'certificate',
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error getting enrollments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments',
      error: error.message
    });
  }
};

/**
 * Get Enrollment by ID (Admin)
 * GET /api/v1/admin/enrollments/:id
 */
exports.getEnrollmentById = async (req, res) => {
  try {
    // Admin check
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Admin access required.'
      });
    }

    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: { exclude: ['password'] }
        },
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        },
        {
          model: Payment,
          as: 'payments'
        },
        {
          model: Certificate,
          as: 'certificate'
        }
      ]
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      data: enrollment
    });

  } catch (error) {
    console.error('Error getting enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollment',
      error: error.message
    });
  }
};

/**
 * Create Manual Enrollment (Admin)
 * POST /api/v1/admin/enrollments
 */
exports.createEnrollment = async (req, res) => {
  try {
    // Admin check
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Admin access required.'
      });
    }

    const { studentId, courseId, status = 'enrolled', progress = 0, paymentStatus = 'completed' } = req.body;

    // Validate student exists
    const student = await User.findByPk(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Validate course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { studentId, courseId }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      status,
      progress: parseInt(progress),
      paymentStatus
    });

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: enrollment
    });

  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating enrollment',
      error: error.message
    });
  }
};

/**
 * Update Enrollment (Admin)
 * PUT /api/v1/admin/enrollments/:id
 */
exports.updateEnrollment = async (req, res) => {
  try {
    // Admin check
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Admin access required.'
      });
    }

    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName'] },
        { model: Course, as: 'course', attributes: ['id', 'title'] }
      ]
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const { status, progress, paymentStatus } = req.body;

    // Track previous values for notification logic
    const prevStatus = enrollment.status;
    const prevProgress = parseInt(enrollment.progress);

    // Update allowed fields
    if (status !== undefined) enrollment.status = status;
    if (progress !== undefined) enrollment.progress = parseInt(progress);
    if (paymentStatus !== undefined) enrollment.paymentStatus = paymentStatus;

    // If progress is 100%, mark as completed
    if (enrollment.progress === 100 && enrollment.status !== 'completed') {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    // Send notification to student based on what changed
    const student = enrollment.student;
    const course = enrollment.course;
    if (student && course) {
      const newStatus = enrollment.status;
      const newProgress = parseInt(enrollment.progress);

      if (newStatus === 'dropped' && prevStatus !== 'dropped') {
        await notifyUser(student.id, {
          type: 'course_update',
          title: 'Enrollment Dropped',
          message: `You have been dropped from the course "${course.title}" by the administrator.`,
          actionUrl: '/student/courses'
        });
      } else if (newStatus === 'completed' && prevStatus !== 'completed') {
        await notifyUser(student.id, {
          type: 'course_completed',
          title: 'Course Completed!',
          message: `Your enrollment in "${course.title}" has been marked as completed by the administrator. Congratulations!`,
          actionUrl: '/student/courses'
        });
      } else if (progress !== undefined && newProgress !== prevProgress) {
        await notifyUser(student.id, {
          type: 'course_update',
          title: 'Progress Updated',
          message: `Your progress in "${course.title}" has been updated to ${newProgress}% by the administrator.`,
          actionUrl: '/student/courses'
        });
      }
    }

    res.json({
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment
    });

  } catch (error) {
    console.error('Error updating enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating enrollment',
      error: error.message
    });
  }
};

/**
 * Delete Enrollment (Admin)
 * DELETE /api/v1/admin/enrollments/:id
 */
exports.deleteEnrollment = async (req, res) => {
  try {
    // Admin check
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Admin access required.'
      });
    }

    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName'] },
        { model: Course, as: 'course', attributes: ['id', 'title'] }
      ]
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const studentId = enrollment.student?.id;
    const courseTitle = enrollment.course?.title;

    await enrollment.destroy();

    // Notify student after removal
    if (studentId && courseTitle) {
      await notifyUser(studentId, {
        type: 'general',
        title: 'Enrollment Removed',
        message: `Your enrollment in "${courseTitle}" has been removed by the administrator.`,
        actionUrl: '/student/courses'
      });
    }

    res.json({
      success: true,
      message: 'Enrollment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting enrollment',
      error: error.message
    });
  }
};

/**
 * Get Enrollment Statistics (Admin)
 * GET /api/v1/admin/enrollments/statistics
 */
exports.getEnrollmentStatistics = async (req, res) => {
  try {
    // Admin check
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Admin access required.'
      });
    }

    const totalEnrollments = await Enrollment.count();
    const activeEnrollments = await Enrollment.count({ where: { status: ['enrolled', 'in_progress'] } });
    const completedEnrollments = await Enrollment.count({ where: { status: 'completed' } });
    const droppedEnrollments = await Enrollment.count({ where: { status: 'dropped' } });
    const inProgressEnrollments = await Enrollment.count({ where: { status: 'in_progress' } });

    // Average progress
    const avgProgressResult = await Enrollment.findAll({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('progress')), 'avgProgress']
      ]
    });
    const avgProgress = parseFloat(avgProgressResult[0]?.dataValues?.avgProgress || 0).toFixed(1);

    // Completion rate
    const completionRate = totalEnrollments > 0
      ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1)
      : 0;

    // Recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEnrollments = await Enrollment.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        droppedEnrollments,
        inProgressEnrollments,
        avgProgress: parseFloat(avgProgress),
        completionRate: parseFloat(completionRate),
        recentEnrollments
      }
    });

  } catch (error) {
    console.error('Error getting enrollment statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollment statistics',
      error: error.message
    });
  }
};

module.exports = exports;

/**
 * Get Site Settings
 * GET /api/v1/admin/settings
 */
exports.getSettings = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized. Admin access required.' });
  }
  const settings = readSettings();
  const safe = { ...settings };
  if (safe.smtpPassword) safe.smtpPassword = '';
  if (safe.stripeSecretKey) safe.stripeSecretKey = '';
  if (safe.stripeWebhookSecret) safe.stripeWebhookSecret = '';
  res.json({ success: true, data: safe });
};

/**
 * Update Site Settings
 * PUT /api/v1/admin/settings
 */
exports.updateSettings = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized. Admin access required.' });
  }
  try {
    const current = readSettings();
    const incoming = req.body;
    const updated = { ...current };
    const secretFields = ['smtpPassword', 'stripeSecretKey', 'stripeWebhookSecret'];
    for (const key of Object.keys(incoming)) {
      if (secretFields.includes(key) && incoming[key] === '') continue;
      updated[key] = incoming[key];
    }
    writeSettings(updated);
    res.json({ success: true, message: 'Settings saved successfully.', data: updated });
  } catch (err) {
    console.error('Error saving settings:', err);
    res.status(500).json({ success: false, message: 'Failed to save settings.', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Predefined Course Catalog
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/admin/predefined-courses
 * Returns all active predefined courses, grouped by category.
 */
exports.getPredefinedCourses = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }

    const courses = await PredefinedCourse.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['courseName', 'ASC']],
      attributes: ['id', 'courseName', 'category']
    });

    // Build a grouped structure for convenient frontend rendering
    const grouped = courses.reduce((acc, c) => {
      if (!acc[c.category]) acc[c.category] = [];
      acc[c.category].push({ id: c.id, courseName: c.courseName });
      return acc;
    }, {});

    return res.json({ success: true, data: { courses, grouped } });
  } catch (error) {
    console.error('getPredefinedCourses error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/v1/admin/instructors/:id/courses
 * Returns predefined courses currently assigned to an instructor.
 */
exports.getInstructorCourses = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }

    const instructor = await User.findOne({ where: { id: req.params.id, role: 'instructor' } });
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found.' });
    }

    const assignments = await InstructorCourse.findAll({
      where: { instructorId: req.params.id },
      include: [{ model: PredefinedCourse, as: 'course', attributes: ['id', 'courseName', 'category'] }]
    });

    const courses = assignments.map(a => a.course).filter(Boolean);
    return res.json({ success: true, data: courses });
  } catch (error) {
    console.error('getInstructorCourses error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * POST /api/v1/admin/instructors/:id/courses
 * Sync (replace) all course assignments for an instructor.
 * Body: { courseIds: ['uuid', ...] }
 */
exports.syncInstructorCourses = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }

    const instructor = await User.findOne({ where: { id: req.params.id, role: 'instructor' } });
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found.' });
    }

    const courseIds = Array.isArray(req.body.courseIds) ? req.body.courseIds : [];

    // Replace all existing assignments atomically
    await sequelize.transaction(async (t) => {
      await InstructorCourse.destroy({ where: { instructorId: req.params.id }, transaction: t });

      if (courseIds.length > 0) {
        const now = new Date();
        const rows = courseIds.map(courseId => ({
          instructorId: req.params.id,
          predefinedCourseId: courseId,
          assignedAt: now
        }));
        await InstructorCourse.bulkCreate(rows, { ignoreDuplicates: true, transaction: t });
      }
    });

    return res.json({ success: true, message: `${courseIds.length} course(s) assigned successfully.` });
  } catch (error) {
    console.error('syncInstructorCourses error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * DELETE /api/v1/admin/instructors/:id/courses/:courseId
 * Remove a single predefined course assignment from an instructor.
 */
exports.removeInstructorCourse = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }

    const deleted = await InstructorCourse.destroy({
      where: { instructorId: req.params.id, predefinedCourseId: req.params.courseId }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    return res.json({ success: true, message: 'Course assignment removed.' });
  } catch (error) {
    console.error('removeInstructorCourse error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
