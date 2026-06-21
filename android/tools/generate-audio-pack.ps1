$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$contentPath = Join-Path $repoRoot "android\app\src\main\java\com\foreverni\sanzijing\ContentRepository.java"
$audioDir = Join-Path $repoRoot "android\app\src\main\assets\audio"
$source = Get-Content -Encoding UTF8 -Raw -Path $contentPath

New-Item -ItemType Directory -Force -Path $audioDir | Out-Null

function Convert-FromJavaString([string]$value) {
    return ConvertFrom-Json ('"' + ($value -replace '\\', '\\') + '"')
}

Add-Type -AssemblyName System.Speech
$format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo 16000, 16, 1
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice = $synth.GetInstalledVoices() |
    Where-Object { $_.Enabled -and $_.VoiceInfo.Culture.Name -eq "zh-CN" } |
    Select-Object -First 1
if (-not $voice) {
    throw "No enabled zh-CN SAPI voice found. Install a Chinese Windows speech voice first."
}
$synth.SelectVoice($voice.VoiceInfo.Name)
$synth.Rate = -2
$synth.Volume = 100

$pages = [regex]::Matches($source, 'new ClassicPage\("((?:\\.|[^"\\])*)",\s*"((?:\\.|[^"\\])*)",\s*"((?:\\.|[^"\\])*)",\s*"((?:\\.|[^"\\])*)",', "Singleline")
if ($pages.Count -eq 0) {
    throw "No pages found in ContentRepository.java"
}

for ($i = 0; $i -lt $pages.Count; $i++) {
    $match = $pages[$i]
    $page = $i + 1
    $number = "{0:D3}" -f $page
    $verse = Convert-FromJavaString $match.Groups[1].Value
    $story = Convert-FromJavaString $match.Groups[3].Value
    $moral = Convert-FromJavaString $match.Groups[4].Value

    $jobs = @(
        @{ Path = Join-Path $audioDir "verse_$number.wav"; Text = $verse },
        @{ Path = Join-Path $audioDir "story_$number.wav"; Text = "$($story)。$($moral)" }
    )

    foreach ($job in $jobs) {
        $synth.SetOutputToWaveFile($job["Path"], $format)
        $synth.Speak($job["Text"])
        $synth.SetOutputToNull()
    }
    Write-Progress -Activity "Generating Android audio pack" -Status "Page $page / $($pages.Count)" -PercentComplete (($page / $pages.Count) * 100)
}

$synth.Dispose()
Write-Host "Generated $($pages.Count * 2) audio files with voice '$($voice.VoiceInfo.Name)' -> $audioDir"
