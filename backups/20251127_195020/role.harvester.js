/**
 * HARVESTER ROLE
 * 
 * Intelligent energy harvesting with optimal source selection
 */

class RoleHarvester {
    static run(creep, strategy) {
        // Initialize stats if missing
        if (!creep.memory.stats) {
            creep.memory.stats = {
                energyHarvested: 0,
                energyDelivered: 0,
                upgraded: 0,
                built: 0,
                repaired: 0
            };
        }
        
        // State machine: harvesting -> delivering
        if (creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
            creep.say('🚚 deliver');
        }
        if (creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = false;
            creep.say('⛏️ harvest');
        }
        
        if (!creep.memory.working) {
            this.harvest(creep);
        } else {
            this.deliver(creep);
        }
    }
    
    /**
     * Harvest energy from source
     */
    static harvest(creep) {
        // Find or remember source
        let source = null;
        
        if (creep.memory.sourceId) {
            source = Game.getObjectById(creep.memory.sourceId);
        }
        
        if (!source) {
            // Intelligent source selection: choose least crowded source
            const sources = creep.room.find(FIND_SOURCES_ACTIVE);
            
            if (sources.length === 0) {
                // No active sources, wait
                return;
            }
            
            // Count creeps at each source
            const sourceCrowding = sources.map(s => {
                const nearbyCreeps = s.pos.findInRange(FIND_MY_CREEPS, 1, {
                    filter: c => c.memory.sourceId === s.id
                });
                return { source: s, count: nearbyCreeps.length };
            });
            
            // Select least crowded
            sourceCrowding.sort((a, b) => a.count - b.count);
            source = sourceCrowding[0].source;
            creep.memory.sourceId = source.id;
        }
        
        // Harvest
        const result = creep.harvest(source);
        
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {
                visualizePathStyle: { stroke: '#ffaa00' },
                reusePath: 10
            });
        } else if (result === OK) {
            // Track harvested energy
            const workParts = creep.body.filter(p => p.type === WORK).length;
            creep.memory.stats.energyHarvested += workParts * 2;
        }
    }
    
    /**
     * Deliver energy to spawn/extensions
     */
    static deliver(creep) {
        // Intelligent target selection
        let target = null;
        
        if (creep.memory.targetId) {
            target = Game.getObjectById(creep.memory.targetId);
            // Validate target exists and has capacity
            if (target && target.store && target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                target = null;
                creep.memory.targetId = null;
            } else if (!target) {
                // Target destroyed or invalid
                creep.memory.targetId = null;
            }
        }
        
        if (!target) {
            // Priority order: spawns, extensions, towers, storage
            const targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: s => {
                    return (s.structureType === STRUCTURE_SPAWN ||
                            s.structureType === STRUCTURE_EXTENSION ||
                            s.structureType === STRUCTURE_TOWER) &&
                           s.store &&
                           s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            
            if (targets.length > 0) {
                target = creep.pos.findClosestByPath(targets);
            }
            
            if (!target) {
                // If no spawn/extension needs energy, deposit in storage
                const storage = creep.room.storage;
                if (storage && storage.store && storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    target = storage;
                }
            }
            
            if (!target) {
                // Last resort: upgrade controller
                target = creep.room.controller;
            }
            
            if (target) {
                creep.memory.targetId = target.id;
            }
        }
        
        if (!target) return;
        
        let result;
        if (target.structureType === STRUCTURE_CONTROLLER) {
            result = creep.upgradeController(target);
        } else {
            result = creep.transfer(target, RESOURCE_ENERGY);
        }
        
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {
                visualizePathStyle: { stroke: '#ffffff' },
                reusePath: 10
            });
        } else if (result === OK) {
            creep.memory.stats.energyDelivered += creep.store[RESOURCE_ENERGY];
            creep.memory.targetId = null; // Clear target after successful delivery
        } else if (result === ERR_INVALID_TARGET || result === ERR_FULL) {
            // Target is invalid or full, clear it
            creep.memory.targetId = null;
        }
    }
}

module.exports = RoleHarvester;
