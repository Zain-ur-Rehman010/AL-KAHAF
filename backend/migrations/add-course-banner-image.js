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

  const courseCols = await qi.describeTable('Courses');
  if (!courseCols.bannerImage) {
    await qi.addColumn('Courses', 'bannerImage', {
      type: DataTypes.STRING,
      allowNull: true,
      after: 'thumbnail',
    });
    console.log('✓ bannerImage column added to Courses');
  } else {
    console.log('– bannerImage column already exists in Courses, skipping');
  }

  await sequelize.close();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
