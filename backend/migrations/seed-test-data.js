require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../src/config/database');
const { User, FreeTrialRequest } = require('../src/models');

const TEST_PASSWORD = 'TempPass@123';

async function seedTestInstructor() {
  const email = 'test.instructor@alkahafonlineacademy.com';
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    console.log(`Test instructor already exists (id: ${existing.id})`);
    return existing;
  }

  const instructor = await User.create({
    firstName: 'Test',
    lastName: 'Instructor',
    email,
    password: TEST_PASSWORD,
    role: 'instructor',
    status: 'active',
    emailVerified: true,
    isVerified: true,
    designation: 'Test Instructor',
    bio: 'This is a test instructor account for testing purposes.',
  });

  console.log(`Created test instructor (id: ${instructor.id}) — email: ${email}, password: ${TEST_PASSWORD}`);
  return instructor;
}

async function seedTestStudent() {
  const email = 'test.student@alkahafonlineacademy.com';
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    console.log(`Test student already exists (id: ${existing.id})`);
    return existing;
  }

  const student = await User.create({
    firstName: 'Test',
    lastName: 'Student',
    email,
    password: TEST_PASSWORD,
    role: 'student',
    status: 'active',
    emailVerified: true,
  });

  console.log(`Created test student (id: ${student.id}) — email: ${email}, password: ${TEST_PASSWORD}`);
  return student;
}

async function seedTestFreeTrialRequest() {
  const email = 'test.freetrial@alkahafonlineacademy.com';
  const existing = await FreeTrialRequest.findOne({ where: { email } });

  if (existing) {
    console.log(`Test free trial request already exists (id: ${existing.id})`);
    return existing;
  }

  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

  const trial = await FreeTrialRequest.create({
    fullName: 'Test Trial Student',
    email,
    phone: '+92-300-0000000',
    country: 'Pakistan',
    courseInterest: 'Quran Recitation',
    preferredSchedule: 'Evenings',
    message: 'This is a test free trial request for testing purposes.',
    password: hashedPassword,
    status: 'pending',
    trialUsed: false,
  });

  console.log(`Created test free trial request (id: ${trial.id}) — email: ${email}, password: ${TEST_PASSWORD}`);
  return trial;
}

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL');

    await seedTestInstructor();
    await seedTestStudent();
    await seedTestFreeTrialRequest();

    console.log('Test data seeding complete.');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed test data:', error.message);
    process.exit(1);
  }
}

run();
