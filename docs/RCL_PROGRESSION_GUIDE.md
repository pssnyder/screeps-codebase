# RCL Progression Guide - Levels 4-8

**Current Status**: RCL 4 (12% to RCL 5) - Room W13N57, shard3
**Date**: November 29, 2025

## Table of Contents
1. [Understanding RCL Metrics](#understanding-rcl-metrics)
2. [RCL 5: Link Economy](#rcl-5-link-economy)
3. [RCL 6: Mineral & Market Operations](#rcl-6-mineral-market-operations)
4. [RCL 7: Expansion & Production](#rcl-7-expansion-production)
5. [RCL 8: Maximum Efficiency](#rcl-8-maximum-efficiency)
6. [Expansion Risk Assessment](#expansion-risk-assessment)
7. [Timeline & Resource Planning](#timeline-resource-planning)

---

## Understanding RCL Metrics

### CRITICAL CLARIFICATION: Energy vs Controller Progress

Based on documentation review, there are TWO separate energy metrics:

#### 1. Room Energy (Spawn/Extension Capacity)
```javascript
room.energyAvailable      // Current energy in spawns/extensions
room.energyCapacityAvailable  // Total capacity
```
**Current Status**: 900 total capacity (12 extensions @ 50 each + spawn @ 300)

#### 2. Controller Progress (RCL Advancement)
```javascript
controller.progress       // Energy invested in controller
controller.progressTotal  // Energy needed for next RCL
controller.level          // Current RCL (4)
```

**Your Current Metrics**:
- **Room Energy**: 111/900 (12%) - This is spawn/extension energy
- **Controller Progress**: Unknown exact value - need to check `controller.progress`
- **Percentage to RCL 5**: 1.23% (from your earlier report)

### RCL Requirements Table

| RCL | Energy to Upgrade | Downgrade Timer | Key Unlocks |
|-----|-------------------|-----------------|-------------|
| 4 (current) | 405,000 → RCL 5 | 40,000 ticks (~28 hours) | 20 extensions, storage |
| 5 | 1,215,000 → RCL 6 | 80,000 ticks (~56 hours) | 30 extensions, 2 towers, **2 links** |
| 6 | 3,645,000 → RCL 7 | 120,000 ticks (~84 hours) | 40 extensions, **extractor, 3 labs, terminal** |
| 7 | 10,935,000 → RCL 8 | 150,000 ticks (~104 hours) | 50 extensions (100 capacity), **2nd spawn, factory** |
| 8 | N/A (max level) | 200,000 ticks (~139 hours) | 60 extensions (200 capacity), 6 towers, **observer, power spawn, nuker** |

**Tick to Time Conversion**: 1 tick ≈ 2-3 seconds
- 1,000 ticks ≈ 40-50 minutes
- 10,000 ticks ≈ 6.5-8.3 hours
- 100,000 ticks ≈ 2.8-3.5 days

---

## RCL 5: Link Economy

**Energy Required**: 1,215,000 (from RCL 4)
**Estimated Timeline**: 2-3 weeks with optimized upgraders

### Key Infrastructure Unlocks

#### Links (2 available)
**Cost**: 5,000 energy each (10,000 total)
**Capacity**: 800 energy
**Cooldown**: 1 tick per tile distance
**Energy Loss**: 3% per transfer

**Optimal Link Placement**:
```
Link 1: Near energy sources (replace static harvesters)
Link 2: Near spawn/extensions (fast energy delivery)
Optional Link 3 (RCL 7): Near controller for upgraders
```

**Why Links Matter**:
- **Static Harvester Evolution**: 2 harvesters sit on source containers, fill links
- **Instant Transport**: Link transfers energy 50x faster than haulers
- **CPU Savings**: -30 to -50% hauler CPU (fewer pathfinding operations)
- **Hauler Reduction**: 2-3 haulers → 0-1 haulers (backup only)

#### Additional Extensions
**10 more extensions** (20 → 30 total)
- Total capacity: 300 (spawn) + 1,500 (extensions) = **1,800 energy**
- Enables creeps with ~36 body parts (vs ~18 at RCL 4)

#### Towers
**2nd tower** (1 → 2 total)
- Better defense coverage
- Redundancy if one tower is under attack
- Can cover larger room area

### Link Implementation Strategy

**Phase 1: Harvester Links** (First 200k controller energy)
```javascript
// Static harvesters with link support
1. Place Link adjacent to each source container
2. Harvesters: harvest → transfer to link (not container)
3. Links transfer to central link near spawn
4. 1 hauler collects from central link → spawn/extensions
```

**Expected Performance**:
- Energy transport: 800/tick potential (vs ~50/tick with haulers)
- CPU reduction: -8 to -12 CPU/tick
- Harvester efficiency: 100% (no travel time)

**Phase 2: Controller Link** (RCL 7+)
```javascript
// When you have 3+ links
1. Place 3rd link near controller
2. Central link → controller link transfer
3. Upgraders withdraw from controller link (no hauling needed)
4. Sustained 15 energy/tick upgrade rate (max controller input)
```

### Strategic Goals for RCL 5

1. **Build Both Links ASAP**: Top priority after hitting RCL 5
2. **Place 10 New Extensions**: Batched construction (3-4 at a time)
3. **Deploy 2nd Tower**: For defense redundancy
4. **Transition Haulers**: 2-3 haulers → 1 hauler (backup role)
5. **Increase Upgraders**: 3-4 upgraders → 5-6 (larger bodies, faster progress)
6. **Build Storage**: If not already built at RCL 4

**Timeline to RCL 6**: With links operational, estimate 3-4 weeks

---

## RCL 6: Mineral & Market Operations

**Energy Required**: 3,645,000 (from RCL 5)
**Estimated Timeline**: 4-6 weeks with link economy

### Critical Infrastructure Unlocks

#### Extractor (1 available)
**Cost**: 5,000 energy
**Cooldown**: 5 ticks per harvest action
**Purpose**: Required to harvest minerals (H, O, U, K, L, Z, X)

#### Terminal (1 available)
**Cost**: 100,000 energy
**Capacity**: 300,000 units
**Cooldown**: 10 ticks between sends
**Transaction Cost**: `Math.ceil(amount * (1 - Math.exp(-distance/30)))`

**Example Transaction Costs**:
- 1000 units, 5 rooms away: 142 energy
- 1000 units, 10 rooms away: 284 energy
- 1000 units, 20 rooms away: 486 energy
- 1000 units, 30 rooms away: 632 energy

#### Labs (3 available)
**Cost**: 50,000 energy each (150,000 total)
**Capacity**: 3,000 mineral units, 2,000 energy units
**Produce**: 5 mineral compound units per reaction
**Range Requirement**: Input labs must be within 2 squares

### Mineral Harvesting Strategy

**Hydrogen in W13N57** (Your Current Shard):

#### Step 1: Identify Mineral Deposit
```javascript
// In-game console
const mineral = Game.rooms['W13N57'].find(FIND_MINERALS)[0];
console.log(mineral.mineralType);  // Should show 'H' for hydrogen
console.log(mineral.mineralAmount); // Initial amount (varies by density)
console.log(mineral.density);       // 1-4 (higher = more minerals)
```

**Mineral Density Table**:
| Density | Amount | Probability |
|---------|--------|-------------|
| Low (1) | 15,000 | 10% |
| Moderate (2) | 35,000 | 40% |
| High (3) | 70,000 | 40% |
| Ultra (4) | 100,000 | 10% |

**Regeneration**: 50,000 ticks (~35 hours) after depletion

#### Step 2: Build Extractor
```javascript
// Place extractor on mineral position
room.createConstructionSite(mineral.pos, STRUCTURE_EXTRACTOR);
```

#### Step 3: Create Miner Role
```javascript
// New role: role.miner.js (similar to harvester)
const roleMiner = {
    run: function(creep) {
        // Check for extractor
        const mineral = creep.room.find(FIND_MINERALS)[0];
        if (!mineral) return;
        
        const extractor = mineral.pos.lookFor(LOOK_STRUCTURES).find(
            s => s.structureType === STRUCTURE_EXTRACTOR
        );
        if (!extractor) return;
        
        // Mine mineral
        if (creep.harvest(mineral) === ERR_NOT_IN_RANGE) {
            creep.moveTo(mineral, {reusePath: 20});
        }
        
        // When full, deposit to storage/terminal
        if (creep.store.getFreeCapacity() === 0) {
            const target = creep.room.storage || creep.room.terminal;
            if (target && creep.transfer(target, RESOURCE_HYDROGEN) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {reusePath: 20});
            }
        }
    }
};
```

**Miner Body Composition**:
```javascript
// Small miner (early RCL 6): [WORK, WORK, CARRY, MOVE, MOVE] (350 energy)
// Large miner (late RCL 6): [WORK×5, CARRY×3, MOVE×4] (950 energy)
```

#### Step 4: Storage Strategy
```javascript
// Priority storage hierarchy
1. Terminal (for market trading) - Keep 10,000 H minimum
2. Storage (overflow, general stockpile) - Unlimited
3. Labs (for compound production) - 3,000 per lab
```

### Market Operations

**Prerequisites**:
- ✅ RCL 6+ (terminal unlocked)
- ✅ Terminal built (100k energy investment)
- ✅ Minerals stockpiled (10k+ units recommended)

#### Market Research
```javascript
// Check hydrogen prices (in-game console)
const orders = Game.market.getAllOrders({resourceType: RESOURCE_HYDROGEN});

// Buy orders (others want to buy)
const buyOrders = orders.filter(o => o.type === ORDER_BUY)
    .sort((a, b) => b.price - a.price);  // Highest price first
console.log('Best buy price:', buyOrders[0].price, 'credits per unit');

// Sell orders (others want to sell)
const sellOrders = orders.filter(o => o.type === ORDER_SELL)
    .sort((a, b) => a.price - b.price);  // Lowest price first
console.log('Best sell price:', sellOrders[0].price, 'credits per unit');
```

**Historical Hydrogen Prices** (approximate):
- Buy orders: 0.05 - 0.15 credits/unit
- Sell orders: 0.10 - 0.30 credits/unit
- Profit margin: 0.05 - 0.15 credits/unit

#### Creating Market Orders

**Sell Order Strategy**:
```javascript
// Create a sell order (list your hydrogen for sale)
Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_HYDROGEN,
    price: 0.20,        // Credits per unit (check market first!)
    totalAmount: 5000,  // How many units to sell
    roomName: 'W13N57'  // Your room with terminal
});
```

**Expected Revenue**:
```
5,000 H × 0.20 credits = 1,000 credits
- Market fee (5%): -50 credits
= 950 credits net profit
```

**Buy Order Strategy** (for missing resources):
```javascript
// Example: Buy oxygen for lab compounds
Game.market.createOrder({
    type: ORDER_BUY,
    resourceType: RESOURCE_OXYGEN,
    price: 0.15,
    totalAmount: 3000,
    roomName: 'W13N57'
});
```

#### Automated Market Bot

**Basic Market Strategy**:
```javascript
// In decision.tree.js or new market.manager.js
const MarketManager = {
    run: function(room) {
        if (!room.terminal || Game.time % 1000 !== 0) return;  // Check every 1000 ticks
        
        // Check hydrogen stockpile
        const hydrogen = room.terminal.store[RESOURCE_HYDROGEN] || 0;
        const threshold = 10000;  // Min reserve
        
        if (hydrogen > threshold + 5000) {
            // Sell excess
            const sellAmount = hydrogen - threshold;
            const orders = Game.market.getAllOrders({
                type: ORDER_BUY,
                resourceType: RESOURCE_HYDROGEN
            }).sort((a, b) => b.price - a.price);
            
            if (orders.length > 0 && orders[0].price > 0.10) {
                // Deal with best buyer
                Game.market.deal(orders[0].id, Math.min(sellAmount, orders[0].amount), room.name);
                console.log(`[Market] Sold ${sellAmount}H @ ${orders[0].price} credits/unit`);
            }
        }
    }
};
```

### Lab Compound Production

**Basic Compounds** (RCL 6, 3 labs):
```javascript
// Example: Produce Ghodium Hydride (GH) for controller boosting
// Reaction: RESOURCE_GHODIUM + RESOURCE_HYDROGEN → RESOURCE_GHODIUM_HYDRIDE

const lab1 = Game.getObjectById('lab1_id');  // Input: Ghodium
const lab2 = Game.getObjectById('lab2_id');  // Input: Hydrogen
const lab3 = Game.getObjectById('lab3_id');  // Output: GH

if (lab1 && lab2 && lab3) {
    lab3.runReaction(lab1, lab2);
    // Produces 5 GH units per reaction (10 tick cooldown)
}
```

**Useful Compounds for RCL 6-7**:
- **GH (Ghodium Hydride)**: +50% controller upgrade speed
- **UH (Utrium Hydride)**: +100% attack damage
- **LH (Lemergium Hydride)**: +50% build/repair speed

### Strategic Goals for RCL 6

1. **Build Extractor Immediately**: Start mining hydrogen day 1
2. **Build Terminal ASAP**: Costs 100k energy but enables market
3. **Mine 10k Hydrogen**: Reserve for future compound production
4. **Create First Market Order**: Sell 5k H to test market system
5. **Build 3 Labs**: For compound production (150k energy investment)
6. **Stockpile Credits**: Aim for 10k+ credits reserve
7. **Plan Lab Compounds**: Research which compounds benefit your strategy

**Timeline to RCL 7**: With market revenue and compound production, estimate 6-8 weeks

---

## RCL 7: Expansion & Production

**Energy Required**: 10,935,000 (from RCL 6)
**Estimated Timeline**: 8-12 weeks

### Major Infrastructure Unlocks

#### 2nd Spawn (1 → 2 total)
**Cost**: 15,000 energy
**Benefit**: Double creep production rate
- Critical for expansion (spawn creeps for remote rooms)
- Redundancy if primary spawn attacked
- Can spawn 2 different roles simultaneously

#### Factory (1 available)
**Cost**: 100,000 energy
**Capacity**: 50,000 units
**Purpose**: Produces commodities from minerals

**Commodity Production Chain**:
```
Base Minerals → Basic Commodities → Advanced Commodities → Trading
H, O, U, K, L, Z, X → Bars, Wires, Cells → Devices, Organisms → Market
```

#### Extensions (10 more, 40 → 50 total)
**Capacity**: 100 energy each (doubled from 50)
- Total room capacity: 300 + 5,000 = **5,300 energy**
- Enables creeps with 100+ body parts
- Allows MAX_CREEP_SIZE (50 parts) creeps

### Factory Operations

**Basic Factory Production**:
```javascript
// Example: Produce battery from energy
const factory = room.find(FIND_MY_STRUCTURES, {
    filter: {structureType: STRUCTURE_FACTORY}
})[0];

if (factory && factory.store[RESOURCE_ENERGY] >= 600) {
    factory.produce(RESOURCE_BATTERY);  // Produces 50 battery, costs 600 energy
}
```

**Profitable Commodity Chains** (requires research):
- Battery → Energy conversion (emergency energy source)
- Alloy → Frame → Hydraulics → Machine (high-value commodity)
- Cell → Phlegm → Tissue → Muscle (bio commodities)

### Expansion Strategy (RCL 7+)

**When to Expand**: RCL 7 is optimal expansion time
- 2 spawns = Can maintain 2 rooms efficiently
- Energy surplus = Can afford remote operations
- Defense established = Home base secure

#### Expansion Options

**Option 1: Claim 2nd Room**
**Cost**: Very high (15k spawn + full infrastructure)
**Benefit**: Full control, GCL increase
**Timeline**: 4-6 weeks to mature

**Claiming Process**:
```javascript
// Create claimer creep
spawn.spawnCreep([CLAIM, MOVE], 'claimer', {
    memory: {role: 'claimer', targetRoom: 'W12N57'}
});

// Claimer logic
if (targetRoom && targetRoom.controller) {
    if (creep.claimController(targetRoom.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targetRoom.controller);
    }
}
```

**Option 2: Remote Harvesting**
**Cost**: Low (2-4 remote harvesters + defenders)
**Benefit**: Extra energy income, no GCL required
**Timeline**: Immediate (profitable day 1)

**Remote Harvesting Process**:
```javascript
// Reserve controller (extends source energy)
creep.reserveController(targetRoom.controller);  // +1 tick per CLAIM part

// Remote harvester brings energy home
if (creep.store.getFreeCapacity() === 0) {
    // Path to home room
    creep.moveTo(new RoomPosition(25, 25, 'W13N57'));
}
```

**Comparison Table**:
| Metric | Claim Room | Remote Harvest |
|--------|------------|----------------|
| Initial Cost | 15,000+ energy | 500-1000 energy |
| GCL Required | +1 level | None |
| Energy ROI | 6-8 weeks | 2-3 days |
| Defense Cost | High | Medium |
| CPU Cost | High | Medium |
| Lifetime Cost | Infrastructure | Creeps only |

**Recommendation**: Start with remote harvesting, claim when GCL allows and energy stable

### Strategic Goals for RCL 7

1. **Build 2nd Spawn**: Critical for expansion operations
2. **Build Factory**: Start commodity production chains
3. **Place 10 Extensions**: Reach 50 total (5,300 capacity)
4. **Scout Adjacent Rooms**: Find best expansion target
5. **Start Remote Harvesting**: 1-2 remote rooms for extra energy
6. **Defend Against Raids**: Expect more hostile activity as you expand
7. **Boost Key Creeps**: Use lab compounds for efficiency gains

**Timeline to RCL 8**: With 2 spawns and remote income, estimate 12-16 weeks

---

## RCL 8: Maximum Efficiency

**Energy Required**: 0 (max level reached)
**No Downgrade Risk**: Controller still degrades but stays at RCL 8

### Final Infrastructure Unlocks

#### 3rd Spawn (2 → 3 total)
**Cost**: 15,000 energy
**Benefit**: Triple creep production, 3-room empire management

#### Extensions (10 more, 50 → 60 total)
**Capacity**: 200 energy each (doubled from 100)
- Total room capacity: 300 + 12,000 = **12,300 energy**
- Enables maximum-sized creeps

#### Towers (3 → 6 total)
**Cost**: 5,000 energy each (15,000 total)
**Benefit**: Complete room coverage, rapid response defense

#### Observer (1 available)
**Cost**: 8,000 energy
**Range**: 10 rooms
**Purpose**: Remote vision without sending creeps

#### Power Spawn (1 available)
**Cost**: 100,000 energy
**Purpose**: Process power into your account for Power Creeps

#### Nuker (1 available)
**Cost**: 100,000 energy
**Launch Cost**: 300k energy + 5k ghodium
**Cooldown**: 100,000 ticks (~70 hours)
**Range**: 10 rooms
**Purpose**: Devastate enemy rooms from distance

### Maximum Creep Configurations

**RCL 8 Creep Bodies** (12,300 energy available):
```javascript
// Ultra Harvester: [WORK×20, CARRY×10, MOVE×15] (4,500 energy)
// Harvest: 40 energy/tick, Capacity: 500, Speed: 1 tile/tick

// Ultra Hauler: [CARRY×25, MOVE×25] (2,500 energy)
// Capacity: 1,250 energy, Speed: 1 tile/tick

// Ultra Upgrader: [WORK×30, CARRY×10, MOVE×20] (6,500 energy)
// Upgrade: 30 energy/tick (capped at 15/tick at controller)

// Ultra Builder: [WORK×20, CARRY×20, MOVE×20] (5,000 energy)
// Build: 100 energy/tick, Repair: 2000 hits/tick

// Ultra Defender: [ATTACK×20, MOVE×20] (2,600 energy)
// Damage: 600 hits/tick, Speed: 1 tile/tick
```

### Observer Usage

**Strategic Vision**:
```javascript
// Observe distant rooms
const observer = room.find(FIND_MY_STRUCTURES, {
    filter: {structureType: STRUCTURE_OBSERVER}
})[0];

if (observer) {
    observer.observeRoom('W5N50');  // 10 room range max
}

// Next tick, room is visible
const targetRoom = Game.rooms['W5N50'];
if (targetRoom) {
    // Scout for expansion opportunities
    // Monitor hostile activity
    // Track power bank spawns
    // Find SK room resources
}
```

### Power Creep Development

**Power Spawn Operations**:
```javascript
// Process power into your account
const powerSpawn = room.find(FIND_MY_STRUCTURES, {
    filter: {structureType: STRUCTURE_POWER_SPAWN}
})[0];

if (powerSpawn && powerSpawn.store[RESOURCE_POWER] >= 1 && powerSpawn.store[RESOURCE_ENERGY] >= 50) {
    powerSpawn.processPower();  // Converts 1 power + 50 energy → account GPL
}
```

**Power Creep Benefits**:
- Permanent heroes (don't die)
- Special abilities (operate structures, generate ops, etc.)
- Can boost economy significantly
- Require GPL (Global Power Level) to upgrade

### Nuker Strategy

**When to Use Nukes**:
- **Defensive**: Enemy threatening your territory
- **Offensive**: Clearing enemy strongholds
- **Strategic**: Opening expansion corridors

**Nuke Launch**:
```javascript
const nuker = room.find(FIND_MY_STRUCTURES, {
    filter: {structureType: STRUCTURE_NUKER}
})[0];

if (nuker && nuker.store[RESOURCE_ENERGY] === 300000 && nuker.store[RESOURCE_GHODIUM] === 5000) {
    nuker.launchNuke(new RoomPosition(25, 25, 'W5N45'));  // 10 room range
    // Landing time: 50,000 ticks (~35 hours)
}
```

### Strategic Goals for RCL 8

1. **Maximize Creep Sizes**: Upgrade all roles to use 12,300 energy
2. **Build 3rd Spawn**: Support multi-room empire
3. **Deploy 6 Towers**: Complete defense grid
4. **Build Observer**: Scout 10-room radius
5. **Expand to 3+ Rooms**: Leverage triple spawn capacity
6. **Commodity Trading**: Maximize market profit
7. **Power Creep Development**: Unlock and upgrade power creeps
8. **Consider Nuker**: If hostile threats exist

**Endgame Focus**: Leaderboard ranking, alliance building, large-scale warfare

---

## Expansion Risk Assessment

### Risk Factor Model

**Risk Factor Formula**:
```
Risk = (Military Threat × 0.4) + (Distance Cost × 0.3) + (Resource ROI × 0.3)
```

#### 1. Military Threat Score (0-10)

**Factors**:
- Nearest hostile player distance (rooms away)
- Hostile player GCL level
- Recent attack history (from Game.market or alliance intel)
- Invader core activity (SK rooms)

**Scoring**:
```javascript
function calculateMilitaryThreat(targetRoom) {
    let threat = 0;
    
    // Check for nearby hostile players (5 room scan)
    const nearbyHostiles = scanHostilePlayers(targetRoom, 5);
    threat += nearbyHostiles.length * 2;  // +2 per hostile
    
    // Check for invader cores
    const invaderCores = targetRoom.find(FIND_HOSTILE_STRUCTURES, {
        filter: {structureType: STRUCTURE_INVADER_CORE}
    });
    threat += invaderCores.length * 3;  // +3 per core
    
    // Check for source keepers
    const isSourceKeeper = /^[WE][0-9]*0[NS][0-9]*0$/.test(targetRoom.name);
    if (isSourceKeeper) threat += 4;
    
    return Math.min(threat, 10);  // Cap at 10
}
```

#### 2. Distance Cost Score (0-10)

**Factors**:
- Linear distance from home room
- CPU cost per creep path
- Energy cost of hauling (remote harvest)
- Creep lifetime utilization

**Scoring**:
```javascript
function calculateDistanceCost(homeRoom, targetRoom) {
    const distance = Game.map.getRoomLinearDistance(homeRoom, targetRoom);
    
    // Distance penalties
    if (distance <= 2) return 1;  // Adjacent = low cost
    if (distance <= 5) return 3;  // Near = medium cost
    if (distance <= 8) return 6;  // Far = high cost
    return 10;  // Very far = extreme cost
}
```

#### 3. Resource ROI Score (0-10, inverted - lower = better)

**Factors**:
- Number of energy sources (2 is ideal)
- Mineral type value (H, O, U, K = medium, L, Z, X = high, G = rare)
- Source energy capacity (owned vs neutral vs reserved)
- Swamp percentage (affects construction and movement)

**Scoring**:
```javascript
function calculateResourceROI(targetRoom) {
    let score = 10;  // Start pessimistic
    
    // Source count bonus
    const sources = targetRoom.find(FIND_SOURCES);
    if (sources.length === 2) score -= 3;  // Ideal
    if (sources.length === 1) score -= 1;  // Acceptable
    
    // Mineral value
    const mineral = targetRoom.find(FIND_MINERALS)[0];
    const highValueMinerals = ['L', 'Z', 'X', 'G'];
    if (highValueMinerals.includes(mineral.mineralType)) {
        score -= 2;
    }
    
    // Terrain analysis
    const terrain = targetRoom.getTerrain();
    let swampTiles = 0;
    for (let x = 0; x < 50; x++) {
        for (let y = 0; y < 50; y++) {
            if (terrain.get(x, y) === TERRAIN_MASK_SWAMP) swampTiles++;
        }
    }
    const swampPercent = swampTiles / 2500;
    if (swampPercent < 0.2) score -= 2;  // Low swamp = good
    
    return Math.max(score, 0);  // Floor at 0
}
```

#### Overall Risk Calculation

```javascript
function assessExpansionRisk(homeRoom, targetRoom) {
    const militaryThreat = calculateMilitaryThreat(targetRoom);
    const distanceCost = calculateDistanceCost(homeRoom, targetRoom);
    const resourceROI = calculateResourceROI(targetRoom);
    
    const riskFactor = (militaryThreat * 0.4) + (distanceCost * 0.3) + (resourceROI * 0.3);
    
    // Risk categories
    if (riskFactor < 3) return 'LOW RISK - Recommended';
    if (riskFactor < 5) return 'MEDIUM RISK - Monitor closely';
    if (riskFactor < 7) return 'HIGH RISK - Prepare defenses';
    return 'EXTREME RISK - Avoid or heavy military';
}
```

### Expansion Decision Tree

**Step 1: Pre-Expansion Checklist**
- [ ] Home room at RCL 7+ (2 spawns minimum)
- [ ] Storage with 100k+ energy reserve
- [ ] Terminal operational (for support)
- [ ] 2+ defenders in reserve
- [ ] GCL allows another room (if claiming)

**Step 2: Room Scouting**
```javascript
// Scan adjacent rooms
const adjacentRooms = [
    'W12N57', 'W14N57',  // Horizontal
    'W13N56', 'W13N58'   // Vertical
];

adjacentRooms.forEach(roomName => {
    const risk = assessExpansionRisk('W13N57', roomName);
    console.log(`${roomName}: ${risk}`);
});
```

**Step 3: Expansion Mode Selection**

**Remote Harvest Decision** (Low commitment):
```
IF risk < 5 AND distance <= 5 AND sources >= 1
  → Deploy remote harvesters
  → Reserve controller
  → Build container at source
  → Defend with 1-2 defenders
```

**Claim Decision** (High commitment):
```
IF risk < 4 AND distance <= 3 AND sources === 2 AND GCL allows
  → Deploy claimer creep
  → Build spawn (15k energy)
  → Full infrastructure buildout
  → Permanent defense force
```

### Defense Planning

**Defensive Creep Composition**:
```javascript
// Light Defense (remote rooms): [ATTACK×5, MOVE×5] (650 energy)
// Medium Defense: [ATTACK×10, MOVE×10] (1,300 energy)
// Heavy Defense: [TOUGH×10, ATTACK×20, MOVE×20] (2,600 energy)
// Ranged Defense: [RANGED_ATTACK×10, MOVE×10] (2,000 energy)
```

**Safe Mode Strategy**:
- **1st Safe Mode**: Free at RCL 1 (use wisely)
- **Generate Safe Mode**: 1000 ghodium at controller (RCL 6+)
- **Safe Mode Cooldown**: 50,000 ticks (~35 hours) in normal rooms
- **Novice Area**: Unlimited safe modes (expired for you now)

---

## Timeline & Resource Planning

### Complete RCL 4 → RCL 8 Roadmap

**Current State (Nov 29, 2025)**:
- RCL: 4
- Controller Progress: ~5,000 / 405,000 (1.23%)
- Energy: 111/900 (spawn/extensions)
- Creeps: 10 (2 harvesters, 2-3 haulers, 3 upgraders, 2 builders)

### Phase 1: RCL 4 → RCL 5 (400k energy, 2-3 weeks)

**Week 1 (Dec 6, 2025)**:
- [ ] Deploy v2.0.3 optimizations (static harvesters)
- [ ] Energy stabilizes at 40-60% (400-600 energy)
- [ ] 2 static harvesters, 2-3 haulers, 3-4 upgraders
- [ ] Controller progress: ~50k / 405k (12%)

**Week 2 (Dec 13, 2025)**:
- [ ] Energy reaches 60-70% (600-700 energy)
- [ ] Upgrade upgraders to larger bodies (WORK×3)
- [ ] Controller progress: ~150k / 405k (37%)

**Week 3 (Dec 20, 2025)**:
- [ ] Energy reaches 70-80% (700-800 energy)
- [ ] 4-5 upgraders working continuously
- [ ] Controller progress: ~300k / 405k (74%)

**Week 4 (Dec 27, 2025)**:
- [ ] **RCL 5 REACHED** (~405k total)
- [ ] Immediately build both links (10k energy)
- [ ] Start building 10 new extensions

**Bottlenecks**:
- Upgrader count (3-4 is optimal, more wastes energy)
- Energy delivery (haulers must keep up)
- Storage not yet available (build at RCL 4 if possible)

### Phase 2: RCL 5 → RCL 6 (1.215M energy, 4-6 weeks)

**Week 5-6 (Jan 10, 2025)**:
- [ ] Links operational, haulers reduced to 1
- [ ] Energy capacity: 1,800 (30 extensions)
- [ ] Upgraders now WORK×5 bodies (500 energy each)
- [ ] Controller progress: ~200k / 1.215M (16%)

**Week 7-8 (Jan 24, 2025)**:
- [ ] 2nd tower built for defense
- [ ] Storage accumulating surplus (50k+ energy)
- [ ] Controller progress: ~500k / 1.215M (41%)

**Week 9-10 (Feb 7, 2025)**:
- [ ] 5-6 large upgraders ([WORK×10, CARRY×5, MOVE×5])
- [ ] Energy stable at 70%+
- [ ] Controller progress: ~900k / 1.215M (74%)

**Week 11 (Feb 14, 2025)**:
- [ ] **RCL 6 REACHED** (~1.62M total)
- [ ] Build extractor immediately
- [ ] Deploy miner to harvest hydrogen
- [ ] Build terminal (100k energy, critical priority)

**Bottlenecks**:
- Link cooldowns (may need 3rd link at RCL 7)
- Controller max input (15 energy/tick cap)
- Upgrader body size (limited by energy capacity)

### Phase 3: RCL 6 → RCL 7 (3.645M energy, 6-10 weeks)

**Weeks 12-15 (Mar 14, 2025)**:
- [ ] Terminal operational
- [ ] First hydrogen mined (~10k units)
- [ ] First market sell order (5k H @ 0.20 credits)
- [ ] Labs built (150k energy, start compound production)
- [ ] Controller progress: ~500k / 3.645M (14%)

**Weeks 16-20 (Apr 18, 2025)**:
- [ ] Market revenue: ~500-1000 credits/week
- [ ] Compound production active (GH for upgraders)
- [ ] Energy capacity: 2,800 (40 extensions @ 50 each)
- [ ] Controller progress: ~1.5M / 3.645M (41%)

**Weeks 21-24 (May 16, 2025)**:
- [ ] Upgraders boosted with GH (+50% speed)
- [ ] Storage at 200k+ energy consistently
- [ ] Controller progress: ~3M / 3.645M (82%)

**Week 25 (May 23, 2025)**:
- [ ] **RCL 7 REACHED** (~5.265M total)
- [ ] Build 2nd spawn immediately (15k energy)
- [ ] Start scouting adjacent rooms for expansion
- [ ] Build factory (100k energy)

**Bottlenecks**:
- Terminal build cost (100k energy upfront)
- Lab placement (need 3 labs within 2 squares)
- Mineral regeneration (50k ticks between harvests)

### Phase 4: RCL 7 → RCL 8 (10.935M energy, 10-16 weeks)

**Weeks 26-30 (Jun 27, 2025)**:
- [ ] 2 spawns operational
- [ ] Energy capacity: 5,300 (50 extensions @ 100 each)
- [ ] Upgraders now WORK×15 bodies ([WORK×15, CARRY×10, MOVE×13])
- [ ] Remote harvesting in 1-2 adjacent rooms
- [ ] Controller progress: ~2M / 10.935M (18%)

**Weeks 31-36 (Aug 8, 2025)**:
- [ ] Factory producing commodities
- [ ] Market revenue: ~2k-5k credits/week
- [ ] 2nd room claimed (if GCL allows)
- [ ] Controller progress: ~5M / 10.935M (46%)

**Weeks 37-42 (Sep 19, 2025)**:
- [ ] Multi-room empire operational
- [ ] Energy surplus from remote rooms
- [ ] Controller progress: ~9M / 10.935M (82%)

**Week 43 (Sep 26, 2025)**:
- [ ] **RCL 8 REACHED** (~16.2M total)
- [ ] Build 3rd spawn (15k energy)
- [ ] Build 3 more towers (15k energy)
- [ ] Energy capacity: 12,300 (60 extensions @ 200 each)

**Bottlenecks**:
- 2-room management complexity
- CPU limits (may need subscription)
- Defense costs (remote rooms vulnerable)

### Resource Investment Summary

| Structure | RCL | Cost | Priority | Payback Period |
|-----------|-----|------|----------|----------------|
| Storage | 4 | 30,000 | High | Immediate (energy buffer) |
| Link × 2 | 5 | 10,000 | Critical | 1-2 weeks (CPU savings) |
| Tower × 2 | 5 | 5,000 | Medium | As needed (defense) |
| Extractor | 6 | 5,000 | High | 2-3 weeks (mineral sales) |
| Terminal | 6 | 100,000 | Critical | 4-6 weeks (market access) |
| Lab × 3 | 6 | 150,000 | Medium | 6-8 weeks (compound production) |
| Spawn × 2 | 7 | 15,000 | Critical | Immediate (expansion) |
| Factory | 7 | 100,000 | Low | 10+ weeks (commodity profit) |
| Observer | 8 | 8,000 | Low | N/A (scouting utility) |
| Power Spawn | 8 | 100,000 | Low | Long-term (power creeps) |
| Nuker | 8 | 100,000 | Low | N/A (warfare) |

**Total Investment (RCL 4-8)**: ~538,000 energy in structures
**Expected Timeline**: 6-9 months to reach RCL 8

---

## Monitoring Commands

### Check RCL Progress
```javascript
// Controller progress
const controller = Game.rooms['W13N57'].controller;
const percent = (controller.progress / controller.progressTotal * 100).toFixed(2);
console.log(`RCL ${controller.level}: ${controller.progress}/${controller.progressTotal} (${percent}%)`);
console.log(`Downgrade timer: ${controller.ticksToDowngrade} ticks`);

// Time to next level (estimate)
const upgraders = Object.values(Game.creeps).filter(c => c.memory.role === 'upgrader');
const upgradeRate = upgraders.reduce((sum, c) => sum + c.getActiveBodyparts(WORK), 0);  // energy/tick
const ticksRemaining = (controller.progressTotal - controller.progress) / upgradeRate;
const daysRemaining = (ticksRemaining * 3 / 86400).toFixed(1);  // 3 sec/tick average
console.log(`Estimated time to RCL ${controller.level + 1}: ${daysRemaining} days`);
```

### Check Mineral Status
```javascript
const mineral = Game.rooms['W13N57'].find(FIND_MINERALS)[0];
console.log(`Mineral: ${mineral.mineralType}`);
console.log(`Amount: ${mineral.mineralAmount}`);
console.log(`Density: ${mineral.density}`);
console.log(`Regeneration: ${mineral.ticksToRegeneration} ticks`);

// Check storage
const storage = Game.rooms['W13N57'].storage;
if (storage) {
    console.log(`H in storage: ${storage.store[RESOURCE_HYDROGEN] || 0}`);
}

const terminal = Game.rooms['W13N57'].terminal;
if (terminal) {
    console.log(`H in terminal: ${terminal.store[RESOURCE_HYDROGEN] || 0}`);
}
```

### Check Market Prices
```javascript
// Check hydrogen market
const orders = Game.market.getAllOrders({resourceType: RESOURCE_HYDROGEN});
const buyOrders = orders.filter(o => o.type === ORDER_BUY).sort((a, b) => b.price - a.price);
const sellOrders = orders.filter(o => o.type === ORDER_SELL).sort((a, b) => a.price - b.price);

console.log(`Hydrogen Market:`);
console.log(`  Best buy price: ${buyOrders[0]?.price || 'N/A'} credits/unit`);
console.log(`  Best sell price: ${sellOrders[0]?.price || 'N/A'} credits/unit`);
console.log(`  Total buy orders: ${buyOrders.length}`);
console.log(`  Total sell orders: ${sellOrders.length}`);
```

### Check Expansion Candidates
```javascript
// Scan adjacent rooms
const homeRoom = 'W13N57';
const adjacent = [
    {name: 'W12N57', dir: 'W'},
    {name: 'W14N57', dir: 'E'},
    {name: 'W13N56', dir: 'S'},
    {name: 'W13N58', dir: 'N'}
];

adjacent.forEach(room => {
    const distance = Game.map.getRoomLinearDistance(homeRoom, room.name);
    const status = Game.map.getRoomStatus(room.name).status;
    console.log(`${room.name} (${room.dir}): Distance ${distance}, Status: ${status}`);
    
    // If you have vision
    if (Game.rooms[room.name]) {
        const sources = Game.rooms[room.name].find(FIND_SOURCES).length;
        const mineral = Game.rooms[room.name].find(FIND_MINERALS)[0];
        console.log(`  Sources: ${sources}, Mineral: ${mineral.mineralType}`);
    }
});
```

---

## Summary & Recommendations

### Immediate Actions (RCL 4, This Week)

1. ✅ **Deploy v2.0.3**: Already in simulation, push to production
2. **Monitor Energy Recovery**: Target 40-60% (400-600/900)
3. **Verify Creep Balance**: 2 harvesters, 2-3 haulers, 3-4 upgraders
4. **Build Storage**: If construction site not placed, place it now (30k energy)

### Short-Term Goals (RCL 5, Next Month)

1. **Reach RCL 5**: Est. 2-3 weeks with optimizations
2. **Build Links Immediately**: Day 1 priority at RCL 5
3. **Transition to Link Economy**: Reduce haulers, increase upgraders
4. **Place 10 Extensions**: Batched construction (3-4 at a time)

### Medium-Term Goals (RCL 6, 2-3 Months)

1. **Build Terminal**: 100k energy investment, critical for market
2. **Start Hydrogen Mining**: Build extractor, deploy miner
3. **First Market Order**: Sell 5k hydrogen, test market system
4. **Build Labs**: Start compound production (GH for upgraders)

### Long-Term Goals (RCL 7-8, 6-12 Months)

1. **2nd Spawn**: Critical for expansion at RCL 7
2. **Remote Harvesting**: 1-2 adjacent rooms for extra energy
3. **2nd Room (Maybe)**: If GCL allows and suitable room found
4. **Factory Operations**: Commodity trading for market revenue
5. **RCL 8 Features**: Observer, power spawn, nuker (optional)

### Risk Management

**Low-Risk Expansion Strategy**:
1. **Remote Harvest First**: Test waters with low commitment
2. **Defend Remote Rooms**: 1-2 defenders minimum
3. **Monitor Market**: Track H prices, sell only when profitable
4. **Reserve Claims**: Don't claim 2nd room until GCL allows and home stable

**High-Risk Scenarios to Avoid**:
- Claiming 2nd room before RCL 7
- Over-extending military defenses
- Selling minerals below production cost
- Expanding into hostile-controlled sectors

---

## Conclusion

You're at an exciting inflection point! RCL 4 is the foundation, but RCL 5-6 is where the game truly opens up:

- **RCL 5**: Link economy = 30-50% CPU reduction, bigger creeps
- **RCL 6**: Minerals + market = passive income, compound production
- **RCL 7**: 2 spawns = expansion capability, multi-room empire
- **RCL 8**: Maximum efficiency, endgame features

Your "12% energy" was actually controller progress (1.23% to RCL 5). The real metric to watch is your spawn/extension energy (111/900 = 12% capacity), which v2.0.3 will fix by optimizing spawning and logistics.

**Next steps**: Deploy v2.0.3, stabilize energy, and start the 2-3 week push to RCL 5. The link economy will be a game-changer! 🚀

---

**Document Version**: 1.0  
**Last Updated**: November 29, 2025  
**Next Review**: After reaching RCL 5
