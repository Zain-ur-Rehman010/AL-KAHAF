'use strict';

/**
 * Seed script for AlKahaf predefined course catalog.
 * Run with: node migrations/seed-predefined-courses.js
 *
 * This script is idempotent — it skips courses that already exist
 * (matched by courseName), so it's safe to run multiple times.
 */

const { v4: uuidv4 } = require('uuid');
const sequelize = require('../src/config/database');

const COURSES = [
  // ── Basic Programs ─────────────────────────────────────────────
  { courseName: 'Basic Computer Skills',        category: 'Basic Programs' },
  { courseName: 'Atfal Winter Course',           category: 'Basic Programs' },
  { courseName: "Kids' Summer Program",          category: 'Basic Programs' },
  { courseName: "Kids' Ramazan Islamic Course",  category: 'Basic Programs' },
  { courseName: "Kids' Arabic Course",           category: 'Basic Programs' },

  // ── Islamic Studies ────────────────────────────────────────────
  { courseName: 'Dars-e-Nizami',                category: 'Islamic Studies' },
  { courseName: 'Arabic Language',              category: 'Islamic Studies' },
  { courseName: 'Tafseer of the Quran',         category: 'Islamic Studies' },
  { courseName: 'Tajweed',                      category: 'Islamic Studies' },

  // ── Advanced Learning ──────────────────────────────────────────
  { courseName: 'Hadith Learning',              category: 'Advanced Learning' },
  { courseName: 'Quranic Arabic',               category: 'Advanced Learning' },
  { courseName: 'Khutbah Training',             category: 'Advanced Learning' },
  { courseName: 'Ideal Marriage Life',          category: 'Advanced Learning' },
  { courseName: 'Masail-e-Taraveeh',            category: 'Advanced Learning' },
  { courseName: 'Fehm-e-Miras',                category: 'Advanced Learning' },
  { courseName: 'Mazameen-e-Quran',             category: 'Advanced Learning' },
];

async function seedPredefinedCourses() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');

    const queryInterface = sequelize.getQueryInterface();
    const now = new Date();
    let inserted = 0;
    let skipped = 0;

    for (const course of COURSES) {
      // Check if this course already exists (by name)
      const [existing] = await sequelize.query(
        'SELECT id FROM PredefinedCourses WHERE courseName = ? LIMIT 1',
        { replacements: [course.courseName], type: sequelize.QueryTypes.SELECT }
      );

      if (existing) {
        console.log(`  ⏭  Skipped (already exists): ${course.courseName}`);
        skipped++;
        continue;
      }

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

    console.log(`\n📊 Summary: ${inserted} inserted, ${skipped} skipped.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedPredefinedCourses();
