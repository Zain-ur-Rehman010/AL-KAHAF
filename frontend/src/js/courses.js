// Course Module

const apiService = require('./api-service');
const { API_ENDPOINTS } = require('../config');

class CourseModule {
  async getAllCourses(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params ? `${API_ENDPOINTS.GET_COURSES}?${params}` : API_ENDPOINTS.GET_COURSES;
    return apiService.get(endpoint);
  }

  async getCourseById(id) {
    return apiService.get(API_ENDPOINTS.GET_COURSE(id));
  }

  async createCourse(courseData) {
    return apiService.post(API_ENDPOINTS.CREATE_COURSE, courseData);
  }

  async updateCourse(id, courseData) {
    return apiService.put(API_ENDPOINTS.UPDATE_COURSE(id), courseData);
  }

  async deleteCourse(id) {
    return apiService.delete(API_ENDPOINTS.DELETE_COURSE(id));
  }

  async enrollCourse(courseId) {
    return apiService.post(API_ENDPOINTS.ENROLL_COURSE, { courseId });
  }

  async getEnrollments() {
    return apiService.get(API_ENDPOINTS.GET_ENROLLMENTS);
  }
}

module.exports = new CourseModule();
