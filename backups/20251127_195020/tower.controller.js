/**
 * TOWER CONTROLLER
 * 
 * Automated tower defense and maintenance
 */

class TowerController {
    /**
     * Execute tower logic for a room
     */
    static run(room, roomEval) {
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        if (towers.length === 0) return;
        
        // Priority 1: Attack hostile creeps
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            // Target closest hostile to spawn/controller
            const targets = hostiles.sort((a, b) => {
                const distA = room.controller ? 
                    a.pos.getRangeTo(room.controller) : 50;
                const distB = room.controller ? 
                    b.pos.getRangeTo(room.controller) : 50;
                return distA - distB;
            });
            
            towers.forEach(tower => {
                tower.attack(targets[0]);
            });
            
            return; // Defense is priority
        }
        
        // Priority 2: Heal damaged creeps
        const damagedCreeps = room.find(FIND_MY_CREEPS, {
            filter: c => c.hits < c.hitsMax
        });
        
        if (damagedCreeps.length > 0) {
            towers.forEach(tower => {
                tower.heal(damagedCreeps[0]);
            });
            return;
        }
        
        // Priority 3: Repair critical structures (walls, ramparts at low health)
        const damagedStructures = room.find(FIND_STRUCTURES, {
            filter: s => {
                if (s.structureType === STRUCTURE_WALL || 
                    s.structureType === STRUCTURE_RAMPART) {
                    return s.hits < 10000;
                }
                return s.hits < s.hitsMax * 0.5;
            }
        });
        
        if (damagedStructures.length > 0) {
            // Sort by health percentage
            damagedStructures.sort((a, b) => {
                const healthA = a.hits / a.hitsMax;
                const healthB = b.hits / b.hitsMax;
                return healthA - healthB;
            });
            
            towers.forEach(tower => {
                if (tower.store.energy > 500) { // Only repair if we have energy
                    tower.repair(damagedStructures[0]);
                }
            });
        }
    }
}

module.exports = TowerController;
