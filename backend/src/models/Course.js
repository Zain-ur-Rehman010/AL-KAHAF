const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'id' },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner',
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending_approval', 'published', 'archived'),
    defaultValue: 'pending_approval',
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'en',
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  enrollmentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  outcomes: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  certificateAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  detailedDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  faqs: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
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

module.exports = Course;
