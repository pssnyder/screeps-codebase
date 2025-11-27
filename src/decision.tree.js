/**
 * DECISION TREE
 * 
 * Chess-engine style move generation and search
 * Generates possible strategies and selects the best one
 */

class DecisionTree {
    /**
     * Generate strategic decisions based on game state
     * Similar to move generation in chess engines
     */
    static generateStrategy(gameState) {
        const strategy = {
            priority: this.determinePriority(gameState),
            spawning: this.generateSpawnDecisions(gameState),
            assignments: this.generateRoleAssignments(gameState),
            defense: this.generateDefenseStrategy(gameState),
            expansion: this.shouldExpandRoom(gameState)
        };
        
        // Store decision for learning
        if (!Memory.engine.decisions) {
            Memory.engine.decisions = [];
        }
        Memory.engine.decisions.push({
            tick: Game.time,
            strategy: strategy,
            score: gameState.score
        });
        
        // Keep only last 1000 decisions
        if (Memory.engine.decisions.length > 1000) {
            Memory.engine.decisions.shift();
        }
        
        return strategy;
    }
    
    /**
     * Determine strategic priority based on evaluation
     * Like determining game phase in chess (opening, middlegame, endgame)
     */
    static determinePriority(gameState) {
        const priorities = [];
        
        // Defense is always highest priority if threatened
        if (gameState.threats.length > 0) {
            priorities.push({ type: 'DEFENSE', weight: 10 });
        }
        
        // Economic development priority
        const avgRoomLevel = Object.values(gameState.rooms).reduce(
            (sum, room) => sum + (room.control?.level || 0), 0
        ) / Object.keys(gameState.rooms).length;
        
        if (avgRoomLevel < 4) {
            priorities.push({ type: 'ECONOMY', weight: 8 });
        } else {
            priorities.push({ type: 'ECONOMY', weight: 5 });
        }
        
        // Upgrade priority based on controller level
        priorities.push({ 
            type: 'UPGRADE', 
            weight: avgRoomLevel < 8 ? 7 : 9 
        });
        
        // Building priority if construction sites exist
        const sites = (typeof Game !== 'undefined' && Game.constructionSites) ? 
            Object.keys(Game.constructionSites).length : 0;
        if (sites > 0) {
            priorities.push({ type: 'BUILD', weight: 6 });
        }
        
        // Expansion priority for higher levels
        if (avgRoomLevel >= 4 && Object.keys(gameState.rooms).length < 3) {
            priorities.push({ type: 'EXPAND', weight: 4 });
        }
        
        // Sort by weight
        priorities.sort((a, b) => b.weight - a.weight);
        
        return priorities;
    }
    
    /**
     * Generate optimal spawn decisions
     * Like piece development in chess - what pieces to develop and when
     */
    static generateSpawnDecisions(gameState) {
        const decisions = [];
        
        for (const roomName in gameState.rooms) {
            const roomEval = gameState.rooms[roomName];
            const room = (typeof Game !== 'undefined' && Game.rooms) ? Game.rooms[roomName] : null;
            
            // Calculate optimal creep composition
            const creepCounts = room ? this.countCreepsByRole(room) : {};
            const sourceCount = roomEval.resources && roomEval.resources.sources ? 
                roomEval.resources.sources.length : 2;
            
            // Determine what to spawn based on needs
            const needs = {
                harvester: Math.max(0, sourceCount * 2 - (creepCounts.harvester || 0)),
                upgrader: Math.max(0, 3 - (creepCounts.upgrader || 0)),
                builder: Math.max(0, 2 - (creepCounts.builder || 0)),
                hauler: Math.max(0, sourceCount - (creepCounts.hauler || 0))
            };
            
            // Defense needs
            if (roomEval.military && roomEval.military.threats && roomEval.military.threats.length > 0) {
                needs.defender = Math.max(2, roomEval.military.threats.length * 2);
            }
            
            // Convert needs to spawn queue
            for (const role in needs) {
                if (needs[role] > 0) {
                    decisions.push({
                        room: roomName,
                        role: role,
                        priority: this.getSpawnPriority(role, needs),
                        body: room ? this.generateOptimalBody(role, room) : [WORK, CARRY, MOVE]
                    });
                }
            }
        }
        
        // Sort by priority
        decisions.sort((a, b) => b.priority - a.priority);
        
        return decisions;
    }
    
    /**
     * Count creeps by role in a room
     */
    static countCreepsByRole(room) {
        const counts = {};
        const creeps = room.find(FIND_MY_CREEPS);
        
        creeps.forEach(creep => {
            const role = creep.memory.role || 'unknown';
            counts[role] = (counts[role] || 0) + 1;
        });
        
        return counts;
    }
    
    /**
     * Determine spawn priority for a role
     */
    static getSpawnPriority(role, needs) {
        const priorities = {
            harvester: 10,  // Highest - economy is critical
            defender: 9,    // Defense is crucial
            hauler: 7,
            upgrader: 5,
            builder: 4
        };
        
        // Boost priority if critical shortage
        let priority = priorities[role] || 1;
        if (needs[role] >= 3) priority += 2;
        
        return priority;
    }
    
    /**
     * Generate optimal body configuration for a role
     * Like choosing piece types in chess based on position
     */
    static generateOptimalBody(role, room) {
        const energyAvailable = room.energyCapacityAvailable;
        
        // Body templates
        const templates = {
            harvester: () => this.buildBody(energyAvailable, [WORK, WORK, CARRY, MOVE]),
            upgrader: () => this.buildBody(energyAvailable, [WORK, CARRY, MOVE]),
            builder: () => this.buildBody(energyAvailable, [WORK, CARRY, MOVE, MOVE]),
            hauler: () => this.buildBody(energyAvailable, [CARRY, CARRY, MOVE]),
            defender: () => this.buildBody(energyAvailable, [TOUGH, ATTACK, MOVE])
        };
        
        return templates[role] ? templates[role]() : [WORK, CARRY, MOVE];
    }
    
    /**
     * Build body parts array within energy constraints
     */
    static buildBody(energy, pattern) {
        const body = [];
        const cost = pattern.reduce((sum, part) => sum + BODYPART_COST[part], 0);
        
        let iterations = Math.floor(energy / cost);
        iterations = Math.min(iterations, Math.floor(50 / pattern.length)); // Max 50 parts
        
        for (let i = 0; i < iterations; i++) {
            body.push(...pattern);
        }
        
        return body.length > 0 ? body : [WORK, CARRY, MOVE];
    }
    
    /**
     * Generate role assignments for creeps
     */
    static generateRoleAssignments(gameState) {
        // Dynamic role reassignment based on needs
        // This could be expanded to reassign creeps mid-game
        return {};
    }
    
    /**
     * Generate defense strategy
     */
    static generateDefenseStrategy(gameState) {
        const strategy = {
            active: false,
            defenders: 0,
            towerTargets: []
        };
        
        if (gameState.threats.length > 0) {
            strategy.active = true;
            strategy.defenders = gameState.threats.length * 2;
        }
        
        return strategy;
    }
    
    /**
     * Evaluate if room should expand to new rooms
     */
    static shouldExpandRoom(gameState) {
        // Expansion logic - similar to chess expansion/space control
        for (const roomName in gameState.rooms) {
            const roomEval = gameState.rooms[roomName];
            if (roomEval.control.level >= 4 && roomEval.resources.stored > 50000) {
                return true;
            }
        }
        return false;
    }
}

module.exports = DecisionTree;
