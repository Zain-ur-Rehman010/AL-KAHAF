const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const sequelize = require('./src/config/database');

async function seedCourses() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Get admin user as instructor
    const [admins] = await sequelize.query(
      "SELECT id FROM Users WHERE role = 'admin' LIMIT 1"
    );
    if (!admins.length) {
      console.error('No admin user found. Run seed-admin.js first.');
      process.exit(1);
    }
    const instructorId = admins[0].id;
    console.log('Using instructor ID:', instructorId);

    const courses = [
      {
        id: uuidv4(),
        instructorId,
        title: 'Quran Recitation for Beginners',
        description: 'Learn the fundamentals of Quran recitation with proper pronunciation. This course is designed for complete beginners who want to start their Quranic journey.',
        detailedDescription: 'This comprehensive course covers Arabic alphabet, basic Tajweed rules, and guided recitation of short Surahs. Perfect for Muslims of all ages who want to connect with the Quran.',
        category: 'Quran',
        price: 2500.00,
        discountPrice: 1999.00,
        duration: 20,
        level: 'beginner',
        status: 'published',
        language: 'Urdu',
        isFeatured: true,
        certificateAvailable: true,
        enrollmentCount: 45,
        rating: 4.80,
        tags: JSON.stringify(['quran', 'recitation', 'beginner', 'arabic']),
        requirements: JSON.stringify(['No prior knowledge required', 'Basic understanding of Arabic letters is a plus']),
        outcomes: JSON.stringify(['Read Quran with correct pronunciation', 'Learn basic Tajweed rules', 'Recite 10 short Surahs confidently']),
        visibility: 'public',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        instructorId,
        title: 'Tajweed Rules — Complete Course',
        description: 'Master the rules of Tajweed and recite the Quran beautifully. This course covers all major Tajweed rules from Makharij to Ghunna.',
        detailedDescription: 'Tajweed is the set of rules governing the correct pronunciation of the Quran. In this course, you will learn Makharij al-Huroof, Sifat al-Huroof, Noon Sakinah rules, Meem Sakinah rules, Madd rules, and Waqf rules.',
        category: 'Tajweed',
        price: 3500.00,
        discountPrice: 2999.00,
        duration: 35,
        level: 'intermediate',
        status: 'published',
        language: 'Urdu',
        isFeatured: true,
        certificateAvailable: true,
        enrollmentCount: 32,
        rating: 4.90,
        tags: JSON.stringify(['tajweed', 'quran', 'pronunciation', 'intermediate']),
        requirements: JSON.stringify(['Ability to read basic Arabic', 'Completion of beginner Quran course recommended']),
        outcomes: JSON.stringify(['Apply all major Tajweed rules', 'Recite Quran with proper Makhraj', 'Identify and correct common mistakes']),
        visibility: 'public',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        instructorId,
        title: 'Arabic Language for Beginners',
        description: 'Start your Arabic language journey with this beginner-friendly course. Learn reading, writing, and basic conversational Arabic.',
        detailedDescription: 'Arabic is the language of the Quran and one of the most widely spoken languages in the world. This course introduces you to the Arabic alphabet, basic grammar, and everyday vocabulary.',
        category: 'Arabic',
        price: 3000.00,
        discountPrice: null,
        duration: 30,
        level: 'beginner',
        status: 'published',
        language: 'Urdu/English',
        isFeatured: true,
        certificateAvailable: true,
        enrollmentCount: 58,
        rating: 4.70,
        tags: JSON.stringify(['arabic', 'language', 'beginner', 'grammar']),
        requirements: JSON.stringify(['No prior Arabic knowledge required', 'Willingness to practice daily']),
        outcomes: JSON.stringify(['Read and write Arabic script', 'Understand basic Arabic grammar', 'Hold simple Arabic conversations']),
        visibility: 'public',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        instructorId,
        title: 'Islamic Studies — Aqeedah & Fiqh',
        description: 'A comprehensive course on Islamic beliefs and jurisprudence. Understand the pillars of faith and the basics of Islamic law.',
        detailedDescription: 'This course covers the six pillars of Iman, the five pillars of Islam, basics of Tahara, Salah, Sawm, Zakat and Hajj from authentic sources.',
        category: 'Islamic Studies',
        price: 2000.00,
        discountPrice: 1499.00,
        duration: 25,
        level: 'beginner',
        status: 'published',
        language: 'Urdu',
        isFeatured: false,
        certificateAvailable: true,
        enrollmentCount: 27,
        rating: 4.85,
        tags: JSON.stringify(['islamic studies', 'aqeedah', 'fiqh', 'islam']),
        requirements: JSON.stringify(['Open mind and sincere intention to learn']),
        outcomes: JSON.stringify(['Understand core Islamic beliefs', 'Learn how to perform Salah correctly', 'Know basics of Zakat and fasting']),
        visibility: 'public',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        instructorId,
        title: 'Quran Memorization (Hifz) Program',
        description: 'A structured Hifz program with proven memorization techniques. Learn to memorize Quran with understanding and retention.',
        detailedDescription: 'Our Hifz program uses modern memory techniques combined with traditional methods. Starting from Juz Amma, students progress systematically with daily revision schedules.',
        category: 'Quran',
        price: 5000.00,
        discountPrice: 4499.00,
        duration: 60,
        level: 'advanced',
        status: 'published',
        language: 'Urdu',
        isFeatured: true,
        certificateAvailable: true,
        enrollmentCount: 18,
        rating: 5.00,
        tags: JSON.stringify(['hifz', 'memorization', 'quran', 'advanced']),
        requirements: JSON.stringify(['Must be able to read Quran fluently', 'Basic Tajweed knowledge required', 'Commitment to daily practice']),
        outcomes: JSON.stringify(['Memorize Juz Amma completely', 'Develop strong revision habits', 'Recite from memory with confidence']),
        visibility: 'public',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        instructorId,
        title: 'Duas & Adhkar for Daily Life',
        description: 'Learn essential daily supplications and remembrances from the Quran and Sunnah. Memorize morning/evening adhkar and situational duas.',
        detailedDescription: 'This course covers the most important duas for daily life including morning and evening adhkar, duas before eating, sleeping, entering home, and many more from authentic sources.',
        category: 'Islamic Studies',
        price: 1500.00,
        discountPrice: 999.00,
        duration: 15,
        level: 'beginner',
        status: 'published',
        language: 'Urdu/English',
        isFeatured: false,
        certificateAvailable: true,
        enrollmentCount: 72,
        rating: 4.75,
        tags: JSON.stringify(['duas', 'adhkar', 'sunnah', 'daily life']),
        requirements: JSON.stringify(['No prior knowledge required']),
        outcomes: JSON.stringify(['Memorize 30+ essential duas', 'Establish morning and evening adhkar habit', 'Understand meanings of duas']),
        visibility: 'public',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const course of courses) {
      await sequelize.query(
        `INSERT INTO Courses (id, instructorId, title, description, detailedDescription, category, price, discountPrice, duration, level, status, language, isFeatured, certificateAvailable, enrollmentCount, rating, tags, requirements, outcomes, visibility, createdAt, updatedAt)
         VALUES (:id, :instructorId, :title, :description, :detailedDescription, :category, :price, :discountPrice, :duration, :level, :status, :language, :isFeatured, :certificateAvailable, :enrollmentCount, :rating, :tags, :requirements, :outcomes, :visibility, :createdAt, :updatedAt)
         ON DUPLICATE KEY UPDATE updatedAt = NOW()`,
        { replacements: course }
      );
      console.log(`✅ Seeded: ${course.title}`);
    }

    console.log('\n✅ All courses seeded successfully!');
    console.log(`Total: ${courses.length} courses added`);
    await sequelize.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedCourses();