'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

async function run() {
  await sequelize.authenticate();
  console.log('Connected to DB');

  const qi = sequelize.getQueryInterface();

  const tables = await qi.showAllTables();
  if (tables.includes('Announcements')) {
    console.log('– Announcements table already exists, skipping');
  } else {
    await qi.createTable('Announcements', {
      id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      message:    { type: DataTypes.TEXT, allowNull: false },
      linkUrl:    { type: DataTypes.STRING(500), allowNull: true },
      linkText:   { type: DataTypes.STRING(100), allowNull: true, defaultValue: 'Learn More' },
      style:      { type: DataTypes.ENUM('info', 'success', 'warning', 'urgent'), allowNull: false, defaultValue: 'info' },
      isActive:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      expiresAt:  { type: DataTypes.DATE, allowNull: true },
      createdAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
    console.log('✓ Announcements table created');
  }

  await sequelize.close();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
