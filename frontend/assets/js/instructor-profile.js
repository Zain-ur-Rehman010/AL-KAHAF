/**
 * Instructor Profile Page - API Integration
 * Populates the read-only profile view with real user data from the API.
 * Requires api-config.js and instructor-header.js to be loaded first.
 */

(function () {
  'use strict';

  var BASE_URL = API_CONFIG.BASE_URL;

  // Format a date string like "16 Jan 2024"
  function formatDate(dateStr) {
    if (!dateStr) return '-';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // Set text of an element by ID
  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value || '-';
  }

  // Render education list
  function renderEducation(list) {
    var container = document.getElementById('prof-education-list');
    if (!container) return;
    if (!list || list.length === 0) {
      container.innerHTML = '<p class="text-muted fs-14">No education details added yet. <a href="/instructor/instructor-settings">Add now</a></p>';
      return;
    }
    container.innerHTML = list.map(function (item, i) {
      var period = item.from ? '(' + item.from + (item.to ? ' - ' + item.to : '') + ')' : '';
      var isLast = i === list.length - 1;
      return '<div class="ps-4 ' + (isLast ? 'pb-0' : 'pb-3') + ' timeline-flow">' +
        '<div><h6 class="mb-1">' + escHtml(item.degree || '-') + '</h6>' +
        '<p>' + escHtml(item.university || '') + (period ? ' - ' + period : '') + '</p></div></div>';
    }).join('');
  }

  // Render work experience list
  function renderExperience(list) {
    var container = document.getElementById('prof-experience-list');
    if (!container) return;
    if (!list || list.length === 0) {
      container.innerHTML = '<p class="text-muted fs-14">No experience details added yet. <a href="/instructor/instructor-settings">Add now</a></p>';
      return;
    }
    container.innerHTML = list.map(function (item, i) {
      var period = item.from ? '(' + item.from + (item.to ? ' - ' + item.to : '') + ')' : '';
      var mb = i < list.length - 1 ? ' mb-4' : '';
      return '<div class="d-flex align-items-center' + mb + '">' +
        '<span class="bg-light border avatar avatar-lg text-gray-9 flex-shrink-0 me-3"><i class="isax isax-briefcase fw-bold"></i></span>' +
        '<div><h6 class="mb-1">' + escHtml(item.position || '-') + '</h6>' +
        '<p>' + escHtml(item.company || '') + (period ? ' - ' + period : '') + '</p></div></div>';
    }).join('');
  }

  // Render certifications list
  function renderCertifications(list) {
    var container = document.getElementById('prof-certification-list');
    if (!container) return;
    if (!list || list.length === 0) {
      container.innerHTML = '<p class="text-muted fs-14">No certifications added yet. <a href="/instructor/instructor-settings">Add now</a></p>';
      return;
    }
    container.innerHTML = '<div class="d-flex flex-wrap gap-3">' + list.map(function (item) {
      var img = item.imageUrl || '/assets/img/certificates/certificate-01.svg';
      return '<div class="text-center" style="width:90px;">' +
        '<img src="' + escAttr(img) + '" alt="' + escAttr(item.title || 'Certification') + '" class="rounded-circle border mb-1" style="width:64px;height:64px;object-fit:cover;">' +
        '<p class="fs-12 mb-0 text-truncate" title="' + escAttr(item.title || '') + '">' + escHtml(item.title || '') + '</p></div>';
    }).join('') + '</div>';
  }

  function escAttr(text) {
    return (text || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function escHtml(text) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(text || ''));
    return d.innerHTML;
  }

  // Populate all profile fields from user object
  function populateProfile(user) {
    setText('prof-firstName',  user.firstName);
    setText('prof-lastName',   user.lastName);
    setText('prof-email',      user.email);
    setText('prof-phone',      user.phone);
    setText('prof-designation', user.designation);
    setText('prof-bio',        user.bio);
    setText('prof-createdAt',  formatDate(user.createdAt));

    renderEducation(user.education);
    renderExperience(user.workExperience);
    renderCertifications(user.certifications);

    // Banner: name (instructor-header.js handles avatar image + name in header dropdown)
    // But the banner h5 on this page needs direct update too
    var bannerName = document.querySelector('.instructor-profile .text-white');
    if (bannerName) {
      var editLink = bannerName.querySelector('a');
      bannerName.childNodes.forEach(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = (user.firstName || '') + ' ' + (user.lastName || '');
        }
      });
      // If there's no text node (only link), set it properly
      if (!Array.from(bannerName.childNodes).some(function (n) { return n.nodeType === Node.TEXT_NODE && n.textContent.trim(); })) {
        bannerName.textContent = (user.firstName || '') + ' ' + (user.lastName || '');
        if (editLink) bannerName.appendChild(editLink);
      }
    }

    // Banner avatar image
    var bannerImg = document.querySelector('.avatar.avatar-xxl img, .avatar-xxl img');
    if (bannerImg && user.profileImage) {
      bannerImg.src = user.profileImage;
    }
  }

  // Load profile data: first from localStorage (fast), then refresh from API
  async function loadProfile() {
    var cached = JSON.parse(localStorage.getItem('user') || 'null');
    if (cached) populateProfile(cached);

    try {
      var res = await fetch(BASE_URL + '/auth/me', {
        headers: API_CONFIG.getHeaders(true)
      });
      if (res.ok) {
        var user = await res.json();
        localStorage.setItem('user', JSON.stringify(user));
        populateProfile(user);
      }
    } catch (e) {
      console.warn('Could not refresh profile:', e.message);
    }
  }

  document.addEventListener('DOMContentLoaded', loadProfile);

})();
