/**
 * HAULER ROLE
 * 
 * Efficient energy transportation between sources and storage
 */

class RoleHauler {
    static run(creep, strategy) {
        // State machine
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
        }
        
        if (creep.memory.working) {
            this.deliver(creep);
        } else {
            this.collect(creep);
        }
    }
    
    /**
     * Collect energy from containers or ground
     */
    static collect(creep) {
        // Priority: dropped resources, containers near sources
        const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: r => r.resourceType === RESOURCE_ENERGY && r.amount > 100
        });
        
        if (droppedEnergy) {
            if (creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy, {
                    visualizePathStyle: { stroke: '#ffff00' }
                });
            }
            return;
        }
        
        // Find containers near sources
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_CONTAINER &&
                        s.store[RESOURCE_ENERGY] > creep.store.getCapacity() / 2
        });
        
        if (containers.length > 0) {
            const target = creep.pos.findClosestByPath(containers);
            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: { stroke: '#ffff00' }
                    });
                }
            }
        }
    }
    
    /**
     * Deliver energy to storage or spawn structures
     */
    static deliver(creep) {
        let target = null;
        
        // Prefer storage if available
        if (creep.room.storage) {
            target = creep.room.storage;
        } else {
            // Otherwise deliver to spawns/extensions
            target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: s => {
                    return (s.structureType === STRUCTURE_SPAWN ||
                            s.structureType === STRUCTURE_EXTENSION) &&
                           s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
        }
        
        if (!target) {
            // No valid targets, deposit at controller
            target = creep.room.controller;
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
                visualizePathStyle: { stroke: '#ffff00' }
            });
        }
    }
}

module.exports = RoleHauler;
