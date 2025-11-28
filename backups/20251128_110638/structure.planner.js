/**
 * STRUCTURE PLANNER
 * 
 * Automatically plans and places construction sites for optimal room layout
 * v1.1 - Basic survival automation
 */

class StructurePlanner {
    /**
     * Plan and place construction sites for a room
     */
    static run(room) {
        // Only plan once every 100 ticks
        if (Game.time % 100 !== 0) return;
        
        // Don't plan if we already have lots of construction sites
        const existingSites = room.find(FIND_MY_CONSTRUCTION_SITES);
        if (existingSites.length > 5) return;
        
        const rcl = room.controller.level;
        
        // Plan based on RCL
        if (rcl >= 2) {
            this.planExtensions(room);
        }
        
        if (rcl >= 2) {
            this.planContainers(room);
        }
        
        if (rcl >= 3) {
            this.planTower(room);
        }
        
        if (rcl >= 4) {
            this.planStorage(room);
        }
        
        this.planRoads(room);
    }
    
    /**
     * Plan extensions near spawn
     */
    static planExtensions(room) {
        const spawns = room.find(FIND_MY_SPAWNS);
        if (spawns.length === 0) return;
        
        const spawn = spawns[0];
        const rcl = room.controller.level;
        
        // Max extensions per RCL
        const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][rcl];
        const existingExtensions = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_EXTENSION
        }).length;
        const extensionSites = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: s => s.structureType === STRUCTURE_EXTENSION
        }).length;
        
        const needed = maxExtensions - existingExtensions - extensionSites;
        
        if (needed <= 0) return;
        
        // Place extensions in a grid pattern near spawn
        const positions = [
            {dx: 2, dy: 0}, {dx: -2, dy: 0}, {dx: 0, dy: 2}, {dx: 0, dy: -2},
            {dx: 2, dy: 2}, {dx: -2, dy: 2}, {dx: 2, dy: -2}, {dx: -2, dy: -2},
            {dx: 3, dy: 0}, {dx: -3, dy: 0}, {dx: 0, dy: 3}, {dx: 0, dy: -3},
            {dx: 3, dy: 1}, {dx: 3, dy: -1}, {dx: -3, dy: 1}, {dx: -3, dy: -1},
            {dx: 1, dy: 3}, {dx: -1, dy: 3}, {dx: 1, dy: -3}, {dx: -1, dy: -3},
            {dx: 3, dy: 3}, {dx: -3, dy: 3}, {dx: 3, dy: -3}, {dx: -3, dy: -3},
            {dx: 4, dy: 0}, {dx: -4, dy: 0}, {dx: 0, dy: 4}, {dx: 0, dy: -4},
            {dx: 4, dy: 1}, {dx: 4, dy: -1}, {dx: -4, dy: 1}, {dx: -4, dy: -1}
        ];
        
        let placed = 0;
        for (const pos of positions) {
            if (placed >= needed) break;
            
            const x = spawn.pos.x + pos.dx;
            const y = spawn.pos.y + pos.dy;
            
            const result = room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
            if (result === OK) {
                placed++;
                console.log(`[Planner] Placed extension at ${x},${y}`);
            }
        }
    }
    
    /**
     * Plan containers at sources
     */
    static planContainers(room) {
        const sources = room.find(FIND_SOURCES);
        
        for (const source of sources) {
            // Check if container already exists nearby
            const nearbyContainer = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: s => s.structureType === STRUCTURE_CONTAINER
            });
            
            const nearbySite = source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1, {
                filter: s => s.structureType === STRUCTURE_CONTAINER
            });
            
            if (nearbyContainer.length > 0 || nearbySite.length > 0) continue;
            
            // Find best position next to source
            const positions = [
                {dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1},
                {dx: 1, dy: 1}, {dx: -1, dy: 1}, {dx: 1, dy: -1}, {dx: -1, dy: -1}
            ];
            
            for (const pos of positions) {
                const x = source.pos.x + pos.dx;
                const y = source.pos.y + pos.dy;
                
                const result = room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
                if (result === OK) {
                    console.log(`[Planner] Placed container at source ${source.id}`);
                    break;
                }
            }
        }
    }
    
    /**
     * Plan tower near spawn
     */
    static planTower(room) {
        const spawns = room.find(FIND_MY_SPAWNS);
        if (spawns.length === 0) return;
        
        const spawn = spawns[0];
        const rcl = room.controller.level;
        const maxTowers = CONTROLLER_STRUCTURES[STRUCTURE_TOWER][rcl];
        
        const existingTowers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        }).length;
        
        const towerSites = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        }).length;
        
        if (existingTowers + towerSites >= maxTowers) return;
        
        // Place tower near spawn but not too close
        const positions = [
            {dx: 3, dy: 3}, {dx: -3, dy: 3}, {dx: 3, dy: -3}, {dx: -3, dy: -3},
            {dx: 4, dy: 2}, {dx: -4, dy: 2}, {dx: 4, dy: -2}, {dx: -4, dy: -2},
            {dx: 2, dy: 4}, {dx: -2, dy: 4}, {dx: 2, dy: -4}, {dx: -2, dy: -4}
        ];
        
        for (const pos of positions) {
            const x = spawn.pos.x + pos.dx;
            const y = spawn.pos.y + pos.dy;
            
            const result = room.createConstructionSite(x, y, STRUCTURE_TOWER);
            if (result === OK) {
                console.log(`[Planner] Placed tower at ${x},${y}`);
                break;
            }
        }
    }
    
    /**
     * Plan storage near spawn
     */
    static planStorage(room) {
        const spawns = room.find(FIND_MY_SPAWNS);
        if (spawns.length === 0) return;
        
        if (room.storage) return; // Already have storage
        
        const storageSites = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: s => s.structureType === STRUCTURE_STORAGE
        });
        
        if (storageSites.length > 0) return;
        
        const spawn = spawns[0];
        
        // Place storage near spawn
        const positions = [
            {dx: 2, dy: 1}, {dx: -2, dy: 1}, {dx: 2, dy: -1}, {dx: -2, dy: -1},
            {dx: 1, dy: 2}, {dx: -1, dy: 2}, {dx: 1, dy: -2}, {dx: -1, dy: -2}
        ];
        
        for (const pos of positions) {
            const x = spawn.pos.x + pos.dx;
            const y = spawn.pos.y + pos.dy;
            
            const result = room.createConstructionSite(x, y, STRUCTURE_STORAGE);
            if (result === OK) {
                console.log(`[Planner] Placed storage at ${x},${y}`);
                break;
            }
        }
    }
    
    /**
     * Plan roads between key structures
     */
    static planRoads(room) {
        // Only plan roads if we have enough CPU
        if (Game.cpu.bucket < 5000) return;
        
        const spawns = room.find(FIND_MY_SPAWNS);
        if (spawns.length === 0) return;
        
        const spawn = spawns[0];
        const sources = room.find(FIND_SOURCES);
        const controller = room.controller;
        
        // Plan roads to sources
        for (const source of sources) {
            this.planRoadPath(room, spawn.pos, source.pos);
        }
        
        // Plan road to controller
        if (controller) {
            this.planRoadPath(room, spawn.pos, controller.pos);
        }
    }
    
    /**
     * Plan a road path between two positions
     */
    static planRoadPath(room, from, to) {
        // Only plan a few roads at a time
        const roadSites = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: s => s.structureType === STRUCTURE_ROAD
        });
        
        if (roadSites.length > 10) return;
        
        const path = room.findPath(from, to, {
            ignoreCreeps: true,
            ignoreRoads: false
        });
        
        // Place roads on path (limit to 3 per run)
        let placed = 0;
        for (const step of path) {
            if (placed >= 3) break;
            
            // Don't place on structures
            const structures = room.lookForAt(LOOK_STRUCTURES, step.x, step.y);
            if (structures.length > 0) continue;
            
            const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, step.x, step.y);
            if (sites.length > 0) continue;
            
            const result = room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
            if (result === OK) {
                placed++;
            }
        }
    }
}

module.exports = StructurePlanner;
