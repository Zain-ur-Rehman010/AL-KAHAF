const sequelize = require('../src/config/database');
const { QueryInterface, DataTypes } = require('sequelize');

async function up() {
  const qi = sequelize.getQueryInterface();

  // Add courseId column
  await qi.addColumn('reviews', 'courseId', {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'courses', key: 'id' },
    onDelete: 'SET NULL',
  });

  console.log('Migration 16: added courseId to reviews');
}

up()
  .then(() => { console.log('Done'); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
