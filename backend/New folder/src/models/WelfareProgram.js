const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WelfareProgram = sequelize.define('WelfareProgram', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.ENUM('food-relief', 'education', 'healthcare', 'microfinance', 'clean-water', 'other'),
    allowNull: false,
    defaultValue: 'other',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  goal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  },
  raised: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  },
  donors: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  beneficiaries: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  banner: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  gallery: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  impact: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  fundUse: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  milestones: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  urgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'completed'),
    defaultValue: 'active',
  },
  startedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'WelfarePrograms',
  timestamps: true,
});

module.exports = WelfareProgram;
