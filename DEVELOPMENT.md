# Screeps Engine - Development Guide

## Quick Reference

### File Structure
```
src/
├── main.js                  # Entry point, game loop
├── engine.core.js           # Central decision engine
├── evaluator.js             # Position evaluation system
├── decision.tree.js         # Strategic decision generation
├── memory.manager.js        # Persistent state management
├── analytics.js             # Data science & ML framework
├── spawn.controller.js      # Spawn management
├── tower.controller.js      # Tower automation
├── role.manager.js          # Role routing
├── role.harvester.js        # Energy harvesting
├── role.upgrader.js         # Controller upgrading
├── role.builder.js          # Construction & repair
├── role.hauler.js           # Energy transportation
└── role.defender.js         # Military defense
```

## Adding New Roles

1. Create `role.newrole.js`:
```javascript
class RoleNewRole {
    static run(creep, strategy) {
        // State machine logic
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
        }
        
        if (creep.memory.working) {
            this.doWork(creep);
        } else {
            this.collectEnergy(creep);
        }
    }
    
    static doWork(creep) {
        // Implement work behavior
    }
    
    static collectEnergy(creep) {
        // Implement energy collection
    }
}

module.exports = RoleNewRole;
```

2. Register in `role.manager.js`:
```javascript
const RoleNewRole = require('role.newrole');

// Add to switch statement:
case 'newrole':
    RoleNewRole.run(creep, strategy);
    break;
```

3. Add to spawn decisions in `decision.tree.js`:
```javascript
needs.newrole = Math.max(0, targetCount - creepCounts.newrole);
```

## Tuning Evaluation Scores

Edit `evaluator.js` to adjust how the engine values different aspects:

```javascript
// Current scoring:
eval.score += room.controller.level * 1000;  // Controller value
eval.score += sources.length * 500;           // Source value
eval.score += spawns.length * 500;            // Spawn value
eval.score += extensions.length * 50;         // Extension value
eval.score += towers.length * 300;            // Tower value
```

Higher scores = higher strategic value. Adjust these to change behavior priorities.

## Adjusting Strategic Priorities

Edit `decision.tree.js` → `determinePriority()`:

```javascript
// Weight values determine priority (higher = more important)
priorities.push({ type: 'DEFENSE', weight: 10 });
priorities.push({ type: 'ECONOMY', weight: 8 });
priorities.push({ type: 'UPGRADE', weight: 7 });
```

## Adding Analytics Metrics

In `analytics.js` → `recordTick()`:

```javascript
// Add new metric:
MemoryManager.recordStat('category', 'metricName', value);

// Examples:
MemoryManager.recordStat('combat', 'hostilesDetected', hostileCount);
MemoryManager.recordStat('economy', 'energyIncome', incomeRate);
```

Access historical data:
```javascript
const history = MemoryManager.getStat('category', 'metricName', 100); // Last 100 ticks
```

## Implementing Machine Learning

### Step 1: Collect Training Data
```javascript
// In memory.manager.js:
static recordDecisionOutcome(decision, outcome) {
    if (!Memory.engine.learning.decisions) {
        Memory.engine.learning.decisions = [];
    }
    
    Memory.engine.learning.decisions.push({
        tick: Game.time,
        decision: decision,
        outcome: outcome,
        success: outcome.score > decision.expectedScore
    });
}
```

### Step 2: Analyze Patterns
```javascript
// In analytics.js:
static analyzeDecisionPatterns() {
    const decisions = Memory.engine.learning.decisions || [];
    const successful = decisions.filter(d => d.success);
    const failed = decisions.filter(d => !d.success);
    
    // Identify common patterns in successful decisions
    // Apply weights to favor successful patterns
}
```

### Step 3: Apply Learning
```javascript
// In decision.tree.js:
static generateStrategy(gameState) {
    const baseStrategy = this.generateBaseStrategy(gameState);
    const learnedAdjustments = Analytics.getLearnedAdjustments();
    
    return this.applyLearning(baseStrategy, learnedAdjustments);
}
```

## Advanced Search Algorithms

### Implementing Alpha-Beta Pruning

Create `search.algorithm.js`:
```javascript
class SearchAlgorithm {
    static alphaBeta(position, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0) {
            return Evaluator.evaluatePosition(position);
        }
        
        const moves = this.generateMoves(position);
        
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (const move of moves) {
                const newPosition = this.applyMove(position, move);
                const evaluation = this.alphaBeta(newPosition, depth - 1, alpha, beta, false);
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) break; // Prune
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                const newPosition = this.applyMove(position, move);
                const evaluation = this.alphaBeta(newPosition, depth - 1, alpha, beta, true);
                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) break; // Prune
            }
            return minEval;
        }
    }
}
```

### Monte Carlo Tree Search

```javascript
class MCTS {
    static search(rootState, iterations) {
        const root = new Node(rootState);
        
        for (let i = 0; i < iterations; i++) {
            const node = this.select(root);
            const reward = this.simulate(node.state);
            this.backpropagate(node, reward);
        }
        
        return this.bestChild(root);
    }
    
    static select(node) {
        while (!node.isTerminal()) {
            if (!node.isFullyExpanded()) {
                return this.expand(node);
            }
            node = this.bestUCB(node);
        }
        return node;
    }
    
    static simulate(state) {
        // Random playout to terminal state
        while (!state.isTerminal()) {
            const moves = state.getLegalMoves();
            const move = moves[Math.floor(Math.random() * moves.length)];
            state = state.applyMove(move);
        }
        return state.getReward();
    }
}
```

## Debugging Tips

### Enable Verbose Logging
```javascript
// In main.js:
const DEBUG = true;

if (DEBUG) {
    console.log(`[Debug] Game state:`, JSON.stringify(gameState, null, 2));
}
```

### Visualize Decision Making
```javascript
// In role files:
creep.room.visual.circle(target.pos, {
    fill: 'transparent',
    radius: 0.55,
    stroke: 'red'
});
```

### Monitor Performance
```javascript
// Track specific operations:
const startCpu = Game.cpu.getUsed();
// ... operation ...
const cpuUsed = Game.cpu.getUsed() - startCpu;
console.log(`Operation used ${cpuUsed.toFixed(2)} CPU`);
```

## Performance Optimization

### 1. Cache Expensive Queries
```javascript
// In engine.core.js:
if (!Memory.cache) Memory.cache = {};
if (!Memory.cache.sources || Game.time % 100 === 0) {
    Memory.cache.sources = room.find(FIND_SOURCES);
}
```

### 2. Reduce Path Calculations
```javascript
// Increase reusePath parameter:
creep.moveTo(target, { reusePath: 20 }); // Recalculate every 20 ticks
```

### 3. Limit Loop Operations
```javascript
// Process subset each tick instead of all:
const creepsToProcess = Object.values(Game.creeps).slice(0, 10);
```

## Testing Strategies

### Unit Testing Individual Roles
```javascript
// Create test scenarios:
const testCreep = {
    memory: { role: 'harvester', working: false },
    store: { [RESOURCE_ENERGY]: 0, getFreeCapacity: () => 50 },
    room: testRoom
};

RoleHarvester.run(testCreep, testStrategy);
// Verify expected behavior
```

### Integration Testing
```javascript
// Test full game tick:
const mockGame = {
    time: 1000,
    rooms: { 'W1N1': mockRoom },
    creeps: { 'harvester_1': mockCreep },
    cpu: { getUsed: () => 5.2, limit: 20 }
};

Engine.run(); // Verify no errors
```

## Extending Analytics

### Export Data for External Analysis
```javascript
// Create data export function:
static exportData(category, format = 'json') {
    const data = Memory.engine.stats[category];
    
    if (format === 'json') {
        return JSON.stringify(data, null, 2);
    } else if (format === 'csv') {
        // Convert to CSV format
        return this.convertToCSV(data);
    }
}

// In game console:
// Analytics.exportData('economy', 'csv')
```

### Integration with External Tools
```javascript
// Post data to external API (if allowed):
const dataToSend = {
    tick: Game.time,
    metrics: Memory.engine.stats
};

// Would require HTTP request capability or manual copy-paste
```

## Common Patterns

### State Machine Pattern
```javascript
// Used in all role modules:
if (condition_to_change_state) {
    creep.memory.working = !creep.memory.working;
}

if (creep.memory.working) {
    this.doWork(creep);
} else {
    this.prepare(creep);
}
```

### Priority Queue Pattern
```javascript
// Used in decision tree and spawn controller:
items.sort((a, b) => b.priority - a.priority);
const highestPriority = items[0];
```

### Strategy Pattern
```javascript
// Different behaviors based on game phase:
const strategies = {
    early: this.earlyGameStrategy,
    mid: this.midGameStrategy,
    late: this.lateGameStrategy
};

const currentStrategy = strategies[gamePhase];
currentStrategy.execute();
```

## Next Steps

1. **Deploy and Monitor**: Watch the console output for the first 100 ticks
2. **Tune Parameters**: Adjust evaluation scores and priorities based on performance
3. **Add Roles**: Implement specialized roles (miners, scouts, claimer)
4. **Expand Analytics**: Add more metrics and pattern recognition
5. **Implement Learning**: Start collecting decision outcomes for ML training
6. **Multi-Room**: Extend to coordinate multiple rooms
7. **Market Trading**: Automate resource trading
8. **Combat AI**: Implement offensive military strategies

---

**Remember**: This engine is designed to be extensible. Every component is modular and can be enhanced independently. Start small, test thoroughly, and iterate!
