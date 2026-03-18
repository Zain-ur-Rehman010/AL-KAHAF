const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' });
const sequelize = require('./backend/src/config/database');

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL');

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
