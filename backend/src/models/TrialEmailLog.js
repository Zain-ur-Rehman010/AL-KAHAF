'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrialEmailLog = sequelize.define('TrialEmailLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'id' },
  },
  emailType: {
    type: DataTypes.ENUM('day1', 'day2', 'day3'),
    allowNull: false,
  },
  sentAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  tableName: 'TrialEmailLogs',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['userId', 'emailType'] },
  ],
});

module.exports = TrialEmailLog;