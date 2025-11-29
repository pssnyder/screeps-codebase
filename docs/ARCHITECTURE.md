# Screeps Engine Architecture

## Overview

This Screeps AI implementation is inspired by **chess engine design principles**, applying advanced decision-making algorithms, position evaluation, and data-driven optimization to create truly intelligent autonomous agents.

## Core Philosophy

### Chess Engine Concepts Applied to Screeps

1. **Position Evaluation** - Every game state (room, resources, military strength) is assigned a numeric score, similar to material and positional evaluation in chess
2. **Move Generation** - The system generates possible "moves" (spawn decisions, role assignments, strategic priorities) based on the current position
3. **Search & Selection** - Decisions are made by searching through options and selecting the highest-value moves
4. **Learning & Adaptation** - Analytics track performance metrics to identify patterns and optimize future decisions

## Architecture Components

### 1. Main Entry Point (`main.js`)
- Game loop orchestrator
- Initializes memory structure
- Handles error recovery
- Periodic analytics and stats display

### 2. Engine Core (`engine.core.js`)
The "brain" of the system that:
- Evaluates overall game state each tick
- Generates strategic decisions via decision tree
- Executes room-level operations (spawning, towers)
- Executes creep-level operations (roles)

### 3. Position Evaluator (`evaluator.js`)
Chess-inspired position scoring system:
- **Room Evaluation**: Assigns scores based on:
  - Controller level (like king position in chess)
  - Resources (like material in chess)
  - Infrastructure (like piece development)
  - Military strength (like attack/defense values)
  - Economy metrics (income efficiency)
- **Creep Evaluation**: Values individual creep effectiveness

### 4. Decision Tree (`decision.tree.js`)
Strategic move generation and selection:
- **Priority Determination**: Identifies game phase (early game = economy, late game = expansion)
- **Spawn Decisions**: Generates optimal creep composition like choosing pieces in chess
- **Body Generation**: Builds creep bodies based on available energy and strategic needs
- **Defense Strategy**: Responds to threats with appropriate force

### 5. Memory Manager (`memory.manager.js`)
Persistent state management:
- Cleans up dead creeps
- Initializes creep memory with tracking stats
- Records statistical data for analytics
- Provides historical data retrieval

### 6. Analytics Engine (`analytics.js`)
Data science and machine learning framework:
- **Data Collection**: Tracks metrics every tick (energy, CPU, population)
- **Trend Analysis**: Uses linear regression to identify patterns
- **Anomaly Detection**: Identifies unusual patterns (energy crashes, CPU spikes)
- **Predictive Modeling**: Forecasts future values based on trends
- **Recommendations**: Suggests strategic adjustments

### 7. Controllers

#### Spawn Controller (`spawn.controller.js`)
- Processes spawn queue with priority ordering
- Scales body configurations to available energy
- Visualizes spawning progress

#### Tower Controller (`tower.controller.js`)
- Automated defense (priority 1)
- Healing wounded creeps (priority 2)
- Repairing critical structures (priority 3)

### 8. Role System

#### Role Manager (`role.manager.js`)
Routes creeps to appropriate behavior modules, enables dynamic role reassignment

#### Role Modules
Each role implements intelligent, context-aware behavior:

**Harvester** (`role.harvester.js`):
- Intelligent source selection (least crowded)
- Optimal delivery targets (priority-based)
- Energy efficiency tracking

**Upgrader** (`role.upgrader.js`):
- Prefers storage/containers over direct harvesting
- Continuous controller upgrading
- Falls back to dropped resources

**Builder** (`role.builder.js`):
- Prioritized construction (spawns > extensions > towers > roads)
- Repairs damaged structures
- Falls back to upgrading when idle

**Hauler** (`role.hauler.js`):
- Collects dropped resources
- Transports from containers to storage
- Efficient energy logistics

**Defender** (`role.defender.js`):
- Threat assessment (attack parts, distance)
- Target prioritization
- Patrol behavior when no threats

## Decision Flow

```
Game Tick
    ↓
[Main Loop]
    ↓
[Engine Core] → Evaluate Game State
    ↓
[Position Evaluator] → Scores for rooms, creeps, resources
    ↓
[Decision Tree] → Generate strategy based on evaluation
    ↓
├─[Room Operations]
│   ├─[Spawn Controller] → Create new creeps
│   └─[Tower Controller] → Defense/repair
│
└─[Creep Operations]
    └─[Role Manager] → Execute role behaviors
        ├─ Harvester
        ├─ Upgrader
        ├─ Builder
        ├─ Hauler
        └─ Defender
```

## Key Innovations

### 1. Chess-Style Evaluation
Every game state gets a numeric score, enabling quantitative comparison of strategies (just like chess engines evaluate positions as +2.5 pawns advantage, etc.)

### 2. Priority-Based Decision Making
Strategic priorities are weighted and sorted, similar to move ordering in chess engines to search the most promising moves first

### 3. Adaptive Body Generation
Creep bodies are dynamically generated based on available energy and strategic needs, optimizing resource utilization

### 4. Data-Driven Optimization
Analytics engine continuously collects metrics and identifies patterns, enabling the system to learn and adapt over time

### 5. Intelligent Source/Target Selection
Creeps make smart decisions about which sources to harvest, which targets to deliver to, based on distance, crowding, and priority

## Performance Considerations

- **Memory Management**: Automatic cleanup of dead creeps, bounded history storage (1000 entries max)
- **Path Reuse**: Creeps reuse paths to reduce CPU usage
- **CPU Monitoring**: Analytics track CPU usage and warn about optimization needs
- **Efficient Queries**: Uses `findClosestByPath` and filters to minimize expensive operations

## Future Enhancements

### Machine Learning Integration
- **Pattern Recognition**: Identify successful strategies from historical data
- **Reinforcement Learning**: Reward successful behaviors, punish failures
- **Opponent Modeling**: Learn from hostile player patterns

### Advanced Search Algorithms
- **Alpha-Beta Pruning**: Like chess engines, prune unpromising strategic branches
- **Monte Carlo Tree Search**: Simulate future game states to evaluate long-term strategies
- **Multi-Room Coordination**: Coordinate strategies across multiple rooms

### Economic Optimization
- **Market Trading**: Automated resource trading based on market trends
- **Supply Chain Optimization**: Balance production and consumption across rooms
- **Energy Efficiency Metrics**: Optimize energy usage per creep action

## Getting Started

The engine will automatically initialize when deployed. Key features:

1. **Automatic Memory Initialization**: First run sets up memory structure
2. **Self-Organizing**: Creates creeps based on room evaluation
3. **Adaptive Behavior**: Responds to threats, adjusts priorities
4. **Data Collection**: Begins tracking metrics from tick 1

Monitor the console for:
- Periodic stats every 10 ticks
- Analytics insights every 100 ticks
- Spawn notifications
- Error messages (if any)

## Data Science Integration

The analytics engine provides:
- **Time Series Data**: Energy, CPU, population over time
- **Trend Analysis**: Linear regression on key metrics
- **Forecasting**: Predict future resource needs
- **Anomaly Detection**: Identify crashes or unusual patterns

This data can be exported (future feature) for external analysis with tools like Python, Pandas, Jupyter notebooks for advanced ML experimentation.

---

**Author**: Pat Snyder
**Version**: 1.0.0
**Philosophy**: Applying chess engine intelligence to create the smartest Screeps AI possible
