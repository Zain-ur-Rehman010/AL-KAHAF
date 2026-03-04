const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('railway', 'root', 'awcHtthHJLJHrnWUSjrVhhArFeJESbxw', {
  host: 'crossover.proxy.rlwy.net',
  port: 50511,
  dialect: 'mysql',
  logging: false,
});

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Connected to Railway MySQL');

    const hash = await bcrypt.hash('Admin@123', 10);

    await sequelize.query(`
      INSERT INTO Users (id, firstName, lastName, email, password, role, status, createdAt, updatedAt)
      VALUES (UUID(), 'Admin', 'AlKahaf', 'admin@alkahaf.com', '${hash}', 'admin', 'active', NOW(), NOW())
      ON DUPLICATE KEY UPDATE updatedAt = NOW();
    `);

    console.log('Admin user created!');
    console.log('Email: admin@alkahaf.com');
    console.log('Password: Admin@123');
    await sequelize.close();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seedAdmin();
