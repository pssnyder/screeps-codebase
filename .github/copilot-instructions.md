# Screeps Engine - AI Coding Agent Instructions

## Project Context
This is a chess-engine inspired AI system for Screeps World, an MMO strategy game where code controls autonomous units. The architecture applies chess concepts (position evaluation, move generation, search algorithms) to RTS gameplay.

## Critical Architecture Patterns

### 1. Chess Engine Decision Flow (Every Game Tick)
The system follows a strict 4-phase cycle in `engine.core.js`:
1. **Evaluate** → Score game state (like chess position evaluation)
2. **Decide** → Generate strategy via `DecisionTree.generateStrategy()`
3. **Execute** → Room operations (spawns, towers) then creep operations (roles)
4. **Learn** → Record metrics for analytics

**Key Pattern**: Never break this evaluation → decision → execution flow. All new features must fit into one of these phases.

### 2. Directory Structure & Deployment
- `default/` - LIVE production code (auto-synced to Screeps World)
- `simulation/` - Testing sandbox (deploy via `./deploy.sh deploy`)
- `test/` - Local Node.js tests (run with `npm test`)
- `backups/` - Auto-generated on each deployment

**Critical**: NEVER edit `default/` directly. Always develop in `simulation/` first, test, then deploy.

### 3. Memory Management Convention
Screeps uses a global `Memory` object that persists between ticks:
```javascript
Memory.engine = {
    version: string,
    stats: { [category]: { [metric]: Array<{tick, value}> } },
    decisions: Array<Decision>,
    learning: Object
}
Memory.creeps[name] = { role, working, stats, ... }
```

**Critical**: Clean dead creep memory every tick via `MemoryManager.cleanDeadCreeps()` or you'll leak memory. Historical stats are capped at 1000 entries max.

### 4. Role State Machine Pattern
Every role module (`role.*.js`) uses a dual-state pattern:
```javascript
// Toggle state based on resource levels
if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.working = false;
}
if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
    creep.memory.working = true;
}

// Execute behavior based on state
if (creep.memory.working) {
    this.doWork(creep);      // Deliver, build, upgrade, etc.
} else {
    this.collectEnergy(creep); // Harvest or withdraw
}
```

**New roles MUST follow this pattern**. Register in `role.manager.js` switch statement.

### 5. Priority-Based Spawning
`DecisionTree` generates spawn needs, `SpawnController` processes them:
```javascript
const needs = {
    harvester: Math.max(0, targetCount - currentCount),
    upgrader: ...,
    builder: ...
};
spawnQueue.sort((a, b) => b.priority - a.priority);
```

**Priority hierarchy**: Defense (10) > Harvester (9) > Hauler (7) > Upgrader (6) > Builder (5)

### 6. Structure Auto-Planning (v1.1+)
`StructurePlanner.run()` executes every 100 ticks, placing construction sites for:
- Extensions (grid pattern around spawn)
- Containers (near sources)
- Towers (room center)
- Roads (between key structures)

**Throttled operations**: Structure planning, tower actions, analytics all use `Game.time % N` to prevent CPU spikes.

## Development Workflow

### Testing Workflow
1. Make changes in `simulation/` folder
2. Run local tests: `npm test` (validates logic with mocks)
3. Test in Screeps simulation room (in-game testing)
4. Check diff: `./deploy.sh diff`
5. Deploy to production: `./deploy.sh deploy`
6. Monitor console output every 10 ticks
7. Emergency rollback: `./deploy.sh restore <timestamp>`

### Console Testing Commands (In-Game)
```javascript
const testEngine = require('console.tests');
testEngine.quick();           // Health check
testEngine.evaluationTest();  // Room analysis
testEngine.decisionTest();    // Strategy verification
testEngine.analyticsTest();   // Metrics review
testEngine.performanceTest(); // CPU profiling
```

### CPU Optimization Rules
- **Reuse paths**: `creep.moveTo(target, {reusePath: 20})`
- **Cache expensive finds**: Store in `Memory.cache`, refresh every 100 ticks
- **Limit construction sites**: Max 5 per room to prevent builder thrashing
- **Throttle operations**: Structure planning (100 ticks), analytics (100 ticks), stats display (100 ticks)
- **Tower CPU caching**: Only search for targets when state changes (implemented in v1.1.2)

## Screeps-Specific Gotchas

### Game API Quirks
- `Game.creeps` includes all creeps but use `creep.my` to filter yours
- `room.find()` is expensive - cache results when possible
- Path reuse is critical - default of 5 is too low, use 20+
- `creep.memory` persists but `creep` objects are recreated each tick

### Common Errors to Avoid
- **Don't spawn without energy check**: `room.energyAvailable >= cost`
- **Don't path to same room repeatedly**: Use `reusePath` parameter
- **Don't modify structures directly**: Use construction sites for changes
- **Don't forget error handling**: Wrap `Engine.run()` in try-catch (see `main.js`)

### RCL Progression Gates
- RCL 1: Basic spawning (5 extensions)
- RCL 2: 10 extensions, first expansions unlocked
- RCL 3: **Towers unlock** - defense automation begins
- RCL 4: Storage unlocked - economy transitions from containers
- RCL 5: Links unlock - energy transport optimization
- RCL 6-8: Advanced structures, multi-room expansion

## Code Conventions

### File Organization
- `*.js` in `default/` or `simulation/` - Screeps modules (uses `require()`, not ES6 imports)
- `test/*.js` - Node.js test files (can use modern JS)
- Export pattern: `module.exports = ClassName;` or `module.exports.loop = function() {}`

### Naming Conventions
- Classes: PascalCase (`EngineCore`, `RoleHarvester`)
- Static methods: camelCase (`evaluateRoom`, `generateStrategy`)
- Creep naming: `role_id_timestamp` (e.g., `harvester_12345_678`)
- Memory keys: camelCase (`creep.memory.working`, `Memory.engine.stats`)

### Visual Feedback Patterns
Use `room.visual` for debugging:
```javascript
creep.room.visual.circle(target.pos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
spawn.room.visual.text('⛏️harvester', spawn.pos.x + 1, spawn.pos.y, {align: 'left'});
```

## Adding New Features

### New Role Checklist
1. Create `simulation/role.newrole.js` with dual-state pattern
2. Add to `role.manager.js` switch statement
3. Add spawn logic to `decision.tree.js` → `generateStrategy()`
4. Add body parts to `spawn.helper.js` → `generateBody()`
5. Test in simulation room
6. Document in `DEVELOPMENT.md`

### New Analytics Metric
```javascript
// In analytics.js → recordTick()
MemoryManager.recordStat('category', 'metricName', value);

// Access historical data
const history = MemoryManager.getStat('category', 'metricName', 100); // Last 100 ticks
```

### New Structure Type
Add to `structure.planner.js`:
1. Add RCL gate check
2. Implement placement logic (prefer grid patterns)
3. Check existing structures + sites to avoid over-planning
4. Throttle to 100 tick intervals

## Key Files Reference

- `main.js` - Entry point, initializes Memory, error handling, stats display
- `engine.core.js` - Main decision loop (evaluate → decide → execute)
- `evaluator.js` - Chess-style position scoring (rooms, creeps, resources)
- `decision.tree.js` - Strategic move generation (spawn priorities, body composition)
- `memory.manager.js` - Memory cleanup, stats recording, historical data
- `analytics.js` - Data collection, trend analysis, anomaly detection
- `spawn.controller.js` - Queue processing, body scaling, spawn execution
- `tower.controller.js` - Automated defense, healing, repairs (CPU optimized)
- `structure.planner.js` - Auto-placement of extensions, containers, towers, roads
- `role.manager.js` - Role routing and execution
- `console.helper.js` & `spawn.helper.js` - In-game console utilities
- `deploy.sh` - Simulation → production deployment with auto-backup

## Testing Strategy

### Local Tests (`npm test`)
- Mock game objects with `test.mocks.js`
- Unit test individual modules (evaluator, decision tree, roles)
- Integration test full game tick cycle
- Validate memory management (no leaks)

### In-Game Tests
- Use `console.tests.js` commands for health checks
- Watch for spawn notifications and role distribution
- Monitor CPU usage (should stay < 80%)
- Check analytics for anomalies every 100 ticks

### Performance Benchmarks
- Engine execution: < 15 CPU per tick (warns if over)
- Total tick: < 80% of CPU limit
- Bucket: Should remain > 5000
- Path calculation: Reuse for 20+ ticks

## Documentation Standards

- Architecture changes: Update `ARCHITECTURE.md`
- New features: Update `DEVELOPMENT.md`
- User-facing changes: Update `QUICKSTART.md` and `CHANGELOG.md`
- Breaking changes: Bump version in `Memory.engine.version` and `package.json`

## Quick Reference

**Run tests before committing**: `npm test`
**Deploy to production**: `./deploy.sh deploy` (creates auto-backup)
**Emergency rollback**: `./deploy.sh restore <timestamp>`
**View deployment diff**: `./deploy.sh diff`
**Check game state**: Type `Memory.engine` in Screeps console
**Health check**: `require('console.tests').quick()` in console

## v2.0 Development Focus (Current)

**Active Shard**: W13N57  
**Current Version**: v1.1.2 (Basic Survival Complete)  
**v2.0 Goals**: CPU optimization, intelligent execution, advanced infrastructure

### Critical v2.0 Principles
1. **CPU First**: Every feature must consider CPU cost. Default to throttling (Game.time % N)
2. **Intelligent Gating**: Don't run operations that aren't needed (check state before executing)
3. **Cache Aggressively**: Use `CacheManager` for all expensive finds (sources: 1000 ticks, structures: 100 ticks, hostiles: 1 tick)
4. **Lazy Execution**: Creeps should skip logic when idle/waiting
5. **Memory Hygiene**: Cap all arrays at 100 entries, clean old data every 1000 ticks

### v2.0 New Patterns
- **Execution Gating**: Use `ExecutionManager.shouldRun(operation, room)` before expensive ops
- **Multi-level Caching**: Use `CacheManager.get(key, room, fetcher, ttl)` for finds
- **Resource Tracking**: Track ALL resources (minerals, compounds), not just energy
- **Enhanced Monitoring**: `status()` command shows complete colony health
- **Circuit Breaker**: Pause non-critical ops if CPU > 90%

### v2.0 Roadmap (see V2_ROADMAP.md)
- **Phase 1** (Immediate): Performance optimization (-40% CPU target)
- **Phase 2** (1 week): Enhanced monitoring and resource tracking  
- **Phase 3** (2-3 weeks): Advanced infrastructure (labs, minerals, market)
- **Phase 4** (1 month): Military and expansion automation
- **Phase 5** (2 months): Machine learning integration
