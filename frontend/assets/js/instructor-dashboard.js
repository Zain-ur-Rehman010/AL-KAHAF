/**
 * Instructor Dashboard - API Integration
 * Loads real data from backend into the instructor dashboard page.
 * Requires api-config.js and instructor-header.js to be loaded first.
 */

(function () {
  'use strict';

  var BASE_URL = API_CONFIG.BASE_URL;

  function getHeaders() {
    return API_CONFIG.getHeaders(true);
  }

  // Set a stat card value
  function setStat(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // Show loading placeholders on cards
  function showLoading() {
    ['stat-enrolled-courses', 'stat-active-courses', 'stat-completed-courses',
      'stat-students', 'stat-total-courses', 'stat-earnings'].forEach(function (id) {
      setStat(id, '...');
    });
  }

  // Format currency
  function formatCurrency(amount) {
    return '$' + parseFloat(amount || 0).toFixed(2);
  }

  // Render the recently created courses table
  function renderCourses(courses) {
    var tbody = document.getElementById('recent-courses-tbody');
    if (!tbody) return;

    if (!courses || courses.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="3" class="text-center py-4">' +
        'No courses created yet. <a href="/courses/add-course">Create your first course</a>' +
        '</td></tr>';
      return;
    }

    tbody.innerHTML = courses.map(function (course) {
      var thumb = course.thumbnail || course.coverImage || '/assets/img/instructor/instructor-table-01.jpg';

      var statusLabel, statusClass;
      if (course.status === 'published') {
        statusLabel = 'Published';
        statusClass = 'text-success';
      } else if (course.status === 'draft') {
        statusLabel = 'Draft';
        statusClass = 'text-warning';
      } else {
        statusLabel = 'Archived';
        statusClass = 'text-secondary';
      }

      var enrolled = course._enrollmentCount !== undefined ? course._enrollmentCount : 0;

      return '<tr>' +
        '<td>' +
        '<div class="course-title d-flex align-items-center">' +
        '<a href="/instructor/instructor-course" class="avatar avatar-xl flex-shrink-0 me-2">' +
        '<img src="' + thumb + '" alt="' + escapeHtml(course.title) + '" ' +
        'onerror="this.src=\'/assets/img/instructor/instructor-table-01.jpg\'">' +
        '</a>' +
        '<div><p class="fw-medium"><a href="/instructor/instructor-course">' + escapeHtml(course.title) + '</a></p></div>' +
        '</div>' +
        '</td>' +
        '<td>' + enrolled + '</td>' +
        '<td class="' + statusClass + ' fw-medium">' + statusLabel + '</td>' +
        '</tr>';
    }).join('');
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text || ''));
    return div.innerHTML;
  }

  // Main dashboard loader
  async function loadDashboard() {
    showLoading();

    try {
      // Fetch instructor's courses (get up to 100 for stats calculation)
      var coursesRes = await fetch(BASE_URL + '/users/taught-courses?limit=100', {
        headers: getHeaders()
      });

      if (!coursesRes.ok) {
        console.error('Failed to load courses, status:', coursesRes.status);
        setStat('stat-total-courses', '0');
        setStat('stat-active-courses', '0');
        setStat('stat-completed-courses', '0');
        setStat('stat-enrolled-courses', '0');
        setStat('stat-students', '0');
        setStat('stat-earnings', '$0.00');
        renderCourses([]);
        return;
      }

      var coursesData = await coursesRes.json();
      var courses = coursesData.courses || [];
      var totalCourses = (coursesData.pagination && coursesData.pagination.total) || courses.length;

      // Calculate counts from course statuses
      var activeCourses = courses.filter(function (c) { return c.status === 'published'; }).length;
      var archivedCourses = courses.filter(function (c) { return c.status === 'archived'; }).length;

      // Update course counts immediately
      setStat('stat-total-courses', totalCourses);
      setStat('stat-active-courses', activeCourses);
      setStat('stat-completed-courses', archivedCourses);

      // Fetch per-course enrollment stats in parallel (limit to 20 to avoid too many requests)
      var totalStudents = 0;
      var totalEarnings = 0;

      if (courses.length > 0) {
        var statsPromises = courses.slice(0, 20).map(function (course) {
          return fetch(BASE_URL + '/courses/' + course.id + '/stats', {
            headers: getHeaders()
          })
            .then(function (r) {
              if (!r.ok) return { totalEnrollments: 0 };
              return r.json();
            })
            .then(function (stats) {
              var enrolled = stats.totalEnrollments || 0;
              course._enrollmentCount = enrolled;
              totalStudents += enrolled;
              totalEarnings += enrolled * (parseFloat(course.price) || 0);
            })
            .catch(function () {
              course._enrollmentCount = 0;
            });
        });

        await Promise.all(statsPromises);
      }

      // Update student and earnings stats
      setStat('stat-enrolled-courses', totalStudents);
      setStat('stat-students', totalStudents);
      setStat('stat-earnings', formatCurrency(totalEarnings));

      // Render most recent 5 courses in the table
      renderCourses(courses.slice(0, 5));

    } catch (err) {
      console.error('Dashboard load error:', err);
      // Show zeros on error rather than leaving '...'
      setStat('stat-total-courses', '0');
      setStat('stat-active-courses', '0');
      setStat('stat-completed-courses', '0');
      setStat('stat-enrolled-courses', '0');
      setStat('stat-students', '0');
      setStat('stat-earnings', '$0.00');
      renderCourses([]);
    }
  }

  // ─── Profile Completion Widget ────────────────────────────────────────────
  function loadProfileCompletion() {
    var user = JSON.parse(localStorage.getItem('user') || 'null');
    var card = document.getElementById('profile-completion-card');
    if (!user || !card) return;

    // Fields that define a complete instructor profile
    var checks = [
      { label: 'Profile Photo',  done: !!user.profileImage },
      { label: 'Phone Number',   done: !!user.phone },
      { label: 'Bio',            done: !!user.bio },
      { label: 'Designation',    done: !!user.designation }
    ];

    // Name always counts as done (required on registration)
    var totalItems  = checks.length + 1;
    var doneItems   = checks.filter(function (c) { return c.done; }).length + 1;
    var pct         = Math.round((doneItems / totalItems) * 100);

    // Hide card when profile is fully complete
    if (pct >= 100) {
      card.style.display = 'none';
      return;
    }
    card.style.display = 'block';

    // Update percentage badge and progress bar
    var pctEl = document.getElementById('completion-pct');
    var barEl  = document.getElementById('completion-bar');
    if (pctEl) pctEl.textContent = pct + '%';
    if (barEl)  barEl.style.width = pct + '%';

    // Render checklist badges
    var listEl = document.getElementById('completion-checklist');
    if (listEl) {
      var nameChip = '<span class="badge bg-success-light text-success">' +
        '<i class="isax isax-tick-circle5 me-1"></i>Name</span>';

      var chips = checks.map(function (c) {
        if (c.done) {
          return '<span class="badge bg-success-light text-success">' +
            '<i class="isax isax-tick-circle5 me-1"></i>' + c.label + '</span>';
        }
        return '<span class="badge bg-warning-light text-warning">' +
          '<i class="isax isax-info-circle me-1"></i>' + c.label + '</span>';
      });

      listEl.innerHTML = nameChip + chips.join('');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadProfileCompletion();
    loadDashboard();
  });

})();
