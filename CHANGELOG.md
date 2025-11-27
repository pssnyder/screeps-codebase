# Screeps Engine - Changelog

## v1.1.0 - Basic Survival Automation (November 27, 2025)

### 🎯 Goal: Automate basic colony survival and infrastructure

### ✨ New Features:

**1. Automatic Structure Planning (`structure.planner.js`)**
- ✅ Auto-places extensions in optimal grid pattern near spawn
- ✅ Auto-places containers at energy sources
- ✅ Auto-places tower for defense (RCL 3+)
- ✅ Auto-places storage (RCL 4+)
- ✅ Auto-plans roads between spawn, sources, and controller
- ✅ Intelligent spacing and positioning
- ✅ Respects construction site limits (max 5 at once)
- ✅ Only plans every 100 ticks (CPU efficient)

**2. Emergency Harvester Spawning**
- ✅ If harvesters < 1, emergency priority spawning (priority 100)
- ✅ Ensures colony never dies from lack of energy income

**3. Smart Builder Management**
- ✅ Builders only spawn when construction sites exist
- ✅ Reduces unnecessary builder population

**4. Structure Planner Integration**
- ✅ Runs automatically every 100 ticks
- ✅ Plans based on Room Controller Level (RCL)
- ✅ Adapts to room progression

### 🔧 Improvements:

**Decision Tree:**
- Enhanced spawn priority system
- Emergency harvester detection
- Dynamic builder needs based on construction sites
- Better logging of spawn needs

**Engine Core:**
- Integrated structure planner into main loop
- Version bump to 1.1.0
- Enhanced initialization message

### 📊 What This Means For You:

**Before v1.1:**
- ❌ Manual extension placement required
- ❌ Manual container placement
- ❌ Manual tower placement
- ❌ Manual road planning
- ❌ Risk of colony death if harvesters die

**After v1.1:**
- ✅ **Fully autonomous** colony development
- ✅ Extensions appear automatically as RCL increases
- ✅ Infrastructure builds itself
- ✅ Emergency systems prevent colony death
- ✅ **True "set it and forget it" gameplay**

### 🎮 User Experience:

Just place your spawn and walk away! The engine now:
1. Spawns optimal creep composition
2. Places all necessary structures automatically
3. Builds infrastructure in priority order
4. Prevents critical failures (harvester shortage)
5. Scales from RCL 1 → 8 autonomously

### 📈 Performance:

- CPU efficient (structure planning only every 100 ticks)
- Smart construction limits (max 5 sites at once)
- Road planning respects CPU bucket (>5000)
- No manual intervention required

---

## v1.0.0 - Initial Release (November 27, 2025)

### Core Features:
- Chess-engine inspired decision making
- Position evaluation system
- Intelligent spawn controller
- 5 role types (harvester, upgrader, builder, hauler, defender)
- Tower automation
- Analytics and learning framework
- Memory management
- Console helper commands

---

## Upcoming Features (v1.2+):

### Planned for v1.2:
- 🔄 Dynamic room layout optimizer
- 🔄 Link management system
- 🔄 Terminal automation
- 🔄 Market trading AI
- 🔄 Multi-room expansion automation

### Planned for v1.3:
- 🔄 Advanced military strategies
- 🔄 Scout automation
- 🔄 Remote mining
- 🔄 Power harvesting

### Long-term Vision:
- 🔄 Machine learning integration
- 🔄 Genetic algorithm optimization
- 🔄 Advanced chess-engine search algorithms
- 🔄 Multi-agent coordination
