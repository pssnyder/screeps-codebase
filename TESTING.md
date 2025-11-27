# Testing Guide for Screeps Engine

## 🧪 Testing Methods

### 1. Local Unit Tests (Before Deployment)

Run the test suite locally to validate modules:

```bash
# From project root
cd test
node test.suite.js
```

This runs comprehensive tests on:
- ✅ Position evaluation scoring
- ✅ Decision tree logic
- ✅ Memory management
- ✅ Analytics calculations
- ✅ Role behaviors
- ✅ Integration between modules

### 2. In-Game Console Tests

Once deployed, test directly in Screeps World console:

#### Quick Health Check
```javascript
// Verify engine is running
Memory.engine

// Should show:
// - version: "1.0.0"
// - initialized: (tick number)
// - stats, decisions, learning objects
```

#### Test Evaluation System
```javascript
// Get evaluation of your main room
const Evaluator = require('evaluator');
const room = Game.rooms['W1N1']; // Replace with your room
const evaluation = Evaluator.evaluateRoom(room);
console.log(JSON.stringify(evaluation, null, 2));

// Check the score - higher is better
// Should show: control, resources, military, economy, infrastructure
```

#### Test Decision Making
```javascript
// Generate strategy based on current state
const DecisionTree = require('decision.tree');
const Engine = require('engine.core');

const gameState = Engine.evaluateGameState();
const strategy = DecisionTree.generateStrategy(gameState);

console.log('Current priorities:', strategy.priority);
console.log('Spawn decisions:', strategy.spawning);
```

#### Test Analytics
```javascript
// View collected metrics
const Analytics = require('analytics');

// Get energy trend
const energyHistory = Memory.engine.stats.economy?.totalEnergy || [];
console.log('Energy data points:', energyHistory.length);

// Run analysis
const insights = Analytics.analyze();
console.log('Insights:', insights);
```

#### Test Individual Roles
```javascript
// Manually test a role with a specific creep
const RoleHarvester = require('role.harvester');
const testCreep = Game.creeps['harvester_1234_567']; // Use actual name

if (testCreep) {
    console.log('Testing harvester with:', testCreep.name);
    console.log('Current state:', testCreep.memory);
    RoleHarvester.run(testCreep, {});
    console.log('After execution:', testCreep.memory);
}
```

### 3. Simulation Room Testing (Private Server)

If you have a private Screeps server:

1. **Set up controlled environment**
   - Start with known initial state
   - Controlled resources
   - No hostile interference

2. **Test scenarios**:
   ```javascript
   // Scenario 1: Resource scarcity
   room.storage.store.energy = 100; // Low energy
   // Watch how engine prioritizes
   
   // Scenario 2: Under attack
   // Spawn hostile creep in room
   // Verify defense response
   
   // Scenario 3: Rapid expansion
   room.controller.level = 8; // Max level
   room.storage.store.energy = 500000; // Rich
   // Watch expansion decisions
   ```

### 4. Regression Testing

Before deploying changes:

```javascript
// 1. Record baseline performance
const baseline = {
    tick: Game.time,
    energy: room.energyAvailable,
    creeps: Object.keys(Game.creeps).length,
    cpu: Game.cpu.getUsed()
};

// 2. Make changes
// 3. Compare after 500 ticks

const after = {
    tick: Game.time,
    energy: room.energyAvailable,
    creeps: Object.keys(Game.creeps).length,
    cpu: Game.cpu.getUsed()
};

console.log('Performance change:', {
    energy: ((after.energy - baseline.energy) / baseline.energy * 100).toFixed(2) + '%',
    cpu: ((after.cpu - baseline.cpu) / baseline.cpu * 100).toFixed(2) + '%'
});
```

## 🎯 Test Scenarios

### Scenario 1: Fresh Start (Controller Level 1)

**Expected Behavior**:
1. Spawn 2 harvesters immediately
2. Start harvesting from sources
3. Begin upgrading controller
4. Energy should grow steadily

**Verification**:
```javascript
// After 100 ticks
const creeps = Object.values(Game.creeps);
const harvesters = creeps.filter(c => c.memory.role === 'harvester');

console.log('Harvesters:', harvesters.length); // Should be 2-4
console.log('Controller progress:', room.controller.progress); // Should be increasing
console.log('Energy available:', room.energyAvailable); // Should be growing
```

### Scenario 2: Under Attack

**Setup**:
```javascript
// Wait for hostile to enter room, or simulate:
const hostiles = room.find(FIND_HOSTILE_CREEPS);
console.log('Hostiles detected:', hostiles.length);
```

**Expected Behavior**:
1. Priority shifts to DEFENSE
2. Defenders spawn automatically
3. Towers attack hostiles
4. Other creeps continue essential work

**Verification**:
```javascript
const strategy = Memory.engine.decisions[Memory.engine.decisions.length - 1];
console.log('Top priority:', strategy.strategy.priority[0].type); // Should be 'DEFENSE'

const defenders = Object.values(Game.creeps).filter(c => c.memory.role === 'defender');
console.log('Defenders spawned:', defenders.length); // Should be > 0
```

### Scenario 3: Economic Boom (High Resources)

**Setup**:
```javascript
// Manually add energy to storage
room.storage.store.energy = 100000;
```

**Expected Behavior**:
1. Larger creep bodies spawn
2. More upgraders created
3. Construction accelerates
4. System suggests expansion

**Verification**:
```javascript
// Check creep body sizes
const creeps = Object.values(Game.creeps);
const avgBodySize = creeps.reduce((sum, c) => sum + c.body.length, 0) / creeps.length;
console.log('Average body size:', avgBodySize); // Should be larger

// Check expansion flag
const strategy = DecisionTree.generateStrategy(Engine.evaluateGameState());
console.log('Should expand:', strategy.expansion); // Should be true if RCL >= 4
```

### Scenario 4: CPU Stress Test

**Purpose**: Verify performance under load

```javascript
// Monitor CPU over 100 ticks
const cpuSamples = [];
for (let i = 0; i < 100; i++) {
    // Run one tick worth of operations
    Engine.run();
    cpuSamples.push(Game.cpu.getUsed());
}

const avgCpu = cpuSamples.reduce((a, b) => a + b) / cpuSamples.length;
const maxCpu = Math.max(...cpuSamples);

console.log('Average CPU:', avgCpu.toFixed(2));
console.log('Max CPU:', maxCpu.toFixed(2));
console.log('CPU Limit:', Game.cpu.limit);
console.log('Usage:', (avgCpu / Game.cpu.limit * 100).toFixed(1) + '%');
```

## 🔍 Debugging Techniques

### 1. Enable Verbose Logging

Add to `main.js`:
```javascript
const DEBUG = true;

if (DEBUG && Game.time % 10 === 0) {
    console.log('[Debug] Full State:', JSON.stringify(Engine.evaluateGameState(), null, 2));
}
```

### 2. Visualize Creep Decisions

Add to any role file:
```javascript
// Visualize what creep is doing
if (target) {
    creep.room.visual.line(creep.pos, target.pos, { color: 'yellow' });
    creep.room.visual.circle(target.pos, { fill: 'transparent', stroke: 'yellow' });
}
```

### 3. Track Decision Accuracy

```javascript
// In decision.tree.js, after generating strategy
if (Memory.engine.decisions.length > 10) {
    const recent = Memory.engine.decisions.slice(-10);
    const scoreDelta = recent.map((d, i) => {
        if (i === 0) return 0;
        return d.score - recent[i-1].score;
    });
    
    console.log('Score changes (last 10):', scoreDelta);
    // Positive = improving, negative = declining
}
```

### 4. Memory Snapshot Comparison

```javascript
// Take snapshot
const snapshot = JSON.parse(JSON.stringify(Memory.engine));

// Wait 100 ticks

// Compare
const changes = {
    statsGrowth: Object.keys(Memory.engine.stats).length - Object.keys(snapshot.stats).length,
    decisionsAdded: Memory.engine.decisions.length - snapshot.decisions.length
};

console.log('Changes after 100 ticks:', changes);
```

## 📊 Success Metrics

### After 500 Ticks
- ✅ 4-8 creeps spawned
- ✅ Energy storage increasing
- ✅ Controller at level 2 or progressing
- ✅ No errors in console
- ✅ CPU usage < 80% of limit

### After 1000 Ticks
- ✅ 8-15 creeps
- ✅ Extensions built
- ✅ Stable energy economy (>300 available)
- ✅ Controller level 3+
- ✅ Analytics showing positive trends

### After 5000 Ticks
- ✅ 15-25 creeps
- ✅ Storage container built
- ✅ Tower operational
- ✅ Controller level 4+
- ✅ Efficient CPU usage (stable patterns)

## 🐛 Common Issues & Fixes

### Issue: "Creeps not spawning"
**Diagnosis**:
```javascript
const room = Game.rooms['W1N1'];
console.log('Energy:', room.energyAvailable, '/', room.energyCapacityAvailable);
console.log('Spawn queue:', strategy.spawning);
console.log('Spawns:', room.find(FIND_MY_SPAWNS).length);
```

**Fix**: 
- Check if spawn is already spawning
- Verify energy available
- Check spawn decisions being generated

### Issue: "High CPU usage"
**Diagnosis**:
```javascript
const startCpu = Game.cpu.getUsed();
Engine.run();
const engineCpu = Game.cpu.getUsed() - startCpu;
console.log('Engine CPU:', engineCpu.toFixed(2));
```

**Fix**:
- Increase path reuse time
- Reduce analytics frequency
- Optimize expensive find() calls

### Issue: "Creeps idle"
**Diagnosis**:
```javascript
Object.values(Game.creeps).forEach(creep => {
    console.log(creep.name, 'Role:', creep.memory.role, 'Working:', creep.memory.working);
});
```

**Fix**:
- Check if targets exist
- Verify role logic
- Check energy sources available

## 🚀 Automated Testing Setup

Create a test runner that can be scheduled:

```javascript
// In game console
global.runTests = function() {
    const tests = {
        evaluation: () => {
            const room = Object.values(Game.rooms)[0];
            const eval = require('evaluator').evaluateRoom(room);
            return eval.score > 0;
        },
        creepCount: () => {
            return Object.keys(Game.creeps).length > 0;
        },
        cpuHealth: () => {
            return Game.cpu.getUsed() < Game.cpu.limit * 0.9;
        },
        memoryHealth: () => {
            return Memory.engine !== undefined;
        }
    };
    
    const results = {};
    for (const name in tests) {
        try {
            results[name] = tests[name]() ? 'PASS' : 'FAIL';
        } catch (e) {
            results[name] = 'ERROR: ' + e.message;
        }
    }
    
    console.log('Test Results:', results);
    return results;
};

// Run every 100 ticks
if (Game.time % 100 === 0) {
    runTests();
}
```

---

## 🎓 Testing Philosophy

The engine is designed to be **self-validating**:
1. **Analytics** continuously monitors health
2. **Evaluation scores** provide quantitative feedback
3. **Decision history** enables replay and analysis
4. **Error handling** catches and logs issues

Trust the data, verify the behavior, iterate on the strategy!
