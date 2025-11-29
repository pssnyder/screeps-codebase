# Screeps Version Management Guide

## 🎮 How Screeps Code Deployment Works

### The Automatic Upload System:

```
┌─────────────────────────────────────────┐
│  Local Screeps Folders (Your Machine)  │
│  c:\Users\patss\AppData\Local\Screeps\ │
│         scripts\screeps.com\            │
│              ├─ default/      (production)
│              ├─ simulation/   (testing)
│              └─ dev/          (experiments)
└─────────────────────────────────────────┘
                    ↓
        Screeps Client Watches ALL Folders
               (Background Process)
                    ↓
┌─────────────────────────────────────────┐
│    Auto-Uploads to Screeps.com API     │
│    ✓ default/     → "default" branch    │
│    ✓ simulation/  → "simulation" branch │
│    ✓ dev/         → "dev" branch        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Screeps.com Server Storage         │
│      (All branches stored)              │
└─────────────────────────────────────────┘
                    ↓
        You Select Which Branch to Execute
                    ↓
┌─────────────────────────────────────────┐
│         Live Game Execution             │
│         (shard3, W13N57)                │
│    Runs whichever branch you selected   │
└─────────────────────────────────────────┘
```

### How It Works:

**CRITICAL UNDERSTANDING:**

1. **The Screeps app automatically watches ALL folders** when running:
   - Any save to `default/` → Uploads to server as "default" branch
   - Any save to `simulation/` → Uploads to server as "simulation" branch  
   - Any save to `dev/` → Uploads to server as "dev" branch

2. **Uploads happen in background**, regardless of:
   - ❌ What view you have open (simulation, live world, map, etc.)
   - ❌ Whether you're actively playing
   - ❌ Which tab/window is visible

3. **Only requirements for auto-upload:**
   - ✅ Screeps desktop app is **running**
   - ✅ You are **logged in** to your account
   - ✅ You have **internet connection**

4. **Branch selection controls EXECUTION, not upload:**
   - All branches are always uploaded
   - You select which one your live game runs
   - Simulation rooms can run different branches

---

## 📂 Screeps Branch System

### Understanding Branches:

Screeps has a **branch system** built into the game. **Each local folder becomes a separate branch on the server.**

```
Your Local Folders (Always Uploading)
    ├─ default/      → Server "default" branch
    ├─ simulation/   → Server "simulation" branch  
    └─ dev/          → Server "dev" branch
                ↓
        All Stored on Server
                ↓
        You Pick Which One Runs
```

**Key Concepts:**

1. **Each folder = One branch on server**
2. **ALL folders upload automatically** (when app is running)
3. **Branch selection = Which code EXECUTES** (not which uploads)
4. **Different views can run different branches:**
   - Live world: Running "default" branch
   - Simulation room: Running "simulation" branch
   - Both active simultaneously!

---

## 🔄 Version Control Workflow

### Current Setup (No Git Integration):

Since you're **NOT using GitHub sync**, your workflow is:

```
1. Edit code in VS Code
   └─> Files in: c:\Users\patss\AppData\Local\Screeps\scripts\screeps.com\

2. Screeps client detects changes (background process)
   └─> Auto-uploads to Screeps.com server

3. Code executes based on branch selection
   └─> Live world runs selected branch
```

**⚠️ CRITICAL WARNING:**

**Any save to `default/` folder = INSTANT PRODUCTION DEPLOY**

This happens **even if**:
- You're in simulation view (not looking at live world)
- You're editing other files
- You haven't "switched" to live world
- The Screeps app is minimized

**The Screeps app is ALWAYS uploading when running!**

---

## 🧪 Safe Testing Strategy

### ⭐ RECOMMENDED: Simulation Branch Workflow (Your Production Setup)

**This is the workflow you're using - safest for production environments:**

```
┌────────────────────────────────────────────┐
│  1. Edit simulation/ files in VS Code     │
│     - Auto-uploads to "simulation" branch  │
│     - Does NOT affect production           │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│  2. Test in Simulation View               │
│     - Open simulation room in Screeps app  │
│     - Switch to "simulation" branch        │
│     - Changes apply in real-time           │
│     - Iterate and test thoroughly          │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│  3. Deploy when ready                      │
│     ./deploy.sh deploy                     │
│     - Copies simulation/ → default/        │
│     - Auto-uploads to production           │
│     - Live world gets new code             │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│  4. Continue in simulation view            │
│     - No need to switch views              │
│     - Production updated automatically     │
│     - Start working on next feature        │
└────────────────────────────────────────────┘
```

**Why This Works:**

✅ **Screeps app uploads BOTH folders simultaneously:**
- `simulation/` changes → "simulation" branch
- `default/` changes → "default" branch  
- Both happen in background automatically

✅ **You stay in simulation view the entire time:**
- No need to switch to live world
- No manual "deploy" button in game
- No risk of forgetting which view you're in

✅ **Deploy script handles the file copy:**
- Creates automatic backup
- Copies tested code to production
- App detects changes and uploads
- Live world updates on next tick

✅ **Seamless workflow:**
- Edit → Test → Deploy → Continue
- Never leave simulation view
- Production updates automatically
- Complete isolation until you deploy

**Commands:**

```bash
# Review changes before deploying
./deploy.sh diff

# Deploy to production (auto-backup)
./deploy.sh deploy

# Sync production → simulation (for new work)
./deploy.sh sync

# List backups (emergency rollback)
./deploy.sh backups

# Restore backup (if deploy went wrong)
./deploy.sh restore 20251127_183022
```

### Alternative: Use Simulation Room (Quick Tests)

**For rapid iteration on small changes:**

1. In Screeps client: Click **"Simulation"** (left sidebar)
2. Click **"Create New"**
3. Edit code (any branch)
4. Simulation picks up changes in real-time
5. Test scenarios, spawn enemies, etc.

**Pros:**
- ✅ Unlimited CPU, instant reset
- ✅ Can test dangerous scenarios
- ✅ Isolated environment

**Cons:**
- ⚠️ Simulation rooms reset when closed
- ⚠️ Limited to single room testing
- ⚠️ Must recreate state each time

---

## 🎯 Your Production Workflows

### ⭐ PRIMARY: Simulation Branch Testing (All Changes)

**Use this for ALL production changes:**

```
1. Edit simulation/ files in VS Code
   - Screeps app auto-uploads to "simulation" branch
   - Does NOT touch production (default/ branch)
   
2. Stay in simulation view
   - Changes appear in real-time
   - Test thoroughly (10+ minutes)
   - Iterate until stable
   
3. Deploy when ready
   ./deploy.sh deploy
   - Auto-creates backup
   - Copies simulation/ → default/
   - Production updates automatically
   
4. Continue working
   - Stay in simulation view
   - No view switching needed
   - Start next feature immediately
```

**Use for:**
- ✅ Bug fixes
- ✅ New features  
- ✅ Refactoring
- ✅ ALL production changes

**Benefits:**
- ✅ Zero risk to production until you deploy
- ✅ Full testing environment
- ✅ Seamless workflow
- ✅ Automatic backups
- ✅ Easy rollback if needed

### Alternative: Emergency Hotfix (Rare)

**ONLY for critical bugs that need immediate fix:**

```
1. Edit default/ file directly
   - Production updates instantly
   - HIGH RISK - no testing!
   
2. Watch live game console
   - Monitor for errors
   - Be ready to rollback
   
3. Sync back to simulation
   ./deploy.sh sync
   - Keeps branches in sync
```

**Use for:**
- ⚠️ Game-breaking bugs in production
- ⚠️ Colony about to die
- ⚠️ Critical syntax errors

**Avoid when possible!** Use simulation branch instead.

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

### Your Daily Workflow:

```bash
# 1. Edit simulation/ files in VS Code
code simulation/role.harvester.js
# Save (Ctrl+S) → Auto-uploads to server

# 2. Test in simulation view
# (No commands needed - just watch game)

# 3. Deploy when ready
./deploy.sh deploy

# 4. Emergency rollback (if needed)
./deploy.sh backups
./deploy.sh restore 20251127_183022
```

### Deploy Script Commands:

```bash
# Show differences between simulation and production
./deploy.sh diff

# Deploy simulation → production (with backup)
./deploy.sh deploy

# Sync production → simulation (for new work)
./deploy.sh sync

# List all backups
./deploy.sh backups

# Restore from backup
./deploy.sh restore <backup_name>

# Show help
./deploy.sh help
```

### Check Current Branch (In Game):

```javascript
// In Screeps console, check top-right corner
// Shows: "Branch: default ▼" or "Branch: simulation ▼"

// Or use console commands
status()    // Enhanced status with branch info
help()      // Show available commands
```

### Manual Branch Operations (Rare):

```bash
# Only if you need to manually manage branches
cp -r simulation/* default/     # Manual deploy
cp -r default/* simulation/     # Manual sync
```

---

## 🚨 Common Mistakes & Solutions

### Mistake 1: "I accidentally edited default/ instead of simulation/!"
**Cause:** Wrong folder, production updated instantly  
**Solution:**
```bash
# Emergency rollback
./deploy.sh backups          # Find latest backup
./deploy.sh restore <name>   # Restore it

# Or Git undo (if you have Git)
git checkout HEAD -- default/
```

### Mistake 2: "My simulation changes aren't in production!"
**Cause:** Forgot to deploy  
**Solution:**
```bash
# Deploy simulation → production
./deploy.sh deploy
```

### Mistake 3: "Production broke after deploy!"
**Cause:** Didn't test enough in simulation  
**Solution:**
```bash
# Restore previous backup (created automatically)
./deploy.sh backups
./deploy.sh restore <previous_backup_name>

# Fix in simulation, test more, redeploy
```

### Mistake 4: "Simulation and production are out of sync!"
**Cause:** Manual edits to default/, or other confusion  
**Solution:**
```bash
# Sync production → simulation
./deploy.sh sync

# Now simulation matches production
# Continue normal workflow
```

### Mistake 5: "App isn't uploading my changes!"
**Cause:** Screeps app not running or not logged in  
**Solution:**
1. Check Screeps app is open
2. Check you're logged in (top-right corner)
3. Check internet connection
4. Look for sync indicator (bottom-right)

### Mistake 6: "Changes showing in wrong place!"
**Cause:** Editing one branch, but viewing another  
**Solution:**
```
Check branch selector in console (top-right)
Make sure:
  - Simulation view = "simulation" branch selected
  - Live world = "default" branch selected
```

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

### The Complete Upload & Execution Flow:

```
┌─────────────────────────────────────────────────────┐
│  VS Code (Edit Code)                                │
│  ├─ Edit simulation/role.harvester.js               │
│  └─ Save (Ctrl+S)                                   │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Local Folders (Source of Truth)                    │
│  ├─ simulation/   (testing code)                    │
│  └─ default/      (production code)                 │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Screeps Client (ALWAYS Watching)                   │
│  Background Process:                                 │
│  ├─ Detects simulation/ change                      │
│  ├─ Detects default/ change                         │
│  └─ Uploads ALL changes to server                   │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Screeps.com Server (Stores All Branches)           │
│  ├─ "simulation" branch (from simulation/ folder)   │
│  └─ "default" branch (from default/ folder)         │
└─────────────────────────────────────────────────────┘
                    ↓
        YOU Select Which Branch to Execute
                    ↓
┌─────────────────────────────────────────────────────┐
│  Game Execution (Independent)                       │
│  ├─ Live World → Runs "default" branch              │
│  └─ Simulation → Runs "simulation" branch           │
│  (Both can run simultaneously!)                      │
└─────────────────────────────────────────────────────┘
```

### Key Understanding:

**Upload (Automatic):**
- Happens for ALL folders whenever files change
- Requires: Screeps app running + logged in
- Independent of what view you have open
- Background process, always active

**Execution (Manual Selection):**
- You choose which branch each view runs
- Live world: Select branch in console dropdown
- Simulation: Can test any branch
- Different views can run different branches

**Your Workflow:**
- Edit `simulation/` → Tests in simulation view
- Deploy script copies `simulation/` → `default/`
- Production automatically gets new code
- You never leave simulation view!

---

## 🎯 TL;DR - Quick Start

### Your Production Workflow:

**Daily Development:**
```bash
1. Edit simulation/ files in VS Code
2. Test in simulation view (stay there!)
3. Deploy when ready: ./deploy.sh deploy
4. Production updates automatically
5. Continue working in simulation
```

**Understanding Uploads:**
- ✅ Screeps app ALWAYS uploads when running
- ✅ ALL folders upload simultaneously  
- ✅ Doesn't matter which view you have open
- ✅ Only requirement: App running + logged in

**Safety Rules:**
- ⚠️ NEVER edit `default/` directly (goes live instantly!)
- ✅ ALWAYS edit `simulation/` first
- ✅ ALWAYS test before deploying
- ✅ Use `./deploy.sh deploy` to push to production

**Version Control:**
- Git = Your backup and history (use it!)
- `./deploy.sh` = Automatic backups before deploy
- Screeps branches = Testing vs Production

**Emergency Rollback:**
```bash
./deploy.sh backups               # List backups
./deploy.sh restore <backup_name> # Restore previous version
```

---

## 📞 Summary

### Your Setup:

**What You Have:**
- ✅ VS Code for editing
- ✅ Screeps desktop app (always uploads when running)
- ✅ `simulation/` folder (safe testing)
- ✅ `default/` folder (production)
- ✅ `deploy.sh` script (safe deployment with backups)
- ✅ No GitHub integration (direct file watching)

**How It Works:**
1. **Screeps app watches ALL folders** (background, automatic)
2. **Any file change uploads to server** (regardless of view)
3. **You select which branch executes** (in game console)
4. **Deploy script safely promotes** simulation → production

**Your Workflow:**
```
Edit simulation/ → Test in sim view → Deploy → Continue
                                       ↓
                            (Production updates automatically)
```

**Safety Features:**
- ✅ Automatic backups before each deploy
- ✅ Complete isolation (simulation ≠ production)
- ✅ Easy rollback if needed
- ✅ No manual upload triggers required
- ✅ Stay in simulation view entire time

**Critical Understanding:**
> The Screeps app is ALWAYS uploading when running.
> Branch selection controls EXECUTION, not UPLOAD.
> All branches are always on the server, ready to run.

**Version Flow:**
```
Edit simulation/ → Auto-uploads → Test
                                   ↓
                            Deploy when ready
                                   ↓
                  Copies to default/ → Auto-uploads → Production runs
                                                            ↓
                                                 Commit to Git (backup)
```

Safe, simple, and effective! 🎉
