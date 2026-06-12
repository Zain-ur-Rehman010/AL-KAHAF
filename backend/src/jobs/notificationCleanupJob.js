'use strict';

const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { Notification } = require('../models');

const SETTINGS_FILE = path.join(__dirname, '../settings.json');

function readSettings() {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
  } catch (err) {
    return {};
  }
}

async function runNotificationCleanupJob() {
  try {
    const settings = readSettings();
    const readRetentionDays = settings.notificationRetentionReadDays || 30;
    const unreadRetentionDays = settings.notificationRetentionUnreadDays || 90;

    const now = Date.now();
    const readCutoff = new Date(now - readRetentionDays * 24 * 60 * 60 * 1000);
    const unreadCutoff = new Date(now - unreadRetentionDays * 24 * 60 * 60 * 1000);

    const deletedRead = await Notification.destroy({
      where: { isRead: true, readAt: { [Op.lt]: readCutoff } },
    });

    const deletedUnread = await Notification.destroy({
      where: { isRead: false, createdAt: { [Op.lt]: unreadCutoff } },
    });

    console.log(`[NotificationCleanupJob] Deleted ${deletedRead} read (>${readRetentionDays}d) and ${deletedUnread} unread (>${unreadRetentionDays}d) notifications`);
  } catch (err) {
    console.error('[NotificationCleanupJob] Error:', err.message);
  }
}

function startNotificationCleanupJob() {
  // Runs every day at 3:00 AM
  cron.schedule('0 3 * * *', () => {
    console.log('[NotificationCleanupJob] Running daily notification cleanup...');
    runNotificationCleanupJob();
  });

  console.log('[NotificationCleanupJob] Scheduled — runs daily at 03:00');
}

module.exports = { startNotificationCleanupJob, runNotificationCleanupJob };
