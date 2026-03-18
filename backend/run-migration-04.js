/**
 * One-off script: Add education + workExperience columns to Users table.
 * Run once on your environment, then delete this file.
 *
 *   node run-migration-04.js
 */

const sequelize = require('./src/config/database');
const migration = require('./migrations/04-add-education-experience');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('✅ Migration 04 complete — education + workExperience columns added');
    process.exit(0);
  } catch (err) {
    // Column already exists → not a problem (PostgreSQL: "already exists", MySQL: "Duplicate column name")
    if (err.message && (err.message.includes('already exists') || err.message.includes('Duplicate column name'))) {
      console.log('ℹ️  Columns already exist — nothing to do');
      process.exit(0);
    }
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
})();
