/**
 * Migration 05: Add 'pending_approval' to Course status ENUM
 * MySQL requires ALTER TABLE to modify ENUM values.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TABLE `Courses` MODIFY COLUMN `status` ENUM('draft', 'pending_approval', 'published', 'archived') NOT NULL DEFAULT 'pending_approval';"
    );
  },
  down: async (queryInterface, Sequelize) => {
    // Revert: first update any pending_approval rows to draft, then remove enum value
    await queryInterface.sequelize.query(
      "UPDATE `Courses` SET `status` = 'draft' WHERE `status` = 'pending_approval';"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE `Courses` MODIFY COLUMN `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft';"
    );
  }
};
