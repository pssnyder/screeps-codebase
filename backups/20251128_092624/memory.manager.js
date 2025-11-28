/**
 * MEMORY MANAGER
 * 
 * Manages persistent state and cleans up dead objects
 */

class MemoryManager {
    /**
     * Clean up memory of dead creeps
     */
    static cleanDeadCreeps() {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    }
    
    /**
     * Initialize creep memory with defaults
     */
    static initCreep(creep, role, targetRoom = null) {
        creep.memory = {
            role: role,
            working: false,
            targetRoom: targetRoom,
            sourceId: null,
            targetId: null,
            born: Game.time,
            stats: {
                energyHarvested: 0,
                energyDelivered: 0,
                upgraded: 0,
                built: 0,
                repaired: 0
            }
        };
    }
    
    /**
     * Store analytics data
     */
    static recordStat(category, key, value) {
        if (!Memory.engine.stats[category]) {
            Memory.engine.stats[category] = {};
        }
        
        if (!Memory.engine.stats[category][key]) {
            Memory.engine.stats[category][key] = [];
        }
        
        Memory.engine.stats[category][key].push({
            tick: Game.time,
            value: value
        });
        
        // Keep only last 1000 entries per stat
        if (Memory.engine.stats[category][key].length > 1000) {
            Memory.engine.stats[category][key].shift();
        }
    }
    
    /**
     * Get historical stat data
     */
    static getStat(category, key, ticksBack = 100) {
        if (!Memory.engine.stats[category] || 
            !Memory.engine.stats[category][key]) {
            return [];
        }
        
        const stats = Memory.engine.stats[category][key];
        const cutoff = Game.time - ticksBack;
        
        return stats.filter(s => s.tick >= cutoff);
    }
}

module.exports = MemoryManager;
