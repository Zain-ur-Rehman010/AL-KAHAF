// Course Controller - Business logic for course operations

const courseService = require('../services/courseService');

const courseController = {
  getAllCourses: async (req, res, next) => {
    try {
      const { category, level, page = 1, limit = 10 } = req.query;
      const courses = await courseService.getAllCourses({ 
        category, 
        level, 
        page, 
        limit 
      });
      
      res.json({
        success: true,
        data: courses
      });
    } catch (error) {
      next(error);
    }
  },

  getCourseById: async (req, res, next) => {
    try {
      const course = await courseService.getCourseById(req.params.id);
      
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }
      
      res.json({
        success: true,
        data: course
      });
    } catch (error) {
      next(error);
    }
  },

  createCourse: async (req, res, next) => {
    try {
      const courseData = {
        ...req.body,
        instructorId: req.user.id
      };
      
      const course = await courseService.createCourse(courseData);
      
      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course
      });
    } catch (error) {
      next(error);
    }
  },

  updateCourse: async (req, res, next) => {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body);
      
      res.json({
        success: true,
        message: 'Course updated successfully',
        data: course
      });
    } catch (error) {
      next(error);
    }
  },

  deleteCourse: async (req, res, next) => {
    try {
      await courseService.deleteCourse(req.params.id);
      
      res.json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  getCourseLessons: async (req, res, next) => {
    try {
      const lessons = await courseService.getCourseLessons(req.params.id);
      
      res.json({
        success: true,
        data: lessons
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = courseController;
