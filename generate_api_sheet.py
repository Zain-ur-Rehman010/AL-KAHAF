"""
Generates AlKahaf LMS — API Endpoint Testing Sheet (Excel)
Matches style of the reference screenshot:
  Col A  Group (merged, coloured)
  Col B  Full endpoint path
  Col C  Controller.method
  Col D  HTTP Method  (coloured badge)
  Col E  Authorization
  Col F  Summary
"""

from openpyxl import Workbook
from openpyxl.styles import (
    PatternFill, Font, Alignment, Border, Side, GradientFill
)
from openpyxl.utils import get_column_letter

# ── Colour palette ─────────────────────────────────────────────────────────────
HEADER_BG   = "1F3864"   # dark navy
HEADER_FG   = "FFFFFF"

GROUP_COLORS = {
    "Auth":                    ("D0E4FF", "1A3C6E"),
    "Users":                   ("D4EDDA", "155724"),
    "Courses":                 ("FFF3CD", "856404"),
    "Enrollments":             ("F8D7DA", "721C24"),
    "Admin":                   ("E2D9F3", "4B2E7E"),
    "Notifications":           ("D1ECF1", "0C5460"),
    "Blogs":                   ("FDEBD0", "7E4809"),
    "Free Trial":              ("D6EAF8", "1A5276"),
    "Payments":                ("D5F5E3", "1E8449"),
    "Welfare":                 ("FDEDEC", "922B21"),
    "Instructor Applications": ("E8F8F5", "1A6345"),
    "Instructor Students":     ("F4ECF7", "6C3483"),
    "Contact":                 ("FEF9E7", "7D6608"),
    "Upload":                  ("EAEDED", "424949"),
}

METHOD_COLORS = {
    "GET":    ("D4EDDA", "155724"),
    "POST":   ("CCE5FF", "004085"),
    "PUT":    ("FFF3CD", "856404"),
    "DELETE": ("F8D7DA", "721C24"),
    "PATCH":  ("E2D9F3", "4B2E7E"),
}

# ── Endpoint data ──────────────────────────────────────────────────────────────
BASE = "/api/v1"

endpoints = [
    # (group, path, controller, method, auth, summary)

    # ── Auth ──────────────────────────────────────────────────────────────────
    ("Auth", f"{BASE}/auth/check-email",          "authController.checkEmail",        "GET",    "Public",              "Check if email is already registered"),
    ("Auth", f"{BASE}/auth/register",             "authController.register",          "POST",   "Public",              "Register a new user account"),
    ("Auth", f"{BASE}/auth/verify-otp",           "authController.verifyOtp",         "POST",   "Public",              "Verify email OTP after registration"),
    ("Auth", f"{BASE}/auth/resend-otp",           "authController.resendOtp",         "POST",   "Public",              "Resend email verification OTP"),
    ("Auth", f"{BASE}/auth/forgot-password",      "authController.forgotPassword",    "POST",   "Public",              "Initiate forgot-password flow"),
    ("Auth", f"{BASE}/auth/verify-reset-otp",     "authController.verifyResetOtp",    "POST",   "Public",              "Verify OTP for password reset"),
    ("Auth", f"{BASE}/auth/reset-password",       "authController.resetPassword",     "POST",   "Public",              "Set new password after OTP verified"),
    ("Auth", f"{BASE}/auth/login",                "authController.login",             "POST",   "Public",              "Login with email + password"),
    ("Auth", f"{BASE}/auth/verify-login-otp",     "authController.verifyLoginOtp",    "POST",   "Public",              "Verify 2FA OTP on login"),
    ("Auth", f"{BASE}/auth/resend-login-otp",     "authController.resendLoginOtp",    "POST",   "Public",              "Resend login OTP"),
    ("Auth", f"{BASE}/auth/refresh-token",        "authController.refreshToken",      "POST",   "Public",              "Exchange refresh token for new access token"),
    ("Auth", f"{BASE}/auth/logout",               "authController.logout",            "POST",   "Authenticated",       "Logout and invalidate refresh token"),
    ("Auth", f"{BASE}/auth/me",                   "authController.getCurrentUser",    "GET",    "Authenticated",       "Get currently authenticated user"),
    ("Auth", f"{BASE}/auth/profile",              "authController.updateProfile",     "PUT",    "Authenticated",       "Update own profile (name, avatar, bio…)"),
    ("Auth", f"{BASE}/auth/change-password",      "authController.changePassword",    "POST",   "Authenticated",       "Change own password"),

    # ── Users ─────────────────────────────────────────────────────────────────
    ("Users", f"{BASE}/users/:userId/profile",    "userController.getUserProfile",         "GET",    "Public",              "Get public profile of any user"),
    ("Users", f"{BASE}/users/instructors",        "userController.getInstructors",         "GET",    "Public",              "List all active instructors"),
    ("Users", f"{BASE}/users/stats",              "userController.getUserStats",           "GET",    "Authenticated",       "Get stats for the current user"),
    ("Users", f"{BASE}/users/taught-courses",     "userController.getMyInstructedCourses", "GET",    "Authenticated",       "Get courses the instructor teaches"),
    ("Users", f"{BASE}/users",                    "userController.getAllUsers",             "GET",    "Authenticated (Admin)","List all users (admin view)"),
    ("Users", f"{BASE}/users/:userId/status",     "userController.updateUserStatus",       "PUT",    "Authenticated (Admin)","Activate / deactivate a user"),
    ("Users", f"{BASE}/users/:userId",            "userController.deleteUser",             "DELETE", "Authenticated (Admin)","Permanently delete a user"),

    # ── Courses ───────────────────────────────────────────────────────────────
    ("Courses", f"{BASE}/courses",                          "courseController.createCourse",           "POST",   "Instructor / Admin",  "Create a new course"),
    ("Courses", f"{BASE}/courses",                          "courseController.getCourses",             "GET",    "Public",              "List published courses (paginated)"),
    ("Courses", f"{BASE}/courses/categories",               "courseController.getCategories",          "GET",    "Public",              "Get available course categories"),
    ("Courses", f"{BASE}/courses/search",                   "courseController.searchCourses",          "GET",    "Public",              "Full-text search for courses"),
    ("Courses", f"{BASE}/courses/my/courses",               "courseController.getMyCourses",           "GET",    "Instructor / Admin",  "Get own created courses"),
    ("Courses", f"{BASE}/courses/:id",                      "courseController.getCourseById",          "GET",    "Public",              "Get full detail of a single course"),
    ("Courses", f"{BASE}/courses/:id",                      "courseController.updateCourse",           "PUT",    "Authenticated",       "Update course details"),
    ("Courses", f"{BASE}/courses/:id",                      "courseController.deleteCourse",           "DELETE", "Authenticated",       "Delete a course"),
    ("Courses", f"{BASE}/courses/:id/publish",              "courseController.publishCourse",          "POST",   "Admin",               "Publish / approve a course"),
    ("Courses", f"{BASE}/courses/:id/submit-for-approval",  "courseController.submitCourseForApproval","POST",   "Instructor / Admin",  "Submit course for admin review"),
    ("Courses", f"{BASE}/courses/:id/stats",                "courseController.getCourseStats",         "GET",    "Authenticated",       "Get enrolment & revenue stats"),
    ("Courses", f"{BASE}/courses/:courseId/modules",        "moduleController.createModule",           "POST",   "Instructor / Admin",  "Add a new module to a course"),
    ("Courses", f"{BASE}/courses/:courseId/modules",        "moduleController.getModules",             "GET",    "Authenticated",       "List modules of a course"),
    ("Courses", f"{BASE}/courses/:courseId/modules/:moduleId/lessons","lessonController.createLesson", "POST",   "Instructor / Admin",  "Add a lesson to a module"),

    # ── Enrollments ───────────────────────────────────────────────────────────
    ("Enrollments", f"{BASE}/enrollments",                               "enrollmentController.enrollCourse",        "POST",   "Student / Admin",     "Enrol a student in a course"),
    ("Enrollments", f"{BASE}/enrollments/my-enrollments",               "enrollmentController.getMyEnrollments",    "GET",    "Authenticated",       "Get own enrolments"),
    ("Enrollments", f"{BASE}/enrollments/my-certificates",              "enrollmentController.getMyCertificates",   "GET",    "Authenticated",       "Get own certificates"),
    ("Enrollments", f"{BASE}/enrollments/:enrollmentId",                "enrollmentController.getEnrollmentById",   "GET",    "Authenticated",       "Get single enrolment detail"),
    ("Enrollments", f"{BASE}/enrollments/:enrollmentId/progress",       "enrollmentController.updateProgress",      "PUT",    "Authenticated",       "Update lesson progress"),
    ("Enrollments", f"{BASE}/enrollments/:enrollmentId/drop",           "enrollmentController.dropCourse",          "POST",   "Authenticated",       "Drop / withdraw from a course"),
    ("Enrollments", f"{BASE}/enrollments/course/:courseId/enrollments", "enrollmentController.getCourseEnrollments","GET",    "Instructor / Admin",  "List all students in a course"),
    ("Enrollments", f"{BASE}/enrollments/:enrollmentId/certificate",    "enrollmentController.issueCertificate",    "POST",   "Instructor / Admin",  "Issue completion certificate"),

    # ── Admin ─────────────────────────────────────────────────────────────────
    ("Admin", f"{BASE}/admin/statistics",                    "adminController.getDashboardStatistics",   "GET",    "Admin",               "Dashboard KPIs & statistics"),
    ("Admin", f"{BASE}/admin/recent-enrollments",            "adminController.getRecentEnrollments",     "GET",    "Admin",               "Latest enrolments"),
    ("Admin", f"{BASE}/admin/enrollment-trends",             "adminController.getEnrollmentTrends",      "GET",    "Admin",               "Enrolment trend over time"),
    ("Admin", f"{BASE}/admin/top-courses",                   "adminController.getTopCourses",            "GET",    "Admin",               "Most enrolled courses"),
    ("Admin", f"{BASE}/admin/recent-registrations",          "adminController.getRecentRegistrations",   "GET",    "Admin",               "Newest registered users"),
    ("Admin", f"{BASE}/admin/instructors",                   "adminController.getAllInstructors",         "GET",    "Admin",               "List all instructors"),
    ("Admin", f"{BASE}/admin/instructors/:id",               "adminController.getInstructorById",        "GET",    "Admin",               "Get instructor detail"),
    ("Admin", f"{BASE}/admin/instructors/:id",               "adminController.updateInstructor",         "PUT",    "Admin",               "Update instructor profile"),
    ("Admin", f"{BASE}/admin/instructors/:id",               "adminController.deleteInstructor",         "DELETE", "Admin",               "Delete an instructor"),
    ("Admin", f"{BASE}/admin/courses",                       "adminController.getAllCourses",             "GET",    "Admin",               "List all courses (any status)"),
    ("Admin", f"{BASE}/admin/courses/statistics",            "adminController.getCourseStatistics",      "GET",    "Admin",               "Course-level statistics"),
    ("Admin", f"{BASE}/admin/courses/:id/status",            "adminController.updateCourseStatus",       "PATCH",  "Admin",               "Change course status (approve/archive)"),
    ("Admin", f"{BASE}/admin/enrollments",                   "adminController.getAllEnrollments",         "GET",    "Admin",               "List all enrolments"),
    ("Admin", f"{BASE}/admin/enrollments/statistics",        "adminController.getEnrollmentStatistics",  "GET",    "Admin",               "Enrolment statistics"),
    ("Admin", f"{BASE}/admin/enrollments/:id",               "adminController.getEnrollmentById",        "GET",    "Admin",               "Get enrolment detail"),
    ("Admin", f"{BASE}/admin/enrollments",                   "adminController.createEnrollment",         "POST",   "Admin",               "Manually create an enrolment"),
    ("Admin", f"{BASE}/admin/enrollments/:id",               "adminController.updateEnrollment",         "PUT",    "Admin",               "Update enrolment record"),
    ("Admin", f"{BASE}/admin/enrollments/:id",               "adminController.deleteEnrollment",         "DELETE", "Admin",               "Delete an enrolment"),
    ("Admin", f"{BASE}/admin/settings",                      "adminController.getSettings",              "GET",    "Admin",               "Get site-wide settings"),
    ("Admin", f"{BASE}/admin/settings",                      "adminController.updateSettings",           "PUT",    "Admin",               "Update site-wide settings"),
    ("Admin", f"{BASE}/admin/predefined-courses",            "adminController.getPredefinedCourses",     "GET",    "Admin",               "List predefined course catalogue"),
    ("Admin", f"{BASE}/admin/predefined-courses",            "adminController.createPredefinedCourse",   "POST",   "Admin",               "Add predefined course"),
    ("Admin", f"{BASE}/admin/predefined-courses/:id",        "adminController.updatePredefinedCourse",   "PUT",    "Admin",               "Update predefined course"),
    ("Admin", f"{BASE}/admin/predefined-courses/:id",        "adminController.deletePredefinedCourse",   "DELETE", "Admin",               "Delete predefined course"),
    ("Admin", f"{BASE}/admin/instructors/:id/courses",       "adminController.getInstructorCourses",     "GET",    "Admin",               "Get courses assigned to instructor"),
    ("Admin", f"{BASE}/admin/instructors/:id/courses",       "adminController.syncInstructorCourses",    "POST",   "Admin",               "Sync / assign courses to instructor"),
    ("Admin", f"{BASE}/admin/instructors/:id/courses/:courseId","adminController.removeInstructorCourse","DELETE", "Admin",               "Remove course from instructor"),

    # ── Notifications ─────────────────────────────────────────────────────────
    ("Notifications", f"{BASE}/notifications",         "notificationController.getNotifications",  "GET",    "Authenticated",       "Get notifications for current user"),
    ("Notifications", f"{BASE}/notifications/read-all","notificationController.markAllAsRead",     "PATCH",  "Authenticated",       "Mark all notifications as read"),
    ("Notifications", f"{BASE}/notifications/:id/read","notificationController.markAsRead",        "PATCH",  "Authenticated",       "Mark single notification as read"),
    ("Notifications", f"{BASE}/notifications/:id",     "notificationController.deleteNotification","DELETE", "Authenticated",       "Delete a notification"),
    ("Notifications", f"{BASE}/notifications",         "notificationController.createNotification","POST",   "Authenticated",       "Create a notification (internal)"),

    # ── Blogs ─────────────────────────────────────────────────────────────────
    ("Blogs", f"{BASE}/blogs",               "blogController.getBlogs",          "GET",    "Public",              "List published blogs (paginated + filter)"),
    ("Blogs", f"{BASE}/blogs/slug/:slug",    "blogController.getBlogBySlug",     "GET",    "Public",              "Get blog post by URL slug"),
    ("Blogs", f"{BASE}/blogs/admin/all",     "blogController.getAllBlogsAdmin",  "GET",    "Admin",               "Admin list all blogs (any status)"),
    ("Blogs", f"{BASE}/blogs/admin/:id",     "blogController.getBlogById",       "GET",    "Admin",               "Admin get single blog by ID"),
    ("Blogs", f"{BASE}/blogs",               "blogController.createBlog",        "POST",   "Admin",               "Create a new blog post"),
    ("Blogs", f"{BASE}/blogs/:id",           "blogController.updateBlog",        "PUT",    "Admin",               "Update blog post"),
    ("Blogs", f"{BASE}/blogs/:id/toggle-publish","blogController.togglePublish", "PATCH",  "Admin",               "Toggle blog publish status"),
    ("Blogs", f"{BASE}/blogs/:id",           "blogController.deleteBlog",        "DELETE", "Admin",               "Delete a blog post"),

    # ── Free Trial ────────────────────────────────────────────────────────────
    ("Free Trial", f"{BASE}/free-trial/courses",  "freeTrialController.getPublicCourses","GET",    "Public",              "Get courses available for free trial"),
    ("Free Trial", f"{BASE}/free-trial",          "freeTrialController.create",          "POST",   "Public",              "Submit a free trial request"),
    ("Free Trial", f"{BASE}/free-trial",          "freeTrialController.getAll",           "GET",    "Admin",               "Admin list all free trial requests"),
    ("Free Trial", f"{BASE}/free-trial/:id/status","freeTrialController.updateStatus",   "PATCH",  "Admin",               "Update free trial request status"),

    # ── Payments ──────────────────────────────────────────────────────────────
    ("Payments", f"{BASE}/payments/jazzcash/initiate", "paymentController.initiateJazzCash", "POST",  "Authenticated",          "Initiate a JazzCash payment for a course"),
    ("Payments", f"{BASE}/payments/jazzcash/callback", "paymentController.jazzcashCallback", "POST",  "Public (JazzCash only)", "JazzCash IPN callback (no user auth)"),
    ("Payments", f"{BASE}/payments/my-payments",       "paymentController.getMyPayments",    "GET",   "Authenticated",          "Get own payment history"),

    # ── Welfare ───────────────────────────────────────────────────────────────
    ("Welfare", f"{BASE}/welfare/programs",               "welfareController.getPrograms",          "GET",    "Public",              "List active welfare programs"),
    ("Welfare", f"{BASE}/welfare/programs/:id",           "welfareController.getProgramById",       "GET",    "Public",              "Get welfare program detail"),
    ("Welfare", f"{BASE}/welfare/donations",              "welfareController.createDonation",       "POST",   "Public",              "Submit a donation"),
    ("Welfare", f"{BASE}/welfare/programs",               "welfareController.createProgram",        "POST",   "Admin",               "Create a welfare program"),
    ("Welfare", f"{BASE}/welfare/programs/:id",           "welfareController.updateProgram",        "PUT",    "Admin",               "Update a welfare program"),
    ("Welfare", f"{BASE}/welfare/programs/:id",           "welfareController.deleteProgram",        "DELETE", "Admin",               "Delete a welfare program"),
    ("Welfare", f"{BASE}/welfare/donations",              "welfareController.getDonations",         "GET",    "Admin",               "List all donations"),
    ("Welfare", f"{BASE}/welfare/donations/:id/status",   "welfareController.updateDonationStatus", "PATCH",  "Admin",               "Update donation status"),
    ("Welfare", f"{BASE}/welfare/stats",                  "welfareController.getWelfareStats",      "GET",    "Admin",               "Get welfare stats summary"),

    # ── Instructor Applications ───────────────────────────────────────────────
    ("Instructor Applications", f"{BASE}/instructor-applications",           "instructorApplicationController.submitApplication", "POST",   "Public",              "Submit become-an-instructor application"),
    ("Instructor Applications", f"{BASE}/instructor-applications",           "instructorApplicationController.getApplications",   "GET",    "Admin",               "List all instructor applications"),
    ("Instructor Applications", f"{BASE}/instructor-applications/:id",       "instructorApplicationController.getApplicationById","GET",    "Admin",               "Get single application detail"),
    ("Instructor Applications", f"{BASE}/instructor-applications/:id/approve","instructorApplicationController.approveApplication","PATCH",  "Admin",               "Approve instructor application"),
    ("Instructor Applications", f"{BASE}/instructor-applications/:id/reject", "instructorApplicationController.rejectApplication", "PATCH",  "Admin",               "Reject instructor application"),
    ("Instructor Applications", f"{BASE}/instructor-applications/:id",       "instructorApplicationController.deleteApplication", "DELETE", "Admin",               "Delete an instructor application"),

    # ── Instructor Students ───────────────────────────────────────────────────
    ("Instructor Students", f"{BASE}/instructor-students/my/students",         "instructorStudentController.getMyStudents",    "GET",    "Instructor / Admin",  "Get students assigned to current instructor"),
    ("Instructor Students", f"{BASE}/instructor-students/assign",              "instructorStudentController.assignStudents",   "POST",   "Admin",               "Assign students to an instructor"),
    ("Instructor Students", f"{BASE}/instructor-students/:instructorId",       "instructorStudentController.getAssignedStudents","GET",  "Instructor / Admin",  "Get students assigned to a specific instructor"),
    ("Instructor Students", f"{BASE}/instructor-students/:instructorId/:studentId","instructorStudentController.removeStudent","DELETE", "Admin",               "Remove a student from an instructor"),

    # ── Contact ───────────────────────────────────────────────────────────────
    ("Contact", f"{BASE}/contact", "contactController.submit", "POST", "Public", "Submit a contact-us form message"),

    # ── Upload ────────────────────────────────────────────────────────────────
    ("Upload", f"{BASE}/upload",   "uploadRoutes (inline)",    "POST", "Authenticated", "Upload image to Cloudinary (query: ?folder=courses|instructors|blogs|welfare)"),
]

# ── Build workbook ─────────────────────────────────────────────────────────────
wb = Workbook()
ws = wb.active
ws.title = "API Endpoints"

# Column widths
col_widths = [22, 62, 45, 10, 28, 60]
for i, w in enumerate(col_widths, 1):
    ws.column_dimensions[get_column_letter(i)].width = w

ws.freeze_panes = "A3"

# ── Header row 1 — title banner ────────────────────────────────────────────────
ws.merge_cells("A1:F1")
title_cell = ws["A1"]
title_cell.value = "AlKahaf LMS — API Endpoint Reference"
title_cell.font   = Font(name="Calibri", bold=True, size=14, color=HEADER_FG)
title_cell.fill   = PatternFill("solid", fgColor=HEADER_BG)
title_cell.alignment = Alignment(horizontal="center", vertical="center")
ws.row_dimensions[1].height = 28

# ── Header row 2 — column labels ──────────────────────────────────────────────
headers = ["Group", "Endpoint", "Controller", "Method", "Auth", "Summary"]
for col, h in enumerate(headers, 1):
    c = ws.cell(row=2, column=col, value=h)
    c.font      = Font(name="Calibri", bold=True, size=10, color=HEADER_FG)
    c.fill      = PatternFill("solid", fgColor="2E4057")
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
ws.row_dimensions[2].height = 20

def thin_border():
    s = Side(style="thin", color="CCCCCC")
    return Border(left=s, right=s, top=s, bottom=s)

def fill(hex_color):
    return PatternFill("solid", fgColor=hex_color)

# ── Data rows ─────────────────────────────────────────────────────────────────
ROW_START = 3
current_group   = None
group_start_row = ROW_START

# Walk through and write, tracking group merge ranges
rows_by_group = []  # [(group, start_row, end_row)]

for row_idx, (group, path, ctrl, method, auth, summary) in enumerate(endpoints, ROW_START):
    # Track group boundaries for merging later
    if group != current_group:
        if current_group is not None:
            rows_by_group.append((current_group, group_start_row, row_idx - 1))
        current_group   = group
        group_start_row = row_idx
# Close last group
if current_group:
    rows_by_group.append((current_group, group_start_row, ROW_START + len(endpoints) - 1))

# Write data (no group cell text yet — we'll merge + write after)
for row_idx, (group, path, ctrl, method, auth, summary) in enumerate(endpoints, ROW_START):
    bg_hex, fg_hex = GROUP_COLORS.get(group, ("F5F5F5", "333333"))
    row_fill = fill(bg_hex)

    # A — group (leave blank; handled via merge below)
    ws.cell(row=row_idx, column=1).fill   = row_fill
    ws.cell(row=row_idx, column=1).border = thin_border()

    # B — endpoint path
    c = ws.cell(row=row_idx, column=2, value=path)
    c.font      = Font(name="Consolas", size=9, color="1A1A1A")
    c.fill      = row_fill
    c.alignment = Alignment(vertical="center", wrap_text=False)
    c.border    = thin_border()

    # C — controller
    c = ws.cell(row=row_idx, column=3, value=ctrl)
    c.font      = Font(name="Consolas", size=9, color=fg_hex)
    c.fill      = row_fill
    c.alignment = Alignment(vertical="center", wrap_text=False)
    c.border    = thin_border()

    # D — HTTP method badge
    m_bg, m_fg = METHOD_COLORS.get(method, ("F5F5F5", "333333"))
    c = ws.cell(row=row_idx, column=4, value=method)
    c.font      = Font(name="Calibri", bold=True, size=9, color=m_fg)
    c.fill      = fill(m_bg)
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border    = thin_border()

    # E — auth
    c = ws.cell(row=row_idx, column=5, value=auth)
    c.font      = Font(name="Calibri", size=9, color=fg_hex)
    c.fill      = row_fill
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = thin_border()

    # F — summary
    c = ws.cell(row=row_idx, column=6, value=summary)
    c.font      = Font(name="Calibri", size=9, color="1A1A1A")
    c.fill      = row_fill
    c.alignment = Alignment(vertical="center", wrap_text=True)
    c.border    = thin_border()

    ws.row_dimensions[row_idx].height = 18

# ── Merge group column A ───────────────────────────────────────────────────────
for group, start, end in rows_by_group:
    bg_hex, fg_hex = GROUP_COLORS.get(group, ("F5F5F5", "333333"))
    if start == end:
        c = ws.cell(row=start, column=1, value=group)
    else:
        ws.merge_cells(start_row=start, start_column=1, end_row=end, end_column=1)
        c = ws.cell(row=start, column=1, value=group)
    c.font      = Font(name="Calibri", bold=True, size=10, color=fg_hex)
    c.fill      = fill(bg_hex)
    c.alignment = Alignment(horizontal="center", vertical="center",
                            wrap_text=True, text_rotation=0)
    c.border    = thin_border()

# ── Auto-filter on header row ──────────────────────────────────────────────────
ws.auto_filter.ref = f"A2:F{ROW_START + len(endpoints) - 1}"

# ── Save ───────────────────────────────────────────────────────────────────────
out = "d:/Personal_Projects/AlKahaf/AlKahaf_API_Endpoints.xlsx"
wb.save(out)
print(f"Saved → {out}  ({len(endpoints)} endpoints)")
