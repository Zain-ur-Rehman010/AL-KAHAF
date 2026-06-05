const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  enrollmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Enrollments', key: 'id' },
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'id' },
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Courses', key: 'id' },
  },
  certificateUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('generated', 'issued', 'revoked'),
    defaultValue: 'generated',
  },
  issuedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
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

module.exports = Certificate;
