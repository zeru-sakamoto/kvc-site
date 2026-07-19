# Downloads all installer assets of a GitHub release into public/download,
# clearing out the old installers first so a version bump doesn't leave stale
# files sitting next to the new ones. kritavc-plugin.zip is left alone — it's
# a separate build artifact, not one of the app release assets.
# Usage: .\scripts\download-release.ps1 [tag]   (defaults to latest release)

param([string]$Tag = "")

$dest = Join-Path $PSScriptRoot "..\public\download"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$installerExtensions = @('.exe', '.msi', '.dmg', '.AppImage', '.deb', '.rpm', '.gz')
Get-ChildItem -Path $dest -File |
    Where-Object { $installerExtensions -contains $_.Extension } |
    Remove-Item -Force

if ($Tag) {
    gh release download $Tag --repo zeru-sakamoto/krita-vc -D $dest --clobber
} else {
    gh release download --repo zeru-sakamoto/krita-vc -D $dest --clobber
}
