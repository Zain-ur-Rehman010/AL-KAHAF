'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InstructorStudent = sequelize.define('InstructorStudent', {
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
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  assignedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'InstructorStudents',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['instructorId', 'studentId'] }
  ]
});

module.exports = InstructorStudent;
