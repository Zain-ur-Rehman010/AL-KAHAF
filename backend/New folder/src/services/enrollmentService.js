// Enrollment Service

class EnrollmentService {
  async enrollCourse(studentId, courseId) {
    // TODO: Check if already enrolled
    // TODO: Save enrollment to database
    return null;
  }

  async getStudentEnrollments(studentId) {
    // TODO: Get all enrollments for student
    return [];
  }

  async getCourseStudents(courseId) {
    // TODO: Get all students enrolled in course
    return [];
  }

  async unenrollCourse(enrollmentId) {
    // TODO: Delete enrollment from database
  }
}

module.exports = new EnrollmentService();
