# Screeps Engine - Changelog

## [3.0.0] - 2025-11-29 - Minerals & Markets Update

### 🎯 Major Features

#### Mineral Economy System
- **New Role: Miner** (`role.miner.js`)
  - Specialized mineral harvesting at RCL 6+
  - Static positioning on mineral deposits (like static harvesters)
  - Delivers to terminal (priority) or storage
  - Handles extractor cooldown and mineral regeneration
  - Body scaling: Small (350) → Medium (950) → Large (1850) → Max (2750)

- **Automated Market Operations** (`market.manager.js`)
  - Real-time price monitoring for all base minerals
  - Automatic sell order creation for surplus minerals
  - Competitive pricing algorithm (5% below market average)
  - Transaction monitoring and analytics
  - Configurable sell thresholds and reserve amounts
  - Console command: `MarketManager.status()` for market overview

#### Integration & Strategy
- **Decision Tree Updates**
  - Miner spawning logic at RCL 6+ (checks for extractor + terminal/storage)
  - Mineral availability detection (only spawn if mineralAmount > 0)
  - Priority: 4 (medium-low, after economy stabilizes)
  - Target: 1 miner per room with extractor

- **Main Loop Integration**
  - Market manager executes every 1000 ticks (~40 minutes)
  - Proper error handling with try-catch blocks
  - CPU profiling for market operations
  - MarketManager exposed to global scope for console access

### 🔧 Technical Debt Fixes (Based on TIPS.md)

#### Memory Management
- **Enhanced Creep Memory Cleanup**
  - Changed from every 10 ticks → **every tick** for immediate reclamation
  - Prevents memory overflow from dead creeps
  - Based on TIPS: "The creep memory is saved upon death, so clear Memory.creeps.* to prevent overflowing"

- **Market Memory Structure**
  - Efficient price database with timestamp tracking
  - Automatic cleanup of old data (50k ticks)
  - Prevents memory bloat from historical price data

#### Performance Optimizations
- **CPU Profiling**
  - Track CPU usage per module (engine, analytics, market, visuals)
  - Market operations throttled to reduce overhead
  - Only update prices every 1000 ticks

- **Modular Error Handling**
  - Try-catch blocks around Engine.run() and MarketManager.run()
  - Prevents complete script halt from errors
  - Based on TIPS: "Use try/catch blocks in right places to avoid a complete halt"

### 📊 New Features

#### Market System
- **Price Database**
  - Tracks avgBuyPrice, avgSellPrice, highestBid, lowestAsk
  - Calculates market spread percentage
  - Records total volume and transaction count
  
- **Sell Order Automation**
  - Configurable sell thresholds per resource type
  - Reserve amounts (never sell below threshold)
  - Minimum order size: 1000 units
  - Automatic order cancellation if uncompetitive (30% variance)

- **Transaction Monitoring**
  - Logs all incoming transactions (sales)
  - Logs all outgoing transactions (purchases)
  - Calculates revenue and costs
  - Updates credit balance tracking

#### Miner Role
- **Intelligent Mining**
  - Waits for extractor if not yet built
  - Handles mineral depletion (50k tick regeneration)
  - Manages extractor cooldown (5 ticks)
  - Delivers to terminal first (for market), storage second

- **Body Composition**
  - Scales with energy availability
  - Optimized WORK:CARRY:MOVE ratio (5:3:4 at medium size)
  - Maximum: WORK×15, CARRY×8, MOVE×12 (2,750 energy)

### 🎮 Console Commands

#### New Commands
```javascript
MarketManager.status()  // Show market status, active orders, prices
```

#### Enhanced Commands
```javascript
// Existing commands still available
help()                  // Show all available commands
status()                // Room status (now includes miner count)
profile()               // CPU profiling (now includes market)
```

### 📈 Expected Impact

#### Economic Benefits
- **Passive Income**: 500-2000 credits/week from mineral sales
- **Resource Availability**: Can buy missing minerals for labs/factory
- **Strategic Flexibility**: Credits enable rapid resource acquisition

#### Performance Metrics
- **CPU Usage**: +0.1-0.3 CPU per tick (market operations throttled)
- **Memory**: +5-10 KB (market price database and transaction logs)
- **Energy Efficiency**: Miners only spawn when infrastructure ready

### 🔄 Migration Notes

#### Upgrading from v2.0.3
1. **No Breaking Changes**: Fully backward compatible
2. **Auto-Initialization**: Market memory created automatically
3. **RCL 6+ Benefit**: Features activate automatically at RCL 6
4. **Terminal Required**: Build terminal (100k energy) to enable market

#### RCL Requirements
- **RCL 4-5**: No changes, existing features continue working
- **RCL 6**: Miner spawns when extractor + terminal/storage available
- **RCL 6+**: Market operations begin when terminal built

### 🐛 Bug Fixes
- None - this is a feature release

### ⚠️ Known Limitations
- **Market Range**: No distance-based order filtering yet (v3.1 planned)
- **Buy Orders**: Only sell orders automated, buy orders manual for now
- **Arbitrage**: No automated arbitrage trading (v3.2 planned)
- **Lab Integration**: Miner doesn't deliver to labs yet (v3.1 planned)

### 📚 Documentation
- **New Files**:
  - `docs/RCL_PROGRESSION_GUIDE.md` - Comprehensive RCL 5-8 roadmap
  - `docs/MARKET_OPERATIONS.md` - Complete market strategy guide (60+ pages)
  - `simulation/role.miner.js` - Miner role implementation
  - `simulation/market.manager.js` - Market automation module

- **Updated Files**:
  - `simulation/main.js` - v3.0.0 integration
  - `simulation/decision.tree.js` - Miner spawning logic
  - `simulation/role.manager.js` - Miner role routing
  - `simulation/memory.manager.js` - Enhanced cleanup
  - `CHANGELOG.md` - This file

### 🔮 Roadmap to v3.1
- **Lab Supply Chain**: Miners deliver to labs for compound production
- **Buy Order Automation**: Auto-buy missing resources
- **Distance Filtering**: Only trade with nearby rooms
- **Price Alerts**: Notify when prices spike/crash
- **Commodity Production**: Factory automation (RCL 7+)

### 👥 Credits
- Architecture: Chess-engine inspired decision-making
- Market Strategy: Based on MARKET_OPERATIONS.md guide
- Performance: Optimizations from TIPS.md
- Testing: Simulation room validation

---

## [2.0.3] - 2025-11-27 - RCL 4+ Optimizations

### Static Harvester System
- Harvesters sit on containers at RCL 4+
- Energy drops into container, haulers transport
- CPU reduction: -30-50% from reduced movement

### Smart Spawning
- RCL-aware creep composition
- Energy-based builder scaling
- Construction site throttling (max 5)

### Hauler Priority
- Increased priority from 7 → 8
- Critical for container-based economy
- Enhanced target selection logic

---

## [2.0.2] - 2025-11-26 - CPU Optimization

### Memory Cleanup
- Throttled to every 10 ticks
- Reduced Memory.engine.stats from 1000 → 100 entries

### Performance Profiling
- CPU tracking per module
- Warning when engine > 15 CPU

---

## [2.0.0] - 2025-11-25 - v2.0 Performance Release

### Performance Framework
- Execution gating for expensive operations
- Multi-level caching system
- CPU budget management

### Enhanced Monitoring
- `status()` command for colony health
- Resource tracking (all resources, not just energy)
- Circuit breaker for CPU overload

---

## [1.1.2] - 2025-11-24 - Basic Survival

### Tower Optimizations
- CPU caching for tower operations
- Intelligent targeting

### Structure Planning
- Auto-placement of extensions, containers, towers, roads
- RCL-aware construction

---

## [1.0.0] - 2025-11-20 - Initial Release

### Core Features
- Engine architecture (evaluate, decide, execute, learn)
- Basic roles: harvester, upgrader, builder
- Memory management
- Analytics system

---

**Format**: [Version] - Date - Title
**Version Numbering**: MAJOR.MINOR.PATCH
- MAJOR: Breaking changes or major features
- MINOR: New features, backward compatible
- PATCH: Bug fixes, minor improvements
