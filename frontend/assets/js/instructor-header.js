/**
 * Instructor Header - Auth check, profile population, logout
 * Include after api-config.js on every instructor page
 */

(function () {
  'use strict';

  /* ─── Auth Guard ────────────────────────────────────── */
  function checkAuth() {
    const token = localStorage.getItem('accessToken');
    const user  = JSON.parse(localStorage.getItem('user') || 'null');

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
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        });
      }
    });

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

  /* ─── Init ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    const user = checkAuth();
    if (!user) return;

    updateHeaderProfile(user);
    updateProfileBanner(user);
    setupLogout();
  });

})();
