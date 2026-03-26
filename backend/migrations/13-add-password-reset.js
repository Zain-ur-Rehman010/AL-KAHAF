module.exports = {
  async up(qi, Sequelize) {
    await qi.addColumn('Users', 'passwordResetToken', {
      type: Sequelize.STRING(64),
      allowNull: true,
    });
    await qi.addColumn('Users', 'passwordResetExpiry', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(qi) {
    await qi.removeColumn('Users', 'passwordResetToken');
    await qi.removeColumn('Users', 'passwordResetExpiry');
  },
};
