# Screeps Engine - Complete Beginner's Guide

## 🌍 Part 1: Getting Into the Game World

### Step 1: Access Screeps World
1. Go to **https://screeps.com/a/#!/**
2. Log in with your account
3. You'll see the world map interface

### Step 2: Choose Your Starting Location

**IMPORTANT**: As a new player, you want to spawn in a **Novice Area** (green zones) or **Respawn Area** (blue zones). These are protected starter zones!

#### What to Look For:
- **Novice Areas (Green)**: Best for beginners! Protected from veterans, only players with GCL ≤3 can enter
  - Completely walled off from outside world
  - ~15 days of protection before walls open
  - No nukes allowed
  - Unlimited safe mode cooldowns
  - You can claim up to 3 rooms
  
- **Respawn Areas (Blue)**: Alternative starter zones
  - Less protection but still isolated
  - Any GCL can spawn here
  - Nukes disabled

#### Finding a Good Room:
1. **Zoom out** on the map to see green/blue zones
2. Click into a Novice or Respawn area
3. Look for a room with:
   - ✅ **2 energy sources** (yellow circles) - MORE ENERGY = BETTER!
   - ✅ **Neutral controller** (grey flag structure) - must not be owned
   - ✅ **Open space** near sources for building
   - ✅ **Not too many swamps** (darker areas slow movement)

4. Click the room you want → Click **"Place Spawn"** button
5. Click on the map where you want your spawn (near center, between the 2 sources is ideal)

**Your spawn will appear with 300 energy and will be in Safe Mode for 20,000 ticks (~15 hours)!**

---

## 🔧 Part 2: Setting Up Your Code

### Step 1: Link Your GitHub Repository

Your code automatically syncs to Screeps via GitHub integration:

1. In Screeps, go to the **left sidebar** → Click **"Scripting"** tab
2. Look for **"Branch:"** dropdown at the top
3. If not connected yet, click **"Connect to GitHub"**
4. Authorize the Screeps app
5. Select repository: **`pssnyder/screeps-codebase`**
6. Select branch: **`main`**
7. The game will now auto-sync code from `screeps-codebase/src/` directory

### Step 2: Deploy Your Engine

The code is ALREADY WRITTEN and ready to go! Just push to GitHub:

```bash
cd "S:/Programming/Gaming Projects/Screeps World/screeps-codebase"
git add .
git commit -m "Deploy Screeps Engine"
git push origin main
```

**Wait ~30 seconds** for GitHub → Screeps sync to complete.

---

## 🎮 Part 3: Understanding the Game Interface

### Main Screen Layout:
- **Left Sidebar**: 
  - Map view (world/room navigation)
  - Room details panel
  - Your structures and creeps list
  
- **Center**: The game world (50x50 room grid)
  
- **Right Sidebar**:
  - Console (JavaScript output and commands)
  - Scripts panel (code editor)

- **Bottom Bar**: Resources, CPU, and stats

### Key Game Concepts:

#### 🏭 **Your Spawn** (Pink/Purple building)
- This is your base! Costs 300 energy to place
- Creates new creeps (costs energy per body part)
- Stores up to 300 energy
- You can build up to 3 spawns per room
- Initially generates 1 energy/tick until it reaches 300

#### ⚡ **Energy Sources** (Yellow glowing things)
- Generate 3000 energy every 300 ticks
- Your creeps harvest energy from these
- Most rooms have 1-2 sources

#### 🏴 **Room Controller** (Grey/colored flag structure)
- Claim this to own the room (costs CLAIM body parts)
- Upgrade it by having creeps use `upgradeController()`
- Higher levels (RCL) unlock more structures and features
- RCL 1-8 progression is your main advancement path

#### 🤖 **Creeps** (Moving units)
- Created by spawns
- Have body parts: WORK, CARRY, MOVE, ATTACK, etc.
- Cost energy to create (each body part has a cost)
- Live for 1500 ticks unless renewed
- Controlled by YOUR CODE!

#### 🏗️ **Extensions** (Small energy containers)
- Store extra energy (50 each)
- Allow spawning larger creeps
- Unlock as you upgrade controller

---

## 🚀 Part 4: Your Engine Starts Working!

### What Happens on First Run

1. **Memory Initialization**: The engine creates its memory structure
2. **Room Evaluation**: Analyzes your starting room (sources, controller, space)
3. **Strategic Planning**: Determines optimal creep composition
4. **Creep Creation**: Begins spawning harvesters automatically
5. **Analytics Start**: Begins collecting performance data
6. **Autonomous Operation**: The engine runs itself from here!

---

## 📊 Part 5: Monitoring Your Colony

### Watch the Console (Right Sidebar)

The engine automatically logs information:

**Every 10 ticks** you'll see status:
```
[Tick 1000] Creeps: 8 | Rooms: 1 | CPU: 12.45/20
```

**Every 100 ticks** you'll see analytics:
```
[Analytics] Anomalies detected: Energy declining rapidly
[Analytics] Recommendations: Spawn more harvesters
```

**Spawn notifications**:
```
[Spawn] W1N1: Creating harvester - harvester_1234_567
```

### Visual Feedback in Game:
- **Yellow lines**: Creeps moving and harvesting
- **White lines**: Creeps delivering energy
- **Green lines**: Creeps upgrading controller
- **Cyan lines**: Creeps building structures
- **Numbers above creeps**: Energy they're carrying

---

## 🧪 Part 6: Testing Your Engine

### In-Game Console Commands

Open the **Console** (right sidebar in Screeps) and type these commands:

### View Game State
```javascript
Memory.engine
```

### Check Analytics
```javascript
Memory.engine.stats
```

### View Decision History
```javascript
Memory.engine.decisions.slice(-10) // Last 10 decisions
```

### Manual Creep Spawn
```javascript
Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'test', {memory: {role: 'harvester'}})
```

### Check CPU Usage
```javascript
Game.cpu.getUsed()
Game.cpu.bucket
```

### View Creep Stats
```javascript
Object.values(Game.creeps).map(c => ({
    name: c.name,
    role: c.memory.role,
    stats: c.memory.stats
}))
```

---

## 🎯 Part 7: Understanding Your Engine's Strategy

### Automatic Creep Management

Your engine is **fully autonomous** and makes intelligent decisions:

#### Phase 1: Early Game (First 30 minutes)
1. **Spawns 2 Harvesters per Source** (4 total if you have 2 sources)
   - They harvest energy and deliver to spawn
   - Will balance themselves across sources

2. **Spawns 2-3 Upgraders**
   - Continuously upgrade the room controller
   - Advances you from RCL 1 → 2 → 3

3. **Spawns 1-2 Builders**
   - Constructs extensions (you'll need to place them manually first)
   - Repairs damaged structures
   - Builds roads and containers

#### Phase 2: Mid Game (After RCL 3)
- Larger creeps with more body parts
- Haulers for energy logistics
- Towers for automatic defense
- Multiple extensions (more energy capacity)

#### Phase 3: Late Game (RCL 5+)
- Defensive structures
- Storage for bulk energy
- Links for fast energy transfer
- Potential room expansion

### Defense Response
- **Automatically spawns defenders** when hostiles detected
- Towers attack enemies automatically
- Priority shifts to DEFENSE mode

---

## 📈 Part 8: What to Expect (Timeline)

### First 100 Ticks (~5 minutes)
- ✅ First 2 harvesters spawn
- ✅ Energy starts accumulating
- ✅ Controller being upgraded
- ✅ Energy available: 100-200

### After 500 Ticks (~20 minutes)
- ✅ 4-6 creeps active
- ✅ Steady energy income
- ✅ Controller reaching RCL 2
- ✅ Energy available: 300+
- ✅ Time to place extensions!

### After 1000 Ticks (~40 minutes)
- ✅ 6-10 creeps
- ✅ Multiple extensions built
- ✅ Controller at RCL 2 or 3
- ✅ Energy available: 500+
- ✅ Larger creeps spawning

### After 5000 Ticks (~3 hours)
- ✅ 10-15 creeps
- ✅ Storage container
- ✅ Tower for defense
- ✅ Controller RCL 4+
- ✅ Colony self-sustaining

---

## 🛠️ Part 9: Your Manual Tasks

### Things YOU Need to Do:

#### 1. Place Construction Sites
The engine spawns builders automatically, but YOU must tell them what to build:

**How to place structures:**
1. Click the **"Construct"** button (hammer icon on left sidebar)
2. Select structure type (Extension, Tower, Road, etc.)
3. Click on map where you want it
4. Your builders will automatically build it!

**What to build first:**
- **Extensions** (5 at RCL 2, more at higher levels)
  - Place them near your spawn for easy access
  - These give you more energy capacity
  
- **Container** near each energy source
  - Stores harvested energy
  - Prevents energy from dropping on ground
  
- **Roads** between spawn and sources
  - Creeps move faster (cost 1 instead of 2)
  - Connect key structures
  
- **Towers** (at RCL 3+)
  - Automatic defense
  - Can also repair and heal

#### 2. Monitor Console for Issues
Watch for error messages or warnings

#### 3. Check CPU Usage
If CPU goes too high (>90%), the engine might skip ticks

#### 4. Place New Spawn Sites (Later)
When you have multiple rooms, place spawns manually

---

## ⚠️ Part 10: Common Beginner Issues

### "My creeps aren't spawning!"
- **Check energy**: Spawn needs 200-300 energy for first creeps
- **Wait**: Initial creeps take time to harvest
- **Check spawn**: Is it already spawning? Look for progress bar

### "Energy isn't growing!"
- **Too few harvesters**: Engine will auto-spawn more
- **Sources depleted**: They refill every 300 ticks
- **Creeps dying**: Takes time to replace them

### "Controller downgrading!"
- **Need upgraders**: Engine spawns them automatically
- **Low energy**: Harvesters need to deliver more
- **Be patient**: Early game is slow

### "CPU bucket dropping!"
- **Normal early game**: Stabilizes after setup
- **Too many creeps**: Engine auto-balances
- **Check console**: Look for errors

### "I want to expand to another room!"
- **Wait for RCL 4**: Engine recommends expansion then
- **Need claimers**: Advanced feature (see DEVELOPMENT.md)
- **High GCL required**: Upgrade your first room first

---

## 🎓 Part 11: Learning More

### Understanding the Code
Your engine uses chess-inspired AI concepts:
- **Position Evaluation**: Rooms are scored like chess positions
- **Decision Trees**: Strategies chosen like chess moves
- **Search Algorithms**: Best actions selected from options
- **Analytics**: Data-driven optimization

### Want to Customize?
See **DEVELOPMENT.md** for:
- Adding new roles
- Tuning evaluation scores
- Adjusting priorities
- Implementing machine learning

### Game Resources:
- **Official Docs**: https://docs.screeps.com/
- **API Reference**: https://docs.screeps.com/api/
- **Discord Community**: http://chat.screeps.com/
- **Tutorial**: https://screeps.com/a/#!/sim/tutorial

---

## 📊 Part 12: Key Metrics to Watch

### Economy Health
- **Energy Available**: Should grow steadily (200 → 500 → 1000+)
- **Energy in Storage**: Build storage at RCL 4
- **Harvester Count**: 2 per source is optimal

### Room Development
- **Controller Level (RCL)**: Your main progression (1-8)
- **Extensions Built**: More = bigger creeps
- **Tower Defense**: Automated protection at RCL 3+

### Performance
- **CPU Usage**: Should stay <80% of limit
- **Bucket**: Should remain high (>5000) 
- **Creep Efficiency**: Tracked in analytics

---

## 🎯 Part 13: First Session Goals

### First 30 Minutes:
1. ✅ Choose and place spawn in Novice Area
2. ✅ Connect GitHub and deploy code
3. ✅ Watch first harvesters spawn
4. ✅ See energy start accumulating
5. ✅ Run `testEngine.quick()` in console

### First Hour:
1. ✅ Place 5 extension construction sites
2. ✅ Watch builders construct them
3. ✅ Reach Controller Level 2
4. ✅ Have 6-8 creeps active
5. ✅ Energy available >300

### First Session Goals:
1. ✅ Stable energy economy (not declining)
2. ✅ Controller progressing to RCL 3
3. ✅ All available extensions built
4. ✅ Roads between spawn and sources
5. ✅ No errors in console
6. ✅ CPU usage <80%

---

## 🆘 Part 14: Quick Reference Card

### Essential Console Commands:
```javascript
// Health check
const testEngine = require('console.tests');
testEngine.quick();

// View your room's score
testEngine.evaluationTest();

// Check strategy
testEngine.decisionTest();

// View all creeps
Object.keys(Game.creeps)

// View your spawn
Game.spawns['Spawn1']  // Replace with your spawn name

// Check energy
Object.values(Game.rooms)[0].energyAvailable

// Manual spawn (if needed)
Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], 'test')
```

### Important Game Constants:
- **1 Tick** ≈ 2-3 seconds real time
- **CREEP_LIFE_TIME** = 1500 ticks (~1 hour)
- **SOURCE_ENERGY_CAPACITY** = 3000 energy
- **ENERGY_REGEN_TIME** = 300 ticks (~10 min)
- **Safe Mode Duration** = 20,000 ticks (~15 hours)

### Room Controller Levels (RCL):
- **RCL 1**: 200 energy to upgrade, 5 extensions
- **RCL 2**: 45K energy needed, 10 extensions total
- **RCL 3**: 135K energy, 20 extensions, Towers!
- **RCL 4**: 405K energy, 30 extensions, Storage
- **RCL 5**: 1.2M energy, 40 extensions, Links
- **RCL 6**: 1.8M energy, 50 extensions
- **RCL 7**: 5.6M energy, 60 extensions, Factories
- **RCL 8**: 12.8M energy, max everything!

## 🧪 Testing the System

### Manual Testing
1. Place a construction site for an extension
2. Watch a builder automatically start working on it
3. Check if harvesters are delivering to spawn
4. Verify upgraders are working on controller

### Performance Testing
```javascript
// Check evaluation score
let state = {rooms: {}};
for (const name in Game.rooms) {
    const room = Game.rooms[name];
    const Evaluator = require('evaluator');
    state.rooms[name] = Evaluator.evaluateRoom(room);
}
console.log(JSON.stringify(state, null, 2));
```

## 🎓 Understanding the Engine

### Decision Flow (Every Tick)
1. **Evaluate**: Score current position (like chess)
2. **Decide**: Generate strategy based on evaluation
3. **Execute**: Spawn creeps, control towers, run creeps
4. **Learn**: Record metrics for analysis

### The "Chess Engine" Analogy
- **Position = Room State**: Resources, structures, threats
- **Material = Energy**: More energy = stronger position
- **Pieces = Creeps**: Each with different values
- **Moves = Decisions**: Spawn decisions, role assignments
- **Search = Strategy**: Finding best decisions

---

## 🏆 Part 15: You're Ready!

### What Makes Your Engine Special:

✨ **Fully Autonomous**: Set it and forget it - the engine handles everything

✨ **Chess-Engine Intelligence**: Makes strategic decisions like a grandmaster

✨ **Self-Optimizing**: Analytics continuously improve performance

✨ **Adaptive**: Responds to threats, shortages, and opportunities automatically

✨ **Scalable**: Works from RCL 1 to 8, single room to empire

### Next Steps After This Guide:

1. **Watch Your Colony Grow**: Let it run for a few hours
2. **Experiment**: Place different structures, watch engine adapt
3. **Learn the Code**: Read ARCHITECTURE.md to understand how it works
4. **Customize**: Use DEVELOPMENT.md to add features
5. **Compete**: Join the leaderboards and forums!

### Remember:
- **Be Patient**: Screeps is a long-term game (days/weeks)
- **Don't Panic**: Safe mode protects you for ~15 hours
- **Ask Questions**: Discord community is very helpful
- **Have Fun**: You're building something unprecedented!

---

## 💡 Pro Tips for Beginners

1. **Don't Touch the Code Yet**: Let the engine run first, learn how Screeps works
2. **Place Extensions in Clusters**: Near spawn for easy energy transfer
3. **Build Roads Early**: 50% movement speed boost is huge
4. **Watch Other Players**: Click on rooms around you, learn from their layouts
5. **Use Safe Mode Wisely**: You have unlimited uses in Novice Areas
6. **Take Screenshots**: Document your colony's growth!
7. **Check Daily**: Even 5 minutes a day keeps your colony thriving
8. **Read the Docs**: https://docs.screeps.com/ has great tutorials
9. **Join Discord**: Real-time help from experienced players
10. **Have Backups**: Your code is in Git - you can always revert!

---

## 🆘 Getting Help

### If Something Goes Wrong:

**In-Game Console:**
```javascript
// Check what's happening
testEngine.quick()

// View detailed room info
testEngine.evaluationTest()

// See recent decisions
Memory.engine.decisions.slice(-5)
```

**Discord Community:**
- http://chat.screeps.com/
- Post your question with room name
- Very friendly and helpful!

**Reset If Needed:**
```javascript
// Nuclear option - wipes all memory
delete Memory.engine;
// Code will reinitialize next tick
```

### Documentation Quick Links:
- **This Guide**: `QUICKSTART.md` ← You are here!
- **Technical Details**: `ARCHITECTURE.md`
- **Customization**: `DEVELOPMENT.md`
- **Testing**: `TESTING.md`
- **Official Docs**: https://docs.screeps.com/

---

## ✅ Success Checklist

### You'll Know It's Working When:

**Visual Confirmation:**
- ✅ Creeps moving around the room
- ✅ Yellow lines from creeps to sources (harvesting)
- ✅ White lines from creeps to spawn (delivering)
- ✅ Green lines from creeps to controller (upgrading)
- ✅ Energy numbers above spawn increasing

**Console Confirmation:**
- ✅ Stats printing every 10 ticks
- ✅ Spawn notifications appearing
- ✅ No error messages (red text)
- ✅ `testEngine.quick()` shows all green checkmarks

**Game Stats:**
- ✅ Energy available: Growing over time
- ✅ Controller progress bar: Moving
- ✅ Creep count: 4-6 in first hour
- ✅ CPU usage: <80% of limit
- ✅ Bucket: >5000 and stable

---

## 🌟 Final Words

Welcome to Screeps! You're not just playing a game - you're:

🧠 **Applying AI Concepts**: Your engine uses chess algorithms, decision trees, and analytics

📊 **Learning Data Science**: Track metrics, identify trends, optimize performance  

💻 **Writing Real Code**: JavaScript that runs 24/7 in a real game world

🎮 **Competing Globally**: Your colony lives in a shared MMO world

🚀 **Building Something Unique**: This engine is unlike any other Screeps bot

### The Journey Ahead:

Screeps is a **marathon, not a sprint**. Your colony will grow over days and weeks. The engine handles the tedious stuff so you can focus on strategy, optimization, and expansion.

**Take your time. Learn. Experiment. Dominate.** 🏆

---

**Ready to conquer Screeps World with artificial intelligence!** 🧠⚡🎮

*Next reading: `ARCHITECTURE.md` for technical deep-dive*  
*For customization: `DEVELOPMENT.md`*  
*For testing: `TESTING.md`*
