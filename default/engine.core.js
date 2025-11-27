/**
 * SCREEPS ENGINE - Core Decision Making System
 * 
 * Inspired by chess engine architecture:
 * - Position evaluation
 * - Move generation
 * - Search algorithms
 * - Best move selection
 */

const Evaluator = require('./evaluator');
const DecisionTree = require('./decision.tree');
const RoleManager = require('./role.manager');
const SpawnController = require('./spawn.controller');
const TowerController = require('./tower.controller');

class EngineCore {
    /**
     * Main engine execution loop
     * This is called every game tick
     */
    static run() {
        // Phase 1: Evaluate current position (like chess position evaluation)
        const gameState = this.evaluateGameState();
        
        // Phase 2: Generate and execute strategic decisions
        const strategy = DecisionTree.generateStrategy(gameState);
        
        // Phase 3: Execute room-level operations
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            
            if (!room.controller || !room.controller.my) continue;
            
            // Evaluate room position
            const roomEval = Evaluator.evaluateRoom(room);
            
            // Make spawn decisions
            SpawnController.run(room, roomEval, strategy);
            
            // Control towers
            TowerController.run(room, roomEval);
        }
        
        // Phase 4: Execute creep-level operations
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            RoleManager.executeCreep(creep, strategy);
        }
        
        // Store evaluation for learning
        Memory.engine.lastEvaluation = gameState;
    }
    
    /**
     * Evaluate overall game state
     * Similar to chess position evaluation: material, position, control
     */
    static evaluateGameState() {
        const state = {
            score: 0,
            rooms: {},
            threats: [],
            opportunities: [],
            resources: {
                energy: 0,
                minerals: {}
            },
            military: {
                offense: 0,
                defense: 0
            },
            economy: {
                income: 0,
                efficiency: 0
            }
        };
        
        // Evaluate each room
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            if (room.controller && room.controller.my) {
                const roomEval = Evaluator.evaluateRoom(room);
                state.rooms[roomName] = roomEval;
                
                // Aggregate scores (like chess material counting)
                state.score += roomEval.score;
                state.resources.energy += roomEval.resources.energy;
                state.military.offense += roomEval.military.offense;
                state.military.defense += roomEval.military.defense;
                state.economy.income += roomEval.economy.income;
            }
        }
        
        // Calculate efficiency metrics
        const creepCount = Object.keys(Game.creeps).length;
        state.economy.efficiency = creepCount > 0 ? 
            state.economy.income / creepCount : 0;
        
        return state;
    }
}

module.exports = EngineCore;
