// Instructor Controller

const instructorService = require('../services/instructorService');

const instructorController = {
  getAllInstructors: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const instructors = await instructorService.getAllInstructors({ page, limit });
      
      res.json({
        success: true,
        data: instructors
      });
    } catch (error) {
      next(error);
    }
  },

  getInstructorById: async (req, res, next) => {
    try {
      const instructor = await instructorService.getInstructorById(req.params.id);
      
      res.json({
        success: true,
        data: instructor
      });
    } catch (error) {
      next(error);
    }
  },

  getInstructorCourses: async (req, res, next) => {
    try {
      const courses = await instructorService.getInstructorCourses(req.params.id);
      
      res.json({
        success: true,
        data: courses
      });
    } catch (error) {
      next(error);
    }
  },

  getInstructorEarnings: async (req, res, next) => {
    try {
      const earnings = await instructorService.getInstructorEarnings(req.params.id);
      
      res.json({
        success: true,
        data: earnings
      });
    } catch (error) {
      next(error);
    }
  },

  getInstructorStudents: async (req, res, next) => {
    try {
      const students = await instructorService.getInstructorStudents(req.params.id);
      
      res.json({
        success: true,
        data: students
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = instructorController;
