/**
 * SPAWN CONTROLLER
 * 
 * Manages spawn queue and creep production
 */

const MemoryManager = require('./memory.manager');

class SpawnController {
    /**
     * Execute spawning logic for a room
     */
    static run(room, roomEval, strategy) {
        const spawns = room.find(FIND_MY_SPAWNS);
        
        if (spawns.length === 0) return;
        
        // Process each spawn
        spawns.forEach(spawn => {
            if (spawn.spawning) {
                this.visualizeSpawning(spawn);
                return;
            }
            
            // Get spawn decisions for this room
            const decisions = strategy.spawning.filter(d => d.room === room.name);
            
            if (decisions.length === 0) return;
            
            // Try to spawn highest priority creep
            const decision = decisions[0];
            const newName = `${decision.role}_${Game.time}_${Math.floor(Math.random() * 1000)}`;
            
            const result = spawn.spawnCreep(decision.body, newName, {
                memory: { role: decision.role }
            });
            
            if (result === OK) {
                console.log(`[Spawn] ${room.name}: Creating ${decision.role} - ${newName}`);
                MemoryManager.initCreep(Game.creeps[newName], decision.role);
            } else if (result === ERR_NOT_ENOUGH_ENERGY) {
                // Try with smaller body if not enough energy
                const smallerBody = this.scaleDownBody(decision.body, room.energyAvailable);
                if (smallerBody.length > 0) {
                    const result2 = spawn.spawnCreep(smallerBody, newName, {
                        memory: { role: decision.role }
                    });
                    if (result2 === OK) {
                        console.log(`[Spawn] ${room.name}: Creating reduced ${decision.role} - ${newName}`);
                        MemoryManager.initCreep(Game.creeps[newName], decision.role);
                    }
                }
            }
        });
    }
    
    /**
     * Scale down body to fit available energy
     */
    static scaleDownBody(body, energyAvailable) {
        const bodyCost = body.reduce((sum, part) => sum + BODYPART_COST[part], 0);
        
        if (bodyCost <= energyAvailable) return body;
        
        // Remove parts until it fits
        const scaled = [...body];
        while (scaled.length > 0) {
            const cost = scaled.reduce((sum, part) => sum + BODYPART_COST[part], 0);
            if (cost <= energyAvailable) break;
            scaled.pop();
        }
        
        return scaled;
    }
    
    /**
     * Visualize spawning progress
     */
    static visualizeSpawning(spawn) {
        if (!spawn.spawning) return;
        
        const spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            `🛠️ ${spawningCreep.memory.role}`,
            spawn.pos.x + 1,
            spawn.pos.y,
            { align: 'left', opacity: 0.8 }
        );
    }
}

module.exports = SpawnController;
