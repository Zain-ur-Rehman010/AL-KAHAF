async function up(qi, Sequelize) {
  const cols = await qi.describeTable('Users');

  const toAdd = [
    // From migration 02 (may not have run due to auto-mark)
    ['designation',        { type: Sequelize.STRING(100), allowNull: true }],
    ['specialization',     { type: Sequelize.JSON,        allowNull: true }],
    ['experience',         { type: Sequelize.INTEGER,     allowNull: true }],
    ['rating',             { type: Sequelize.DECIMAL(2,1),allowNull: true, defaultValue: 5.0 }],
    ['isVerified',         { type: Sequelize.BOOLEAN,     allowNull: false, defaultValue: false }],
    ['socialLinks',        { type: Sequelize.JSON,        allowNull: true }],
    ['totalCourses',       { type: Sequelize.INTEGER,     allowNull: false, defaultValue: 0 }],
    ['totalStudents',      { type: Sequelize.INTEGER,     allowNull: false, defaultValue: 0 }],

    // From migration 04 (may not have run)
    ['education',          { type: Sequelize.JSON,        allowNull: true }],
    ['workExperience',     { type: Sequelize.JSON,        allowNull: true }],

    // From migration 15
    ['billingAddress',     { type: Sequelize.JSON,        allowNull: true }],

    // Trial columns — not in any migration
    ['isTrial',            { type: Sequelize.BOOLEAN,     allowNull: false, defaultValue: false }],
    ['trialStartedAt',     { type: Sequelize.DATE,        allowNull: true }],
    ['trialExpiresAt',     { type: Sequelize.DATE,        allowNull: true }],
    ['trialEmailsSent',    { type: Sequelize.TINYINT,     allowNull: false, defaultValue: 0 }],
    ['trialCourseId',      { type: Sequelize.UUID,        allowNull: true }],

    // Other potentially missing
    ['twoFactorEnabled',   { type: Sequelize.BOOLEAN,     allowNull: false, defaultValue: false }],
    ['lastLogin',          { type: Sequelize.DATE,        allowNull: true }],
  ];

  for (const [name, def] of toAdd) {
    if (!cols[name]) {
      await qi.addColumn('Users', name, def);
      console.log(`  ✅ Added: ${name}`);
    } else {
      console.log(`  ⏭  Already exists: ${name}`);
    }
  }
}

async function down(qi, Sequelize) {
  const removable = [
    'isTrial','trialStartedAt','trialExpiresAt','trialEmailsSent','trialCourseId',
  ];
  for (const col of removable) {
    await qi.removeColumn('Users', col);
  }
}

module.exports = { up, down };