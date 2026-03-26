# Branch: `main`

Production branch. All finalized and approved code merges here.

---

## Commands

### Fetch latest main from remote
```bash
git fetch origin main
```

### Pull latest changes into local main
```bash
git checkout main
git pull origin main
```

### Merge main into another branch
```bash
git checkout <branch-name>
git merge origin/main
```

### Push main to remote
```bash
git push origin main
```

---

## History Log

| Date | Command | Note |
|---|---|---|
| 2026-03-26 | `git fetch origin main` | Fetched to sync before merging into f/smtp |
| 2026-03-26 | `git merge origin/main` | Fast-forward merge into f/smtp (added CLAUDE.md) |
