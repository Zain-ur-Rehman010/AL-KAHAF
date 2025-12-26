# Script to update internal page links in HTML files
# Maps page names to their new locations

$pagesDir = ".\src\pages"
$pageMap = @{}

# Build a map of all HTML files to their new locations
Get-ChildItem -Path $pagesDir -Filter "*.html" -Recurse | ForEach-Object {
    $filename = $_.Name
    $relativePath = $_.FullName -replace [regex]::Escape($pagesDir), ""
    $relativePath = $relativePath -replace "\\", "/" -replace "^/", ""
    $pageMap[$filename] = $relativePath
}

Write-Host "Mapping found $($pageMap.Count) pages" -ForegroundColor Yellow

# Now update all HTML files with correct relative links
$htmlFiles = Get-ChildItem -Path $pagesDir -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $filePath = $file.FullName -replace [regex]::Escape($pagesDir), "" -replace "\\", "/" -replace "^/", ""
    
    # Get current file's directory depth
    $fileDepth = ($file.FullName -replace [regex]::Escape($pagesDir), "" -split [regex]::Escape("\")).Count - 2
    $upPath = ("../") * $fileDepth
    
    # Update all page links
    foreach ($pageFile in $pageMap.Keys) {
        $pageLocation = $pageMap[$pageFile]
        
        # Create patterns to match the old links
        $patterns = @(
            @{ old = "href=[`"']\.?/?$pageFile[`"']"; new = "href=`"$upPath$pageLocation`"" },
            @{ old = "href=[`"'][^`"']*/$pageFile[`"']"; new = "href=`"$upPath$pageLocation`"" }
        )
        
        foreach ($pattern in $patterns) {
            $content = $content -replace $pattern.old, $pattern.new
        }
    }
    
    # Save if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host " Updated links in: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Page link update complete!" -ForegroundColor Green
