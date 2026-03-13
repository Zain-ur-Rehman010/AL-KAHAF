'use strict';

const { User, InstructorStudent } = require('../models');

/**
 * POST /api/v1/instructor-students/assign
 * Body: { instructorId, studentIds: [] }
 * Assign one or more students to an instructor (admin only)
 */
exports.assignStudents = async (req, res) => {
  try {
    const { instructorId, studentIds } = req.body;

    if (!instructorId || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'instructorId and studentIds[] are required' });
    }

    // Verify instructor exists and has instructor/admin role
    const instructor = await User.findOne({ where: { id: instructorId, role: ['instructor', 'admin'] } });
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    // Upsert each assignment (ignore duplicates)
    const records = studentIds.map(studentId => ({
      instructorId,
      studentId,
      assignedAt: new Date()
    }));

    await InstructorStudent.bulkCreate(records, { ignoreDuplicates: true });

    res.json({ success: true, message: `${studentIds.length} student(s) assigned to instructor` });
  } catch (error) {
    console.error('assignStudents error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/v1/instructor-students/:instructorId
 * Get all students assigned to an instructor
 */
exports.getAssignedStudents = async (req, res) => {
  try {
    const { instructorId } = req.params;

    // Instructors can only fetch their own students; admins can fetch any
    if (req.user.role !== 'admin' && req.user.userId !== instructorId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const rows = await InstructorStudent.findAll({
      where: { instructorId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'profileImage', 'status', 'createdAt']
        }
      ],
      order: [['assignedAt', 'DESC']]
    });

    const students = rows.map(r => ({
      assignmentId: r.id,
      assignedAt: r.assignedAt,
      ...r.student.toJSON()
    }));

    res.json({ success: true, data: students, total: students.length });
  } catch (error) {
    console.error('getAssignedStudents error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/v1/instructor-students/:instructorId/:studentId
 * Remove a student from an instructor (admin only)
 */
exports.removeStudent = async (req, res) => {
  try {
    const { instructorId, studentId } = req.params;

    const deleted = await InstructorStudent.destroy({ where: { instructorId, studentId } });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.json({ success: true, message: 'Student removed from instructor' });
  } catch (error) {
    console.error('removeStudent error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/v1/instructor-students/my/students
 * Shortcut for logged-in instructor to get their own assigned students
 */
exports.getMyStudents = async (req, res) => {
  req.params.instructorId = req.user.userId;
  return exports.getAssignedStudents(req, res);
};
