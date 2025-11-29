# Screeps Engine - Testing Complete! ✅

## 🧪 Testing Infrastructure Ready

You now have **4 comprehensive ways** to test your Screeps Engine:

---

## 1️⃣ **Local Unit Tests** (Before Deployment)

### Setup
```bash
cd "S:\Programming\Gaming Projects\Screeps World\screeps-codebase"
npm install  # Install dev dependencies (optional)
npm test     # Run all tests
```

### What It Tests
- ✅ Evaluator scoring logic
- ✅ Decision tree generation
- ✅ Memory management
- ✅ Analytics calculations
- ✅ Role state machines
- ✅ Integration between modules

### Files Created
- `test/test.suite.js` - Main test runner
- `test/test.framework.js` - Simple assertion library
- `test/test.mocks.js` - Mock Screeps objects
- `package.json` - Node.js configuration

---

## 2️⃣ **In-Game Quick Tests** (Console Commands)

Once deployed to Screeps World, open the console and use these commands:

### Quick Health Check
```javascript
const testEngine = require('console.tests');
testEngine.quick();
```

**Output Example:**
```
=== SCREEPS ENGINE HEALTH CHECK ===
✓ Engine initialized
  Version: 1.0.0
✓ 8 creeps active
  Roles: {"harvester":4,"upgrader":3,"builder":1}
✓ 1 rooms controlled
  W1N1: RCL 3, 450/550 energy
✓ CPU healthy: 45.2% of limit
  Bucket: 9847
✓ Analytics collecting data
✓ Decision system active
=== OVERALL STATUS: HEALTHY ===
```

### Other Test Commands
```javascript
// Test room evaluation
testEngine.evaluationTest('W1N1');

// Test decision making
testEngine.decisionTest();

// Test analytics
testEngine.analyticsTest();

// Test specific creep
testEngine.creepTest('harvester_1234_567');

// Performance benchmark
testEngine.performanceTest();

// View data trends
testEngine.trends('economy', 'totalEnergy', 50);
```

---

## 3️⃣ **Manual Scenario Testing** (In-Game)

### Test Scenario: Economic Growth
```javascript
// Check current state
const room = Game.rooms['W1N1'];
console.log('Energy:', room.energyAvailable);
console.log('Creeps:', Object.keys(Game.creeps).length);

// Wait 500 ticks and check again
// Energy should be growing, creeps increasing
```

### Test Scenario: Defense Response
```javascript
// When hostile enters room:
const hostiles = room.find(FIND_HOSTILE_CREEPS);
console.log('Hostiles:', hostiles.length);

// Check if defenders spawn automatically
// Check if strategy prioritizes defense
const strategy = require('decision.tree').generateStrategy(
    require('engine.core').evaluateGameState()
);
console.log('Top priority:', strategy.priority[0].type); // Should be 'DEFENSE'
```

### Test Scenario: CPU Performance
```javascript
// Monitor CPU over time
const cpuHistory = Memory.engine.stats.performance?.cpu || [];
const recent = cpuHistory.slice(-20);
const avg = recent.reduce((sum, s) => sum + s.value, 0) / recent.length;
console.log('Average CPU (last 20 ticks):', avg.toFixed(2));
```

---

## 4️⃣ **Analytics Dashboard** (Built-In)

The engine automatically tracks metrics. View them anytime:

```javascript
// View all collected data
Memory.engine.stats

// Energy trends
Memory.engine.stats.economy.totalEnergy

// CPU usage history
Memory.engine.stats.performance.cpu

// Population changes
Memory.engine.stats.population

// Decision history
Memory.engine.decisions.slice(-10) // Last 10 decisions
```

---

## 🎯 Testing Roadmap

### Phase 1: Initial Deployment (First 100 Ticks)
**Run:** `testEngine.quick()` every 20 ticks

**Verify:**
- ✅ Engine initialized
- ✅ First creeps spawning
- ✅ No errors in console
- ✅ CPU < 80%

### Phase 2: Early Game (100-500 Ticks)
**Run:** `testEngine.evaluationTest()` to check room development

**Verify:**
- ✅ Harvesters collecting energy
- ✅ Energy storage growing
- ✅ Controller being upgraded
- ✅ Extensions being built

### Phase 3: Established Colony (500-1000 Ticks)
**Run:** `testEngine.analyticsTest()` to see trends

**Verify:**
- ✅ Positive energy trend
- ✅ Stable CPU usage
- ✅ Balanced creep composition
- ✅ No anomalies detected

### Phase 4: Optimization (1000+ Ticks)
**Run:** `testEngine.performanceTest()` for benchmarking

**Verify:**
- ✅ CPU efficiency maintained
- ✅ Economic growth sustained
- ✅ Controller progressing to RCL 4+
- ✅ Ready for expansion

---

## 🐛 Debugging Tips

### If Tests Fail Locally
```bash
# Check Node.js version
node --version  # Should be 14+

# Run with verbose output
node test/test.suite.js 2>&1 | more
```

### If Engine Not Working In-Game
1. Check console for errors
2. Run `testEngine.quick()`
3. Verify Memory.engine exists
4. Check if code synced: `Memory.engine.version`

### If Creeps Acting Strange
```javascript
// Debug specific creep
const creep = Game.creeps['creep_name'];
console.log('Role:', creep.memory.role);
console.log('State:', creep.memory);

// Test role manually
const RoleHarvester = require('role.harvester');
RoleHarvester.run(creep, {});
```

---

## 📊 Success Criteria

### Local Tests
```
=== RESULTS: 20/20 passed, 0 failed ===
```

### In-Game Quick Test
```
=== OVERALL STATUS: HEALTHY ===
```

### After 500 Ticks
- Energy available > 300
- Creeps > 6
- Controller progressing
- CPU < 80%
- No errors

### After 1000 Ticks
- Energy available > 500
- Creeps > 10
- Controller RCL 3+
- Positive trends in analytics
- Stable performance

---

## 🚀 Next Steps After Testing

1. **Monitor First 1000 Ticks**
   - Watch console output
   - Run `testEngine.quick()` periodically
   - Check for anomalies

2. **Review Analytics**
   ```javascript
   testEngine.analyticsTest()
   ```

3. **Tune Performance**
   - Adjust evaluation scores if needed
   - Modify priorities based on playstyle
   - Optimize CPU if hitting limits

4. **Expand Features**
   - Add new roles (see DEVELOPMENT.md)
   - Implement ML learning
   - Add multi-room coordination

---

## 📚 Documentation Reference

- **TESTING.md** - Comprehensive testing guide
- **ARCHITECTURE.md** - System design details
- **DEVELOPMENT.md** - Customization guide
- **QUICKSTART.md** - Getting started guide

---

## 🎓 Testing Philosophy

> "In God we trust, all others bring data." - W. Edwards Deming

The engine is designed to be **data-driven and self-validating**:
1. Every decision is scored and tracked
2. Analytics continuously monitor health
3. Tests verify each component independently
4. Integration tests ensure components work together

**You have the tools. Now deploy and dominate!** 🏆
