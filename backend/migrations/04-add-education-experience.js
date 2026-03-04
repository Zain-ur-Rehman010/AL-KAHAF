/**
 * Migration: Add Education and Work Experience JSON fields to Users table
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'education', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Array of { degree, university, from, to }'
    });

    await queryInterface.addColumn('Users', 'workExperience', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Array of { position, company, from, to }'
    });

    console.log('✅ Added education and workExperience fields to Users table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'education');
    await queryInterface.removeColumn('Users', 'workExperience');
    console.log('✅ Removed education and workExperience fields from Users table');
  }
};
