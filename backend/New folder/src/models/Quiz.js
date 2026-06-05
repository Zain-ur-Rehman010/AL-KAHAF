const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Courses', key: 'id' },
  },
  lessonId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'Lessons', key: 'id' },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  passingScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  shuffleQuestions: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  showAnswers: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  allowReview: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Quiz;
