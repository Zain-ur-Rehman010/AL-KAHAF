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

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

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
};
