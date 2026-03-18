require('dotenv').config();
const { User } = require('./src/models');
const sequelize = require('./src/config/database');

async function seedDummyInstructor() {
  const email = 'anees.rehman@example.com';

  const payload = {
    firstName: 'Maulana Anees ur',
    lastName: 'Rehman',
    email,
    password: 'TempPass@123',
    role: 'instructor',
    status: 'active',
    phone: '+92-300-1234567',
    designation: 'Supervisor, Al-Kahaf Online Academy',
    bio: 'Experienced Islamic scholar and academic supervisor with strong foundation in classical and contemporary Islamic education.',
    profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=500&q=80',
    specialization: ['Quran', 'Tajweed', 'Dars-e-Nizami', 'Islamic Studies'],
    experience: 12,
    isVerified: true,
    rating: 4.9,
    emailVerified: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/aneesurrehman',
      facebook: 'https://facebook.com/aneesurrehman',
      twitter: 'https://x.com/aneesurrehman',
      website: 'https://alkahafonlineacademy.com'
    },
    education: [
      {
        degree: 'Shahadat-ul-Alamiyyah',
        university: 'Wifaq ul Madaris',
        from: '2012',
        to: '2018'
      },
      {
        degree: 'MA Islamic Studies',
        university: 'University X',
        from: '2019',
        to: '2021'
      }
    ],
    workExperience: [
      {
        position: 'Supervisor',
        company: 'Al-Kahaf Online Academy',
        from: '2021',
        to: 'Present'
      },
      {
        position: 'Lecturer',
        company: 'Madrasa Y',
        from: '2017',
        to: '2021'
      }
    ]
  };

  const existing = await User.findOne({ where: { email } });

  if (!existing) {
    await User.create(payload);
    console.log('Created dummy instructor:', email);
  } else {
    // Keep current password if instructor already exists.
    const updatePayload = { ...payload };
    delete updatePayload.password;
    await existing.update(updatePayload);
    console.log('Updated dummy instructor:', email);
  }

  const instructor = await User.findOne({
    where: { email },
    attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'status']
  });

  console.log('Instructor ID:', instructor.id);
  console.log('Details API URL:', `http://localhost:5000/api/v1/users/${instructor.id}/profile`);
  console.log('Frontend URL (local):', `http://localhost:3000/src/pages/instructor/instructor-details.html?id=${instructor.id}`);
}

async function run() {
  try {
    await sequelize.authenticate();
    await seedDummyInstructor();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed dummy instructor:', error.message);
    process.exit(1);
  }
}

run();

