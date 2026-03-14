'use strict';

// Drops all duplicate users_email indexes, keeping only the one created by the UNIQUE constraint.
// Required because sequelize.sync({ alter: true }) added the same index on every server start.
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const [indexes] = await queryInterface.sequelize.query(
        "SHOW INDEX FROM `Users` WHERE Key_name LIKE 'users_email%'"
      );

      // Collect index names to drop (skip the first occurrence to keep at least one)
      const seen = new Set();
      for (const row of indexes) {
        const name = row.Key_name;
        if (seen.has(name)) {
          // duplicate — drop it
          try {
            await queryInterface.sequelize.query(
              `ALTER TABLE \`Users\` DROP INDEX \`${name}\``
            );
            console.log(`Dropped duplicate index: ${name}`);
          } catch (e) {
            console.log(`Could not drop ${name}: ${e.message}`);
          }
        } else {
          seen.add(name);
        }
      }

      // Also clean up role/status duplicate indexes
      for (const col of ['users_role', 'users_status']) {
        const [idxs] = await queryInterface.sequelize.query(
          `SHOW INDEX FROM \`Users\` WHERE Key_name LIKE '${col}%'`
        );
        const s = new Set();
        for (const row of idxs) {
          if (s.has(row.Key_name)) {
            try {
              await queryInterface.sequelize.query(
                `ALTER TABLE \`Users\` DROP INDEX \`${row.Key_name}\``
              );
              console.log(`Dropped duplicate index: ${row.Key_name}`);
            } catch (e) { /* ignore */ }
          } else {
            s.add(row.Key_name);
          }
        }
      }
    } catch (e) {
      console.log('Cleanup skipped (table may not exist yet):', e.message);
    }
  },
  down: async () => {}
};
