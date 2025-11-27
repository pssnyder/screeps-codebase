# Screeps World Codebase
Author: Pat Snyder

# Project Overview

This repository contains the codebase for my Screeps World project, a persistent MMO strategy game designed for programmers. Screeps is a unique game where players write JavaScript code to control in-game units (creeps) that autonomously gather resources, build structures, and defend territory.

## Vision & Approach

This project aims to revolutionize Screeps gameplay by leveraging advanced data science, machine learning, and AI concepts. Drawing from extensive experience in chess engine development, the goal is to implement sophisticated decision-making algorithms that go beyond simple reactive programming.

### Key Innovation Areas:
- **Intelligent Decision Making**: Implementing search algorithms inspired by chess engines to evaluate and select optimal moves from multiple possible actions
- **Machine Learning Integration**: Applying ML techniques to enhance creep behavior and strategic planning
- **Advanced Analytics**: Leveraging data science background to analyze game patterns and optimize performance
- **Screeps Engine**: Building a comprehensive AI framework that makes creeps not just responsive, but truly intelligent

## Technical Setup

- **Language**: JavaScript (ES6+)
- **Deployment**: Direct sync to Screeps game via GitHub integration
- **Source Directory**: `screeps-codebase/src` (automatically synced to game)
- **Authentication**: Game CLI auth token stored in `env.local`

This codebase represents an ambitious attempt to create something unprecedented in the Screeps community - a truly intelligent, adaptive AI system that can compete at the highest levels of gameplay.

## 🚀 Quick Start

Your code automatically syncs to Screeps World via GitHub integration. After pushing to GitHub:

1. **Wait for sync** - Code deploys automatically to `screeps-codebase/src`
2. **Monitor console** - Stats display every 10 ticks
3. **Run health check** - Use `testEngine.quick()` in game console
4. **Watch it work** - The engine is fully autonomous!

See **QUICKSTART.md** for detailed first-time setup guide.

## 🧪 Testing

### Local Tests (Before Deployment)
```bash
npm install  # First time only
npm test     # Run full test suite
```

### In-Game Tests (After Deployment)
```javascript
// In Screeps World console
const testEngine = require('console.tests');
testEngine.quick();           // Health check
testEngine.evaluationTest();  // Room analysis
testEngine.decisionTest();    // Strategy check
testEngine.analyticsTest();   // View metrics
testEngine.performanceTest(); // CPU benchmark
```

See **TESTING.md** for comprehensive testing guide.

## 📚 Documentation

- **QUICKSTART.md** - Get started guide with console commands
- **ARCHITECTURE.md** - Deep technical architecture explanation  
- **DEVELOPMENT.md** - How to extend and customize the engine
- **TESTING.md** - Comprehensive testing guide
- **TESTING_SUMMARY.md** - Quick testing reference

## 📁 Project Structure

```
src/
├── main.js              # Entry point & game loop
├── engine.core.js       # Central decision engine
├── evaluator.js         # Chess-style position evaluation
├── decision.tree.js     # Strategic move generation
├── analytics.js         # ML/data science framework
├── memory.manager.js    # State persistence
├── spawn.controller.js  # Spawn management
├── tower.controller.js  # Tower automation
├── role.manager.js      # Role routing
└── role.*.js           # Intelligent role behaviors

test/
├── test.suite.js        # Automated test suite
├── test.framework.js    # Test utilities
├── test.mocks.js        # Mock game objects
└── console.tests.js     # In-game test commands
```

## 🔗 External References
- Complete Screeps Documentation - https://docs.screeps.com/
- Committing scripts using external tools - https://docs.screeps.com/commit.html
- Screeps World - https://screeps.com/world/
- Screeps API - https://docs.screeps.com/api/
- Additional language support - https://docs.screeps.com/third-party.html
- screepers (community made scripts for the screeps game) - https://github.com/screepers
