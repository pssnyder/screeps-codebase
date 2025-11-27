/**
 * SCREEPS ENGINE - Test Suite
 * 
 * Comprehensive testing framework for local validation before deployment
 */

const TestFramework = require('./test.framework');
const MockGame = require('./test.mocks');

// Import modules to test
const Evaluator = require('../src/evaluator');
const DecisionTree = require('../src/decision.tree');
const MemoryManager = require('../src/memory.manager');
const Analytics = require('../src/analytics');

class TestSuite {
    static runAll() {
        console.log('='.repeat(60));
        console.log('SCREEPS ENGINE - TEST SUITE');
        console.log('='.repeat(60));
        
        const results = {
            passed: 0,
            failed: 0,
            total: 0
        };
        
        // Run all test categories
        this.runEvaluatorTests(results);
        this.runDecisionTreeTests(results);
        this.runMemoryTests(results);
        this.runAnalyticsTests(results);
        this.runRoleTests(results);
        this.runIntegrationTests(results);
        
        // Display summary
        console.log('\n' + '='.repeat(60));
        console.log(`RESULTS: ${results.passed}/${results.total} passed, ${results.failed} failed`);
        console.log('='.repeat(60));
        
        return results;
    }
    
    /**
     * Test Evaluator Module
     */
    static runEvaluatorTests(results) {
        console.log('\n[EVALUATOR TESTS]');
        
        // Test 1: Basic room evaluation
        TestFramework.test('Room evaluation returns valid structure', () => {
            const mockRoom = MockGame.createMockRoom({
                controller: { my: true, level: 3 },
                sources: 2,
                spawns: 1,
                extensions: 5
            });
            
            const evaluation = Evaluator.evaluateRoom(mockRoom);
            
            TestFramework.assert(evaluation.score > 0, 'Score should be positive');
            TestFramework.assert(evaluation.control.level === 3, 'Controller level should match');
            TestFramework.assert(evaluation.resources.sources.length === 2, 'Should find 2 sources');
            
            return true;
        }, results);
        
        // Test 2: Score increases with better infrastructure
        TestFramework.test('Better infrastructure yields higher score', () => {
            const room1 = MockGame.createMockRoom({ controller: { level: 1 }, spawns: 1 });
            const room2 = MockGame.createMockRoom({ controller: { level: 5 }, spawns: 2, extensions: 30 });
            
            const eval1 = Evaluator.evaluateRoom(room1);
            const eval2 = Evaluator.evaluateRoom(room2);
            
            TestFramework.assert(eval2.score > eval1.score, 'Higher level room should score higher');
            
            return true;
        }, results);
        
        // Test 3: Threats decrease score
        TestFramework.test('Hostile creeps decrease room score', () => {
            const safeRoom = MockGame.createMockRoom({ hostiles: 0 });
            const dangerRoom = MockGame.createMockRoom({ hostiles: 3 });
            
            const evalSafe = Evaluator.evaluateRoom(safeRoom);
            const evalDanger = Evaluator.evaluateRoom(dangerRoom);
            
            TestFramework.assert(evalSafe.score > evalDanger.score, 'Safe room should score higher');
            TestFramework.assert(evalDanger.military.threats.length === 3, 'Should detect 3 threats');
            
            return true;
        }, results);
        
        // Test 4: Creep evaluation
        TestFramework.test('Creep evaluation calculates body value', () => {
            const mockCreep = MockGame.createMockCreep({
                body: [
                    { type: WORK }, { type: WORK },
                    { type: CARRY }, { type: MOVE }
                ],
                ticksToLive: 1500
            });
            
            const evaluation = Evaluator.evaluateCreep(mockCreep);
            
            TestFramework.assert(evaluation.value > 0, 'Should have positive value');
            TestFramework.assert(evaluation.efficiency > 0, 'Should have efficiency rating');
            TestFramework.assert(evaluation.score === evaluation.value * evaluation.efficiency, 'Score calculation correct');
            
            return true;
        }, results);
    }
    
    /**
     * Test Decision Tree Module
     */
    static runDecisionTreeTests(results) {
        console.log('\n[DECISION TREE TESTS]');
        
        // Test 1: Priority determination
        TestFramework.test('Priority system ranks defense highest when threatened', () => {
            MockGame.setupFullGame(); // Set up Game global
            
            const gameState = MockGame.createGameState({
                threats: [{ type: 'hostile' }]
            });
            
            const priorities = DecisionTree.determinePriority(gameState);
            
            TestFramework.assert(priorities.length > 0, 'Should have priorities');
            TestFramework.assert(priorities[0].type === 'DEFENSE', 'Defense should be highest priority');
            
            return true;
        }, results);
        
        // Test 2: Spawn decisions generation
        TestFramework.test('Spawn decisions created based on needs', () => {
            MockGame.setupFullGame(); // Set up Game global
            
            const gameState = MockGame.createGameState({
                rooms: {
                    'W1N1': {
                        control: { level: 3 },
                        resources: { sources: [1, 2] }
                    }
                }
            });
            
            const decisions = DecisionTree.generateSpawnDecisions(gameState);
            
            TestFramework.assert(decisions.length > 0, 'Should generate spawn decisions');
            TestFramework.assert(decisions[0].role !== undefined, 'Decision should have role');
            TestFramework.assert(decisions[0].priority !== undefined, 'Decision should have priority');
            
            return true;
        }, results);
        
        // Test 3: Body generation
        TestFramework.test('Body generation creates valid creep bodies', () => {
            const mockRoom = MockGame.createMockRoom({ energy: 550 });
            
            const body = DecisionTree.generateOptimalBody('harvester', mockRoom);
            
            TestFramework.assert(Array.isArray(body), 'Body should be array');
            TestFramework.assert(body.length > 0, 'Body should have parts');
            TestFramework.assert(body.length <= 50, 'Body should not exceed 50 parts');
            
            const cost = body.reduce((sum, part) => sum + BODYPART_COST[part], 0);
            TestFramework.assert(cost <= 550, 'Body cost should not exceed available energy');
            
            return true;
        }, results);
        
        // Test 4: Body scaling
        TestFramework.test('Body scales down for low energy', () => {
            const lowEnergyRoom = MockGame.createMockRoom({ energy: 300 });
            const highEnergyRoom = MockGame.createMockRoom({ energy: 1000 });
            
            const smallBody = DecisionTree.generateOptimalBody('harvester', lowEnergyRoom);
            const largeBody = DecisionTree.generateOptimalBody('harvester', highEnergyRoom);
            
            TestFramework.assert(largeBody.length >= smallBody.length, 'High energy should create larger bodies');
            
            return true;
        }, results);
    }
    
    /**
     * Test Memory Manager
     */
    static runMemoryTests(results) {
        console.log('\n[MEMORY MANAGER TESTS]');
        
        // Test 1: Stat recording
        TestFramework.test('Stats recorded correctly', () => {
            MockGame.setupFullGame(); // Set up Game global
            MockGame.resetMemory();
            
            MemoryManager.recordStat('test', 'metric1', 100);
            MemoryManager.recordStat('test', 'metric1', 200);
            
            const stats = MemoryManager.getStat('test', 'metric1');
            
            TestFramework.assert(stats.length === 2, 'Should have 2 stat entries');
            TestFramework.assert(stats[0].value === 100, 'First value correct');
            TestFramework.assert(stats[1].value === 200, 'Second value correct');
            
            return true;
        }, results);
        
        // Test 2: Stat history limit
        TestFramework.test('Stat history limited to 1000 entries', () => {
            MockGame.setupFullGame(); // Set up Game global
            MockGame.resetMemory();
            
            for (let i = 0; i < 1500; i++) {
                MemoryManager.recordStat('test', 'overflow', i);
            }
            
            const stats = Memory.engine.stats.test.overflow;
            
            TestFramework.assert(stats.length === 1000, 'Should be limited to 1000 entries');
            TestFramework.assert(stats[0].value === 500, 'Oldest entries should be removed');
            
            return true;
        }, results);
        
        // Test 3: Creep initialization
        TestFramework.test('Creep memory initialized correctly', () => {
            MockGame.setupFullGame(); // Set up Game global
            const mockCreep = MockGame.createMockCreep();
            
            MemoryManager.initCreep(mockCreep, 'harvester', 'W1N1');
            
            TestFramework.assert(mockCreep.memory.role === 'harvester', 'Role set correctly');
            TestFramework.assert(mockCreep.memory.working === false, 'Working state initialized');
            TestFramework.assert(mockCreep.memory.stats !== undefined, 'Stats object created');
            
            return true;
        }, results);
    }
    
    /**
     * Test Analytics Module
     */
    static runAnalyticsTests(results) {
        console.log('\n[ANALYTICS TESTS]');
        
        // Test 1: Trend calculation
        TestFramework.test('Trend calculation works correctly', () => {
            const data = [
                { tick: 1, value: 10 },
                { tick: 2, value: 20 },
                { tick: 3, value: 30 },
                { tick: 4, value: 40 }
            ];
            
            const trend = Analytics.calculateTrend(data);
            
            // With indices 0,1,2,3 the line is y = 10x + 10
            TestFramework.assert(trend.slope === 10, 'Slope should be 10 (linear increase)');
            TestFramework.assert(Math.abs(trend.intercept - 10) < 0.1, 'Intercept should be 10');
            
            return true;
        }, results);
        
        // Test 2: Prediction
        TestFramework.test('Prediction forecasts future values', () => {
            MockGame.setupFullGame(); // Set up Game global
            MockGame.resetMemory();
            
            // Create upward trend
            for (let i = 0; i < 50; i++) {
                MemoryManager.recordStat('test', 'energy', 100 + i * 10);
            }
            
            const prediction = Analytics.predict('test', 'energy', 10);
            
            TestFramework.assert(prediction !== null, 'Should return prediction');
            TestFramework.assert(prediction.value > 600, 'Should predict higher value');
            TestFramework.assert(prediction.confidence > 0, 'Should have confidence rating');
            
            return true;
        }, results);
    }
    
    /**
     * Test Role Behaviors
     */
    static runRoleTests(results) {
        console.log('\n[ROLE BEHAVIOR TESTS]');
        
        // Test 1: Harvester state machine
        TestFramework.test('Harvester switches states correctly', () => {
            const RoleHarvester = require('../src/role.harvester');
            const mockCreep = MockGame.createMockCreep({ 
                role: 'harvester',
                energy: 0,
                capacity: 50
            });
            
            TestFramework.assert(mockCreep.memory.working === false, 'Should start not working');
            
            // Fill creep
            mockCreep.store[RESOURCE_ENERGY] = 50;
            RoleHarvester.run(mockCreep, {});
            
            TestFramework.assert(mockCreep.memory.working === true, 'Should switch to working when full');
            
            return true;
        }, results);
        
        // Test 2: Role manager routing
        TestFramework.test('Role manager routes to correct handler', () => {
            const RoleManager = require('../src/role.manager');
            const mockCreep = MockGame.createMockCreep({ role: 'upgrader' });
            
            // This should not throw an error
            RoleManager.executeCreep(mockCreep, {});
            
            return true;
        }, results);
    }
    
    /**
     * Integration Tests
     */
    static runIntegrationTests(results) {
        console.log('\n[INTEGRATION TESTS]');
        
        // Test 1: Full game state evaluation
        TestFramework.test('Full game state evaluates without errors', () => {
            const Engine = require('../src/engine.core');
            MockGame.setupFullGame();
            
            const gameState = Engine.evaluateGameState();
            
            TestFramework.assert(gameState.score !== undefined, 'Should have overall score');
            TestFramework.assert(Object.keys(gameState.rooms).length > 0, 'Should have room data');
            
            return true;
        }, results);
        
        // Test 2: Strategy generation
        TestFramework.test('Strategy generation completes', () => {
            MockGame.setupFullGame(); // Set up Game global
            
            const gameState = MockGame.createGameState({
                rooms: {
                    'W1N1': {
                        control: { level: 3 },
                        resources: { sources: [1, 2], energy: 1000 }
                    }
                },
                threats: [] // Add empty threats array
            });
            
            const strategy = DecisionTree.generateStrategy(gameState);
            
            TestFramework.assert(strategy.priority !== undefined, 'Should have priorities');
            TestFramework.assert(strategy.spawning !== undefined, 'Should have spawn decisions');
            
            return true;
        }, results);
    }
}

// Run tests if executed directly
if (typeof module !== 'undefined' && require.main === module) {
    TestSuite.runAll();
}

module.exports = TestSuite;
