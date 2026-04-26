/**
 * Instructor Settings - Profile Form API Integration
 * Handles personal details, education, and work experience.
 * Requires api-config.js and instructor-header.js to be loaded first.
 */

(function () {
  'use strict';

  var BASE_URL = API_CONFIG.BASE_URL;

  // ─── Row Templates ────────────────────────────────────────────────────────

  function makeEducationRow(data) {
    data = data || {};
    var div = document.createElement('div');
    div.className = 'edu-row border rounded p-3 mb-2 position-relative';
    div.innerHTML =
      '<button type="button" class="btn-close position-absolute remove-row" style="top:10px;right:10px;" aria-label="Remove"></button>' +
      '<div class="row g-2">' +
        '<div class="col-md-6">' +
          '<label class="form-label form-label-sm">Degree</label>' +
          '<input type="text" class="form-control form-control-sm edu-degree" placeholder="e.g. BCA – Bachelor of Computer Applications" value="' + esc(data.degree) + '">' +
        '</div>' +
        '<div class="col-md-6">' +
          '<label class="form-label form-label-sm">University / Institution</label>' +
          '<input type="text" class="form-control form-control-sm edu-university" placeholder="e.g. International University" value="' + esc(data.university) + '">' +
        '</div>' +
        '<div class="col-md-3">' +
          '<label class="form-label form-label-sm">From</label>' +
          '<input type="text" class="form-control form-control-sm edu-from" placeholder="e.g. 2018" value="' + esc(data.from) + '">' +
        '</div>' +
        '<div class="col-md-3">' +
          '<label class="form-label form-label-sm">To</label>' +
          '<input type="text" class="form-control form-control-sm edu-to" placeholder="e.g. 2022 or Present" value="' + esc(data.to) + '">' +
        '</div>' +
      '</div>';
    div.querySelector('.remove-row').addEventListener('click', function () { div.remove(); });
    return div;
  }

  function makeExperienceRow(data) {
    data = data || {};
    var div = document.createElement('div');
    div.className = 'exp-row border rounded p-3 mb-2 position-relative';
    div.innerHTML =
      '<button type="button" class="btn-close position-absolute remove-row" style="top:10px;right:10px;" aria-label="Remove"></button>' +
      '<div class="row g-2">' +
        '<div class="col-md-6">' +
          '<label class="form-label form-label-sm">Position / Role</label>' +
          '<input type="text" class="form-control form-control-sm exp-position" placeholder="e.g. Web Developer" value="' + esc(data.position) + '">' +
        '</div>' +
        '<div class="col-md-6">' +
          '<label class="form-label form-label-sm">Company / Organisation</label>' +
          '<input type="text" class="form-control form-control-sm exp-company" placeholder="e.g. Creative Agency" value="' + esc(data.company) + '">' +
        '</div>' +
        '<div class="col-md-3">' +
          '<label class="form-label form-label-sm">From</label>' +
          '<input type="text" class="form-control form-control-sm exp-from" placeholder="e.g. 2019" value="' + esc(data.from) + '">' +
        '</div>' +
        '<div class="col-md-3">' +
          '<label class="form-label form-label-sm">To</label>' +
          '<input type="text" class="form-control form-control-sm exp-to" placeholder="e.g. Present" value="' + esc(data.to) + '">' +
        '</div>' +
      '</div>';
    div.querySelector('.remove-row').addEventListener('click', function () { div.remove(); });
    return div;
  }

  // ─── Serializers ──────────────────────────────────────────────────────────

  function serializeEducation() {
    var rows = document.querySelectorAll('#education-list .edu-row');
    var result = [];
    rows.forEach(function (row) {
      var degree     = row.querySelector('.edu-degree').value.trim();
      var university = row.querySelector('.edu-university').value.trim();
      var from       = row.querySelector('.edu-from').value.trim();
      var to         = row.querySelector('.edu-to').value.trim();
      if (degree || university) {
        result.push({ degree: degree, university: university, from: from, to: to });
      }
    });
    return result;
  }

  function serializeExperience() {
    var rows = document.querySelectorAll('#experience-list .exp-row');
    var result = [];
    rows.forEach(function (row) {
      var position = row.querySelector('.exp-position').value.trim();
      var company  = row.querySelector('.exp-company').value.trim();
      var from     = row.querySelector('.exp-from').value.trim();
      var to       = row.querySelector('.exp-to').value.trim();
      if (position || company) {
        result.push({ position: position, company: company, from: from, to: to });
      }
    });
    return result;
  }

  // ─── Populate form with user data ────────────────────────────────────────

  function populateForm(user) {
    setVal('firstName',   user.firstName   || '');
    setVal('lastName',    user.lastName    || '');
    setVal('phone',       user.phone       || '');
    setVal('designation', user.designation || '');
    setVal('bio',         user.bio         || '');

    // Education rows
    var eduList = document.getElementById('education-list');
    if (eduList) {
      eduList.innerHTML = '';
      var education = user.education || [];
      if (education.length === 0) {
        eduList.appendChild(makeEducationRow());
      } else {
        education.forEach(function (item) { eduList.appendChild(makeEducationRow(item)); });
      }
    }

    // Experience rows
    var expList = document.getElementById('experience-list');
    if (expList) {
      expList.innerHTML = '';
      var workExp = user.workExperience || [];
      if (workExp.length === 0) {
        expList.appendChild(makeExperienceRow());
      } else {
        workExp.forEach(function (item) { expList.appendChild(makeExperienceRow(item)); });
      }
    }

    // Profile image preview
    if (user.profileImage) {
      var img = document.querySelector('.avatar-xxxl img, .avatar.avatar-xxxl img');
      if (img) img.src = user.profileImage;
    }
  }

  function setVal(id, value) {
    var el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'TEXTAREA') { el.textContent = value; } else { el.value = value; }
  }

  // Escape for use in HTML attribute values
  function esc(val) {
    return (val || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  // ─── Load profile from API ────────────────────────────────────────────────

  async function loadProfile() {
    var cached = typeof AlKahafSession !== 'undefined' ? AlKahafSession.getUser() : JSON.parse(localStorage.getItem('user') || 'null');
    if (cached) populateForm(cached);

    try {
      var res = await fetch(BASE_URL + '/auth/me', { headers: API_CONFIG.getHeaders(true) });
      if (res.ok) {
        var raw = await res.json();
        var user = typeof AlKahafSession !== 'undefined'
          ? (AlKahafSession.normalizeUserPayload(raw) || raw)
          : raw;
        if (typeof AlKahafSession !== 'undefined') AlKahafSession.setUser(user);
        else localStorage.setItem('user', JSON.stringify(user));
        populateForm(user);
      }
    } catch (e) {
      console.warn('Could not refresh profile:', e.message);
    }
  }

  // ─── Alert ────────────────────────────────────────────────────────────────

  function showAlert(msg, type) {
    var existing = document.getElementById('profile-save-alert');
    if (existing) existing.remove();
    var alert = document.createElement('div');
    alert.id = 'profile-save-alert';
    alert.className = 'alert alert-' + type + ' alert-dismissible fade show mt-3';
    alert.innerHTML = msg + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    var form = document.getElementById('profile-form');
    if (form) form.insertAdjacentElement('afterbegin', alert);
    setTimeout(function () {
      if (alert.parentElement) { alert.classList.remove('show'); setTimeout(function () { if (alert.parentElement) alert.remove(); }, 300); }
    }, 4000);
  }

  // ─── Handle form submit ───────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();

    var btn = document.getElementById('save-profile-btn');
    var originalText = btn ? btn.textContent : 'Update Profile';
    if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }

    var firstName   = (document.getElementById('firstName')   || {}).value || '';
    var lastName    = (document.getElementById('lastName')    || {}).value || '';
    var phone       = (document.getElementById('phone')       || {}).value || '';
    var designation = (document.getElementById('designation') || {}).value || '';
    var bio         = (document.getElementById('bio')         || {}).value || '';

    if (!firstName.trim() || !lastName.trim()) {
      showAlert('First name and last name are required.', 'danger');
      if (btn) { btn.disabled = false; btn.textContent = originalText; }
      return;
    }

    var payload = {
      firstName:      firstName.trim(),
      lastName:       lastName.trim(),
      phone:          phone.trim(),
      designation:    designation.trim(),
      bio:            bio.trim(),
      education:      serializeEducation(),
      workExperience: serializeExperience()
    };

    try {
      var res = await fetch(BASE_URL + '/auth/profile', {
        method: 'PUT',
        headers: API_CONFIG.getHeaders(true),
        body: JSON.stringify(payload)
      });
      var data = await res.json();

      if (res.ok) {
        if (typeof AlKahafSession !== 'undefined') AlKahafSession.mergeUser(payload);
        else {
          var current = JSON.parse(localStorage.getItem('user') || '{}');
          Object.assign(current, payload);
          localStorage.setItem('user', JSON.stringify(current));
        }
        showAlert('Profile updated successfully!', 'success');
      } else {
        showAlert(data.message || 'Failed to update profile.', 'danger');
      }
    } catch (err) {
      showAlert('Network error. Please try again.', 'danger');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = originalText; }
    }
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    loadProfile();

    // Add row buttons
    var addEdu = document.getElementById('add-education-btn');
    if (addEdu) {
      addEdu.addEventListener('click', function () {
        var list = document.getElementById('education-list');
        if (list) list.appendChild(makeEducationRow());
      });
    }

    var addExp = document.getElementById('add-experience-btn');
    if (addExp) {
      addExp.addEventListener('click', function () {
        var list = document.getElementById('experience-list');
        if (list) list.appendChild(makeExperienceRow());
      });
    }

    var form = document.getElementById('profile-form');
    if (form) form.addEventListener('submit', handleSubmit);
  });

})();
