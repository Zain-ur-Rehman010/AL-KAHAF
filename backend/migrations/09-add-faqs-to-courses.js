'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDesc = await queryInterface.describeTable('Courses');
    if (!tableDesc.faqs) {
      await queryInterface.addColumn('Courses', 'faqs', {
        type: Sequelize.JSON,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Courses', 'faqs');
  },
};
