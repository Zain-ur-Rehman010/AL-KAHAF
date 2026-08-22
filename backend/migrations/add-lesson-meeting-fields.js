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
  const cols = await qi.describeTable('Lessons');

  if (!cols.meetingLink) {
    await qi.addColumn('Lessons', 'meetingLink', {
      type: DataTypes.STRING,
      allowNull: true,
      after: 'videoUrl',
    });
    console.log('✓ meetingLink column added to Lessons');
  } else {
    console.log('– meetingLink column already exists, skipping');
  }

  if (!cols.meetingScheduledAt) {
    await qi.addColumn('Lessons', 'meetingScheduledAt', {
      type: DataTypes.DATE,
      allowNull: true,
      after: 'meetingLink',
    });
    console.log('✓ meetingScheduledAt column added to Lessons');
  } else {
    console.log('– meetingScheduledAt column already exists, skipping');
  }

  await sequelize.close();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});