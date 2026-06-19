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

  // 1. Create Contacts table
  const tables = await qi.showAllTables();
  if (!tables.includes('Contacts')) {
    await qi.createTable('Contacts', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('new', 'read', 'replied'),
        defaultValue: 'new',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
    console.log('✓ Contacts table created');
  } else {
    console.log('– Contacts table already exists, skipping');
  }

  // 2. Add thumbnail column to WelfarePrograms if missing
  const wpCols = await qi.describeTable('WelfarePrograms');
  if (!wpCols.thumbnail) {
    await qi.addColumn('WelfarePrograms', 'thumbnail', {
      type: DataTypes.TEXT,
      allowNull: true,
      after: 'beneficiaries',
    });
    console.log('✓ thumbnail column added to WelfarePrograms');
  } else {
    console.log('– thumbnail column already exists in WelfarePrograms, skipping');
  }

  await sequelize.close();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
