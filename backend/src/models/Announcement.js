const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  linkUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  linkText: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Learn More',
  },
  style: {
    type: DataTypes.ENUM('info', 'success', 'warning', 'urgent'),
    allowNull: false,
    defaultValue: 'info',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Announcements',
  timestamps: true,
});

module.exports = Announcement;
