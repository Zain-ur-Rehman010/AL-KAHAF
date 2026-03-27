const { Sequelize } = require('sequelize');
const sequelize = require('../src/config/database');

async function up() {
  try {
    // MySQL requires modifying the ENUM column directly
    await sequelize.query(`
      ALTER TABLE Payments
      MODIFY COLUMN paymentMethod ENUM('stripe', 'paypal', 'bank_transfer', 'jazzcash') NOT NULL;
    `);
    console.log('✅ Added jazzcash to Payments.paymentMethod enum');
  } catch (error) {
    console.error('Migration error:', error.message);
  } finally {
    await sequelize.close();
  }
}

up();
