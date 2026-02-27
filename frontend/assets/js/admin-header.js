/**
 * Admin Header - Dynamic Notifications & User Avatar
 * Include this script in every admin page after api-config.js
 */

(function () {
  'use strict';

  const POLL_INTERVAL = 60000; // refresh notifications every 60s

  /* ─── Helpers ─────────────────────────────────────── */
  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60)    return 'Just now';
    if (diff < 3600)  return Math.floor(diff / 60) + ' mins ago';
    if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
    return Math.floor(diff / 86400) + ' days ago';
  }

  function getNotificationIcon(type) {
    const icons = {
      enrollment_confirmation: 'isax-book',
      course_update:           'isax-book-saved',
      quiz_reminder:           'isax-clipboard',
      assignment_due:          'isax-task-square',
      grade_posted:            'isax-medal',
      message_received:        'isax-message',
      certificate_issued:      'isax-award',
      course_completed:        'isax-tick-circle',
      general:                 'isax-notification',
    };
    return icons[type] || 'isax-notification';
  }

  function getUserInitials(user) {
    if (!user) return 'A';
    return ((user.firstName || '')[0] + (user.lastName || '')[0]).toUpperCase() || 'A';
  }

  /* ─── Update user avatar & name in navbar ──────────── */
  function updateUserInfo() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) return;

    // Update admin name — support both id variants used across admin pages
    const nameEl = document.getElementById('admin-name') || document.getElementById('adminName');
    if (nameEl) nameEl.textContent = (user.firstName || '') + ' ' + (user.lastName || '');

    // Find .user-img spans in both navbar structures:
    //   Structure A: .user-dropdown .user-img  (instructors-list, courses-list, etc.)
    //   Structure B: .main-drop .user-img       (admin-settings, course-add, etc.)
    const userImgSpans = document.querySelectorAll(
      '.user-dropdown .user-img, .main-drop .user-img'
    );

    userImgSpans.forEach(function (userImg) {
      if (user.profileImage) {
        var img = userImg.querySelector('img');
        if (img) img.src = user.profileImage;
      } else {
        // Convert .user-img itself into the initials badge — avoids alignment issues
        // caused by replacing the <img> with a sibling <span>
        var initials = getUserInitials(user);
        userImg.style.cssText = [
          'width:38px',
          'height:38px',
          'min-width:38px',
          'border-radius:50%',
          'background:#522811',
          'display:inline-flex',
          'align-items:center',
          'justify-content:center',
          'margin-right:8px',
          'flex-shrink:0',
          'position:relative',
          'cursor:pointer',
        ].join(';');
        userImg.innerHTML =
          '<span style="font-size:13px;font-weight:700;color:#fff;line-height:1;letter-spacing:.5px;">'
          + initials
          + '</span>';
      }
    });
  }

  /* ─── Load & render notifications ──────────────────── */
  async function loadNotifications() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res  = await fetch(API_CONFIG.BASE_URL + '/notifications?limit=10', {
        headers: API_CONFIG.getHeaders(true),
      });
      const data = await res.json();
      if (!data.success) return;

      renderNotifications(data.data, data.unreadCount);
    } catch (e) {
      console.error('Notification load error:', e);
    }
  }

  function renderNotifications(notifications, unreadCount) {
    // Update badge
    const badges = document.querySelectorAll('.noti-dropdown .badge');
    badges.forEach(b => {
      if (unreadCount > 0) {
        b.textContent = unreadCount > 99 ? '99+' : unreadCount;
        b.style.display = '';
      } else {
        b.style.display = 'none';
      }
    });

    // Update dropdown content
    const lists = document.querySelectorAll('.noti-content .notification-list');
    lists.forEach(list => {
      if (notifications.length === 0) {
        list.innerHTML = `
          <li class="notification-message text-center py-3">
            <p class="text-muted mb-0">No notifications</p>
          </li>`;
        return;
      }

      list.innerHTML = notifications.map(n => `
        <li class="notification-message ${n.isRead ? '' : 'unread-notification'}" data-id="${n.id}">
          <a href="javascript:void(0);" onclick="handleNotificationClick('${n.id}', '${n.actionUrl || ''}')">
            <div class="media d-flex align-items-start">
              <span class="me-2 mt-1">
                <i class="isax ${getNotificationIcon(n.type)}" style="font-size:18px;color:#522811"></i>
              </span>
              <div class="media-body">
                <p class="noti-details mb-0 fw-semibold">${n.title}</p>
                <p class="noti-details mb-0 text-muted" style="font-size:12px">${n.message}</p>
                <p class="noti-time mb-0">${timeAgo(n.createdAt)}</p>
              </div>
              ${!n.isRead ? '<span class="ms-2 mt-1" style="width:8px;height:8px;background:#522811;border-radius:50%;display:inline-block;flex-shrink:0"></span>' : ''}
            </div>
          </a>
        </li>`).join('');
    });

    // Add "Mark all read" footer if there are unread notifications
    const headers = document.querySelectorAll('.topnav-dropdown-header');
    headers.forEach(header => {
      let footer = header.parentElement.querySelector('.noti-footer');
      if (!footer) {
        footer = document.createElement('div');
        footer.className = 'noti-footer text-center border-top pt-2 pb-1';
        header.parentElement.appendChild(footer);
      }
      footer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center px-1">
          ${unreadCount > 0
            ? `<a href="javascript:void(0);" onclick="markAllNotificationsRead()" style="color:#522811;font-size:13px">Mark all as read</a>`
            : `<span class="text-muted" style="font-size:13px">All caught up!</span>`
          }
          <a href="/admin/notifications" style="color:#522811;font-size:13px;font-weight:600">View all &rarr;</a>
        </div>`;
    });
  }

  /* ─── Global handlers (called from onclick) ─────────── */
  window.handleNotificationClick = async function (id, actionUrl) {
    // Mark as read
    try {
      await fetch(API_CONFIG.BASE_URL + '/notifications/' + id + '/read', {
        method: 'PATCH',
        headers: API_CONFIG.getHeaders(true),
      });
    } catch (e) { /* silent */ }

    // Remove unread dot
    const li = document.querySelector(`li[data-id="${id}"]`);
    if (li) li.classList.remove('unread-notification');

    // Reload badge count
    loadNotifications();

    // Navigate if actionUrl exists
    if (actionUrl && actionUrl !== 'undefined' && actionUrl !== '') {
      window.location.href = actionUrl;
    }
  };

  window.markAllNotificationsRead = async function () {
    try {
      await fetch(API_CONFIG.BASE_URL + '/notifications/read-all', {
        method: 'PATCH',
        headers: API_CONFIG.getHeaders(true),
      });
      loadNotifications();
    } catch (e) { /* silent */ }
  };

  /* ─── Logout handler ─────────────────────────────────── */
  function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      });
    }
  }

  /* ─── Init ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    updateUserInfo();
    setupLogout();
    loadNotifications();
    // Auto-refresh notifications
    setInterval(loadNotifications, POLL_INTERVAL);
  });

})();
