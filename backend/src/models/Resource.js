const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resource = sequelize.define('Resource', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('book', 'syllabus', 'form', 'certificate', 'other'),
    allowNull: false,
    defaultValue: 'other',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fileUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fileType: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  downloads: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('active', 'archived'),
    defaultValue: 'active',
  },
  uploadedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  tableName: 'Resources',
  timestamps: true,
});

module.exports = Resource;
