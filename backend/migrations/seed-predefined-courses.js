'use strict';

/**
 * Seed script for AlKahaf predefined course catalog.
 * Run with: node migrations/seed-predefined-courses.js
 *
 * This script is idempotent — it upserts by courseName:
 * - Inserts missing courses
 * - Updates category/isActive for existing courses
 * Safe to run multiple times.
 */

const { v4: uuidv4 } = require('uuid');
const sequelize = require('../src/config/database');

const COURSES = [
  // Children
  { courseName: 'Basic Computer Skills', category: 'Children' },
  { courseName: 'Atfal Winter Course', category: 'Children' },
  { courseName: "Kids' Summer Program", category: 'Children' },
  { courseName: "Kids' Ramazan Islamic Course", category: 'Children' },
  { courseName: "Kids' Arabic Course", category: 'Children' },

  // Adult - Long Courses
  { courseName: 'Dars-e-Nizami', category: 'Adult - Long Courses' },
  { courseName: 'Arabic Language', category: 'Adult - Long Courses' },
  { courseName: 'Tafseer of the Quran', category: 'Adult - Long Courses' },
  { courseName: 'Tajweed', category: 'Adult - Long Courses' },

  // Adult - Short Courses
  { courseName: 'Hadith Learning', category: 'Adult - Short Courses' },
  { courseName: 'Quranic Arabic', category: 'Adult - Short Courses' },
  { courseName: 'Khutbah Training', category: 'Adult - Short Courses' },
  { courseName: 'Ideal Marriage Life', category: 'Adult - Short Courses' },
  { courseName: 'Masail-e-Taraveeh', category: 'Adult - Short Courses' },
  { courseName: 'Fehm-e-Miras', category: 'Adult - Short Courses' },
  { courseName: 'Mazameen-e-Quran', category: 'Adult - Short Courses' },

  // Workshops
  { courseName: 'Hajj & Umrah Workshop', category: 'Workshops' },
  { courseName: 'Zakat Workshop', category: 'Workshops' },
  { courseName: 'Namaz Workshop', category: 'Workshops' },
  { courseName: 'Huqooq-e-Mustafa Workshop', category: 'Workshops' },
  { courseName: 'Khatm-e-Nubuwwat Workshop', category: 'Workshops' }
];

async function seedPredefinedCourses() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');

    const queryInterface = sequelize.getQueryInterface();
    const now = new Date();
    let inserted = 0;
    let updated = 0;

    for (const course of COURSES) {
      // Check if this course already exists (by name)
      const existing = await sequelize.query(
        'SELECT id FROM PredefinedCourses WHERE courseName = ? LIMIT 1',
        { replacements: [course.courseName], type: sequelize.QueryTypes.SELECT }
      );

      if (existing && existing.length > 0) {
        await sequelize.query(
          'UPDATE PredefinedCourses SET category = ?, isActive = ?, updatedAt = ? WHERE courseName = ?',
          {
            replacements: [course.category, true, now, course.courseName],
            type: sequelize.QueryTypes.UPDATE
          }
        );
        console.log(`  🔄 Updated: [${course.category}] ${course.courseName}`);
        updated++;
      } else {
        await sequelize.query(
          'INSERT INTO PredefinedCourses (id, courseName, category, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
          {
            replacements: [uuidv4(), course.courseName, course.category, true, now, now],
            type: sequelize.QueryTypes.INSERT
          }
        );

        console.log(`  ✅ Inserted: [${course.category}] ${course.courseName}`);
        inserted++;
      }
    }

    console.log(`\n📊 Summary: ${inserted} inserted, ${updated} updated.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedPredefinedCourses();
