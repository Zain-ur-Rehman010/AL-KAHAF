'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PredefinedCourse = sequelize.define('PredefinedCourse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  courseName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  tableName: 'PredefinedCourses',
  timestamps: true
});

module.exports = PredefinedCourse;
