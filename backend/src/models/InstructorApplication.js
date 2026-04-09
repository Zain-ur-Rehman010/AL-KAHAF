const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InstructorApplication = sequelize.define('InstructorApplication', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  specialization: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  motivation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  linkedinUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  cvUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  adminNote: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // If approved, link to the created user account
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  tableName: 'InstructorApplications',
  timestamps: true,
});

module.exports = InstructorApplication;