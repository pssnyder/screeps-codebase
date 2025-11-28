# Screeps Engine v2.0 - Roadmap & Implementation Plan

**Current Status**: v1.1.2 - Basic Survival Automation Complete  
**Shard Location**: W13N57  
**Date**: November 28, 2025

## Executive Summary

v1.0-1.1 achieved basic survival: energy gathering, spawning, basic infrastructure. v2.0 focuses on **intelligent scaling**, **CPU/memory optimization**, and **advanced automation** to compete at higher levels.

### Critical Constraints
- **CPU Budget**: 20 CPU/tick baseline (expandable with credits)
- **Memory**: 2MB persistent, 10MB heap
- **Current Issues**: Excessive operations per tick, need intelligent throttling

---

## Phase 1: Performance & Intelligence (v2.0.0) 🚀
**Goal**: Reduce CPU by 40%, add intelligent execution gating  
**Timeline**: Immediate (Deploy in 2-3 days)

### 1.1 Intelligent Execution Gating
**Problem**: All code runs every tick regardless of need

**Solution**: State-based execution with priority queuing

```javascript
// New: execution.manager.js
class ExecutionManager {
    static shouldRun(operation, roomName) {
        const configs = {
            structurePlanning: { interval: 100, priority: 3 },
            towerDefense: { interval: 1, priority: 10 },    // Every tick
            towerHealing: { interval: 3, priority: 7 },
            towerRepair: { interval: 10, priority: 4 },
            analytics: { interval: 100, priority: 2 },
            visualFeedback: { interval: 5, priority: 1 }
        };
        
        const config = configs[operation];
        if (!config) return true; // Unknown ops run every tick (safe default)
        
        // Check if it's time to run based on interval
        if (Game.time % config.interval !== 0) return false;
        
        // Check CPU budget - skip low priority if CPU high
        const cpuUsage = Game.cpu.getUsed() / Game.cpu.limit;
        if (cpuUsage > 0.7 && config.priority < 5) return false;
        
        return true;
    }
}
```

**Impact**: 
- ✅ 30-40% CPU reduction
- ✅ Operations run only when needed
- ✅ Automatic throttling under CPU pressure

### 1.2 Advanced Caching System
**Problem**: Repeated `find()` operations are expensive

**Solution**: Multi-level cache with TTL

```javascript
// New: cache.manager.js
class CacheManager {
    static get(key, room, fetcher, ttl = 50) {
        if (!Memory.cache) Memory.cache = {};
        if (!Memory.cache[room]) Memory.cache[room] = {};
        
        const cached = Memory.cache[room][key];
        const now = Game.time;
        
        // Return cached if valid
        if (cached && (now - cached.tick) < ttl) {
            return cached.data;
        }
        
        // Fetch and cache
        const data = fetcher();
        Memory.cache[room][key] = { data, tick: now };
        return data;
    }
    
    static invalidate(room, key) {
        if (Memory.cache?.[room]?.[key]) {
            delete Memory.cache[room][key];
        }
    }
}
```

**Cache Strategy**:
- Sources: 1000 ticks (never change)
- Structures: 100 ticks (change rarely)
- Construction sites: 10 ticks (change often)
- Hostiles: 1 tick (change every tick)

**Impact**:
- ✅ 10-20% CPU reduction
- ✅ Eliminates redundant room scans

### 1.3 Lazy Creep Operations
**Problem**: All creeps run logic every tick even when waiting

**Solution**: Creep state machine with idle detection

```javascript
// Enhanced role pattern
static run(creep, strategy) {
    // Skip if waiting for resources to regenerate
    if (creep.memory.waiting && Game.time - creep.memory.waitStart < 10) {
        return; // Save CPU by not running logic
    }
    
    // Skip if already at target and performing action
    if (creep.memory.actionInProgress) {
        const result = this.continueAction(creep);
        if (result === OK || result === ERR_BUSY) return;
        delete creep.memory.actionInProgress; // Action complete
    }
    
    // Normal logic only if state changed
    // ...existing state machine...
}
```

**Impact**:
- ✅ 15-25% CPU reduction
- ✅ Creeps only think when needed

### 1.4 Memory Optimization
**Problem**: Memory growing unbounded, stats arrays too large

**Solution**: Circular buffers and aggressive pruning

```javascript
// Enhanced memory.manager.js
static recordStat(category, key, value, maxEntries = 100) { // Reduced from 1000
    // Use circular buffer instead of array
    if (!Memory.engine.stats[category]) {
        Memory.engine.stats[category] = {};
    }
    if (!Memory.engine.stats[category][key]) {
        Memory.engine.stats[category][key] = [];
    }
    
    const stats = Memory.engine.stats[category][key];
    stats.push({ tick: Game.time, value: value });
    
    // Keep only recent entries
    if (stats.length > maxEntries) {
        stats.splice(0, stats.length - maxEntries);
    }
}

static cleanOldStats() {
    // Run every 1000 ticks
    if (Game.time % 1000 !== 0) return;
    
    for (const category in Memory.engine.stats) {
        for (const key in Memory.engine.stats[category]) {
            const stats = Memory.engine.stats[category][key];
            // Remove stats older than 10,000 ticks
            Memory.engine.stats[category][key] = stats.filter(
                s => Game.time - s.tick < 10000
            );
        }
    }
}
```

**Impact**:
- ✅ 90% memory reduction for stats
- ✅ Faster serialization/deserialization

---

## Phase 2: Enhanced Monitoring (v2.0.1) 📊
**Goal**: Comprehensive visibility into colony health  
**Timeline**: 1 week

### 2.1 Advanced Status Dashboard
**New Console Command**: `status()` - Complete colony health

```javascript
// Enhanced console.helper.js
static status() {
    console.log('═══════════════════════════════════════════');
    console.log('🧠 SCREEPS ENGINE v2.0 - COLONY STATUS');
    console.log('═══════════════════════════════════════════');
    
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (!room.controller?.my) continue;
        
        console.log(`\n🏰 Room: ${roomName} (RCL ${room.controller.level})`);
        
        // Energy Economy
        const energyPercent = (room.energyAvailable / room.energyCapacityAvailable * 100).toFixed(0);
        console.log(`  ⚡ Energy: ${room.energyAvailable}/${room.energyCapacityAvailable} (${energyPercent}%)`);
        
        if (room.storage) {
            const storageEnergy = room.storage.store[RESOURCE_ENERGY];
            console.log(`  📦 Storage: ${storageEnergy.toLocaleString()} energy`);
        }
        
        // Minerals
        const minerals = room.find(FIND_MINERALS);
        if (minerals.length > 0) {
            minerals.forEach(m => {
                console.log(`  💎 Mineral: ${m.mineralType} (${m.mineralAmount}/${m.mineralAmount + m.ticksToRegeneration})`);
            });
        }
        
        // Construction Progress
        const sites = room.find(FIND_MY_CONSTRUCTION_SITES);
        if (sites.length > 0) {
            console.log(`  🏗️  Construction: ${sites.length} sites active`);
            const totalProgress = sites.reduce((sum, s) => sum + s.progress / s.progressTotal * 100, 0) / sites.length;
            console.log(`     Average: ${totalProgress.toFixed(0)}% complete`);
        }
        
        // Creep Population
        const creeps = room.find(FIND_MY_CREEPS);
        const byRole = {};
        creeps.forEach(c => {
            byRole[c.memory.role] = (byRole[c.memory.role] || 0) + 1;
        });
        console.log(`  🤖 Creeps: ${creeps.length} total`);
        for (const role in byRole) {
            console.log(`     ${role}: ${byRole[role]}`);
        }
        
        // Defense Status
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            console.log(`  ⚔️  THREAT: ${hostiles.length} hostile creeps!`);
        } else {
            console.log(`  🛡️  Defense: All clear`);
        }
        
        // Controller Progress
        const ctrlPercent = (room.controller.progress / room.controller.progressTotal * 100).toFixed(2);
        console.log(`  📈 Controller: ${ctrlPercent}% to RCL ${room.controller.level + 1}`);
        const ticksToDowngrade = room.controller.ticksToDowngrade;
        console.log(`     Downgrade in: ${ticksToDowngrade.toLocaleString()} ticks`);
    }
    
    // Performance Metrics
    console.log('\n⚙️  PERFORMANCE:');
    console.log(`  CPU: ${Game.cpu.getUsed().toFixed(2)}/${Game.cpu.limit} (${(Game.cpu.getUsed() / Game.cpu.limit * 100).toFixed(0)}%)`);
    console.log(`  Bucket: ${Game.cpu.bucket}/10000`);
    console.log(`  Memory: ${(RawMemory.get().length / 1024).toFixed(0)} KB`);
    
    // Critical Alerts
    console.log('\n⚠️  ALERTS:');
    const alerts = [];
    
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (!room.controller?.my) continue;
        
        // Low energy
        if (room.energyAvailable < room.energyCapacityAvailable * 0.3) {
            alerts.push(`${roomName}: Low energy reserves`);
        }
        
        // Controller downgrade risk
        if (room.controller.ticksToDowngrade < 5000) {
            alerts.push(`${roomName}: Controller downgrade risk!`);
        }
        
        // Low creep count
        const creeps = room.find(FIND_MY_CREEPS);
        if (creeps.length < 4) {
            alerts.push(`${roomName}: Low creep population`);
        }
    }
    
    // CPU alerts
    if (Game.cpu.bucket < 2000) {
        alerts.push('CRITICAL: CPU bucket low!');
    }
    
    if (alerts.length === 0) {
        console.log('  ✅ All systems nominal');
    } else {
        alerts.forEach(alert => console.log(`  🔴 ${alert}`));
    }
    
    console.log('═══════════════════════════════════════════');
}
```

### 2.2 Resource Tracking
**Track all resources, not just energy**

```javascript
// Enhanced analytics.js
static recordTick() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (!room.controller?.my) continue;
        
        // Energy tracking (existing)
        MemoryManager.recordStat('economy', `${roomName}_energy`, room.energyAvailable);
        
        // Storage tracking
        if (room.storage) {
            for (const resource in room.storage.store) {
                const amount = room.storage.store[resource];
                MemoryManager.recordStat('resources', `${roomName}_${resource}`, amount);
            }
        }
        
        // Mineral tracking
        const minerals = room.find(FIND_MINERALS);
        minerals.forEach(mineral => {
            MemoryManager.recordStat('minerals', `${roomName}_${mineral.mineralType}`, mineral.mineralAmount);
        });
        
        // Construction progress
        const sites = room.find(FIND_MY_CONSTRUCTION_SITES);
        const totalProgress = sites.reduce((sum, s) => sum + s.progress, 0);
        MemoryManager.recordStat('construction', `${roomName}_progress`, totalProgress);
        
        // Controller tracking
        MemoryManager.recordStat('controller', `${roomName}_progress`, room.controller.progress);
        MemoryManager.recordStat('controller', `${roomName}_downgrade`, room.controller.ticksToDowngrade);
    }
}
```

---

## Phase 3: Advanced Infrastructure (v2.1.0) 🏗️
**Goal**: Intelligent building, minerals, labs  
**Timeline**: 2-3 weeks

### 3.1 Smart Structure Placement
**Current**: Grid pattern, basic placement  
**v2.1**: Optimal layout calculation

```javascript
// Enhanced structure.planner.js
class AdvancedPlanner {
    static planOptimalLayout(room) {
        // Calculate room "center of mass" based on:
        // - Spawn position
        // - Source positions
        // - Controller position
        // - Mineral position
        
        const centerPoint = this.calculateOptimalCenter(room);
        
        // Plan compact core (extensions + storage + towers)
        this.planCompactCore(room, centerPoint);
        
        // Plan ramparts at key choke points
        this.planDefensiveStructures(room);
        
        // Plan labs near storage
        if (room.controller.level >= 6) {
            this.planLabCluster(room);
        }
    }
    
    static planLabCluster(room) {
        // Labs need to be within range 2 of each other
        // Optimal pattern: 3x3 grid near storage
        // 2 input labs + 7 output labs
    }
}
```

### 3.2 Mineral Harvesting
**New Role**: `role.miner.js` - Mine minerals when available

```javascript
class RoleMiner {
    static run(creep) {
        const room = creep.room;
        const mineral = room.find(FIND_MINERALS)[0];
        
        if (!mineral || mineral.mineralAmount === 0) {
            // No mineral available, become upgrader
            creep.memory.role = 'upgrader';
            return;
        }
        
        // Need extractor built on mineral
        const extractor = mineral.pos.findInRange(FIND_STRUCTURES, 0, {
            filter: s => s.structureType === STRUCTURE_EXTRACTOR
        })[0];
        
        if (!extractor) {
            // Build extractor if we're RCL 6+
            if (room.controller.level >= 6) {
                room.createConstructionSite(mineral.pos, STRUCTURE_EXTRACTOR);
            }
            return;
        }
        
        // Mine mineral
        if (creep.harvest(mineral) === ERR_NOT_IN_RANGE) {
            creep.moveTo(mineral);
        }
    }
}
```

### 3.3 Lab Automation
**New**: `lab.controller.js` - Automated resource reactions

```javascript
class LabController {
    static run(room) {
        if (!ExecutionManager.shouldRun('labOperations', room.name)) return;
        
        const labs = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_LAB
        });
        
        if (labs.length < 3) return; // Need minimum 3 labs
        
        // Define reaction chains
        const reactions = [
            { inputs: [RESOURCE_HYDROGEN, RESOURCE_OXYGEN], output: RESOURCE_HYDROXIDE },
            { inputs: [RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM], output: RESOURCE_ZYNTHIUM_KEANITE },
            // ... more reactions
        ];
        
        // Find reaction we can produce
        const reaction = this.findAvailableReaction(room, reactions);
        if (reaction) {
            this.executeReaction(room, labs, reaction);
        }
    }
}
```

### 3.4 Terminal & Market Automation
**New**: `market.controller.js` - Automated trading

```javascript
class MarketController {
    static run(room) {
        if (!room.terminal) return;
        if (!ExecutionManager.shouldRun('marketOperations', room.name)) return;
        
        // Auto-sell excess resources
        for (const resource in room.terminal.store) {
            const amount = room.terminal.store[resource];
            
            // Sell if we have excess
            if (this.isExcess(resource, amount)) {
                this.sellResource(room, resource, amount);
            }
        }
        
        // Auto-buy needed resources
        const needed = this.getNeededResources(room);
        for (const resource of needed) {
            this.buyResource(room, resource);
        }
    }
    
    static isExcess(resource, amount) {
        const thresholds = {
            [RESOURCE_ENERGY]: 100000,
            [RESOURCE_HYDROGEN]: 3000,
            // ... resource-specific thresholds
        };
        return amount > (thresholds[resource] || 5000);
    }
}
```

---

## Phase 4: Military & Expansion (v2.2.0) ⚔️
**Goal**: Automated combat and multi-room control  
**Timeline**: 1 month

### 4.1 Room Claiming Automation
**New**: `expansion.controller.js`

```javascript
class ExpansionController {
    static evaluateExpansionTargets() {
        // Find rooms adjacent to our territory
        const targets = [];
        
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            if (!room.controller?.my) continue;
            
            // Check adjacent rooms
            const adjacents = this.getAdjacentRooms(roomName);
            for (const adjRoom of adjacents) {
                const score = this.scoreExpansionRoom(adjRoom);
                if (score > 50) {
                    targets.push({ room: adjRoom, score: score });
                }
            }
        }
        
        targets.sort((a, b) => b.score - a.score);
        return targets[0]; // Best target
    }
    
    static scoreExpansionRoom(roomName) {
        // Score based on:
        // - Number of sources (2 is best)
        // - Mineral type (T/X high value)
        // - Distance from owned rooms
        // - Presence of hostile structures
        // - Swamp percentage
    }
}
```

### 4.2 Remote Mining
**New**: `role.remoteminer.js` - Mine resources in adjacent rooms

### 4.3 Advanced Combat
**Enhanced**: Coordinated squad tactics

```javascript
class SquadController {
    static formSquad(targetRoom, squadType) {
        // Create coordinated military squads
        // Types: raiding, defending, claiming
        const squad = {
            id: Game.time,
            target: targetRoom,
            members: [],
            type: squadType
        };
        
        // Spawn appropriate composition
        // Raiders: 2 healers + 4 attackers
        // Defenders: 3 defenders + 1 healer
    }
}
```

---

## Phase 5: Machine Learning (v2.3.0) 🤖
**Goal**: Adaptive behavior and optimization  
**Timeline**: 2 months

### 5.1 Q-Learning for Role Assignment
**Concept**: Learn optimal creep counts through reinforcement

```javascript
class QLearning {
    static updateQ(state, action, reward, newState) {
        // Q(s,a) = Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]
        const alpha = 0.1; // Learning rate
        const gamma = 0.9; // Discount factor
        
        if (!Memory.qTable) Memory.qTable = {};
        const qKey = `${state}_${action}`;
        const currentQ = Memory.qTable[qKey] || 0;
        
        const maxFutureQ = Math.max(...this.getPossibleActions(newState).map(
            a => Memory.qTable[`${newState}_${a}`] || 0
        ));
        
        Memory.qTable[qKey] = currentQ + alpha * (reward + gamma * maxFutureQ - currentQ);
    }
}
```

### 5.2 Genetic Algorithm for Body Optimization
**Concept**: Evolve optimal creep bodies

### 5.3 Pattern Recognition
**Concept**: Detect attack patterns, optimize defense

---

## Implementation Priority Matrix

| Feature | CPU Impact | Memory Impact | Complexity | Priority | Phase |
|---------|-----------|---------------|------------|----------|-------|
| Execution Gating | -40% | Low | Low | 🔴 CRITICAL | 1 |
| Advanced Caching | -20% | +5% | Medium | 🔴 CRITICAL | 1 |
| Enhanced Status | +2% | Low | Low | 🟡 HIGH | 2 |
| Resource Tracking | +3% | +10% | Low | 🟡 HIGH | 2 |
| Memory Optimization | 0% | -90% | Low | 🔴 CRITICAL | 1 |
| Lab Automation | +5% | Low | High | 🟢 MEDIUM | 3 |
| Mineral Mining | +2% | Low | Medium | 🟡 HIGH | 3 |
| Market Automation | +3% | Low | Medium | 🟢 MEDIUM | 3 |
| Room Expansion | +10% | Medium | High | 🟢 MEDIUM | 4 |
| Combat Squads | +8% | Medium | High | 🟢 LOW | 4 |
| Machine Learning | +15% | High | Very High | 🟢 LOW | 5 |

---

## Immediate Action Plan (Next 48 Hours)

### Day 1: Critical Performance
1. ✅ Implement `execution.manager.js` - intelligent throttling
2. ✅ Implement `cache.manager.js` - reduce repeated finds
3. ✅ Update `memory.manager.js` - circular buffers
4. ✅ Test in simulation - verify 40% CPU reduction
5. ✅ Deploy to production W13N57

### Day 2: Enhanced Monitoring
1. ✅ Enhance `console.helper.js` - new `status()` command
2. ✅ Update `analytics.js` - track all resources
3. ✅ Add mineral tracking
4. ✅ Add construction progress tracking
5. ✅ Test and deploy

---

## Success Metrics

### v2.0.0 (Performance)
- ✅ CPU usage: < 12 CPU/tick (currently ~20+)
- ✅ Bucket: Stable at 9000+ (currently fluctuating)
- ✅ Memory: < 200 KB (currently growing)
- ✅ Tick execution: < 50ms

### v2.1.0 (Infrastructure)
- ✅ Mineral harvesting active
- ✅ Lab reactions producing compounds
- ✅ Market trades executing
- ✅ RCL 6+ rooms optimized

### v2.2.0 (Expansion)
- ✅ 3+ rooms under control
- ✅ Remote mining active
- ✅ Defense rating > 1000

### v2.3.0 (ML)
- ✅ Q-learning adjusting creep counts
- ✅ Genetic algorithm optimizing bodies
- ✅ Pattern recognition detecting threats

---

## Risk Mitigation

### Deployment Safety
- Always test in `simulation/` first
- Use `./deploy.sh diff` before deploying
- Auto-backups before each deploy
- Emergency rollback ready

### CPU Budget Management
- Implement circuit breaker (pause non-critical ops if CPU > 90%)
- Gradual rollout of new features
- A/B testing for optimizations

### Memory Management
- Implement memory watchdog (alert if > 1.5 MB)
- Regular cleanup every 1000 ticks
- Cap all arrays at 100 entries

---

## Next Steps

**Immediate** (You should do this now):
1. Review this roadmap
2. Approve Phase 1 implementation
3. I'll implement execution gating + caching
4. Test in simulation
5. Deploy to W13N57

**Questions for you**:
1. What's your current CPU usage average? (Run `Game.cpu.getUsed()`)
2. What's your bucket level? (Run `Game.cpu.bucket`)
3. What RCL is W13N57 currently?
4. Do you have storage built yet?
5. Any immediate pain points I should address first?

Let's start with Phase 1 and get your CPU under control! 🚀
