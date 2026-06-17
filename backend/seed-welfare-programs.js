require('dotenv').config();

const sequelize = require('./src/config/database');
const WelfareProgram = require('./src/models/WelfareProgram');

const PROGRAMS = [
  {
    title: 'Ramadan Food Package Drive',
    category: 'food-relief',
    description:
      'Providing essential food packages to low-income families during Ramadan across major cities in Pakistan.',
    goal: 2000000,
    raised: 1820000,
    donors: 1240,
    location: 'Lahore, Karachi, Faisalabad, Rawalpindi',
    beneficiaries: '5,000 families',
    banner: '/assets/img/bg/home-bg-01.jpg',
    gallery: ['/assets/img/bg/home-bg-01.jpg'],
    impact: ['Monthly ration support', 'Packaged iftar essentials', 'Family food assistance'],
    fundUse: 'Food packs, logistics, volunteer transport, and distribution costs.',
    milestones: [
      'Phase 1: Warehouse packing',
      'Phase 2: City-wise delivery',
      'Phase 3: Final beneficiary verification',
    ],
    urgent: true,
    status: 'active',
    startedDate: '2026-03-01',
  },
  {
    title: 'Orphan Education Support Fund',
    category: 'education',
    description:
      'Supporting orphaned and vulnerable children with school fees, uniforms, books, and learning materials.',
    goal: 1500000,
    raised: 840000,
    donors: 410,
    location: 'Punjab and Sindh',
    beneficiaries: '250 students',
    banner: '/assets/img/about/about-2.svg',
    gallery: ['/assets/img/about/about-2.svg'],
    impact: ['School fee coverage', 'Books and uniforms', 'Tuition assistance'],
    fundUse: 'Education fees, books, uniforms, and transport support.',
    milestones: ['Student registration', 'Fee disbursement', 'Quarterly progress review'],
    urgent: false,
    status: 'active',
    startedDate: '2026-02-10',
  },
  {
    title: 'Free Medical Camps Initiative',
    category: 'healthcare',
    description:
      'Organizing free medical camps in underserved communities with basic checkups, medicines, and referrals.',
    goal: 1200000,
    raised: 465000,
    donors: 225,
    location: 'Multan, Sukkur, Bahawalpur',
    beneficiaries: '2,000 patients',
    banner: '/assets/img/course/course-01.jpg',
    gallery: ['/assets/img/course/course-01.jpg'],
    impact: ['Doctor consultations', 'Free medicines', 'Health screening'],
    fundUse: 'Doctors, medicines, test kits, and camp setup.',
    milestones: ['Community outreach', 'Camp setup', 'Follow-up care'],
    urgent: true,
    status: 'active',
    startedDate: '2026-04-15',
  },
  {
    title: 'Interest-Free Microloan Program',
    category: 'microfinance',
    description:
      'Helping small business owners and women entrepreneurs start or expand income-generating work.',
    goal: 2500000,
    raised: 1125000,
    donors: 360,
    location: 'Faisalabad, Gujranwala, Sialkot',
    beneficiaries: '180 entrepreneurs',
    banner: '/assets/img/course/course-02.jpg',
    gallery: ['/assets/img/course/course-02.jpg'],
    impact: ['Small business growth', 'Women-led income support', 'Household stability'],
    fundUse: 'Revolving microloans, admin review, and business mentoring.',
    milestones: ['Applicant screening', 'Loan disbursement', 'Repayment tracking'],
    urgent: false,
    status: 'active',
    startedDate: '2026-01-20',
  },
  {
    title: 'Clean Water for Villages',
    category: 'clean-water',
    description:
      'Installing hand pumps and filtration systems in villages with limited access to safe drinking water.',
    goal: 1800000,
    raised: 615000,
    donors: 198,
    location: 'Tharparkar, Rahim Yar Khan, Dera Ghazi Khan',
    beneficiaries: '12 villages',
    banner: '/assets/img/course/course-03.jpg',
    gallery: ['/assets/img/course/course-03.jpg'],
    impact: ['Safe drinking water', 'Reduced waterborne disease', 'Community water access'],
    fundUse: 'Bore wells, filtration units, maintenance, and installation labor.',
    milestones: ['Site survey', 'Installation', 'Water quality testing'],
    urgent: false,
    status: 'active',
    startedDate: '2026-05-05',
  },
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seedWelfarePrograms() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    let inserted = 0;
    let updated = 0;

    for (const program of PROGRAMS) {
      const slug = slugify(program.title);
      const payload = {
        slug,
        ...program,
      };

      const existing = await WelfareProgram.findOne({ where: { slug } });

      if (existing) {
        await existing.update(payload);
        updated += 1;
        console.log(`Updated: ${program.title}`);
      } else {
        await WelfareProgram.create(payload);
        inserted += 1;
        console.log(`Inserted: ${program.title}`);
      }
    }

    console.log(`\nDone. ${inserted} inserted, ${updated} updated.`);
    await sequelize.close();
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
}

seedWelfarePrograms();