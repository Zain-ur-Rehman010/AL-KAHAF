'use strict';

const cron = require('node-cron');
const { Op } = require('sequelize');
const { User, TrialEmailLog } = require('../models');
const emailService = require('../services/emailService');
const config = require('../config/config');

/**
 * Determine which email type to send based on hours elapsed since trial started.
 * Windows:
 *   day1 → 20h–44h elapsed
 *   day2 → 44h–68h elapsed
 *   day3 → 68h+ elapsed (still within trial)
 */
function getEmailType(trialStartedAt) {
  const hoursElapsed = (Date.now() - new Date(trialStartedAt).getTime()) / (1000 * 60 * 60);
  if (hoursElapsed >= 20 && hoursElapsed < 44) return 'day1';
  if (hoursElapsed >= 44 && hoursElapsed < 68) return 'day2';
  if (hoursElapsed >= 68) return 'day3';
  return null;
}

async function runTrialEmailJob() {
  try {
    const now = new Date();

    // Fetch all users whose trial is still active
    const trialUsers = await User.findAll({
      where: {
        isTrial: true,
        trialExpiresAt: { [Op.gt]: now },
        trialStartedAt: { [Op.ne]: null },
      },
      attributes: ['id', 'firstName', 'email', 'trialStartedAt', 'trialCourseId'],
    });

    for (const user of trialUsers) {
      const emailType = getEmailType(user.trialStartedAt);
      if (!emailType) continue;

      // findOrCreate with unique (userId, emailType) — prevents double-sends
      const [, created] = await TrialEmailLog.findOrCreate({
        where: { userId: user.id, emailType },
        defaults: { userId: user.id, emailType, courseId: user.trialCourseId || null },
      });

      if (!created) continue; // already sent this email

      const courseUrl = user.trialCourseId
        ? `${config.frontendUrl}/src/pages/courses/course-details.html?id=${user.trialCourseId}`
        : `${config.frontendUrl}/src/pages/courses/course-grid.html`;

      await emailService.sendTrialReminderEmail(user.email, user.firstName, emailType, courseUrl);

      console.log(`[TrialEmailJob] Sent ${emailType} to ${user.email}`);
    }
  } catch (err) {
    console.error('[TrialEmailJob] Error:', err.message);
  }
}

function startTrialEmailJob() {
  // Runs every day at 9:00 AM
  cron.schedule('0 9 * * *', () => {
    console.log('[TrialEmailJob] Running daily trial email check...');
    runTrialEmailJob();
  });

  console.log('[TrialEmailJob] Scheduled — runs daily at 09:00');
}

module.exports = { startTrialEmailJob, runTrialEmailJob };