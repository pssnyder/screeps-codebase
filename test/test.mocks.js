/**
 * Mock Game Objects
 * Creates fake Screeps game objects for testing
 */

// Mock global constants
global.WORK = 'work';
global.CARRY = 'carry';
global.MOVE = 'move';
global.ATTACK = 'attack';
global.RANGED_ATTACK = 'ranged_attack';
global.HEAL = 'heal';
global.TOUGH = 'tough';
global.CLAIM = 'claim';

global.STRUCTURE_SPAWN = 'spawn';
global.STRUCTURE_EXTENSION = 'extension';
global.STRUCTURE_TOWER = 'tower';
global.STRUCTURE_STORAGE = 'storage';
global.STRUCTURE_CONTAINER = 'container';
global.STRUCTURE_ROAD = 'road';
global.STRUCTURE_RAMPART = 'rampart';
global.STRUCTURE_WALL = 'constructedWall';
global.STRUCTURE_CONTROLLER = 'controller';

global.RESOURCE_ENERGY = 'energy';

global.FIND_SOURCES = 101;
global.FIND_SOURCES_ACTIVE = 102;
global.FIND_MY_SPAWNS = 103;
global.FIND_MY_STRUCTURES = 104;
global.FIND_HOSTILE_CREEPS = 105;
global.FIND_MY_CREEPS = 106;
global.FIND_STRUCTURES = 107;
global.FIND_CONSTRUCTION_SITES = 108;
global.FIND_DROPPED_RESOURCES = 109;

global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.ERR_NOT_ENOUGH_ENERGY = -6;

global.CREEP_LIFE_TIME = 1500;

global.BODYPART_COST = {
    [WORK]: 100,
    [CARRY]: 50,
    [MOVE]: 50,
    [ATTACK]: 80,
    [RANGED_ATTACK]: 150,
    [HEAL]: 250,
    [TOUGH]: 10,
    [CLAIM]: 600
};

class MockGame {
    /**
     * Create a mock room
     */
    static createMockRoom(options = {}) {
        const room = {
            name: options.name || 'W1N1',
            controller: options.controller || { my: true, level: 3, progress: 1000, progressTotal: 10000 },
            energyAvailable: options.energy || 300,
            energyCapacityAvailable: options.energyCapacity || 550,
            storage: options.storage ? {
                store: {
                    energy: options.storage,
                    getCapacity: () => 100000
                }
            } : null,
            
            find: (type, filter) => {
                switch(type) {
                    case FIND_SOURCES:
                    case FIND_SOURCES_ACTIVE:
                        return this.createMockSources(options.sources || 2);
                    
                    case FIND_MY_SPAWNS:
                        return this.createMockSpawns(options.spawns || 1);
                    
                    case FIND_MY_STRUCTURES:
                        if (filter && filter.filter) {
                            const structures = [];
                            if (options.extensions) {
                                for (let i = 0; i < options.extensions; i++) {
                                    structures.push({ structureType: STRUCTURE_EXTENSION });
                                }
                            }
                            if (options.towers) {
                                for (let i = 0; i < options.towers; i++) {
                                    structures.push({ structureType: STRUCTURE_TOWER });
                                }
                            }
                            return structures.filter(filter.filter);
                        }
                        return [];
                    
                    case FIND_HOSTILE_CREEPS:
                        return this.createMockHostiles(options.hostiles || 0);
                    
                    case FIND_MY_CREEPS:
                        return this.createMockCreeps(options.creeps || 0);
                    
                    default:
                        return [];
                }
            },
            
            visual: {
                text: () => {},
                circle: () => {}
            }
        };
        
        return room;
    }
    
    /**
     * Create mock sources
     */
    static createMockSources(count) {
        const sources = [];
        for (let i = 0; i < count; i++) {
            sources.push({
                id: `source_${i}`,
                energy: 3000,
                energyCapacity: 3000,
                pos: {
                    x: 25 + i * 10,
                    y: 25,
                    findInRange: () => []
                }
            });
        }
        return sources;
    }
    
    /**
     * Create mock spawns
     */
    static createMockSpawns(count) {
        const spawns = [];
        for (let i = 0; i < count; i++) {
            spawns.push({
                id: `spawn_${i}`,
                name: `Spawn${i + 1}`,
                structureType: STRUCTURE_SPAWN,
                spawning: null,
                spawnCreep: () => OK,
                pos: { x: 25, y: 25 }
            });
        }
        return spawns;
    }
    
    /**
     * Create mock hostile creeps
     */
    static createMockHostiles(count) {
        const hostiles = [];
        for (let i = 0; i < count; i++) {
            hostiles.push({
                id: `hostile_${i}`,
                owner: { username: 'Enemy' },
                body: [{ type: ATTACK }, { type: MOVE }],
                pos: { x: 40, y: 40 }
            });
        }
        return hostiles;
    }
    
    /**
     * Create mock friendly creeps
     */
    static createMockCreeps(count) {
        const creeps = [];
        for (let i = 0; i < count; i++) {
            creeps.push(this.createMockCreep({
                name: `creep_${i}`,
                role: i % 2 === 0 ? 'harvester' : 'upgrader'
            }));
        }
        return creeps;
    }
    
    /**
     * Create a single mock creep
     */
    static createMockCreep(options = {}) {
        return {
            name: options.name || 'test_creep',
            memory: {
                role: options.role || 'harvester',
                working: false,
                stats: {
                    energyHarvested: 0,
                    energyDelivered: 0,
                    upgraded: 0,
                    built: 0,
                    repaired: 0
                }
            },
            body: options.body || [
                { type: WORK }, { type: CARRY }, { type: MOVE }
            ],
            store: {
                [RESOURCE_ENERGY]: options.energy || 0,
                getFreeCapacity: function() {
                    return options.capacity - this[RESOURCE_ENERGY];
                }
            },
            ticksToLive: options.ticksToLive || 1500,
            room: options.room || this.createMockRoom(),
            pos: {
                x: 25,
                y: 25,
                getRangeTo: () => 10,
                findClosestByPath: () => null,
                findInRange: () => []
            },
            
            // Actions
            harvest: () => ERR_NOT_IN_RANGE,
            transfer: () => ERR_NOT_IN_RANGE,
            withdraw: () => ERR_NOT_IN_RANGE,
            upgradeController: () => ERR_NOT_IN_RANGE,
            build: () => ERR_NOT_IN_RANGE,
            repair: () => ERR_NOT_IN_RANGE,
            moveTo: () => OK,
            attack: () => ERR_NOT_IN_RANGE,
            rangedAttack: () => ERR_NOT_IN_RANGE
        };
    }
    
    /**
     * Create a mock game state
     */
    static createGameState(options = {}) {
        return {
            score: options.score || 0,
            rooms: options.rooms || {},
            threats: options.threats || [],
            opportunities: options.opportunities || [],
            resources: {
                energy: options.energy || 0,
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
    }
    
    /**
     * Set up global Game object
     */
    static setupFullGame() {
        global.Game = {
            time: 1000,
            rooms: {
                'W1N1': this.createMockRoom({ spawns: 1, sources: 2 })
            },
            creeps: {
                'harvester_1': this.createMockCreep({ role: 'harvester' }),
                'upgrader_1': this.createMockCreep({ role: 'upgrader' })
            },
            spawns: {
                'Spawn1': this.createMockSpawns(1)[0]
            },
            cpu: {
                getUsed: () => 5.5,
                limit: 20,
                bucket: 10000
            },
            constructionSites: {},
            getObjectById: (id) => null
        };
        
        global.Memory = {
            engine: {
                version: '1.0.0',
                initialized: 1,
                stats: {},
                decisions: [],
                learning: {}
            },
            creeps: {}
        };
    }
    
    /**
     * Reset memory for clean tests
     */
    static resetMemory() {
        global.Memory = {
            engine: {
                version: '1.0.0',
                initialized: 1,
                stats: {},
                decisions: [],
                learning: {}
            },
            creeps: {}
        };
    }
}

module.exports = MockGame;
