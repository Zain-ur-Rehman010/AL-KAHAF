const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FreeTrialRequest = sequelize.define('FreeTrialRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  courseInterest: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  preferredSchedule: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'contacted', 'enrolled', 'cancelled'),
    defaultValue: 'pending',
  },
});

module.exports = FreeTrialRequest;
