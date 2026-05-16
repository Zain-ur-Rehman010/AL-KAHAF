async function up(qi, Sequelize) {
  const userCols = await qi.describeTable('Users');

  if (!userCols.billingAddress) {
    await qi.addColumn('Users', 'billingAddress', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null,
    });
    console.log('  Added billingAddress column');
  }

  if (!userCols.socialLinks) {
    await qi.addColumn('Users', 'socialLinks', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null,
    });
    console.log('  Added socialLinks column');
  }
}

async function down(qi, Sequelize) {
  await qi.removeColumn('Users', 'billingAddress');
  await qi.removeColumn('Users', 'socialLinks');
}

module.exports = { up, down };