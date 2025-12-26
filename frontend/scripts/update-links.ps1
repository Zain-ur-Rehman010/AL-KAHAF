# Script to update all internal links in HTML files
# This handles both asset paths and internal page links

$pagesDir = ".\src\pages"
$assetPrefix = "../../assets"  # From nested pages folder to assets

# Get all HTML files recursively
$htmlFiles = Get-ChildItem -Path $pagesDir -Filter "*.html" -Recurse

Write-Host "Found $($htmlFiles.Count) HTML files to process" -ForegroundColor Yellow

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Update asset paths from "assets/" to "../../assets/"
    # Match: href="assets/ or src="assets/ or href='assets/ or src='assets/
    $content = $content -replace 'href="assets/', "href=`"$assetPrefix/"
    $content = $content -replace "href='assets/", "href='$assetPrefix/"
    $content = $content -replace 'src="assets/', "src=`"$assetPrefix/"
    $content = $content -replace "src='assets/", "src='$assetPrefix/"
    
    # Save if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host " Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Link update complete!" -ForegroundColor Green
