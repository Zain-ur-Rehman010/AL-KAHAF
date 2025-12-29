const fs = require('fs');
const path = require('path');
const sequelize = require('../src/config/database');

async function runMigrations() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Get migration files
    const migrationsPath = __dirname;
    const files = fs.readdirSync(migrationsPath)
      .filter(file => file.endsWith('.js') && file !== 'migrate.js' && file !== 'rollback.js')
      .sort();

    console.log(`Found ${files.length} migration(s)`);

    // Run each migration
    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const migration = require(path.join(migrationsPath, file));

      if (migration.up) {
        await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        console.log(`✅ Migration ${file} completed`);
      }
    }

    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();