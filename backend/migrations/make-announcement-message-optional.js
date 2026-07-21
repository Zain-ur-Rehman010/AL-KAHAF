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

  await qi.changeColumn('Announcements', 'message', {
    type: DataTypes.TEXT,
    allowNull: true,
  });
  console.log('✓ Announcements.message is now nullable (image-only announcements allowed)');

  await sequelize.close();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
