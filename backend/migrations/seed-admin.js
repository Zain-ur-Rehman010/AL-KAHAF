const bcrypt = require("bcryptjs");
require("dotenv").config();
const sequelize = require("../src/config/database");

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL");

    const hash = await bcrypt.hash("%4oUOFXkUatLHxmt", 10);

    await sequelize.query(`
      INSERT INTO Users (id, firstName, lastName, email, password, role, status, emailVerified, createdAt, updatedAt)
      VALUES (UUID(), 'Admin', 'AlKahaf', 'admin@alkahafonlineacademy.com', '${hash}', 'admin', 'active', 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE emailVerified = 1, updatedAt = NOW();
    `);

    console.log("Admin user created!");
    console.log("Email: admin@alkahaf.com");
    console.log("Password: Admin@123");
    await sequelize.close();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

seedAdmin();
