# Screeps Version Management Guide

## 🎮 How Screeps Code Deployment Works

### The Two Environments:

```
┌─────────────────────────────────────────┐
│  Local Screeps Folder (Your Machine)   │
│  c:\Users\patss\AppData\Local\Screeps\ │
│         scripts\screeps.com\            │
│              └─ default/                │
│                  ├─ main.js             │
│                  ├─ role.harvester.js   │
│                  └─ ...                 │
└─────────────────────────────────────────┘
                    ↓
        Screeps Client Auto-Loads
                    ↓
┌─────────────────────────────────────────┐
│         Live Game Server                │
│         (screeps.com)                   │
│           shard3, W13N57                │
└─────────────────────────────────────────┘
```

### How It Works:

**Your Screeps client (the desktop app) automatically watches the local folder:**
- Any changes to files in `default/` folder
- Are **immediately loaded** into the game
- You see changes in real-time (no manual upload needed)

---

## 📂 Screeps Branch System

### Understanding Branches:

Screeps has a **branch system** similar to Git, but it's built into the game:

```
Your Local Folder
    ↓
Screeps Client
    ↓
┌─────────────────────────────────┐
│   Screeps Branches              │
├─────────────────────────────────┤
│  📁 default/  ← Main code       │
│  📁 tutorial-1/                 │
│  📁 tutorial-2/                 │
│  📁 sim/     ← Simulation test  │
│  📁 dev/     ← Development      │
└─────────────────────────────────┘
```

**Key Concept:** Each folder = one branch in Screeps

---

## 🔄 Version Control Workflow

### Current Setup (No Git Integration):

Since you're **NOT using GitHub sync**, your workflow is:

```
1. Edit code in VS Code
   └─> Files in: c:\Users\patss\AppData\Local\Screeps\scripts\screeps.com\default\

2. Screeps client detects changes
   └─> Auto-loads to LIVE game (shard3)

3. Code runs immediately
   └─> No manual upload needed
```

**⚠️ WARNING:** Changes go **LIVE instantly**. No staging environment!

---

## 🧪 Safe Testing Strategy

### Option 1: Use Simulation Room (Recommended)

**For quick tests without affecting your live colony:**

1. In Screeps client: Click **"Simulation"** (left sidebar)
2. Click **"Create New"**
3. Your code from `default/` loads into simulation
4. Test changes in isolated environment
5. If good → already live in your real colony!
6. If bad → Stop simulation, fix code, test again

**Pros:**
- ✅ Safe testing environment
- ✅ Can spawn enemies, test scenarios
- ✅ Unlimited CPU
- ✅ Can reset anytime

**Cons:**
- ⚠️ Code is still live in real game simultaneously
- ⚠️ Not a true "staging" environment

### Option 2: Use Separate Branch/Folder

**For major changes you want to test first:**

**Step 1: Create a dev branch folder**
```bash
# In terminal
cd "c:\Users\patss\AppData\Local\Screeps\scripts\screeps.com"
mkdir dev
cp -r default/* dev/
```

**Step 2: Switch branch in Screeps client**
1. In Screeps game, open **Console** (right side)
2. Click the **branch selector** (top right of console)
3. Select **"dev"** branch
4. Now your live game runs `dev/` code

**Step 3: Edit and test**
- Edit files in `dev/` folder
- Changes apply to your live game
- `default/` folder is untouched

**Step 4: When ready, copy back**
```bash
# Copy tested code back to default
cp -r dev/* default/
```

**Step 5: Switch back to default branch**
- In Screeps console: Switch branch back to **"default"**

---

## 🎯 Recommended Workflows

### For Small Changes (Tweaks, Bug Fixes):

```
1. Edit code in default/
2. Watch live game for 5-10 minutes
3. If working: Done! ✅
4. If broken: Fix immediately, auto-reloads
```

**Use when:**
- Small tweaks to existing functions
- Bug fixes
- Parameter adjustments

### For Major Changes (New Features, Refactors):

```
1. Copy default/ to dev/
2. Switch Screeps to "dev" branch
3. Edit code in dev/
4. Test in live game (on dev branch)
5. When stable:
   - Copy dev/ → default/
   - Switch back to "default" branch
6. Monitor for issues
```

**Use when:**
- Adding new roles
- Refactoring core systems
- Major algorithm changes
- v1.2, v1.3 updates

### For Risky Experiments:

```
1. Use Simulation Room
2. Place test code in default/
3. Test in simulation
4. If good: Already live!
5. If bad: Fix before real colony affected
```

**Use when:**
- Testing military strategies
- Experimenting with spawning logic
- Learning new Screeps APIs

---

## 💾 Git Backup Strategy

### Recommended: Manual Git Commits

Even though Screeps doesn't use Git for deployment, **you should still use Git for version control!**

**Setup:**
```bash
cd "c:\Users\patss\AppData\Local\Screeps\scripts\screeps.com"
git init
git add .
git commit -m "v1.1.0 - Basic survival automation"
```

**Workflow:**
```bash
# After testing changes in live game
git add default/
git commit -m "Fixed harvester delivery logic"
git push origin main  # Push to your GitHub repo
```

**Benefits:**
- ✅ Version history
- ✅ Can rollback mistakes
- ✅ Backup if Screeps folder corrupted
- ✅ Share code with others

---

## 🔧 Quick Reference Commands

### VS Code → Screeps:
```
1. Save file in VS Code (Ctrl+S)
2. Screeps client detects change automatically
3. Code reloads in game (~2-3 seconds)
4. Watch console for errors
```

### Check Current Branch:
```javascript
// In Screeps console
Memory.branch  // Shows current branch (may be undefined)

// Or check top-right of console window
// Shows: "Branch: default" or "Branch: dev"
```

### Quick Test in Simulation:
```
1. Simulation → Create New
2. Code from default/ loads
3. Test scenarios
4. Stop → Fix → Repeat
```

### Switch Branches:
```
1. Console → Branch dropdown (top right)
2. Select branch
3. Confirm reload
4. Code from that folder now runs
```

### Copy Between Branches:
```bash
# Terminal
cp -r default/* dev/          # Copy to dev
cp -r dev/* default/          # Copy back
```

---

## 🚨 Common Mistakes & Solutions

### Mistake 1: "My changes aren't showing!"
**Cause:** Edited wrong branch folder  
**Solution:**
```bash
# Check which branch Screeps is using
# In console, look at top-right branch indicator
# Make sure you're editing the right folder!
```

### Mistake 2: "Game crashed after my change!"
**Cause:** Syntax error in live code  
**Solution:**
```javascript
// Errors show in console immediately
// Fix the file in VS Code
// Save → Auto-reloads
```

### Mistake 3: "Can't find my old code!"
**Cause:** No Git commits  
**Solution:**
```bash
# Start using Git NOW
git init
git add .
git commit -m "Backup before changes"
```

### Mistake 4: "Broke my colony!"
**Cause:** Untested major change  
**Solution:**
1. Revert file in VS Code (Ctrl+Z)
2. Save to reload old code
3. Or restore from Git: `git checkout main -- default/`

---

## 📊 Version Management Best Practices

### For This Project:

**1. Use Semantic Versioning:**
```
v1.0.0 - Initial release
v1.1.0 - Basic survival automation  ← You are here
v1.2.0 - Future: Link management
```

**2. Tag Stable Versions in Git:**
```bash
git tag v1.1.0
git push origin v1.1.0
```

**3. Update Version in Code:**
```javascript
// main.js
Memory.engine = {
    version: '1.1.0',  // Update this
    ...
}
```

**4. Document Changes:**
- Update `CHANGELOG.md`
- Commit with descriptive message
- Note any breaking changes

**5. Test Progression:**
```
Small change → Test live for 30 mins
Medium change → Use dev branch, test 2 hours
Major change → Dev branch + simulation + monitor 24 hours
```

---

## 🎓 Mental Model

Think of it like this:

```
┌────────────────────────────────────────┐
│  VS Code                               │
│  (Your IDE - Edit Code)                │
└────────────────────────────────────────┘
              ↓ Save File
┌────────────────────────────────────────┐
│  Local Folder                          │
│  (c:\...\screeps.com\default\)        │
│  (Source of Truth)                     │
└────────────────────────────────────────┘
              ↓ Auto-Watch
┌────────────────────────────────────────┐
│  Screeps Client                        │
│  (Game Window - Loads Code)            │
└────────────────────────────────────────┘
              ↓ Executes
┌────────────────────────────────────────┐
│  Live Game Server                      │
│  (shard3 - Your Colony)                │
└────────────────────────────────────────┘
```

**Key Points:**
- 💾 **Source of Truth**: Files in local folder
- 🔄 **Auto-Sync**: Screeps client watches folder
- ⚡ **Instant Deploy**: Changes go live immediately
- 🧪 **Testing**: Use simulation or dev branch
- 📚 **History**: Use Git for version control

---

## 🎯 TL;DR - Quick Start

**Normal workflow:**
1. Edit code in VS Code (default/ folder)
2. Save (Ctrl+S)
3. Watch Screeps console for changes
4. Commit to Git when stable

**Testing workflow:**
1. For small changes: Just watch live game
2. For big changes: Copy to dev/, switch branch, test
3. For experiments: Use Simulation room

**Version control:**
- Git = Your backup and history
- Screeps branches = Quick A/B testing
- Always commit stable versions

**Emergency rollback:**
```bash
git checkout HEAD -- default/filename.js
```

---

## 📞 Summary

**You Have:**
- ✅ VS Code for editing
- ✅ Screeps client for running/viewing
- ✅ Local folder that auto-syncs
- ✅ No GitHub integration (direct file watching)

**You Should Do:**
- ✅ Use Git for version history (manual commits)
- ✅ Use dev/ branch for major changes
- ✅ Use simulation for risky experiments
- ✅ Monitor live game after each change
- ✅ Keep CHANGELOG.md updated

**Version Flow:**
```
Edit in VS Code → Auto-loads in Screeps → Runs on shard3
                                     ↓
                            Commit to Git (backup)
```

Simple and effective! 🎉
