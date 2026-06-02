'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Courses');
    if (!table.previewVideo) {
      await queryInterface.addColumn('Courses', 'previewVideo', {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: null,
      });
    }
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Courses', 'previewVideo');
  },
};
