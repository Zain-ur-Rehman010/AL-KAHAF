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

  const cols = await qi.describeTable('Announcements');
  if (!cols.imageUrl) {
    await qi.addColumn('Announcements', 'imageUrl', {
      type: DataTypes.TEXT,
      allowNull: true,
      after: 'message',
    });
    console.log('✓ imageUrl column added to Announcements');
  } else {
    console.log('– imageUrl column already exists in Announcements, skipping');
  }

  await sequelize.close();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
