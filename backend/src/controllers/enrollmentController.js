// Enrollment Controller

const enrollmentService = require('../services/enrollmentService');

const enrollmentController = {
  enrollCourse: async (req, res, next) => {
    try {
      const { courseId } = req.body;
      const studentId = req.user.id;
      
      const enrollment = await enrollmentService.enrollCourse(studentId, courseId);
      
      res.status(201).json({
        success: true,
        message: 'Enrolled in course successfully',
        data: enrollment
      });
    } catch (error) {
      next(error);
    }
  },

  getStudentEnrollments: async (req, res, next) => {
    try {
      const enrollments = await enrollmentService.getStudentEnrollments(req.user.id);
      
      res.json({
        success: true,
        data: enrollments
      });
    } catch (error) {
      next(error);
    }
  },

  getCourseStudents: async (req, res, next) => {
    try {
      const students = await enrollmentService.getCourseStudents(req.params.courseId);
      
      res.json({
        success: true,
        data: students
      });
    } catch (error) {
      next(error);
    }
  },

  unenrollCourse: async (req, res, next) => {
    try {
      await enrollmentService.unenrollCourse(req.params.id);
      
      res.json({
        success: true,
        message: 'Unenrolled from course successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = enrollmentController;
