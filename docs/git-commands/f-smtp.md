# Branch: `f/smtp`

Feature branch for SMTP / email functionality implementation.

---

## Commands

### List all branches

```bash
git branch -a
```

### Fetch latest main

```bash
git fetch origin main
```

### Check commits ahead/behind main

```bash
git log --oneline main..f/smtp
git log --oneline f/smtp..main
```

### Pull (merge) main into f/smtp

```bash
git merge origin/main
```

### Push f/smtp to remote

```bash
git push origin f/smtp
```

### Push f/smtp to remote

```bash
git push -u origin HEAD
```

---

#

## History Log

| Date       | Command                          | Note                                  |
| ---------- | -------------------------------- | ------------------------------------- |
| 2026-03-26 | `git branch -a`                  | Listed all local + remote branches    |
| 2026-03-26 | `git fetch origin main`          | Fetched latest main                   |
| 2026-03-26 | `git log --oneline main..f/smtp` | Checked f/smtp was 0 commits ahead    |
| 2026-03-26 | `git log --oneline f/smtp..main` | Confirmed 1 commit behind (CLAUDE.md) |
| 2026-03-26 | `git merge origin/main`          | Fast-forward merge — added CLAUDE.md  |
| 2026-03-26 | `git push origin f/smtp`         | Pushed synced branch to remote        |
