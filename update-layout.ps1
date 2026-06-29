$source = Get-Content "D:\aiseo\docs\index.html" -Raw -Encoding UTF8
$header = [regex]::Match($source, '(?s)<header.*?</header>').Value
$footer = [regex]::Match($source, '(?s)<footer.*?</footer>').Value

Get-ChildItem "D:\aiseo\docs" -Filter "*.html" -Recurse -Exclude "index.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    $content = [regex]::Replace($content, '(?s)<header.*?</header>', $header)
    $content = [regex]::Replace($content, '(?s)<footer.*?</footer>', $footer)
    Set-Content $_.FullName -Value $content -Encoding UTF8
    Write-Host "Updated: $($_.Name)"
}
Write-Host "Done!"