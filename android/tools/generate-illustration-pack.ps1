$ErrorActionPreference = "Stop"

$scriptRoot = $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($scriptRoot)) {
    $scriptRoot = Join-Path (Get-Location) "android\tools"
}
$repoRoot = Resolve-Path (Join-Path $scriptRoot "..\..")
$dataPath = Join-Path $repoRoot "data.js"
$outputDir = Join-Path $repoRoot "android\app\src\main\assets\illustrations"
$source = Get-Content -Encoding UTF8 -Raw -Path $dataPath

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
Add-Type -AssemblyName System.Drawing

function ColorFromHex([string]$hex) {
    return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function BlendColor([System.Drawing.Color]$a, [System.Drawing.Color]$b, [double]$amountB) {
    $r = [int]($a.R * (1 - $amountB) + $b.R * $amountB)
    $g = [int]($a.G * (1 - $amountB) + $b.G * $amountB)
    $bl = [int]($a.B * (1 - $amountB) + $b.B * $amountB)
    return [System.Drawing.Color]::FromArgb(255, $r, $g, $bl)
}

$blocks = [regex]::Matches($source, '\{\s*verse\s*:\s*"((?:\\.|[^"\\])*)".*?bgColor\s*:\s*"(#[0-9A-Fa-f]{6})".*?accentColor\s*:\s*"(#[0-9A-Fa-f]{6})"\s*\}', 'Singleline')
if ($blocks.Count -eq 0) {
    throw "No pages found in data.js"
}

for ($i = 0; $i -lt $blocks.Count; $i++) {
    $page = $i + 1
    $number = "{0:D3}" -f $page
    $bg = ColorFromHex $blocks[$i].Groups[2].Value
    $accent = ColorFromHex $blocks[$i].Groups[3].Value
    $cream = [System.Drawing.Color]::FromArgb(255, 254, 248, 232)
    $ink = [System.Drawing.Color]::FromArgb(255, 58, 74, 62)
    $softBg = BlendColor $bg $cream 0.58
    $lightAccent = BlendColor $accent $cream 0.45
    $darkAccent = BlendColor $accent $ink 0.30

    $bitmap = New-Object System.Drawing.Bitmap 1280, 720
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear($softBg)

    $rect = New-Object System.Drawing.Rectangle 0, 0, 1280, 720
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $cream, $softBg, 35
    $graphics.FillRectangle($brush, $rect)
    $brush.Dispose()

    $washBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(58, $accent.R, $accent.G, $accent.B))
    for ($j = 0; $j -lt 7; $j++) {
        $x = 90 + (($page * 83 + $j * 157) % 1060)
        $y = 55 + (($page * 47 + $j * 109) % 520)
        $w = 160 + (($page + $j * 17) % 180)
        $h = 80 + (($page * 3 + $j * 23) % 130)
        $graphics.FillEllipse($washBrush, $x, $y, $w, $h)
    }

    $mountainBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(92, $darkAccent.R, $darkAccent.G, $darkAccent.B))
    for ($j = 0; $j -lt 4; $j++) {
        $baseX = -120 + $j * 340 + (($page * 19) % 90)
        $peakY = 170 + (($page + $j * 31) % 120)
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddPolygon(@(
            (New-Object System.Drawing.Point ($baseX), 590),
            (New-Object System.Drawing.Point ($baseX + 220), $peakY),
            (New-Object System.Drawing.Point ($baseX + 470), 590)
        ))
        $graphics.FillPath($mountainBrush, $path)
        $path.Dispose()
    }

    $riverPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(118, $lightAccent.R, $lightAccent.G, $lightAccent.B)), 34
    $riverPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $riverPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $riverPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $riverPath.AddBezier(70, 620, 330, 520 + ($page % 45), 730, 685 - ($page % 55), 1210, 570)
    $graphics.DrawPath($riverPen, $riverPath)
    $riverPath.Dispose()
    $riverPen.Dispose()

    $sunBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(178, $accent.R, $accent.G, $accent.B))
    $sunX = 855 + (($page * 29) % 210)
    $sunY = 75 + (($page * 13) % 90)
    $graphics.FillEllipse($sunBrush, $sunX, $sunY, 108, 108)

    $linePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(168, $ink.R, $ink.G, $ink.B)), 7
    $linePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $houseX = 505 + (($page * 37) % 170)
    $houseY = 392 + (($page * 11) % 55)
    $roof = @(
        (New-Object System.Drawing.Point ($houseX - 92), ($houseY + 20)),
        (New-Object System.Drawing.Point ($houseX), ($houseY - 58)),
        (New-Object System.Drawing.Point ($houseX + 102), ($houseY + 20))
    )
    $graphics.DrawLines($linePen, $roof)
    $graphics.DrawRectangle($linePen, $houseX - 63, $houseY + 20, 128, 92)
    $graphics.DrawLine($linePen, $houseX, $houseY + 20, $houseX, $houseY + 112)

    $figureBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(150, $ink.R, $ink.G, $ink.B))
    $fx = 260 + (($page * 41) % 130)
    $fy = 430 + (($page * 7) % 65)
    $graphics.FillEllipse($figureBrush, $fx, $fy, 42, 42)
    $graphics.FillRectangle($figureBrush, $fx + 10, $fy + 39, 22, 72)
    $bookBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(178, $accent.R, $accent.G, $accent.B))
    $graphics.FillRectangle($bookBrush, $fx + 44, $fy + 65, 64, 38)
    $graphics.DrawRectangle($linePen, $fx + 44, $fy + 65, 64, 38)

    $mistPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(88, 255, 255, 255)), 10
    for ($j = 0; $j -lt 5; $j++) {
        $y = 215 + $j * 72 + (($page * 5) % 30)
        $graphics.DrawBezier($mistPen, 90, $y, 360, $y - 44, 710, $y + 42, 1190, $y - 18)
    }

    $framePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(175, $accent.R, $accent.G, $accent.B)), 12
    $graphics.DrawRectangle($framePen, 22, 22, 1236, 676)

    $path = Join-Path $outputDir "page_$number.png"
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

    $framePen.Dispose()
    $mistPen.Dispose()
    $bookBrush.Dispose()
    $figureBrush.Dispose()
    $linePen.Dispose()
    $sunBrush.Dispose()
    $mountainBrush.Dispose()
    $washBrush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()

    Write-Progress -Activity "Generating Android illustrations" -Status "Page $page / $($blocks.Count)" -PercentComplete (($page / $blocks.Count) * 100)
}

Get-ChildItem -Path $outputDir -Filter "page_*.png" |
    Where-Object { [int]($_.BaseName -replace 'page_', '') -gt $blocks.Count } |
    Remove-Item

Write-Host "Generated $($blocks.Count) illustration files -> $outputDir"
