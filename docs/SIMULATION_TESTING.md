# Simulation Room Testing Guide

## 🎮 Quick Start in Simulation Room

Your engine is now ready to test! Here's how to get started in the Screeps simulation room:

### Step 1: Access Simulation Room
1. In Screeps client, click **"Simulation"** on left sidebar
2. Click **"Create New"** to start fresh simulation
3. Your code from `default/` folder is already loaded!

### Step 2: Initial Setup
The simulation room starts with:
- ✅ 1 Spawn (your base)
- ✅ 2 Energy sources
- ✅ 1 Room controller
- ✅ 300 starting energy

### Step 3: Spawn Your First Creeps

**NEW: Quick Console Commands Available!**
```javascript
// Show all available commands
help()

// Show colony status
status()

// Show current strategy
strategy()

// List all creeps
creeps()
```

**Option A: Quick Manual Spawning (Fastest)**
```javascript
// In the console (right side):
SpawnHelper.quick()  // Show available commands
SpawnHelper.h()      // Spawn a harvester
SpawnHelper.h()      // Spawn another harvester
SpawnHelper.u()      // Spawn an upgrader
SpawnHelper.b()      // Spawn a builder
```

**Option B: Auto-Spawn (Let Engine Decide)**
```javascript
SpawnHelper.auto()   // Spawns based on need
```

**Option C: Let Full Engine Run**
Your engine will automatically start spawning creeps based on strategic decisions!

---

## 📊 Monitoring Your Colony

### Visual Feedback You'll See:

**🔹 Creep Actions:**
- ⛏️ Yellow lines = Harvesting energy
- 📦 White lines = Delivering energy
- ⚡ Green lines = Upgrading controller
- 🔨 Cyan lines = Building structures
- 💬 Emoji bubbles = Current action

**🔹 Spawn Status:**
- Text next to spawn shows what's being created
- Progress bar on spawn shows completion

**🔹 Console Output (Every 10 ticks):**
```
[Tick 100] Creeps: 5 | Rooms: 1 | CPU: 12.45/20
  └─ harvester: 2, upgrader: 2, builder: 1
```

---

## 🧪 Testing Features

### Test 1: Basic Economy
```javascript
// Spawn 2 harvesters
SpawnHelper.h()
SpawnHelper.h()

// Wait ~30 seconds, watch energy accumulate
// Should see steady energy income
```

### Test 2: Controller Upgrading
```javascript
// Spawn upgraders
SpawnHelper.u()
SpawnHelper.u()

// Watch controller progress bar fill
// Console shows upgrade rate
```

### Test 3: Construction
```javascript
// Place extension construction site manually:
// 1. Click "Construct" (hammer icon)
// 2. Select "Extension"
// 3. Click near spawn

// Spawn builder
SpawnHelper.b()

// Watch builder construct the extension
```

### Test 4: All Roles Working Together
```javascript
// Balanced team
SpawnHelper.h()  // Harvester 1
SpawnHelper.h()  // Harvester 2
SpawnHelper.u()  // Upgrader 1
SpawnHelper.u()  // Upgrader 2
SpawnHelper.b()  // Builder

// Watch autonomous operation!
```

---

## 🎯 What Should Happen (Success Indicators)

### First 50 Ticks (~2 minutes):
- ✅ Harvesters move to sources
- ✅ Energy starts flowing to spawn
- ✅ Spawn energy increases (0 → 50 → 100+)
- ✅ Console shows creep count growing

### After 100 Ticks (~4 minutes):
- ✅ Multiple creeps working
- ✅ Upgraders working on controller
- ✅ Energy available: 200-300
- ✅ Controller progress bar moving

### After 500 Ticks (~20 minutes):
- ✅ 4-6 creeps operational
- ✅ If extensions placed: builders constructing them
- ✅ Steady energy income (not fluctuating wildly)
- ✅ Controller advancing toward level 2

---

## 🐛 Debugging Commands

### Check Creep Status
```javascript
// List all creeps
Object.keys(Game.creeps)

// Check specific creep
Game.creeps['harvester_12345']

// View creep memory
Game.creeps['harvester_12345'].memory

// See what creep is doing
Game.creeps['harvester_12345'].memory.working
```

### Check Room State
```javascript
// Energy available
Game.rooms['sim'].energyAvailable

// Energy capacity
Game.rooms['sim'].energyCapacityAvailable

// Controller level
Game.rooms['sim'].controller.level

// Controller progress
Game.rooms['sim'].controller.progress
```

### Engine Diagnostics
```javascript
// View engine decisions
Memory.engine.decisions.slice(-5)

// View analytics
Memory.engine.stats

// Check current strategy
Memory.engine.strategy
```

### Test Framework
```javascript
// Load test commands
const testEngine = require('console.tests')

// Quick health check
testEngine.quick()

// Test position evaluation
testEngine.evaluationTest()

// Test decision tree
testEngine.decisionTest()
```

---

## 🚀 Advanced Testing Scenarios

### Scenario 1: Resource Scarcity
```javascript
// Let energy drain low
// Don't spawn harvesters for a while
// Watch engine prioritize harvester spawning
```

### Scenario 2: Rapid Expansion
```javascript
// Place 5 extensions manually
// Spawn 1 builder
// Watch construction priority system
```

### Scenario 3: Speed Test
```javascript
// Spawn maximum creeps
// Monitor CPU usage
// Check if < 20 CPU (should be!)
```

### Scenario 4: Role Distribution
```javascript
// Use SpawnHelper.auto() repeatedly
// Watch engine balance roles
// Should maintain ~2 harvesters per source
```

---

## 📈 Performance Benchmarks

### Good Performance:
- ✅ CPU usage: 5-15 per tick (with 5-10 creeps)
- ✅ Energy income: 10-20 per tick (with 2 harvesters)
- ✅ Controller upgrade: Steady progress
- ✅ No console errors

### Excellent Performance:
- ✅ CPU usage: < 10 per tick
- ✅ Energy income: 20-40 per tick
- ✅ All creeps busy (not idle)
- ✅ Analytics showing positive trends

---

## 🎓 Learning Tips

1. **Watch Visual Lines**: Color-coded actions show what creeps are doing
2. **Read Console**: Engine logs strategic decisions every 100 ticks
3. **Experiment**: Try different spawn orders, see what works
4. **Place Structures**: Manually place roads/extensions to test builders
5. **Check Memory**: `Memory.engine` has tons of debugging info

---

## 🔄 Reset Simulation

To start fresh:
1. Click **"Stop Simulation"**
2. Click **"Create New"**
3. Your code automatically reloads
4. All memory is reset

---

## ✅ Ready for Real World

Once you see:
- ✅ 5+ creeps working autonomously
- ✅ Steady energy income
- ✅ Controller upgrading
- ✅ No errors in console
- ✅ CPU usage < 20

**You're ready to deploy to the real Screeps World!** 🎉

Follow **QUICKSTART.md Part 1-2** to select a room and place your spawn on the official servers.

Your engine will work exactly the same, but with real players, real competition, and real progression!
