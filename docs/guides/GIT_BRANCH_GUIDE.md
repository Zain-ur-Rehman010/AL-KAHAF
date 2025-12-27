# Git Branch Management Guide

## 🎯 Quick Reference

### Current Status Commands
```bash
# Where am I? (which branch)
git branch

# What's the status?
git status

# What branches exist?
git branch -a

# What changed in my files?
git diff
```

### Creating and Switching Branches
```bash
# Create a new branch
git branch feature/my-feature

# Switch to a branch
git checkout feature/my-feature

# Create AND switch in one command (recommended)
git checkout -b feature/my-feature

# Switch back to main
git checkout main
```

### Working on a Branch
```bash
# 1. Make sure you're on the right branch
git branch
# Output: * feature/my-feature (the * shows current branch)

# 2. Make your changes (edit files)

# 3. See what changed
git status

# 4. Add changes
git add .

# 5. Commit changes
git commit -m "Description of what you did"

# 6. Push to GitHub
git push origin feature/my-feature
```

### Merging Branches
```bash
# 1. Switch to the branch you want to merge INTO (usually main)
git checkout main

# 2. Pull latest changes
git pull origin main

# 3. Merge your feature branch
git merge feature/my-feature

# 4. If no conflicts, push
git push origin main

# 5. Delete the feature branch (optional, after successful merge)
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

### Handling Merge Conflicts
```bash
# If you see "CONFLICT" during merge:

# 1. See which files have conflicts
git status

# 2. Open the conflicting files and look for:
<<<<<<< HEAD
Your current code
=======
Incoming code
>>>>>>> feature/my-feature

# 3. Edit the file to keep what you want, remove the markers

# 4. After fixing all conflicts:
git add .
git commit -m "Resolved merge conflicts"
git push origin main
```

---

## 📊 Recommended Workflow for AlKahaf Project

### Approach 1: Feature-Based Branches (Recommended)

```
main (always working)
  ├── feature/login-page (when adding login)
  ├── feature/course-list (when adding course listing)
  └── feature/payment-integration (when adding payments)
```

**Steps:**
1. Start on main: `git checkout main`
2. Create feature branch: `git checkout -b feature/login-page`
3. Work on login page
4. Commit: `git commit -m "Add login page"`
5. Push: `git push origin feature/login-page`
6. When done, merge to main:
   ```bash
   git checkout main
   git merge feature/login-page
   git push origin main
   ```
7. Delete branch: `git branch -d feature/login-page`

---

### Approach 2: Area-Based Branches (Your Current Setup)

```
main (complete project)
  ├── frontend (all frontend work)
  └── backend (all backend work)
```

**When to use:** When frontend and backend are completely separate

**Problem you faced:** When merging, both branches had different versions of the same files

**Solution:**
- Keep frontend and backend in separate folders
- Never edit the same files in both branches
- Merge carefully, one at a time

---

## 🚀 Simplified Workflow for You

### Daily Workflow

```bash
# Morning: Start work
git checkout main
git pull origin main

# Create today's feature branch
git checkout -b feature/add-dashboard

# Work on your code...
# Save often!

# End of day: Save progress
git add .
git commit -m "Work in progress on dashboard"
git push origin feature/add-dashboard

# Feature complete? Merge to main
git checkout main
git merge feature/add-dashboard
git push origin main

# Clean up
git branch -d feature/add-dashboard
```

---

## 🛡️ Safety Rules to Avoid Confusion

### Rule 1: Always Know Where You Are
Before making changes, run:
```bash
git branch
```
Look for the `*` to see your current branch.

### Rule 2: Commit Before Switching
Before switching branches, commit your work:
```bash
git add .
git commit -m "Save work before switching"
git checkout other-branch
```

### Rule 3: Pull Before You Push
```bash
git pull origin main
git push origin main
```

### Rule 4: One Task = One Branch
Don't mix multiple features in one branch.

✅ Good:
- `feature/login`
- `feature/signup`
- `feature/dashboard`

❌ Bad:
- `feature/login-signup-dashboard-and-more`

### Rule 5: Keep Main Clean
Never work directly on `main` for big features. Use feature branches.

---

## 🔧 Common Scenarios

### Scenario 1: "I'm confused which branch I'm on"
```bash
git branch
# The one with * is your current branch
```

### Scenario 2: "I made changes on the wrong branch"
```bash
# Save your changes without committing
git stash

# Switch to correct branch
git checkout correct-branch

# Apply your changes
git stash pop
```

### Scenario 3: "I want to start over on a branch"
```bash
# Throw away all changes and match remote
git fetch origin
git reset --hard origin/main
```

### Scenario 4: "I want to see what's different between branches"
```bash
git diff main..feature/my-feature
```

### Scenario 5: "I want to delete a branch"
```bash
# Delete local branch
git branch -d feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature
```

---

## 📝 Your Current AlKahaf Setup

### Current Branches:
- `main` - Your production code
- `backend` - Backend API code
- `Frontend` - Frontend code (note: unusual to capitalize)
- `topbar` - Topbar feature

### Recommendation:

**Option A: Simplify (Recommended for you)**
1. Keep everything in `main` branch
2. Delete `backend`, `Frontend`, `topbar` branches
3. Use feature branches only when needed for big features

```bash
# Merge everything to main
git checkout main
git merge backend
git merge Frontend
git push origin main

# Delete old branches
git branch -d backend Frontend topbar
git push origin --delete backend Frontend topbar
```

**Option B: Keep Current Structure**
- Use `main` for merged/production code
- Use `backend` only for backend-specific work
- Use `Frontend` only for frontend-specific work
- Always merge to `main` when done

---

## 🎓 Visual Guide

### Good Branch Flow:
```
main
  ↓
feature/add-courses (create)
  ↓ (work, commit, push)
feature/add-courses (complete)
  ↓ (merge back)
main (updated)
  ↓ (delete feature branch)
main (clean)
```

### What You Should See:
```bash
$ git branch
  backend
  frontend
* main          ← You are here
  topbar
```

---

## 💡 Pro Tips

1. **Use descriptive branch names**
   - ✅ `feature/user-authentication`
   - ✅ `fix/login-bug`
   - ✅ `update/homepage-design`
   - ❌ `test`
   - ❌ `new-branch`
   - ❌ `asdf`

2. **Commit messages should be clear**
   - ✅ "Add user login form with validation"
   - ✅ "Fix bug in course enrollment"
   - ❌ "changes"
   - ❌ "update"
   - ❌ "fix"

3. **Small, frequent commits are better**
   - Commit every logical change
   - Don't wait until end of day
   - Makes it easier to undo mistakes

4. **Before merging, test your code**
   - Make sure your feature works
   - Test on the feature branch first
   - Only merge when confident

5. **Keep `main` branch stable**
   - `main` should always work
   - Never commit broken code to `main`
   - Use branches for experiments

---

## 🚨 Emergency Commands

### "I messed up everything, help!"
```bash
# Go back to last working commit
git reset --hard HEAD~1

# Go back to exact state of remote main
git fetch origin
git reset --hard origin/main
```

### "I committed to wrong branch!"
```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Switch to correct branch
git checkout correct-branch

# Commit again
git add .
git commit -m "Your message"
```

### "Merge went wrong, I want to cancel!"
```bash
# If merge hasn't been committed yet
git merge --abort

# If merge was committed
git reset --hard HEAD~1
```

---

## 📚 Learning Resources

- **Git Basics**: https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control
- **Interactive Tutorial**: https://learngitbranching.js.org/
- **Visual Git Guide**: https://marklodato.github.io/visual-git-guide/index-en.html

---

## 🎯 Your Next Steps

1. **Understand your current branch:**
   ```bash
   git branch
   git status
   ```

2. **Simplify your branches:**
   - Decide: Do you need separate branches?
   - If no: Merge everything to `main`
   - If yes: Use feature-based branches

3. **Establish a workflow:**
   - Choose one workflow and stick to it
   - Write it down
   - Follow it consistently

4. **Practice:**
   - Create a test repository
   - Practice creating, switching, merging branches
   - Make mistakes safely

---

**Remember:** Branches are meant to help you, not confuse you. Start simple, and add complexity only when needed.