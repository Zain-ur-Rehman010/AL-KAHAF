'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('InstructorCourses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      instructorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      predefinedCourseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'PredefinedCourses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      assignedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Prevent duplicate assignments
    await queryInterface.addIndex('InstructorCourses', ['instructorId', 'predefinedCourseId'], {
      unique: true,
      name: 'unique_instructor_course'
    });

    await queryInterface.addIndex('InstructorCourses', ['instructorId']);
    await queryInterface.addIndex('InstructorCourses', ['predefinedCourseId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('InstructorCourses');
  }
};
