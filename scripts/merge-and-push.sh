#!/bin/bash
# Permanent merge-and-push: merge feature/banking-reports into main, resolve conflicts
# by keeping feature-branch changes, then push to GitHub. Run from repo root.

set -e
# Run from repo root (works from main repo or worktree)
if git rev-parse --show-toplevel 2>/dev/null; then
  cd "$(git rev-parse --show-toplevel)"
else
  cd "$(cd "$(dirname "$0")/.." && pwd)"
fi

echo "=== 1. Stash any local changes ==="
git stash push -m "pre-merge stash" --allow-empty 2>/dev/null || true

echo "=== 2. Fetch latest from GitHub ==="
git fetch origin

echo "=== 3. Checkout main and update it ==="
git checkout main
git pull origin main

echo "=== 4. Merge feature/banking-reports (accept feature-branch on conflicts) ==="
BRANCH="origin/feature/banking-reports"
git rev-parse --verify "$BRANCH" 2>/dev/null || BRANCH="feature/banking-reports"

if git merge "$BRANCH" -m "Merge feature/banking-reports: banking reports + product-wise analysis" -X theirs; then
  echo "Merge completed with no conflicts."
else
  echo "Merge had conflicts. Resolving by keeping feature-branch version for conflicted files..."
  for f in $(git diff --name-only --diff-filter=U); do
    git checkout --theirs -- "$f"
    git add "$f"
  done
  git commit -m "Merge feature/banking-reports: banking reports + product-wise analysis (conflicts resolved)"
fi

echo "=== 5. Push main to GitHub ==="
git push origin main

echo "=== 6. Restore stash if you had local changes ==="
git stash list | grep -q "pre-merge stash" && git stash pop 2>/dev/null || true

echo "Done. main is merged and pushed to GitHub."
