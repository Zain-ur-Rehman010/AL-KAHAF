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

  // Reassign resources still on the old generic categories to 'other' before
  // narrowing the ENUM, so MySQL doesn't silently blank out invalid values.
  const [result] = await sequelize.query(
    "UPDATE Resources SET category = 'other' WHERE category IN ('book', 'syllabus', 'form', 'certificate')"
  );
  console.log(`✓ Reassigned ${result.affectedRows || 0} resource(s) from old categories to 'other'`);

  const qi = sequelize.getQueryInterface();
  await qi.changeColumn('Resources', 'category', {
    type: DataTypes.ENUM('darja_ula', 'darja_sania', 'darja_salisa', 'darja_rabia', 'tajweed_lil_huffaz', 'arabic_language', 'other'),
    allowNull: false,
    defaultValue: 'other',
  });
  console.log('✓ Resources.category ENUM updated to class-based categories');

  await sequelize.close();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});