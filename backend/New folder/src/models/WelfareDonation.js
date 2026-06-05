const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WelfareDonation = sequelize.define('WelfareDonation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  programId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'WelfarePrograms', key: 'id' },
  },
  donorName: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  donorPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  donorEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(5),
    defaultValue: 'PKR',
  },
  payMethod: {
    type: DataTypes.ENUM('jazzcash', 'card', 'bank_transfer', 'cash'),
    allowNull: false,
    defaultValue: 'jazzcash',
  },
  anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: 'WelfareDonations',
  timestamps: true,
});

module.exports = WelfareDonation;