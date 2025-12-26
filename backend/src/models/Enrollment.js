const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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
  status: {
    type: DataTypes.ENUM('enrolled', 'in_progress', 'completed', 'dropped'),
    defaultValue: 'enrolled',
  },
  progress: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  completionDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  certificateIssued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  enrollmentDate: {
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
}, {
  indexes: [{ unique: true, fields: ['studentId', 'courseId'] }],
});

module.exports = Enrollment;
