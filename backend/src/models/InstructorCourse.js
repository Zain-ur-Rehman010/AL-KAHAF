'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InstructorCourse = sequelize.define('InstructorCourse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  predefinedCourseId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  assignedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'InstructorCourses',
  timestamps: false
});

module.exports = InstructorCourse;
