'use strict';

/**
 * Single fresh migration — creates all tables from scratch.
 * Run once on a clean database: node migrations/00-fresh-setup.js
 */

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

async function run() {
  await sequelize.authenticate();
  console.log('✓ Database connected');

  const qi = sequelize.getQueryInterface();

  // ── 1. Users ───────────────────────────────────────────────────────────────
  await qi.createTable('Users', {
    id:                  { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    firstName:           { type: DataTypes.STRING, allowNull: false },
    lastName:            { type: DataTypes.STRING, allowNull: false },
    email:               { type: DataTypes.STRING, allowNull: false, unique: true },
    password:            { type: DataTypes.STRING, allowNull: false },
    phone:               { type: DataTypes.STRING, allowNull: true },
    profileImage:        { type: DataTypes.STRING, allowNull: true },
    bio:                 { type: DataTypes.TEXT, allowNull: true },
    designation:         { type: DataTypes.STRING(100), allowNull: true },
    specialization:      { type: DataTypes.JSON, allowNull: true },
    experience:          { type: DataTypes.INTEGER, allowNull: true },
    rating:              { type: DataTypes.DECIMAL(2, 1), allowNull: true, defaultValue: 5.0 },
    isVerified:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    socialLinks:         { type: DataTypes.JSON, allowNull: true },
    billingAddress:      { type: DataTypes.JSON, allowNull: true },
    education:           { type: DataTypes.JSON, allowNull: true },
    workExperience:      { type: DataTypes.JSON, allowNull: true },
    totalCourses:        { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    totalStudents:       { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    role:                { type: DataTypes.ENUM('admin', 'instructor', 'student'), allowNull: false, defaultValue: 'student' },
    status:              { type: DataTypes.ENUM('active', 'inactive', 'banned'), defaultValue: 'active' },
    emailVerified:       { type: DataTypes.BOOLEAN, defaultValue: false },
    verificationOtp:     { type: DataTypes.STRING(6), allowNull: true },
    otpExpiresAt:        { type: DataTypes.DATE, allowNull: true },
    passwordResetToken:  { type: DataTypes.STRING(64), allowNull: true },
    passwordResetExpiry: { type: DataTypes.DATE, allowNull: true },
    twoFactorEnabled:    { type: DataTypes.BOOLEAN, defaultValue: false },
    isTrial:             { type: DataTypes.BOOLEAN, defaultValue: false },
    trialStartedAt:      { type: DataTypes.DATE, allowNull: true },
    trialExpiresAt:      { type: DataTypes.DATE, allowNull: true },
    trialEmailsSent:     { type: DataTypes.TINYINT, defaultValue: 0 },
    trialCourseId:       { type: DataTypes.UUID, allowNull: true },
    lastLogin:           { type: DataTypes.DATE, allowNull: true },
    createdAt:           { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:           { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ Users');

  // ── 2. PredefinedCourses ───────────────────────────────────────────────────
  await qi.createTable('PredefinedCourses', {
    id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    courseName: { type: DataTypes.STRING(255), allowNull: false },
    category:   { type: DataTypes.STRING(100), allowNull: false },
    isActive:   { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    createdAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ PredefinedCourses');

  // ── 3. Courses ─────────────────────────────────────────────────────────────
  await qi.createTable('Courses', {
    id:                  { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    instructorId:        { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
    title:               { type: DataTypes.STRING, allowNull: false },
    description:         { type: DataTypes.TEXT, allowNull: false },
    category:            { type: DataTypes.STRING, allowNull: false },
    thumbnail:           { type: DataTypes.STRING, allowNull: true },
    price:               { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    duration:            { type: DataTypes.INTEGER, allowNull: true },
    level:               { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'beginner' },
    status:              { type: DataTypes.ENUM('draft', 'pending_approval', 'published', 'archived'), defaultValue: 'pending_approval' },
    language:            { type: DataTypes.STRING, defaultValue: 'en' },
    rating:              { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
    enrollmentCount:     { type: DataTypes.INTEGER, defaultValue: 0 },
    tags:                { type: DataTypes.JSON, allowNull: true },
    requirements:        { type: DataTypes.JSON, allowNull: true },
    outcomes:            { type: DataTypes.JSON, allowNull: true },
    isFeatured:          { type: DataTypes.BOOLEAN, defaultValue: false },
    certificateAvailable:{ type: DataTypes.BOOLEAN, defaultValue: true },
    detailedDescription: { type: DataTypes.TEXT, allowNull: true },
    faqs:                { type: DataTypes.JSON, allowNull: true },
    maxStudents:         { type: DataTypes.INTEGER, allowNull: true },
    accessDuration:      { type: DataTypes.INTEGER, allowNull: true },
    visibility:          { type: DataTypes.ENUM('public', 'private'), defaultValue: 'public' },
    discountPrice:       { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    previewVideo:        { type: DataTypes.STRING(500), allowNull: true },
    createdAt:           { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:           { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ Courses');

  // ── 4. Modules ─────────────────────────────────────────────────────────────
  await qi.createTable('Modules', {
    id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    courseId:    { type: DataTypes.UUID, allowNull: false, references: { model: 'Courses', key: 'id' } },
    title:       { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    order:       { type: DataTypes.INTEGER, allowNull: false },
    createdAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ Modules');

  // ── 5. Lessons ─────────────────────────────────────────────────────────────
  await qi.createTable('Lessons', {
    id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    courseId:    { type: DataTypes.UUID, allowNull: false, references: { model: 'Courses', key: 'id' } },
    moduleId:    { type: DataTypes.UUID, allowNull: false, references: { model: 'Modules', key: 'id' } },
    title:       { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    content:     { type: DataTypes.TEXT, allowNull: true },
    videoUrl:    { type: DataTypes.STRING, allowNull: true },
    duration:    { type: DataTypes.INTEGER, allowNull: true },
    order:       { type: DataTypes.INTEGER, allowNull: false },
    status:      { type: DataTypes.ENUM('draft', 'published', 'archived'), defaultValue: 'draft' },
    attachments: { type: DataTypes.JSON, allowNull: true },
    createdAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ Lessons');

  // ── 6. Enrollments ─────────────────────────────────────────────────────────
  await qi.createTable('Enrollments', {
    id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    studentId:      { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
    courseId:       { type: DataTypes.UUID, allowNull: false, references: { model: 'Courses', key: 'id' } },
    status:         { type: DataTypes.ENUM('enrolled', 'in_progress', 'completed', 'dropped'), defaultValue: 'enrolled' },
    progress:       { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    completionDate: { type: DataTypes.DATE, allowNull: true },
    certificateIssued: { type: DataTypes.BOOLEAN, defaultValue: false },
    paymentStatus:  { type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'), defaultValue: 'pending' },
    enrollmentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    createdAt:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  await qi.addIndex('Enrollments', ['studentId', 'courseId'], { unique: true, name: 'enrollments_student_course_unique' });
  console.log('✓ Enrollments');

  // ── 7. Payments ────────────────────────────────────────────────────────────
  await qi.createTable('Payments', {
    id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    enrollmentId:  { type: DataTypes.UUID, allowNull: false, references: { model: 'Enrollments', key: 'id' } },
    studentId:     { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
    courseId:      { type: DataTypes.UUID, allowNull: false, references: { model: 'Courses', key: 'id' } },
    amount:        { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency:      { type: DataTypes.STRING, defaultValue: 'PKR' },
    status:        { type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled'), defaultValue: 'pending' },
    paymentMethod: { type: DataTypes.ENUM('stripe', 'paypal', 'bank_transfer', 'jazzcash'), allowNull: false },
    transactionId: { type: DataTypes.STRING, allowNull: true, unique: true },
    receiptUrl:    { type: DataTypes.STRING, allowNull: true },
    refundAmount:  { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    refundReason:  { type: DataTypes.TEXT, allowNull: true },
    paymentDate:   { type: DataTypes.DATE, allowNull: true },
    createdAt:     { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:     { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ Payments');

  // ── 8. Certificates ────────────────────────────────────────────────────────
  await qi.createTable('Certificates', {
    id:               { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    enrollmentId:     { type: DataTypes.UUID, allowNull: false, references: { model: 'Enrollments', key: 'id' } },
    studentId:        { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
    courseId:         { type: DataTypes.UUID, allowNull: false, references: { model: 'Courses', key: 'id' } },
    certificateUrl:   { type: DataTypes.STRING, allowNull: true },
    verificationCode: { type: DataTypes.STRING, allowNull: false, unique: true },
    status:           { type: DataTypes.ENUM('generated', 'issued', 'revoked'), defaultValue: 'generated' },
    issuedDate:       { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    createdAt:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ Certificates');

  // ── 9. Notifications ───────────────────────────────────────────────────────
  await qi.createTable('Notifications', {
    id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId:    { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
    type:      { type: DataTypes.ENUM('enrollment_confirmation','course_update','quiz_reminder','assignment_due','grade_posted','message_received','certificate_issued','course_completed','general'), allowNull: false },
    title:     { type: DataTypes.STRING, allowNull: false },
    message:   { type: DataTypes.TEXT, allowNull: false },
    data:      { type: DataTypes.JSON, allowNull: true },
    isRead:    { type: DataTypes.BOOLEAN, defaultValue: false },
    readAt:    { type: DataTypes.DATE, allowNull: true },
    actionUrl: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ Notifications');

  // ── 10. Blogs ──────────────────────────────────────────────────────────────
  await qi.createTable('Blogs', {
    id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    authorId:    { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
    title:       { type: DataTypes.STRING, allowNull: false },
    slug:        { type: DataTypes.STRING, allowNull: false, unique: true },
    excerpt:     { type: DataTypes.TEXT, allowNull: true },
    content:     { type: DataTypes.TEXT, allowNull: false },
    category:    { type: DataTypes.STRING, allowNull: false, defaultValue: 'General' },
    thumbnail:   { type: DataTypes.STRING, allowNull: true },
    status:      { type: DataTypes.ENUM('draft', 'published', 'archived'), defaultValue: 'draft' },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    views:       { type: DataTypes.INTEGER, defaultValue: 0 },
    tags:        { type: DataTypes.JSON, allowNull: true },
    createdAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ Blogs');

  // ── 11. Quizzes ────────────────────────────────────────────────────────────
  await qi.createTable('Quizzes', {
    id:               { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    courseId:         { type: DataTypes.UUID, allowNull: false, references: { model: 'Courses', key: 'id' } },
    lessonId:         { type: DataTypes.UUID, allowNull: true, references: { model: 'Lessons', key: 'id' } },
    title:            { type: DataTypes.STRING, allowNull: false },
    description:      { type: DataTypes.TEXT, allowNull: true },
    totalQuestions:   { type: DataTypes.INTEGER, allowNull: false },
    passingScore:     { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    duration:         { type: DataTypes.INTEGER, allowNull: true },
    shuffleQuestions: { type: DataTypes.BOOLEAN, defaultValue: true },
    showAnswers:      { type: DataTypes.BOOLEAN, defaultValue: true },
    allowReview:      { type: DataTypes.BOOLEAN, defaultValue: true },
    status:           { type: DataTypes.ENUM('draft', 'published', 'archived'), defaultValue: 'draft' },
    createdAt:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ Quizzes');

  // ── 12. Assignments ────────────────────────────────────────────────────────
  await qi.createTable('Assignments', {
    id:                  { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    courseId:            { type: DataTypes.UUID, allowNull: false, references: { model: 'Courses', key: 'id' } },
    lessonId:            { type: DataTypes.UUID, allowNull: true, references: { model: 'Lessons', key: 'id' } },
    title:               { type: DataTypes.STRING, allowNull: false },
    description:         { type: DataTypes.TEXT, allowNull: false },
    instructions:        { type: DataTypes.TEXT, allowNull: true },
    dueDate:             { type: DataTypes.DATE, allowNull: true },
    maxScore:            { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 100 },
    submissionType:      { type: DataTypes.ENUM('file', 'text', 'link', 'multiple'), defaultValue: 'file' },
    allowLateSubmission: { type: DataTypes.BOOLEAN, defaultValue: true },
    latePenalty:         { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    status:              { type: DataTypes.ENUM('draft', 'published', 'archived'), defaultValue: 'draft' },
    createdAt:           { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:           { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ Assignments');

  // ── 13. Messages ───────────────────────────────────────────────────────────
  await qi.createTable('Messages', {
    id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    senderId:    { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
    recipientId: { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
    courseId:    { type: DataTypes.UUID, allowNull: true, references: { model: 'Courses', key: 'id' } },
    message:     { type: DataTypes.TEXT, allowNull: false },
    isRead:      { type: DataTypes.BOOLEAN, defaultValue: false },
    readAt:      { type: DataTypes.DATE, allowNull: true },
    attachments: { type: DataTypes.JSON, allowNull: true },
    createdAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ Messages');

  // ── 14. FreeTrialRequests ──────────────────────────────────────────────────
  await qi.createTable('FreeTrialRequests', {
    id:                { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName:          { type: DataTypes.STRING, allowNull: false },
    email:             { type: DataTypes.STRING, allowNull: false },
    phone:             { type: DataTypes.STRING, allowNull: false },
    country:           { type: DataTypes.STRING, allowNull: true },
    courseInterest:    { type: DataTypes.STRING, allowNull: false },
    preferredSchedule: { type: DataTypes.STRING, allowNull: true },
    message:           { type: DataTypes.TEXT, allowNull: true },
    password:          { type: DataTypes.STRING, allowNull: true },
    status:            { type: DataTypes.ENUM('pending', 'contacted', 'enrolled', 'cancelled'), defaultValue: 'pending' },
    trialUsed:         { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt:         { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:         { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ FreeTrialRequests');

  // ── 15. InstructorCourses ──────────────────────────────────────────────────
  await qi.createTable('InstructorCourses', {
    id:                 { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    instructorId:       { type: DataTypes.UUID, allowNull: false },
    predefinedCourseId: { type: DataTypes.UUID, allowNull: false },
    assignedAt:         { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
  });
  console.log('✓ InstructorCourses');

  // ── 16. InstructorStudents ─────────────────────────────────────────────────
  await qi.createTable('InstructorStudents', {
    id:           { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    instructorId: { type: DataTypes.UUID, allowNull: false },
    studentId:    { type: DataTypes.UUID, allowNull: false },
    assignedAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdAt:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  await qi.addIndex('InstructorStudents', ['instructorId', 'studentId'], { unique: true, name: 'instructor_student_unique' });
  console.log('✓ InstructorStudents');

  // ── 17. TrialEmailLogs ─────────────────────────────────────────────────────
  await qi.createTable('TrialEmailLogs', {
    id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId:    { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
    emailType: { type: DataTypes.ENUM('day1', 'day2', 'day3'), allowNull: false },
    sentAt:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    courseId:  { type: DataTypes.UUID, allowNull: true },
  });
  await qi.addIndex('TrialEmailLogs', ['userId', 'emailType'], { unique: true, name: 'trial_email_log_unique' });
  console.log('✓ TrialEmailLogs');

  // ── 18. InstructorApplications ─────────────────────────────────────────────
  await qi.createTable('InstructorApplications', {
    id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    firstName:      { type: DataTypes.STRING(100), allowNull: false },
    lastName:       { type: DataTypes.STRING(100), allowNull: false },
    email:          { type: DataTypes.STRING(255), allowNull: false },
    phone:          { type: DataTypes.STRING(30), allowNull: true },
    specialization: { type: DataTypes.STRING(255), allowNull: true },
    experience:     { type: DataTypes.STRING(50), allowNull: true },
    motivation:     { type: DataTypes.TEXT, allowNull: true },
    linkedinUrl:    { type: DataTypes.STRING(500), allowNull: true },
    cvUrl:          { type: DataTypes.STRING(1000), allowNull: true },
    status:         { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
    adminNote:      { type: DataTypes.TEXT, allowNull: true },
    userId:         { type: DataTypes.UUID, allowNull: true },
    createdAt:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ InstructorApplications');

  // ── 19. WelfarePrograms ────────────────────────────────────────────────────
  await qi.createTable('WelfarePrograms', {
    id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title:         { type: DataTypes.STRING(255), allowNull: false },
    slug:          { type: DataTypes.STRING(100), allowNull: false, unique: true },
    category:      { type: DataTypes.ENUM('food-relief', 'education', 'healthcare', 'microfinance', 'clean-water', 'other'), allowNull: false, defaultValue: 'other' },
    description:   { type: DataTypes.TEXT, allowNull: true },
    goal:          { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    raised:        { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    donors:        { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    location:      { type: DataTypes.STRING(255), allowNull: true },
    beneficiaries: { type: DataTypes.STRING(100), allowNull: true },
    banner:        { type: DataTypes.TEXT, allowNull: true },
    gallery:       { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
    impact:        { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
    fundUse:       { type: DataTypes.TEXT, allowNull: true },
    milestones:    { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
    urgent:        { type: DataTypes.BOOLEAN, defaultValue: false },
    status:        { type: DataTypes.ENUM('active', 'inactive', 'completed'), defaultValue: 'active' },
    startedDate:   { type: DataTypes.DATEONLY, allowNull: true },
    createdAt:     { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:     { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ WelfarePrograms');

  // ── 20. WelfareDonations ───────────────────────────────────────────────────
  await qi.createTable('WelfareDonations', {
    id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    programId:     { type: DataTypes.UUID, allowNull: false, references: { model: 'WelfarePrograms', key: 'id' } },
    donorName:     { type: DataTypes.STRING(150), allowNull: false },
    donorPhone:    { type: DataTypes.STRING(20), allowNull: true },
    donorEmail:    { type: DataTypes.STRING(255), allowNull: true },
    amount:        { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    currency:      { type: DataTypes.STRING(5), defaultValue: 'PKR' },
    payMethod:     { type: DataTypes.ENUM('jazzcash', 'card', 'bank_transfer', 'cash'), allowNull: false, defaultValue: 'jazzcash' },
    anonymous:     { type: DataTypes.BOOLEAN, defaultValue: false },
    status:        { type: DataTypes.ENUM('pending', 'completed', 'failed'), defaultValue: 'pending' },
    notes:         { type: DataTypes.TEXT, allowNull: true },
    transactionId: { type: DataTypes.STRING(100), allowNull: true },
    createdAt:     { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:     { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ WelfareDonations');

  // ── 21. reviews ────────────────────────────────────────────────────────────
  await qi.createTable('reviews', {
    id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId:    { type: DataTypes.UUID, allowNull: false },
    message:   { type: DataTypes.TEXT, allowNull: false },
    rating:    { type: DataTypes.TINYINT, allowNull: false, defaultValue: 5 },
    courseId:  { type: DataTypes.UUID, allowNull: true },
    location:  { type: DataTypes.STRING(100), allowNull: true },
    status:    { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  console.log('✓ reviews');

  console.log('\n✅ All 21 tables created successfully.');
  await sequelize.close();
}

run().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
