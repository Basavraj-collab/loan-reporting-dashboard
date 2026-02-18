# Permanent solution: Merge feature branch and push to GitHub

Run these from your **main repo** root: `loan-reporting-dashboard` (not the ddr worktree).

---

## Option A: Run the script (recommended)

```bash
cd /Users/basu/loan-reporting-dashboard
chmod +x scripts/merge-and-push.sh
./scripts/merge-and-push.sh
```

This will: fetch, checkout main, pull, merge `feature/banking-reports` (resolving conflicts by keeping the feature-branch code), and push to GitHub.

---

## Option B: Commands to run one by one

Copy and run in order. If a merge reports conflicts, run the "On conflict" block, then push.

```bash
cd /Users/basu/loan-reporting-dashboard

git stash push -m "pre-merge" --allow-empty
git fetch origin
git checkout main
git pull origin main

# Merge; use -X theirs so feature-branch version wins on conflicts
git merge origin/feature/banking-reports -m "Merge feature/banking-reports: banking + product-wise analysis" -X theirs
```

**If you see "Merge conflict" and the merge stops:**

```bash
# Resolve by keeping the feature-branch version of every conflicted file
git diff --name-only --diff-filter=U | while read f; do git checkout --theirs -- "$f"; git add "$f"; done
git commit -m "Merge feature/banking-reports: conflicts resolved, keep all functionality"
```

**Then push:**

```bash
git push origin main
```

---

## If you don't see a PR on GitHub

- The PR may already be merged (check the main branch on GitHub).
- To open a **new** PR: push your feature branch, then on GitHub go to the repo → "Compare & pull request" for `feature/banking-reports` → main.

```bash
cd /Users/basu/.cursor/worktrees/loan-reporting-dashboard/ddr
git push origin feature/banking-reports
```

Then in GitHub: create a Pull Request from `feature/banking-reports` into `main`.
