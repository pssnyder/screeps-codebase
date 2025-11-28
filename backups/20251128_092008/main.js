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
const SpawnHelper = require('./spawn.helper');
const ConsoleHelper = require('./console.helper');

// Expose helpers to global scope for console commands
global.SpawnHelper = SpawnHelper;
global.Analytics = Analytics;
global.Engine = Engine;

// Initialize memory structure on first run
if (!Memory.engine) {
    Memory.engine = {
        version: '1.1.2',
        initialized: Game.time,
        stats: {},
        decisions: [],
        learning: {}
    };
    
    // Welcome message
    console.log('═══════════════════════════════════════════');
    console.log('🧠 SCREEPS ENGINE v1.1.2 - INITIALIZED');
    console.log('═══════════════════════════════════════════');
    console.log('Chess-engine inspired AI system');
    console.log('OPTIMIZED: Tower CPU caching, throttled operations');
    console.log('Type help() for available commands');
    console.log('═══════════════════════════════════════════');
}

module.exports.loop = function() {
    // CPU profiling (only when over limit)
    const cpuStart = Game.cpu.getUsed();
    
    // Clean up dead creeps from memory
    MemoryManager.cleanDeadCreeps();
    
    // Collect analytics data for each tick
    Analytics.recordTick();
    
    // Visual feedback for spawning creeps (from tutorial)
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        if (spawn.spawning) {
            const spawningCreep = Game.creeps[spawn.spawning.name];
            const role = spawningCreep ? spawningCreep.memory.role : 'unknown';
            
            // Emoji map for visual feedback
            const roleEmojis = {
                harvester: '⛏️',
                upgrader: '⚡',
                builder: '🔨',
                hauler: '🚚',
                defender: '⚔️'
            };
            
            spawn.room.visual.text(
                (roleEmojis[role] || '🛠️') + role,
                spawn.pos.x + 1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8}
            );
        }
    }
    
    // Main engine execution - evaluate position and make decisions
    try {
        const engineStart = Game.cpu.getUsed();
        Engine.run();
        const engineCost = Game.cpu.getUsed() - engineStart;
        
        // Warn if engine is consuming too much CPU
        if (engineCost > 15 && Game.time % 10 === 0) {
            console.log(`⚠️ High CPU: Engine used ${engineCost.toFixed(2)} CPU`);
        }
    } catch (error) {
        console.log(`[ERROR] Engine execution failed: ${error.message}`);
        console.log(error.stack);
    }
    
    // Periodic analytics and learning
    if (Game.time % 100 === 0) {
        Analytics.analyze();
    }
    
    // Display stats every 100 ticks (reduced from 10 to prevent CPU spikes)
    if (Game.time % 100 === 0) {
        const creepsByRole = {};
        for (const name in Game.creeps) {
            const role = Game.creeps[name].memory.role || 'unknown';
            creepsByRole[role] = (creepsByRole[role] || 0) + 1;
        }
        
        const totalCpu = Game.cpu.getUsed();
        const cpuPercent = ((totalCpu / Game.cpu.limit) * 100).toFixed(0);
        
        console.log(`[Tick ${Game.time}] Creeps: ${Object.keys(Game.creeps).length} | ` +
                    `Rooms: ${Object.keys(Game.rooms).length} | ` +
                    `CPU: ${totalCpu.toFixed(2)}/${Game.cpu.limit} (${cpuPercent}%) | ` +
                    `Bucket: ${Game.cpu.bucket}`);
        
        // Show creep composition
        const composition = Object.keys(creepsByRole)
            .map(role => `${role}: ${creepsByRole[role]}`)
            .join(', ');
        if (composition) {
            console.log(`  └─ ${composition}`);
        }
    }
};
