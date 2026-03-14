const fs = require('fs');
const path = require('path');
const sequelize = require('../src/config/database');

async function runMigrations() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    const qi = sequelize.getQueryInterface();

    // Create tracking table if it doesn't exist
    await sequelize.query(
      'CREATE TABLE IF NOT EXISTS `SequelizeMeta` (`name` VARCHAR(255) NOT NULL, PRIMARY KEY (`name`)) ENGINE=InnoDB'
    );

    // Get already-run migrations
    const [ran] = await sequelize.query('SELECT name FROM SequelizeMeta');
    const ranSet = new Set(ran.map(r => r.name));

    // Get all migration files
    const files = fs.readdirSync(__dirname)
      .filter(f => f.endsWith('.js') && f !== 'migrate.js' && f !== 'rollback.js' && f !== 'seed-predefined-courses.js')
      .sort();

    // If Users table already exists with data, mark all old migrations (01-08) as done
    // without running them — they were applied by the old sequelize.sync({ alter: true })
    try {
      const [rows] = await sequelize.query('SELECT COUNT(*) as cnt FROM `Users`');
      const usersExist = rows[0].cnt >= 0; // table exists
      if (usersExist) {
        for (const f of files) {
          // Mark migrations 01-08 as done if not already tracked
          const num = parseInt(f.split('-')[0]);
          if (num >= 1 && num <= 8 && !ranSet.has(f)) {
            await sequelize.query('INSERT IGNORE INTO SequelizeMeta (name) VALUES (?)', { replacements: [f] });
            console.log(`⏭  Auto-marked as done (schema already applied): ${f}`);
            ranSet.add(f);
          }
        }
      }
    } catch (e) {
      // Users table doesn't exist yet — fresh install, run all migrations normally
    }

    console.log(`Found ${files.length} migration(s), ${ranSet.size} already run`);

    for (const file of files) {
      if (ranSet.has(file)) {
        console.log(`⏭  Skipping (already run): ${file}`);
        continue;
      }
      console.log(`Running migration: ${file}`);
      const migration = require(path.join(__dirname, file));
      if (migration.up) {
        await migration.up(qi, sequelize.Sequelize);
        await sequelize.query('INSERT IGNORE INTO SequelizeMeta (name) VALUES (?)', { replacements: [file] });
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
