/**
 * One-off script: Add 'pending_approval' to Course status ENUM.
 * Run once on Railway, then revert start script.
 *
 *   node run-migration-05.js
 */

const sequelize = require('./src/config/database');
const migration = require('./migrations/05-add-pending-approval-status');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('✅ Migration 05 complete — pending_approval status added to Courses');
    process.exit(0);
  } catch (err) {
    // If ENUM already has the value, ignore
    if (err.message && (err.message.includes('already exists') || err.message.includes('Duplicate'))) {
      console.log('ℹ️  Status already exists — nothing to do');
      process.exit(0);
    }
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
})();
