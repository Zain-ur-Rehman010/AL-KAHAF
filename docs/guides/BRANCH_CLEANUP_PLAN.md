# Branch Cleanup Plan for AlKahaf

## Current Situation
You have multiple branches that are now outdated because everything is merged into `main`.

## Branches to Delete

### Local Branches (on your computer):
- `backend` - Already merged into main ✅
- `frontend` - Behind main, no longer needed
- `topbar` - Old feature, already in main

### Remote Branches (on GitHub):
- `origin/backend` - Already merged
- `origin/Frontend` - Already merged

## Why Delete?
- Reduces confusion
- Keeps repository clean
- Makes it clear that `main` is the source of truth
- Easier to manage

## Commands to Clean Up

### Step 1: Delete Local Branches
```bash
# Delete backend branch
git branch -d backend

# Delete frontend branch
git branch -d frontend

# Delete topbar branch
git branch -d topbar
```

### Step 2: Delete Remote Branches
```bash
# Delete backend from GitHub
git push origin --delete backend

# Delete Frontend from GitHub (note capital F)
git push origin --delete Frontend
```

### Step 3: Verify Cleanup
```bash
# Should only show: * main
git branch

# Should only show: origin/main, origin/HEAD
git branch -r
```

## After Cleanup

You'll have:
- ✅ One main branch with all your code
- ✅ Clean repository
- ✅ No confusion about which branch to use

## Going Forward

### When to Create a New Branch?

**Create a branch when:**
1. Adding a major new feature (e.g., "payment system")
2. Experimenting with something you might discard
3. Working on something that will take multiple days

**Stay on main when:**
1. Making small fixes
2. Updating content
3. Quick changes

### Recommended Naming Convention

```bash
# For new features
git checkout -b feature/course-enrollment
git checkout -b feature/user-profile

# For bug fixes
git checkout -b fix/login-error
git checkout -b fix/payment-issue

# For updates
git checkout -b update/homepage-design
git checkout -b update/api-integration
```

## Emergency: "I deleted wrong branch!"

Don't panic! Branches can be recovered within 30 days:

```bash
# See deleted branches
git reflog

# Restore a branch
git checkout -b branch-name <commit-hash>
```