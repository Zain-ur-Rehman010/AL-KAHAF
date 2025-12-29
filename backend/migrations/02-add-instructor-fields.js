/**
 * Migration: Add Instructor-specific Fields to Users Table
 *
 * This migration adds fields needed for instructor profiles:
 * - designation (job title like "Lead Designer", "Accountant")
 * - specialization (JSON array of specializations)
 * - experience (years of experience)
 * - rating (instructor rating 0-5)
 * - isVerified (verification badge)
 * - socialLinks (JSON object with social media links)
 * - totalCourses (cached count)
 * - totalStudents (cached count)
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'designation', {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Job title or designation (e.g., Lead Designer, Accountant)'
    });

    await queryInterface.addColumn('Users', 'specialization', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Array of specializations (e.g., ["Web Development", "UI/UX Design"])'
    });

    await queryInterface.addColumn('Users', 'experience', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Years of experience'
    });

    await queryInterface.addColumn('Users', 'rating', {
      type: Sequelize.DECIMAL(2, 1),
      allowNull: true,
      defaultValue: 5.0,
      comment: 'Instructor rating from 0.0 to 5.0'
    });

    await queryInterface.addColumn('Users', 'isVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the instructor is verified (blue checkmark)'
    });

    await queryInterface.addColumn('Users', 'socialLinks', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Social media links (LinkedIn, Twitter, Facebook, Website)'
    });

    await queryInterface.addColumn('Users', 'totalCourses', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Cached count of courses created by instructor'
    });

    await queryInterface.addColumn('Users', 'totalStudents', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Cached count of students taught by instructor'
    });

    console.log('✅ Successfully added instructor fields to Users table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'designation');
    await queryInterface.removeColumn('Users', 'specialization');
    await queryInterface.removeColumn('Users', 'experience');
    await queryInterface.removeColumn('Users', 'rating');
    await queryInterface.removeColumn('Users', 'isVerified');
    await queryInterface.removeColumn('Users', 'socialLinks');
    await queryInterface.removeColumn('Users', 'totalCourses');
    await queryInterface.removeColumn('Users', 'totalStudents');

    console.log('✅ Successfully removed instructor fields from Users table');
  }
};