// Script to create admin user
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('./src/config/database');
const User = require('./src/models/User');

async function createAdminUser() {
  try {
    // Connect to database
    await db.authenticate();
    console.log('✅ Database connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@alkahaf.com' } });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Updating password...');

      // Hash new password
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Update password (skip hooks to avoid double hashing)
      await existingAdmin.update({ password: hashedPassword }, { hooks: false });
      console.log('✅ Admin password updated successfully!');
    } else {
      // Create new admin user
      console.log('Creating new admin user...');

      // DON'T hash password here - let the beforeCreate hook do it
      await User.create({
        id: uuidv4(),
        firstName: 'Admin',
        lastName: 'AlKahaf',
        email: 'admin@alkahaf.com',
        password: 'admin123', // Plain password - hook will hash it
        role: 'admin',
        status: 'active',
        emailVerified: true
      });

      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📧 Email: admin@alkahaf.com');
    console.log('🔑 Password: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
