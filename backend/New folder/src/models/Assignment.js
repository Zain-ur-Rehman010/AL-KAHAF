const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assignment = sequelize.define('Assignment', {
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
    allowNull: false,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  maxScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 100,
  },
  submissionType: {
    type: DataTypes.ENUM('file', 'text', 'link', 'multiple'),
    defaultValue: 'file',
  },
  allowLateSubmission: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  latePenalty: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
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

module.exports = Assignment;
