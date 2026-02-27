/**
 * Notification Service
 * Provides a helper to create notifications for all admin users
 * whenever a student or admin performs a significant action.
 */

const { Notification, User } = require('../models');

/**
 * Find all admin user IDs (cached briefly per process to avoid repeat DB hits)
 */
let _adminIdCache = null;
let _adminIdCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

async function getAdminIds() {
  const now = Date.now();
  if (_adminIdCache && now - _adminIdCacheTime < CACHE_TTL_MS) {
    return _adminIdCache;
  }
  const admins = await User.findAll({
    where: { role: 'admin' },
    attributes: ['id'],
  });
  _adminIdCache = admins.map(a => a.id);
  _adminIdCacheTime = now;
  return _adminIdCache;
}

/**
 * Create a notification for every admin user.
 *
 * @param {object} options
 * @param {string} options.type       - Notification type (must match model ENUM)
 * @param {string} options.title      - Short title shown in dropdown
 * @param {string} options.message    - Longer description
 * @param {string} [options.actionUrl]- URL to navigate to when clicked
 * @param {object} [options.data]     - Extra JSON data
 */
async function notifyAdmins({ type = 'general', title, message, actionUrl = null, data = null }) {
  try {
    const adminIds = await getAdminIds();
    if (!adminIds.length) return;

    await Notification.bulkCreate(
      adminIds.map(userId => ({
        userId,
        type,
        title,
        message,
        actionUrl,
        data,
        isRead: false,
      }))
    );
  } catch (err) {
    // Notifications are non-critical — log but never crash the main request
    console.error('[NotificationService] Failed to notify admins:', err.message);
  }
}

/**
 * Create a notification for a specific user (e.g. a student).
 *
 * @param {string} userId      - UUID of the target user
 * @param {object} options
 * @param {string} options.type       - Notification type (must match model ENUM)
 * @param {string} options.title      - Short title shown in notification list
 * @param {string} options.message    - Longer description
 * @param {string} [options.actionUrl]- URL to navigate to when clicked
 * @param {object} [options.data]     - Extra JSON data
 */
async function notifyUser(userId, { type = 'general', title, message, actionUrl = null, data = null }) {
  try {
    await Notification.create({
      userId,
      type,
      title,
      message,
      actionUrl,
      data,
      isRead: false,
    });
  } catch (err) {
    // Notifications are non-critical — log but never crash the main request
    console.error('[NotificationService] Failed to notify user:', err.message);
  }
}

module.exports = { notifyAdmins, notifyUser };
