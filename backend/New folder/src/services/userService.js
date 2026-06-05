// User Service

class UserService {
  async getUserById(id) {
    // TODO: Query user from database
    return null;
  }

  async updateUser(id, userData) {
    // TODO: Validate user data
    // TODO: Update in database
    return null;
  }

  async getUserProfile(id) {
    // TODO: Get full user profile with additional details
    return null;
  }

  async getUserCourses(id) {
    // TODO: Get all courses for user
    return [];
  }
}

module.exports = new UserService();
