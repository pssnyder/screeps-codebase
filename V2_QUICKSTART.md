# Screeps Engine v2.0 - Quick Start Guide

## 🎯 What We're Doing

Your Screeps colony in **W13N57** has basic survival working (v1.1.2), but it's using too much CPU and lacks visibility into resources beyond energy. v2.0 fixes this and prepares for expansion.

## 🚨 Critical Issues Identified

1. **CPU Overuse**: Running all code every tick regardless of need
2. **Memory Growth**: Stats arrays growing unbounded
3. **Limited Visibility**: Only tracking energy, not minerals/compounds
4. **Inefficient Caching**: Repeated expensive `find()` operations

## ✅ v2.0 Solutions

### Phase 1: Performance (Deploy in 2-3 days)
**Target**: 40% CPU reduction

1. **Execution Gating** - Operations only run when needed
   - Structure planning: Every 100 ticks (not every tick)
   - Tower repairs: Every 10 ticks (was every tick)
   - Analytics: Every 100 ticks (was every tick)
   
2. **Advanced Caching** - Stop repeated room scans
   - Sources cached 1000 ticks (they never move)
   - Structures cached 100 ticks (rarely change)
   - Construction sites cached 10 ticks
   
3. **Lazy Creeps** - Creeps skip logic when idle
   - Don't path when already at target
   - Don't think when waiting for resources
   
4. **Memory Optimization** - Stop memory growth
   - Stats arrays: 1000 → 100 entries
   - Old data purged every 1000 ticks
   - Circular buffers instead of growing arrays

### Phase 2: Monitoring (Deploy in 1 week)
**Target**: Complete visibility

1. **Enhanced Status Command** - New `status()` shows:
   - Energy reserves + storage
   - Mineral amounts and types
   - Construction progress (% complete)
   - Creep population by role
   - Threat detection
   - Controller progress + downgrade risk
   - Performance metrics (CPU/bucket/memory)
   - Critical alerts

2. **Resource Tracking** - Track everything:
   - All resources in storage (not just energy)
   - Minerals in room deposits
   - Construction site progress
   - Controller upgrade progress

## 📊 Expected Results

### Before v2.0
```
CPU: 20-24 / 20 (100-120% usage) ❌
Bucket: Fluctuating, sometimes low ❌
Memory: Growing over time ❌
Visibility: Only energy tracked ❌
```

### After v2.0
```
CPU: 10-12 / 20 (50-60% usage) ✅
Bucket: Stable at 9000+ ✅
Memory: <200 KB, stable ✅
Visibility: All resources tracked ✅
```

## 🛠️ Files to Create/Modify

### New Files (Phase 1)
- `simulation/execution.manager.js` - Intelligent operation throttling
- `simulation/cache.manager.js` - Multi-level caching system

### Modified Files (Phase 1)
- `simulation/memory.manager.js` - Add circular buffers, cleanup
- `simulation/engine.core.js` - Use ExecutionManager gates
- `simulation/tower.controller.js` - Use CacheManager
- `simulation/role.*.js` - Add lazy execution logic

### Modified Files (Phase 2)
- `simulation/console.helper.js` - Add enhanced `status()` command
- `simulation/analytics.js` - Track all resources, not just energy

## 🚀 Implementation Steps

### Step 1: Prepare (You do this)
Run these commands in Screeps console to get baseline metrics:

```javascript
// Check current state
Game.cpu.getUsed()  // Current CPU usage
Game.cpu.bucket     // Current bucket level
Game.rooms.W13N57.controller.level  // Your RCL
RawMemory.get().length / 1024       // Memory usage in KB

// Run existing status
require('console.helper').status()
```

Share these numbers with me so I can track improvements.

### Step 2: Implement Phase 1 (I do this)
1. Create `execution.manager.js` with throttling logic
2. Create `cache.manager.js` with caching system
3. Update `memory.manager.js` with optimization
4. Update all modules to use new managers
5. Test in simulation folder
6. Run `npm test` to verify no breaks

### Step 3: Deploy (We do together)
```bash
cd "c:\Users\patss\AppData\Local\Screeps\scripts\screeps.com"

# Review changes
./deploy.sh diff

# Deploy to production
./deploy.sh deploy

# Monitor in console
# Watch CPU usage drop over next 10 ticks
```

### Step 4: Monitor (You do this)
After deployment, watch console output:
- CPU should drop to 10-12/tick within minutes
- Bucket should start climbing
- No errors should appear

If issues: `./deploy.sh restore <timestamp>`

### Step 5: Phase 2 (Next week)
Enhanced monitoring and resource tracking

## 📈 Future Phases

- **Phase 3**: Labs, minerals, market automation
- **Phase 4**: Multi-room expansion, remote mining
- **Phase 5**: Machine learning, adaptive behavior

## 🤔 Questions for You

Before I start implementing, tell me:

1. **What's your current CPU usage?** (run `Game.cpu.getUsed()` in console)
2. **What's your bucket level?** (run `Game.cpu.bucket`)
3. **What RCL is W13N57?** (run `Game.rooms.W13N57.controller.level`)
4. **Do you have storage built?** (run `Game.rooms.W13N57.storage`)
5. **Any immediate pain points?** (specific features causing lag?)

## 📝 Testing Checklist

After Phase 1 deployment, verify:

- [ ] CPU usage < 15 per tick
- [ ] Bucket climbing (should reach 10000)
- [ ] No errors in console
- [ ] Creeps still functioning normally
- [ ] Spawns still creating creeps
- [ ] Towers still defending/repairing
- [ ] Construction continuing

## 🆘 Emergency Procedures

If deployment breaks something:

```bash
# Immediate rollback
cd "c:\Users\patss\AppData\Local\Screeps\scripts\screeps.com"
./deploy.sh restore <timestamp>  # Use latest backup timestamp

# Check console for errors
# Report errors to me for fix
```

## 📚 Documentation

- **Full Roadmap**: See `V2_ROADMAP.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Copilot Instructions**: See `.github/copilot-instructions.md`
- **Current Changes**: See `CHANGELOG.md`

---

**Ready to start?** Share your current metrics and I'll begin Phase 1 implementation! 🚀
