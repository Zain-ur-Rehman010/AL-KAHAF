# Corrected script to update internal page links

$pagesDir = ".\src\pages"

# Define mapping of files to their folder locations
$pageLocations = @{
    # Auth pages
    "login.html" = "auth"
    "register.html" = "auth"
    "forgot-password.html" = "auth"
    "set-password.html" = "auth"
    "otp.html" = "auth"
    "lock-screen.html" = "auth"
    # Course pages
    "course-details.html" = "courses"
    "course-details-2.html" = "courses"
    "course-list.html" = "courses"
    "course-grid.html" = "courses"
    "course-category.html" = "courses"
    "course-category-2.html" = "courses"
    "course-category-3.html" = "courses"
    "course-watch.html" = "courses"
    "course-resume.html" = "courses"
    "add-course.html" = "courses"
    # Student pages
    "student-dashboard.html" = "student"
    "student-courses.html" = "student"
    "student-certificates.html" = "student"
    "student-messages.html" = "student"
    "student-profile.html" = "student"
    "student-settings.html" = "student"
    "student-details.html" = "student"
    "student-billing-address.html" = "student"
    "student-linked-accounts.html" = "student"
    "student-list.html" = "student"
    "student-notifications.html" = "student"
    "student-order-history.html" = "student"
    "student-quiz.html" = "student"
    "student-quiz-questions.html" = "student"
    "student-referral.html" = "student"
    "student-reviews.html" = "student"
    "student-social-profile.html" = "student"
    "student-tickets.html" = "student"
    "student-wishlist.html" = "student"
    "students.html" = "student"
    "student-change-password.html" = "student"
    # Instructor pages
    "instructor-dashboard.html" = "instructor"
    "instructor-courses.html" = "instructor"
    "instructor-course.html" = "instructor"
    "instructor-profile.html" = "instructor"
    "instructor-earnings.html" = "instructor"
    "instructor-students.html" = "instructor"
    "instructor-announcements.html" = "instructor"
    "instructor-assignment.html" = "instructor"
    "instructor-certificate.html" = "instructor"
    "instructor-change-password.html" = "instructor"
    "instructor-course-grid.html" = "instructor"
    "instructor-details.html" = "instructor"
    "instructor-grid.html" = "instructor"
    "instructor-integrations.html" = "instructor"
    "instructor-linked-accounts.html" = "instructor"
    "instructor-list.html" = "instructor"
    "instructor-message.html" = "instructor"
    "instructor-notifications.html" = "instructor"
    "instructor-payout.html" = "instructor"
    "instructor-plans.html" = "instructor"
    "instructor-quiz.html" = "instructor"
    "instructor-quiz-questions.html" = "instructor"
    "instructor-quiz-results.html" = "instructor"
    "instructor-settings.html" = "instructor"
    "instructor-social-profiles.html" = "instructor"
    "instructor-statements.html" = "instructor"
    "instructor-tickets.html" = "instructor"
    "instructor-withdraw.html" = "instructor"
    # Blog pages
    "blog-grid.html" = "blog"
    "blog-2-grid.html" = "blog"
    "blog-3-grid.html" = "blog"
    "blog-details.html" = "blog"
    "blog-details-left-sidebar.html" = "blog"
    "blog-details-right-sidebar.html" = "blog"
    "blog-masonry.html" = "blog"
    "blog-left-sidebar.html" = "blog"
    "blog-right-sidebar.html" = "blog"
    "blog-carousal.html" = "blog"
    # Shared pages (all in shared folder)
}

# All remaining HTML files go to shared
Get-ChildItem -Path $pagesDir -Filter "*.html" -Recurse | ForEach-Object {
    if (-not $pageLocations.Contains($_.Name)) {
        $pageLocations[$_.Name] = "shared"
    }
}

$htmlFiles = Get-ChildItem -Path $pagesDir -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Get current folder (auth, courses, student, etc.)
    $currentFolder = $file.Directory.BaseName
    
    # Replace all problematic absolute paths with relative ones
    foreach ($pageName in $pageLocations.Keys) {
        $targetFolder = $pageLocations[$pageName]
        
        # Remove absolute paths first
        $content = $content -replace "href=`"[^`"]*[/\\]$pageName", "href=`"TEMP_$pageName"
    }
    
    # Now convert TEMP placeholders to proper relative paths
    foreach ($pageName in $pageLocations.Keys) {
        $targetFolder = $pageLocations[$pageName]
        $currentFolder = $file.Directory.BaseName
        
        if ($currentFolder -eq $targetFolder) {
            # Same folder
            $relativePath = $pageName
        } else {
            # Different folder - need to go up and across
            $relativePath = "../$targetFolder/$pageName"
        }
        
        $content = $content -replace "href=`"TEMP_$pageName", "href=`"$relativePath"
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host " Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Link correction complete!" -ForegroundColor Green
