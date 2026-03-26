module.exports = {
  async up(qi, Sequelize) {
    await qi.addColumn('Users', 'verificationOtp', {
      type: Sequelize.STRING(6),
      allowNull: true,
    });
    await qi.addColumn('Users', 'otpExpiresAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(qi) {
    await qi.removeColumn('Users', 'verificationOtp');
    await qi.removeColumn('Users', 'otpExpiresAt');
  },
};
