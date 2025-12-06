/**
 * STRUCTURE PLANNER
 * 
 * Automatically plans and places construction sites for optimal room layout
 * v2.0.1 - Priority-based planning (critical structures first)
 */

class StructurePlanner {
    /**
     * Plan and place construction sites for a room
     * v2.0.3: Reduced site limits to prevent overwhelming builders
     */
    static run(room) {
        // Only plan once every 100 ticks
        if (Game.time % 100 !== 0) return;
        
        const rcl = room.controller.level;
        const existingSites = room.find(FIND_MY_CONSTRUCTION_SITES);
        
        // v2.0.3: Stop planning if we already have too many sites
        if (existingSites.length >= 5) {
            return; // Wait for builders to catch up
        }
        
        const energyPercent = room.energyAvailable / room.energyCapacityAvailable;
        
        // PRIORITY 1: Extensions (critical for energy capacity)
        // But only if energy is reasonable
        if (rcl >= 2 && existingSites.length < 5 && energyPercent > 0.25) {
            this.planExtensions(room);
        }
        
        // PRIORITY 2: Towers (critical for defense at RCL 3+)
        if (rcl >= 3 && existingSites.length < 5) {
            this.planTower(room);
        }
        
        // PRIORITY 3: Containers (important for economy)
        if (rcl >= 2 && existingSites.length < 5) {
            this.planContainers(room);
        }
        
        // PRIORITY 4: Storage (game-changer at RCL 4+)
        // Only plan storage if energy situation is stable
        if (rcl >= 4 && existingSites.length < 3 && energyPercent > 0.5) {
            this.planStorage(room);
        }
        
        // PRIORITY 5: Roads (nice to have, but not critical)
        // Only plan roads if we have < 2 sites total and energy is stable
        if (existingSites.length < 2 && energyPercent > 0.6) {
            this.planRoads(room);
        }
    }
    
    /**
     * Plan extensions near spawn
     * v2.0.3: Place 3-4 at a time (not all at once)
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
        
        // v2.0.3: Only place 3-4 extensions per planning cycle
        const toPlace = Math.min(needed, 4);
        
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
            if (placed >= toPlace) break;
            
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
