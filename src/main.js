/**
 * SCREEPS ENGINE - Main Entry Point
 * Author: Pat Snyder
 * 
 * Chess-engine inspired AI system for Screeps World
 * Implements search-based decision making, position evaluation, and intelligent behavior
 */

const Engine = require('./engine.core');
const MemoryManager = require('./memory.manager');
const Analytics = require('./analytics');

// Initialize memory structure on first run
if (!Memory.engine) {
    Memory.engine = {
        version: '1.0.0',
        initialized: Game.time,
        stats: {},
        decisions: [],
        learning: {}
    };
}

module.exports.loop = function() {
    // Clean up dead creeps from memory
    MemoryManager.cleanDeadCreeps();
    
    // Collect analytics data for each tick
    Analytics.recordTick();
    
    // Main engine execution - evaluate position and make decisions
    try {
        Engine.run();
    } catch (error) {
        console.log(`[ERROR] Engine execution failed: ${error.message}`);
        console.log(error.stack);
    }
    
    // Periodic analytics and learning
    if (Game.time % 100 === 0) {
        Analytics.analyze();
    }
    
    // Display stats every 10 ticks
    if (Game.time % 10 === 0) {
        console.log(`[Tick ${Game.time}] Creeps: ${Object.keys(Game.creeps).length} | ` +
                    `Rooms: ${Object.keys(Game.rooms).length} | ` +
                    `CPU: ${Game.cpu.getUsed().toFixed(2)}/${Game.cpu.limit}`);
    }
};
