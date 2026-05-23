const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 5,
    validate: { min: 1, max: 5 } },
  location: { type: DataTypes.STRING(100), allowNull: true },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending' },
}, { tableName: 'reviews', timestamps: true });

module.exports = Review;