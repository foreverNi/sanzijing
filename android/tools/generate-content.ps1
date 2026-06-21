$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$dataPath = Join-Path $repoRoot "data.js"
$outputPath = Join-Path $repoRoot "android\app\src\main\java\com\foreverni\sanzijing\ContentRepository.java"
$source = Get-Content -Encoding UTF8 -Raw -Path $dataPath

function Read-JsString([string]$block, [string]$name) {
    $match = [regex]::Match($block, "$name\s*:\s*""((?:\\.|[^""\\])*)""", "Singleline")
    if (-not $match.Success) {
        throw "Missing field $name"
    }
    return ConvertFrom-Json ('"' + $match.Groups[1].Value + '"')
}

function Convert-ToJavaString([string]$value) {
    $escaped = foreach ($char in $value.ToCharArray()) {
        switch ([int][char]$char) {
            34 { '\"' }
            92 { '\\' }
            10 { '\n' }
            13 { '\r' }
            9 { '\t' }
            default { [string]$char }
        }
    }
    return '"' + ($escaped -join '') + '"'
}

$items = [System.Collections.Generic.List[string]]::new()
$blocks = [regex]::Matches($source, "\{\s*verse\s*:\s*"".*?accentColor\s*:\s*""#[0-9A-Fa-f]{6}""\s*\}", "Singleline")
foreach ($blockMatch in $blocks) {
    $block = $blockMatch.Value
    $verse = Convert-ToJavaString (Read-JsString $block "verse")
    $pinyin = Convert-ToJavaString (Read-JsString $block "pinyin")
    $story = Convert-ToJavaString (Read-JsString $block "story")
    $moral = Convert-ToJavaString (Read-JsString $block "moral")
    $animation = Convert-ToJavaString (Read-JsString $block "animation")
    $bgColor = (Read-JsString $block "bgColor").TrimStart("#").ToUpperInvariant()
    $accentColor = (Read-JsString $block "accentColor").TrimStart("#").ToUpperInvariant()
    $items.Add("        new ClassicPage($verse, $pinyin, $story, $moral, $animation, 0xFF$bgColor, 0xFF$accentColor)")
}

if ($items.Count -eq 0) {
    throw "No pages generated from data.js"
}

$content = @"
package com.foreverni.sanzijing;

final class ContentRepository {
    static final ClassicPage[] PAGES = new ClassicPage[] {
$($items -join ",`n")
    };

    private ContentRepository() {
    }
}
"@

[System.IO.File]::WriteAllText($outputPath, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Generated $($items.Count) pages -> $outputPath"
