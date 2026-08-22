/**
 * Instructor Profile Page - API Integration
 * Populates the read-only profile view with real user data from the API.
 * Requires api-config.js and instructor-header.js to be loaded first.
 */

(function () {
  'use strict';

  var BASE_URL = API_CONFIG.BASE_URL;
  var currentUser = null;
  var newCertImageUrl = '';

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
    currentUser = user;
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

  // ─── Add Certification modal (quick-add without leaving the Profile tab) ──

  function resetCertModal() {
    newCertImageUrl = '';
    var title = document.getElementById('cert-modal-title');
    var preview = document.getElementById('cert-modal-preview');
    var status = document.getElementById('cert-modal-upload-status');
    var alertBox = document.getElementById('cert-modal-alert');
    var fileInput = document.getElementById('cert-modal-file');
    if (title) title.value = '';
    if (preview) preview.src = '/assets/img/certificates/certificate-01.svg';
    if (status) status.textContent = '';
    if (fileInput) fileInput.value = '';
    if (alertBox) { alertBox.classList.add('d-none'); alertBox.textContent = ''; }
  }

  function showCertModalAlert(msg) {
    var alertBox = document.getElementById('cert-modal-alert');
    if (!alertBox) return;
    alertBox.className = 'alert alert-danger';
    alertBox.textContent = msg;
  }

  function wireCertModal() {
    var addBtn = document.getElementById('prof-add-cert-btn');
    var modalEl = document.getElementById('add_certification_modal');
    var fileInput = document.getElementById('cert-modal-file');
    var saveBtn = document.getElementById('cert-modal-save-btn');
    if (!addBtn || !modalEl || !saveBtn) return;

    addBtn.addEventListener('click', function () {
      resetCertModal();
      var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    });

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        var file = this.files[0];
        if (!file) return;
        var preview = document.getElementById('cert-modal-preview');
        var status = document.getElementById('cert-modal-upload-status');
        status.textContent = 'Uploading...';
        var fd = new FormData();
        fd.append('image', file);
        fetch(BASE_URL + '/upload?folder=certifications', {
          method: 'POST',
          headers: { 'Authorization': API_CONFIG.getHeaders(true).Authorization },
          body: fd
        }).then(function (r) { return r.json(); })
          .then(function (res) {
            if (res.success && res.url) {
              newCertImageUrl = res.url;
              preview.src = res.url;
              status.textContent = 'Uploaded';
              setTimeout(function () { status.textContent = ''; }, 2000);
            } else {
              status.textContent = res.message || 'Upload failed';
            }
          })
          .catch(function () { status.textContent = 'Upload failed'; });
      });
    }

    saveBtn.addEventListener('click', function () {
      var title = (document.getElementById('cert-modal-title') || {}).value || '';
      title = title.trim();
      if (!title && !newCertImageUrl) {
        showCertModalAlert('Please enter a title or upload an image.');
        return;
      }

      var originalText = saveBtn.textContent;
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      var existing = (currentUser && currentUser.certifications) || [];
      var updated = existing.concat([{ title: title, imageUrl: newCertImageUrl }]);

      fetch(BASE_URL + '/auth/profile', {
        method: 'PUT',
        headers: API_CONFIG.getHeaders(true),
        body: JSON.stringify({ certifications: updated })
      }).then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
        .then(function (result) {
          if (!result.ok || !result.data || !result.data.user) {
            showCertModalAlert((result.data && result.data.message) || 'Failed to save certification.');
            return;
          }
          currentUser = Object.assign({}, currentUser, { certifications: updated });
          localStorage.setItem('user', JSON.stringify(currentUser));
          renderCertifications(updated);
          bootstrap.Modal.getOrCreateInstance(document.getElementById('add_certification_modal')).hide();
        })
        .catch(function () { showCertModalAlert('Network error. Please try again.'); })
        .finally(function () { saveBtn.disabled = false; saveBtn.textContent = originalText; });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadProfile();
    wireCertModal();
  });

})();
