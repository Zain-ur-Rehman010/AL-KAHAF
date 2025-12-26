# PowerShell script to update HTML headers
# Updates: Remove header-topbar, change header-two to header-one, update bar-icon, replace header-btn

$standardHeaderBtn = @'
						<div class="header-btn d-flex align-items-center">
							<!-------Language changer-------->							
							<div class="dropdown language-dropdown">
								<a href="javascript:void(0);" class="dropdown-toggle lang-toggle d-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
									<img src="assets/img/flags/us-flag.svg" class="lang-flag" alt="flag">
									<span class="lang-text">EN</span>
								</a>
								<ul class="dropdown-menu lang-menu">
									<li>
										<a class="dropdown-item lang-item active" href="javascript:void(0);">
											<img src="assets/img/flags/us-flag.svg" alt="flag">
											<span>English</span>
											<i class="isax isax-tick-circle5 check-icon"></i>
										</a>
									</li>
									<li>
										<a class="dropdown-item lang-item" href="javascript:void(0);">
											<img src="assets/img/flags/arab-flag.svg" alt="flag">
											<span>العربية</span>
											<i class="isax isax-tick-circle5 check-icon"></i>
										</a>
									</li>
									<li>
										<a class="dropdown-item lang-item" href="javascript:void(0);">
											<img src="assets/img/flags/france-flag.svg" alt="flag">
											<span>Français</span>
											<i class="isax isax-tick-circle5 check-icon"></i>
										</a>
									</li>
								</ul>
							</div>
							<!-------Currency changer-------->
							<div class="dropdown currency-dropdown">
								<a href="javascript:void(0);" class="dropdown-toggle currency-toggle d-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
									<i class="isax isax-dollar-circle4 currency-icon"></i>
									<span class="currency-text">USD</span>
								</a>
								<ul class="dropdown-menu currency-menu">
									<li>
										<a class="dropdown-item currency-item active" href="javascript:void(0);">
											<span class="currency-symbol">$</span>
											<span>USD - US Dollar</span>
											<i class="isax isax-tick-circle5 check-icon"></i>
										</a>
									</li>
									<li>
										<a class="dropdown-item currency-item" href="javascript:void(0);">
											<span class="currency-symbol">¥</span>
											<span>YEN - Japanese Yen</span>
											<i class="isax isax-tick-circle5 check-icon"></i>
										</a>
									</li>
									<li>
										<a class="dropdown-item currency-item" href="javascript:void(0);">
											<span class="currency-symbol">€</span>
											<span>EUR - Euro</span>
											<i class="isax isax-tick-circle5 check-icon"></i>
										</a>
									</li>
								</ul>
							</div>
							<!-------Light Mode || Dark Mode--------->
							<div class="icon-btn">
								<a href="javascript:void(0);" id="dark-mode-toggle" class="theme-toggle activate">
									<i class="isax isax-sun-15"></i>
								</a>
								<a href="javascript:void(0);" id="light-mode-toggle" class="theme-toggle">
									<i class="isax isax-moon"></i>
								</a>
							</div>
							<!--Cart-->
							<div class="icon-btn">
								<a href="cart.html" class="position-relative">
									<i class="isax isax-shopping-cart5"></i>
									<span class="count-icon bg-success p-1 rounded-pill text-white fs-10 fw-bold">1</span>
								</a>
							</div>
							<!--SigIn || Register-->
							<a href="login.html" class="btn btn-primary d-inline-flex align-items-center me-2">
								Enroll Now
							</a>
							<a href="register.html" class="btn btn-secondary btn-donate me-0">
								<i class="isax isax-heart5 me-1"></i>Donate
							</a>
						</div>
'@

# Files to update (non-dashboard pages - without profile dropdown)
$publicFiles = @(
    "blog-3-grid.html",
    "blog-carousal.html",
    "blog-details.html",
    "blog-details-left-sidebar.html",
    "blog-details-right-sidebar.html",
    "blog-grid.html",
    "blog-left-sidebar.html",
    "blog-masonry.html",
    "blog-right-sidebar.html",
    "course-category-2.html",
    "course-category-3.html",
    "course-details-2.html",
    "course-resume.html",
    "course-watch.html",
    "instructor-grid.html",
    "instructor-list.html",
    "instructor-details.html"
)

# Dashboard files (with profile dropdown - need special handling)
$dashboardFiles = @(
    "instructor-announcements.html",
    "instructor-assignment.html",
    "instructor-certificate.html",
    "instructor-change-password.html",
    "instructor-course.html",
    "instructor-course-grid.html",
    "instructor-earnings.html",
    "instructor-integrations.html",
    "instructor-linked-accounts.html",
    "instructor-message.html"
)

function Update-HtmlFile {
    param (
        [string]$FilePath,
        [bool]$IsDashboard = $false
    )
    
    $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
    $originalContent = $content
    
    # 1. Remove header-topbar section
    $content = $content -replace '(?s)<!-- Header Topbar-->.*?<!-- /Header Topbar-->\s*', ''
    $content = $content -replace '(?s)<!-- Header Topbar-->\s*<div class="header-topbar.*?</div>\s*</div>\s*</div>\s*</div>\s*<!-- /Header Topbar-->\s*', ''
    
    # 2. Change header-two to header-one
    $content = $content -replace '<header class="header-two">', '<header class="header-one">'
    
    # 3. Update bar-icon to use menu icon
    $content = $content -replace '(?s)<span class="bar-icon">\s*<span></span>\s*<span></span>\s*<span></span>\s*</span>', '<span class="bar-icon">`n									<i class="isax isax-menu"></i>`n								</span>'
    
    # 4. Replace header-btn section (for non-dashboard files)
    if (-not $IsDashboard) {
        # Match the old header-btn pattern and replace with new one
        $oldPattern = '(?s)<div class="header-btn d-flex align-items-center">.*?</a>\s*</div>\s*(</div>\s*</div>\s*</header>)'
        $content = $content -replace $oldPattern, ($standardHeaderBtn + "`n					`$1")
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $FilePath -Value $content -Encoding UTF8 -NoNewline
        return $true
    }
    return $false
}

Write-Host "Updating public pages..."
foreach ($file in $publicFiles) {
    $path = Join-Path $PSScriptRoot $file
    if (Test-Path $path) {
        $updated = Update-HtmlFile -FilePath $path -IsDashboard $false
        if ($updated) {
            Write-Host "  Updated: $file" -ForegroundColor Green
        } else {
            Write-Host "  No changes: $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  Not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nUpdating dashboard pages..."
foreach ($file in $dashboardFiles) {
    $path = Join-Path $PSScriptRoot $file
    if (Test-Path $path) {
        $updated = Update-HtmlFile -FilePath $path -IsDashboard $true
        if ($updated) {
            Write-Host "  Updated: $file" -ForegroundColor Green
        } else {
            Write-Host "  No changes: $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  Not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nDone!"
