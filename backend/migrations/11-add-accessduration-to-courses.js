'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Courses');
    if (!table.accessDuration) {
      await queryInterface.addColumn('Courses', 'accessDuration', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Courses', 'accessDuration');
  },
};
