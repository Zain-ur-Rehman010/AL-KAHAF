'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FreeTrialRequests', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      courseInterest: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      preferredSchedule: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'contacted', 'enrolled', 'cancelled'),
        defaultValue: 'pending',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FreeTrialRequests');
  },
};
