// User Controller

const userService = require('../services/userService');

const userController = {
  getUserById: async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.id);
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      
      res.json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  getUserProfile: async (req, res, next) => {
    try {
      const profile = await userService.getUserProfile(req.params.id);
      
      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  },

  getUserCourses: async (req, res, next) => {
    try {
      const courses = await userService.getUserCourses(req.params.id);
      
      res.json({
        success: true,
        data: courses
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
