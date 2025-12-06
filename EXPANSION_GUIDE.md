# Expansion System Guide

## Overview
The expansion system automates multi-room claiming and colonization in Screeps. It's designed to be configurable and safe, with manual control over when and where to expand.

## System Components

### 1. Scout Role (`role.scout.js`)
- **Purpose**: Explore distant rooms to gather intelligence
- **Body**: `[MOVE]` (50 energy - cheap and fast)
- **Behavior**: Visits assigned rooms, reports detailed findings, suicides after completion

### 2. Claimer Role (`role.claimer.js`)
- **Purpose**: Claim remote room controllers
- **Body**: `[CLAIM, MOVE]` (650 energy) or `[CLAIM, CLAIM, MOVE, MOVE]` (1,300 energy)
- **Behavior**: Travels to target room, claims controller, signs it, then suicides

### 3. Pioneer Role (`role.pioneer.js`)
- **Purpose**: Self-sufficient colonist for new rooms
- **Body**: Scales with energy - `[WORK×N, CARRY×N, MOVE×2N]`
- **Behavior**: Harvests, builds, and upgrades in target room
- **Priorities**:
  1. Build spawn (critical - enables self-sufficiency)
  2. Build extensions (increases energy capacity)
  3. Build containers (energy storage)
  4. Build other structures
  5. Upgrade controller (when idle)

### 4. Expansion Manager (`expansion.manager.js`)
- **Purpose**: Coordinates the entire expansion process
- **Features**:
  - Prerequisite checking (GCL, energy, CPU)
  - Claimer and pioneer spawning
  - Operation tracking and monitoring
  - Optimal spawn placement in new rooms

### 5. Expansion Scout Tool (`expansion.scout.js`)
- **Purpose**: Analyze rooms from game memory (console tool)
- **Provides**: Source counts, terrain analysis, hostile detection, expansion scores

## Usage Guide

### Step 1: Scout Target Rooms

First, send scout creeps to explore potential expansion targets:

```javascript
// Spawn a scout to explore multiple rooms
scout('W12N57', 'W13N56', 'W12N56', 'W14N57', 'W14N56')
```

The scout will visit each room and report:
- Actual source count
- Mineral type
- Owner/reservation status
- Controller signs
- Hostile presence
- Terrain quality
- Expansion score

Results are stored in `Memory.rooms[roomName].scout`.

### Step 2: Review Scout Data

After scouts complete their exploration, view the collected data:

```javascript
// View scout data for a specific room
Memory.rooms['W12N57'].scout

// Or view all scout data
Memory.rooms
```

Look for rooms with:
- **2+ sources** (standard is 2, 3 is rare and valuable)
- **No owner** (status: 'available')
- **Low hostile presence** (0 hostile creeps/structures)
- **Reasonable terrain** (<30% swamp, <40% walls)
- **Close distance** (1-2 rooms from home)

### Step 3: Queue Expansion Targets

Once you've identified good targets, queue them for expansion:

```javascript
// Simple queue (defaults: 3 pioneers, 50k min energy)
queueExpansion('W12N57')

// Advanced queue with custom settings
queueExpansion('W12N57', {
    pioneerCount: 4,      // More pioneers = faster buildout
    minEnergy: 80000,     // Wait for more energy before starting
    signText: 'AI Colony - Shard3'  // Custom controller sign
})

// Queue multiple rooms (will expand sequentially)
queueExpansion('W12N57')
queueExpansion('W13N56')
queueExpansion('W12N56')
```

### Step 4: Enable Expansion System

The expansion system starts **disabled** by default for safety. Enable it when ready:

```javascript
// Enable expansion system
enableExpansion()

// The system will now:
// 1. Check prerequisites (GCL, energy, CPU)
// 2. Spawn claimer when conditions are met
// 3. Claim the first queued room
// 4. Spawn pioneers to colonize it
// 5. Monitor progress until spawn is built
// 6. Move to next queued room
```

### Step 5: Monitor Progress

Check expansion status at any time:

```javascript
// View current expansion status
expand()
```

This shows:
- System enabled/disabled status
- Current GCL level and progress
- Queued targets
- Active operations (in-progress claims)
- Owned rooms and their status

### Step 6: Disable When Done (Optional)

After completing your expansion goals, you can disable the system:

```javascript
disableExpansion()
```

## Prerequisites for Expansion

The system automatically checks these conditions before starting an operation:

1. **GCL Level**: Must have capacity for another room
   - GCL 1 = 1 room max
   - GCL 2 = 2 rooms max
   - GCL 3 = 3 rooms max, etc.

2. **Energy Reserves**: Default 50k energy (configurable per target)
   - Claimer: 650-1,300 energy
   - Pioneers: 300-2,000 energy each (3-4 pioneers)
   - Total cost: ~6,000-10,000 energy for initial wave

3. **CPU Bucket**: Must be >5,000 (safety check)

4. **Available Spawn**: Need at least one idle spawn

## Expansion Timeline

Typical timeline for one room:

- **Tick 0**: Prerequisites met, spawn claimer
- **Tick 50-150**: Claimer travels to target room
- **Tick 150**: Controller claimed
- **Tick 151**: Spawn site placed, 3 pioneers spawned
- **Tick 200-300**: Pioneers arrive and begin building
- **Tick 300-500**: Pioneers harvest and build spawn (15,000 energy needed)
- **Tick 500-600**: Spawn completes construction
- **Tick 600+**: Room is self-sufficient, can spawn own creeps

Total time: **600-800 ticks** (~40-50 minutes) per room

## Optimal Spawn Placement

The expansion manager automatically places the spawn in an optimal location:

**Criteria**:
- 4-8 tiles from controller (upgrader access)
- 5-10 tiles from sources (harvester access)
- Not on wall terrain
- Not on room edges (avoid exits)
- Balanced position between controller and sources

This ensures efficient energy flow and creep movement from the start.

## Tips for Successful Expansion

### Energy Management
- **Don't expand if energy < 50k**: You'll stall both rooms
- **Boost upgraders before expanding**: Reach GCL 2 faster
- **Temporarily reduce builders**: Save energy for expansion costs

### Room Selection
- **Prioritize 2-source rooms**: Standard economy
- **Avoid swamp-heavy rooms**: Slow creep movement (+5x energy cost)
- **Check for signs**: Respect territorial claims during novice period
- **Stay close to home**: 1-room distance is ideal for first expansion

### Timing
- **Expand during novice protection**: You have 9 days of safety
- **One room at a time**: Wait for spawn completion before next claim
- **GCL 2 first**: Can't own 2 rooms until GCL 2 (82% progress currently)

### Pioneer Count
- **3 pioneers**: Standard (balanced speed and cost)
- **4-5 pioneers**: Faster buildout (costs more energy)
- **2 pioneers**: Slower but cheaper (if energy-limited)

### Post-Expansion
- Once spawn is built, the room becomes autonomous
- Structure planner will auto-place extensions, towers, etc.
- Can spawn additional creeps locally in the new room
- Continue expansion to next queued target

## Troubleshooting

### "GCL not enough"
- Your GCL level doesn't allow more rooms
- Check: `Game.gcl.level` and `Game.gcl.progress`
- Solution: Spawn more upgraders, wait for GCL 2

### "Not enough energy"
- Storage has less than required energy (default 50k)
- Check: `Game.rooms['W13N57'].storage.store[RESOURCE_ENERGY]`
- Solution: Reduce builders, wait for energy to accumulate

### "Claimer died before claiming"
- Claimer was killed en route or got stuck
- Check: Hostile activity in path rooms
- Solution: Scout the path first, wait for hostiles to clear

### "Pioneers not arriving"
- Pathing issues or CPU limits
- Check: Console for pathfinding errors
- Solution: Ensure path is clear, check CPU usage

### "Spawn taking too long"
- Not enough pioneers or they're dying
- Spawn costs 15,000 energy to build
- Solution: Spawn more pioneers, protect existing ones

## Console Commands Reference

```javascript
// Scouting
scout('W12N57', 'W13N56')           // Spawn scout creep
Memory.rooms['W12N57'].scout        // View scout data

// Expansion Control
enableExpansion()                   // Enable system
disableExpansion()                  // Disable system
expand()                            // Show status

// Queueing Targets
queueExpansion('W12N57')            // Simple queue
queueExpansion('W12N57', {          // Advanced queue
    pioneerCount: 4,
    minEnergy: 80000,
    signText: 'Custom message'
})

// Monitoring
Memory.expansion                    // View full expansion memory
Memory.expansion.targets            // View queue
Memory.expansion.activeOperations   // View in-progress claims
Memory.expansion.ownedRooms         // View claimed rooms
```

## Memory Structure

```javascript
Memory.expansion = {
    enabled: false,              // System on/off
    targets: [                   // Queue of rooms to claim
        {
            room: 'W12N57',
            pioneerCount: 3,
            minEnergy: 50000,
            signText: 'AI Colony'
        }
    ],
    activeOperations: [          // In-progress claims
        {
            targetRoom: 'W12N57',
            claimerName: 'claimer_W12N57_12345',
            pioneerCount: 3,
            startedAt: 12345,
            claimed: false,
            spawnBuilt: false,
            pioneersAlive: 0
        }
    ],
    ownedRooms: {                // Claimed room tracking
        'W12N57': {
            claimedAt: 12345,
            status: 'colonizing'  // or 'established'
        }
    },
    pioneerRequests: [           // Pending pioneer spawns
        {
            targetRoom: 'W12N57',
            count: 3,
            spawned: 1,
            requestedAt: 12345
        }
    ]
}
```

## Example: Expanding to W12N57

Complete walkthrough:

```javascript
// 1. Scout the target
scout('W12N57', 'W13N56', 'W12N56')
// Wait ~200 ticks for scout to complete

// 2. Review scout data
Memory.rooms['W12N57'].scout
// Expected: { sources: 2, available: true, score: 142 }

// 3. Queue for expansion
queueExpansion('W12N57', {
    pioneerCount: 3,
    minEnergy: 50000
})

// 4. Verify queue
expand()
// Should show W12N57 in "QUEUED TARGETS"

// 5. Enable system when ready
enableExpansion()

// 6. Monitor progress
expand()
// Watch for:
// - Claimer spawned
// - Room claimed
// - Pioneers spawned
// - Spawn construction
// - Spawn completed

// 7. Once spawn is built, expand to next room
queueExpansion('W13N56')
// System will automatically start next expansion
```

## Advanced: Multiple Room Expansion

To expand to 4 rooms efficiently:

```javascript
// Queue all targets at once
queueExpansion('W12N57', { pioneerCount: 3, minEnergy: 60000 })
queueExpansion('W13N56', { pioneerCount: 3, minEnergy: 60000 })
queueExpansion('W12N56', { pioneerCount: 3, minEnergy: 60000 })

// Enable system
enableExpansion()

// System will:
// 1. Expand to W12N57 first (waits for spawn)
// 2. Then W13N56 (waits for spawn)
// 3. Then W12N56 (waits for spawn)
// 4. Each expansion waits for 60k energy before starting

// Timeline:
// Day 1: GCL 2 achieved
// Day 2: W12N57 claimed and spawn built
// Day 3: W13N56 claimed and spawn built
// Day 4-5: W12N56 claimed and spawn built
// Day 6-9: Stabilize all rooms, prepare defenses
```

This ensures smooth expansion without resource conflicts or stalling.
