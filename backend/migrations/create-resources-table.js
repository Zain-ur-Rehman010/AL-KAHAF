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
  if (tables.includes('Resources')) {
    console.log('– Resources table already exists, skipping');
  } else {
    await qi.createTable('Resources', {
      id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      title:      { type: DataTypes.STRING(255), allowNull: false },
      category:   { type: DataTypes.ENUM('book', 'syllabus', 'form', 'certificate', 'other'), allowNull: false, defaultValue: 'other' },
      description:{ type: DataTypes.TEXT, allowNull: true },
      fileUrl:    { type: DataTypes.TEXT, allowNull: false },
      fileName:   { type: DataTypes.STRING(255), allowNull: true },
      fileSize:   { type: DataTypes.INTEGER, allowNull: true },
      fileType:   { type: DataTypes.STRING(20), allowNull: true },
      thumbnail:  { type: DataTypes.TEXT, allowNull: true },
      downloads:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      status:     { type: DataTypes.ENUM('active', 'archived'), defaultValue: 'active' },
      uploadedBy: { type: DataTypes.UUID, allowNull: true },
      createdAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
    console.log('✓ Resources table created');
  }

  await sequelize.close();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
