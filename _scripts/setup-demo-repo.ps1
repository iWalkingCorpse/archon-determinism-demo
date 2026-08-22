# setup-demo-repo.ps1
# One-time setup for the Archon determinism test bed.
# Run from the repo root:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\_scripts\setup-demo-repo.ps1
#
# What it does:
#   1. npm install + npm test (expects exactly ONE failing test — the seeded bug)
#   2. git init, first commit
#   3. tags the starting state as baseline-root
#   4. optionally creates the GitHub repo and pushes (uncomment the gh lines)

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

Write-Host "== Installing dependencies =="
npm install

Write-Host "== Running test suite (one failure is EXPECTED: the seeded Bug A test) =="
npm test
if ($LASTEXITCODE -eq 0) {
    Write-Warning "Test suite passed clean. The seeded bug is missing - the test bed is NOT in its intended starting state."
} else {
    Write-Host "Non-zero exit from npm test is correct here (the Bug A test fails by design)."
}

if (Test-Path ".git") {
    Write-Host "== Git repo already initialized, skipping init =="
} else {
    Write-Host "== Initializing git repo =="
    git init -b main
}

git add -A
git commit -m "Initial test bed: inventory API with seeded date-range bug and frozen task prompts"

Write-Host "== Tagging starting state as baseline-root =="
git tag -f baseline-root
git log --oneline -1
git tag --list baseline-root

# --- Optional: create the GitHub repo and push (Archon opens PRs via gh) ---
# gh repo create archon-determinism-demo --public --source . --remote origin
# git push -u origin main --tags

Write-Host ""
Write-Host "Done. Every experiment run starts from: git checkout -b <branch> baseline-root"
