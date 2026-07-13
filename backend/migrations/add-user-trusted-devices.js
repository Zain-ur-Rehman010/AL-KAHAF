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

  const userCols = await qi.describeTable('Users');
  if (!userCols.trustedDevices) {
    await qi.addColumn('Users', 'trustedDevices', {
      type: DataTypes.JSON,
      allowNull: true,
      after: 'otpExpiresAt',
    });
    console.log('✓ trustedDevices column added to Users');
  } else {
    console.log('– trustedDevices column already exists in Users, skipping');
  }

  await sequelize.close();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
