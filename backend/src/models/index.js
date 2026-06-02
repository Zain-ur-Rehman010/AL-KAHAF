const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Enrollment = require('./Enrollment');
const Module = require('./Module');
const Lesson = require('./Lesson');
const Quiz = require('./Quiz');
const Assignment = require('./Assignment');
const Payment = require('./Payment');
const Certificate = require('./Certificate');
const Message = require('./Message');
const Notification = require('./Notification');
const Blog = require('./Blog');
const FreeTrialRequest = require('./FreeTrialRequest');
const TrialEmailLog = require('./TrialEmailLog');
const PredefinedCourse = require('./PredefinedCourse');
const InstructorCourse = require('./InstructorCourse');
const InstructorStudent = require('./InstructorStudent');
const WelfareProgram = require('./WelfareProgram');
const WelfareDonation = require('./WelfareDonation');
const InstructorApplication = require('./InstructorApplication');
const Review = require('./Review');

// User associations
User.hasMany(Course, { foreignKey: 'instructorId', as: 'instructedCourses' });
User.hasMany(Enrollment, { foreignKey: 'studentId', as: 'enrollments' });
User.hasMany(Payment, { foreignKey: 'studentId', as: 'payments' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'recipientId', as: 'receivedMessages' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
User.hasMany(Certificate, { foreignKey: 'studentId', as: 'certificates' });

// Course associations
Course.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
Course.hasMany(Module, { foreignKey: 'courseId', as: 'modules' });
Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'lessons' });
Course.hasMany(Quiz, { foreignKey: 'courseId', as: 'quizzes' });
Course.hasMany(Assignment, { foreignKey: 'courseId', as: 'assignments' });
Course.hasMany(Payment, { foreignKey: 'courseId', as: 'payments' });
Course.hasMany(Certificate, { foreignKey: 'courseId', as: 'certificates' });

// Module associations
Module.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Module.hasMany(Lesson, { foreignKey: 'moduleId', as: 'lessons' });

// Lesson associations
Lesson.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Lesson.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });
Lesson.hasMany(Quiz, { foreignKey: 'lessonId', as: 'quizzes' });
Lesson.hasMany(Assignment, { foreignKey: 'lessonId', as: 'assignments' });

// Enrollment associations
Enrollment.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Enrollment.hasOne(Certificate, { foreignKey: 'enrollmentId', as: 'certificate' });
Enrollment.hasMany(Payment, { foreignKey: 'enrollmentId', as: 'payments' });

// Quiz associations
Quiz.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Quiz.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

// Assignment associations
Assignment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Assignment.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

// Payment associations
Payment.belongsTo(Enrollment, { foreignKey: 'enrollmentId', as: 'enrollment' });
Payment.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Payment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Certificate associations
Certificate.belongsTo(Enrollment, { foreignKey: 'enrollmentId', as: 'enrollment' });
Certificate.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Certificate.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Message associations
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });
Message.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// TrialEmailLog associations
TrialEmailLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(TrialEmailLog, { foreignKey: 'userId', as: 'trialEmailLogs' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Blog associations
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' });

// Instructor ↔ PredefinedCourse (many-to-many via InstructorCourses junction table)
User.belongsToMany(PredefinedCourse, {
  through: InstructorCourse,
  foreignKey: 'instructorId',
  otherKey: 'predefinedCourseId',
  as: 'assignedCourses'
});
PredefinedCourse.belongsToMany(User, {
  through: InstructorCourse,
  foreignKey: 'predefinedCourseId',
  otherKey: 'instructorId',
  as: 'instructors'
});
InstructorCourse.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });
InstructorCourse.belongsTo(PredefinedCourse, { foreignKey: 'predefinedCourseId', as: 'course' });

// Review associations
Review.belongsTo(User, { foreignKey: 'userId', as: 'student' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Course.hasMany(Review, { foreignKey: 'courseId', as: 'reviews' });

// Welfare associations
WelfareDonation.belongsTo(WelfareProgram, { foreignKey: 'programId', as: 'program' });
WelfareProgram.hasMany(WelfareDonation, { foreignKey: 'programId', as: 'donations' });

// Instructor ↔ Student (many-to-many via InstructorStudents junction table)
User.belongsToMany(User, {
  through: InstructorStudent,
  foreignKey: 'instructorId',
  otherKey: 'studentId',
  as: 'assignedStudents'
});
User.belongsToMany(User, {
  through: InstructorStudent,
  foreignKey: 'studentId',
  otherKey: 'instructorId',
  as: 'assignedInstructors'
});
InstructorStudent.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });
InstructorStudent.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

module.exports = {
  sequelize,
  User,
  Course,
  Enrollment,
  Module,
  Lesson,
  Quiz,
  Assignment,
  Payment,
  Certificate,
  Message,
  Notification,
  Blog,
  FreeTrialRequest,
  TrialEmailLog,
  PredefinedCourse,
  InstructorCourse,
  InstructorStudent,
  InstructorApplication,
  Review,
};
