require('dotenv').config();
const sequelize = require('./src/config/database');

async function testConnection() {
  console.log('\n🔍 Testing Database Connection...\n');
  console.log('Configuration:');
  console.log('- Host:', process.env.DB_HOST);
  console.log('- Port:', process.env.DB_PORT);
  console.log('- Database:', process.env.DB_NAME);
  console.log('- User:', process.env.DB_USER);
  console.log('- Dialect: mysql\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully!');

    // Test query
    const [results] = await sequelize.query('SELECT VERSION() as version');
    console.log('✅ MySQL Version:', results[0].version);

    // Check if Users table exists
    const [tables] = await sequelize.query("SHOW TABLES LIKE 'Users'");
    if (tables.length > 0) {
      console.log('✅ Users table exists');

      // Count users
      const [count] = await sequelize.query('SELECT COUNT(*) as count FROM Users');
      console.log('✅ Total users in database:', count[0].count);
    } else {
      console.log('⚠️  Users table does not exist - run migrations first');
    }

    console.log('\n✅ All tests passed!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. Database credentials in .env file');
    console.error('2. Database exists in cPanel/phpMyAdmin');
    console.error('3. Database user has proper privileges');
    console.error('4. MySQL service is running\n');
    process.exit(1);
  }
}

testConnection();