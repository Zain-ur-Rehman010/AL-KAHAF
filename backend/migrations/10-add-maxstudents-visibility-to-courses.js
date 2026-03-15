'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Courses');
    if (!table.maxStudents) {
      await queryInterface.addColumn('Courses', 'maxStudents', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    if (!table.visibility) {
      await queryInterface.addColumn('Courses', 'visibility', {
        type: Sequelize.ENUM('public', 'private'),
        defaultValue: 'public',
      });
    }
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Courses', 'maxStudents');
    await queryInterface.removeColumn('Courses', 'visibility');
  },
};
