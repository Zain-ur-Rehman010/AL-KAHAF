/**
 * Instructor Header - Auth check, profile population, logout
 * Include after api-config.js on every instructor page
 */

(function () {
  'use strict';

  /* ─── Auth Guard ────────────────────────────────────── */
  function checkAuth() {
    const token = typeof AlKahafSession !== 'undefined' ? AlKahafSession.getAccessToken() : localStorage.getItem('accessToken');
    const user  = typeof AlKahafSession !== 'undefined' ? AlKahafSession.getUser() : JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user) {
      window.location.href = '/auth/login';
      return null;
    }
    if (user.role !== 'instructor' && user.role !== 'admin') {
      window.location.href = '/auth/login';
      return null;
    }
    return user;
  }

  /* ─── Update header dropdown ────────────────────────── */
  function updateHeaderProfile(user) {
    // Profile images in header dropdown (two spots: toggle button + dropdown card)
    const headerImgs = document.querySelectorAll('.dropdown.profile-dropdown .avatar img');
    headerImgs.forEach(function (img) {
      if (user.profileImage) {
        img.src = user.profileImage;
      } else {
        // Replace with initials avatar
        const initials = ((user.firstName || '')[0] + (user.lastName || '')[0]).toUpperCase() || 'IN';
        const parent = img.parentElement;
        parent.style.cssText = 'width:40px;height:40px;min-width:40px;border-radius:50%;background:#522811;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;';
        parent.innerHTML = '<span style="font-size:13px;font-weight:700;color:#fff;">' + initials + '</span>';
      }
    });

    // Name and email in dropdown card
    const nameEl  = document.querySelector('.dropdown.profile-dropdown .profile-header h6');
    const emailEl = document.querySelector('.dropdown.profile-dropdown .profile-header p');
    if (nameEl)  nameEl.textContent  = (user.firstName || '') + ' ' + (user.lastName || '');
    if (emailEl) emailEl.textContent = user.email || '';
  }

  /* ─── Update profile banner ─────────────────────────── */
  function updateProfileBanner(user) {
    // Banner profile image (.avatar-xxl img)
    const bannerImg = document.querySelector('.avatar.avatar-xxl img, .avatar-xxl img');
    if (bannerImg) {
      if (user.profileImage) {
        bannerImg.src = user.profileImage;
      } else {
        const parent = bannerImg.closest('.avatar');
        if (parent) {
          const initials = ((user.firstName || '')[0] + (user.lastName || '')[0]).toUpperCase() || 'IN';
          parent.style.cssText = 'width:80px;height:80px;min-width:80px;border-radius:50%;background:#522811;display:inline-flex;align-items:center;justify-content:center;border:3px solid #fff;';
          parent.innerHTML = '<span style="font-size:24px;font-weight:700;color:#fff;">' + initials + '</span>';
        }
      }
    }

    // Banner name — first <h5> with text-white in the instructor-profile div
    const bannerName = document.querySelector('.instructor-profile .text-white');
    if (bannerName) {
      // Preserve any child elements (like the edit icon link)
      const editLink = bannerName.querySelector('a');
      bannerName.childNodes.forEach(function (node) {
        if (node.nodeType === Node.TEXT_NODE) node.textContent = (user.firstName || '') + ' ' + (user.lastName || '');
      });
      if (!bannerName.childNodes.length || (bannerName.childNodes.length === 1 && bannerName.childNodes[0].nodeType === Node.TEXT_NODE)) {
        bannerName.textContent = (user.firstName || '') + ' ' + (user.lastName || '');
        if (editLink) bannerName.appendChild(editLink);
      }
    }
  }

  /* ─── Logout ─────────────────────────────────────────── */
  function setupLogout() {
    // Support both href="/auth/login" logout links and id="logout-btn"
    document.querySelectorAll('a[href="/auth/login"]').forEach(function (link) {
      // Only the Logout button (last link in profile-footer), not "Log in as Student"
      if (link.textContent.trim().toLowerCase().includes('logout')) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          if (typeof AlKahafSession !== 'undefined') AlKahafSession.clearAuth();
          else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
          window.location.href = '/auth/login';
        });
      }
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (typeof AlKahafSession !== 'undefined') AlKahafSession.clearAuth();
        else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
        window.location.href = '/auth/login';
      });
    }
  }

  /* ─── Notifications ─────────────────────────────────── */
  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60)    return 'Just now';
    if (diff < 3600)  return Math.floor(diff / 60) + ' min ago';
    if (diff < 86400) return Math.floor(diff / 3600) + ' hr ago';
    return Math.floor(diff / 86400) + ' days ago';
  }

  function getNotifIcon(type) {
    const map = {
      course_update:     'isax-book-saved',
      message_received:  'isax-message',
      certificate_issued:'isax-award',
      assignment_due:    'isax-task-square',
      quiz_reminder:     'isax-clipboard-text',
      general:           'isax-notification',
    };
    return map[type] || 'isax-notification';
  }

  function loadNotifications() {
    const badge = document.getElementById('notif-badge');
    const list  = document.getElementById('notif-list');
    if (!badge || !list) return;

    fetch(API_CONFIG.BASE_URL + '/notifications?limit=10', {
      headers: API_CONFIG.getHeaders(true)
    })
    .then(function(r){ return r.json(); })
    .then(function(data) {
      if (!data.success) return;
      var unread = data.unreadCount || 0;
      badge.textContent = unread > 99 ? '99+' : unread;
      badge.style.display = unread > 0 ? 'inline-flex' : 'none';

      var items = data.data || [];
      if (!items.length) {
        list.innerHTML = '<li class="px-3 py-4 text-center text-muted small">No notifications yet</li>';
        return;
      }
      list.innerHTML = items.map(function(n) {
        return '<li class="notif-item' + (n.isRead ? '' : ' unread') + '" data-id="' + n.id + '">'
          + '<a href="' + (n.actionUrl || 'javascript:void(0);') + '" onclick="instructorMarkRead(\'' + n.id + '\')" class="d-flex align-items-start gap-2 p-3 border-bottom text-decoration-none">'
          + '<span class="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle" style="width:34px;height:34px;background:' + (n.isRead ? '#f0f0f0' : '#fff3e0') + ';">'
          + '<i class="isax ' + getNotifIcon(n.type) + ' ' + (n.isRead ? 'text-muted' : 'text-warning') + ' fs-14"></i></span>'
          + '<div style="min-width:0;flex:1;">'
          + '<p class="mb-0 fw-medium ' + (n.isRead ? 'text-muted' : 'text-dark') + '" style="font-size:12px;white-space:normal;">' + (n.title || '') + '</p>'
          + '<p class="mb-0 text-muted" style="font-size:11px;white-space:normal;">' + (n.message || '') + '</p>'
          + '<p class="mb-0 text-muted" style="font-size:11px;">' + timeAgo(n.createdAt) + '</p>'
          + '</div>'
          + (!n.isRead ? '<span class="flex-shrink-0 ms-1 mt-1 rounded-circle" style="width:8px;height:8px;background:#d8ac27;display:inline-block;"></span>' : '')
          + '</a></li>';
      }).join('');
    })
    .catch(function(){});
  }

  window.instructorMarkRead = function(id) {
    fetch(API_CONFIG.BASE_URL + '/notifications/' + id + '/read', {
      method: 'PATCH', headers: API_CONFIG.getHeaders(true)
    }).then(function(){ loadNotifications(); }).catch(function(){});
  };

  window.instructorMarkAllRead = function() {
    fetch(API_CONFIG.BASE_URL + '/notifications/read-all', {
      method: 'PATCH', headers: API_CONFIG.getHeaders(true)
    }).then(function(){ loadNotifications(); }).catch(function(){});
  };

  /* ─── Init ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    const user = checkAuth();
    if (!user) return;

    updateHeaderProfile(user);
    updateProfileBanner(user);
    setupLogout();
    loadNotifications();
    setInterval(loadNotifications, 60000);
  });

})();
