# Screeps Engine - Quick Start Guide

## 🚀 Deployment

Your code is already synced with GitHub and will automatically deploy to Screeps World!

### What Happens on First Run

1. **Memory Initialization**: The engine creates its memory structure
2. **Room Evaluation**: Analyzes your starting room
3. **Strategic Planning**: Determines what creeps to spawn
4. **Creep Creation**: Begins spawning harvesters
5. **Analytics Start**: Begins collecting performance data

## 📊 Monitoring Your Colony

### Console Output

Every **10 ticks** you'll see:
```
[Tick 1000] Creeps: 8 | Rooms: 1 | CPU: 12.45/20
```

Every **100 ticks** you'll see analytics insights:
```
[Analytics] Anomalies detected: Energy declining rapidly
[Analytics] Recommendations: Spawn more harvesters
```

### Spawn Notifications
```
[Spawn] W1N1: Creating harvester - harvester_1234_567
```

## 🎮 In-Game Console Commands

Access the game console (in Screeps World) and try these:

### View Game State
```javascript
Memory.engine
```

### Check Analytics
```javascript
Memory.engine.stats
```

### View Decision History
```javascript
Memory.engine.decisions.slice(-10) // Last 10 decisions
```

### Manual Creep Spawn
```javascript
Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'test', {memory: {role: 'harvester'}})
```

### Check CPU Usage
```javascript
Game.cpu.getUsed()
Game.cpu.bucket
```

### View Creep Stats
```javascript
Object.values(Game.creeps).map(c => ({
    name: c.name,
    role: c.memory.role,
    stats: c.memory.stats
}))
```

## 🏗️ Initial Strategy

The engine will automatically:

1. **Spawn 2 Harvesters per Source** - Critical for economy
2. **Spawn 3 Upgraders** - Advance your controller
3. **Spawn 2 Builders** - Construct extensions and structures
4. **Spawn Defenders** - Only when hostiles detected

## 📈 Key Metrics to Watch

### Economy Health
- **Energy Available**: Should grow steadily
- **Income Rate**: Tracked in analytics
- **Harvester Count**: 2 per source optimal

### Room Development
- **Controller Level**: Increases unlock new structures
- **Extensions Built**: More energy capacity
- **Tower Defense**: Automated protection

### Performance
- **CPU Usage**: Should stay under limit
- **Bucket**: Should remain high (>5000)
- **Creep Efficiency**: Tracked per creep

## 🎯 First Hour Goals

1. ✅ Reach 4-6 harvesters
2. ✅ Build all available extensions
3. ✅ Reach Controller Level 2
4. ✅ Establish container network
5. ✅ Achieve positive energy trend

## 🔧 Common Issues & Solutions

### "Not enough energy to spawn"
- **Normal**: Early game energy is tight
- **Solution**: Wait for harvesters to collect more energy

### "Creeps idle at source"
- **Cause**: Source is crowded
- **Solution**: Engine automatically balances - wait a few ticks

### "CPU usage high"
- **Normal**: <80% of limit is fine
- **Concern**: >90% means you may need optimization

### "No construction happening"
- **Check**: Do you have construction sites?
- **Solution**: Place construction sites manually first

## 🧪 Testing the System

### Manual Testing
1. Place a construction site for an extension
2. Watch a builder automatically start working on it
3. Check if harvesters are delivering to spawn
4. Verify upgraders are working on controller

### Performance Testing
```javascript
// Check evaluation score
let state = {rooms: {}};
for (const name in Game.rooms) {
    const room = Game.rooms[name];
    const Evaluator = require('evaluator');
    state.rooms[name] = Evaluator.evaluateRoom(room);
}
console.log(JSON.stringify(state, null, 2));
```

## 🎓 Understanding the Engine

### Decision Flow (Every Tick)
1. **Evaluate**: Score current position (like chess)
2. **Decide**: Generate strategy based on evaluation
3. **Execute**: Spawn creeps, control towers, run creeps
4. **Learn**: Record metrics for analysis

### The "Chess Engine" Analogy
- **Position = Room State**: Resources, structures, threats
- **Material = Energy**: More energy = stronger position
- **Pieces = Creeps**: Each with different values
- **Moves = Decisions**: Spawn decisions, role assignments
- **Search = Strategy**: Finding best decisions

## 🚀 Advanced Features

### Automatic Defense
- Towers attack hostiles automatically
- Defenders spawn when threats detected
- Target priority based on threat level

### Intelligent Harvesting
- Sources balanced by creep count
- Harvesters claim specific sources
- Delivery prioritizes spawns/extensions

### Adaptive Body Generation
- Creep bodies scale with available energy
- Role-optimized body configurations
- Falls back to smaller bodies if needed

### Data-Driven Decisions
- Tracks energy trends
- Predicts future needs
- Recommends adjustments

## 📚 Next Steps

1. **Monitor First 1000 Ticks**: Watch the colony establish itself
2. **Review Analytics**: Check `Memory.engine.stats` after 500 ticks
3. **Tune Parameters**: Adjust evaluation scores in `evaluator.js`
4. **Add Features**: See `DEVELOPMENT.md` for extensions
5. **Expand Territory**: The engine will suggest expansion at RCL 4

## 🆘 Getting Help

### Debug Mode
Edit `main.js` and add after the imports:
```javascript
const DEBUG = true;
```

### Verbose Logging
In any role file, add:
```javascript
console.log(`[${creep.name}] State: ${creep.memory.working ? 'Working' : 'Collecting'}`);
```

### Reset Memory (if needed)
```javascript
// WARNING: This wipes all data!
delete Memory.engine;
```

## 🎉 Success Indicators

You'll know it's working when you see:

- ✅ Multiple creeps spawning automatically
- ✅ Harvesters delivering to spawn
- ✅ Upgraders working on controller
- ✅ Energy available increasing over time
- ✅ Console shows regular stats updates
- ✅ No error messages

## 🌟 The Vision

This isn't just a Screeps bot - it's an **AI research project** applying:
- Chess engine algorithms
- Machine learning concepts
- Data science analytics
- Intelligent decision making

You're building something truly unique in the Screeps community!

---

**Ready to dominate Screeps World with intelligence, not just code!** 🧠🎮

*Check `ARCHITECTURE.md` for deep technical details*
*Check `DEVELOPMENT.md` for customization guide*
