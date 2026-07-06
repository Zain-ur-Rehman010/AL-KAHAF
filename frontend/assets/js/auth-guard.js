// Auth Guard — runs immediately on every dashboard page.
// Detects required role from URL path (/admin/, /instructor/, /student/),
// validates JWT from localStorage, redirects to login if no token or wrong role.
(function () {
  var path = window.location.pathname;

  // Pages that live under a role folder but are actually public
  // (e.g. instructor-details is a public instructor profile page,
  // linked from course listings for anyone, logged in or not)
  var publicPages = ['/instructor/instructor-details'];
  if (publicPages.indexOf(path.replace(/\/$/, '')) !== -1) return;

  // Determine required role from URL segment
  var required = null;
  if (path.indexOf('/admin/') !== -1)      required = 'admin';
  else if (path.indexOf('/instructor/') !== -1) required = 'instructor';
  else if (path.indexOf('/student/') !== -1)    required = 'student';

  // Not a protected dashboard path — do nothing
  if (!required) return;

  var token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.replace('/auth/login?redirect=' + encodeURIComponent(path));
    return;
  }

  // Decode JWT payload (base64url → JSON) without verifying signature
  // Signature is verified server-side on every API call; this is a UX guard only
  try {
    var parts = token.split('.');
    if (parts.length !== 3) throw new Error('bad token');
    var payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    // Check expiry
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.replace('/auth/login?redirect=' + encodeURIComponent(path));
      return;
    }

    // Check role
    var role = payload.role;
    if (role !== required) {
      // Wrong role — redirect to their correct dashboard instead of login
      var dest = '/auth/login';
      if (role === 'admin')      dest = '/admin/admin-dashboard';
      else if (role === 'instructor') dest = '/instructor/instructor-dashboard';
      else if (role === 'student')    dest = '/student/student-dashboard';
      window.location.replace(dest);
      return;
    }
  } catch (e) {
    // Malformed token — clear and redirect
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.replace('/auth/login?redirect=' + encodeURIComponent(path));
  }
})();
