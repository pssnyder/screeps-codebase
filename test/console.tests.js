/**
 * IN-GAME TEST COMMANDS
 * 
 * Copy these functions into your Screeps console to test the engine
 * Use: testEngine.quick() for basic health check
 */

const testEngine = {
    /**
     * Quick health check - run this first!
     */
    quick: function() {
        console.log('=== SCREEPS ENGINE HEALTH CHECK ===\n');
        
        const results = [];
        
        // Test 1: Engine initialized
        if (Memory.engine) {
            results.push('✓ Engine initialized');
            results.push(`  Version: ${Memory.engine.version}`);
            results.push(`  Started: Tick ${Memory.engine.initialized}`);
        } else {
            results.push('✗ Engine not initialized!');
            return results.join('\n');
        }
        
        // Test 2: Creeps exist
        const creepCount = Object.keys(Game.creeps).length;
        if (creepCount > 0) {
            results.push(`✓ ${creepCount} creeps active`);
            
            // Count by role
            const roles = {};
            Object.values(Game.creeps).forEach(c => {
                const role = c.memory.role || 'unknown';
                roles[role] = (roles[role] || 0) + 1;
            });
            results.push('  Roles: ' + JSON.stringify(roles));
        } else {
            results.push('⚠ No creeps yet (may be early game)');
        }
        
        // Test 3: Rooms controlled
        const myRooms = Object.values(Game.rooms).filter(r => r.controller && r.controller.my);
        if (myRooms.length > 0) {
            results.push(`✓ ${myRooms.length} rooms controlled`);
            myRooms.forEach(r => {
                results.push(`  ${r.name}: RCL ${r.controller.level}, ${r.energyAvailable}/${r.energyCapacityAvailable} energy`);
            });
        } else {
            results.push('✗ No rooms controlled!');
        }
        
        // Test 4: CPU health
        const cpuUsage = (Game.cpu.getUsed() / Game.cpu.limit * 100).toFixed(1);
        if (cpuUsage < 80) {
            results.push(`✓ CPU healthy: ${cpuUsage}% of limit`);
        } else {
            results.push(`⚠ CPU high: ${cpuUsage}% of limit`);
        }
        results.push(`  Bucket: ${Game.cpu.bucket}`);
        
        // Test 5: Analytics working
        if (Memory.engine.stats && Object.keys(Memory.engine.stats).length > 0) {
            results.push('✓ Analytics collecting data');
            results.push(`  Categories: ${Object.keys(Memory.engine.stats).length}`);
        } else {
            results.push('⚠ No analytics data yet');
        }
        
        // Test 6: Decisions being made
        if (Memory.engine.decisions && Memory.engine.decisions.length > 0) {
            results.push(`✓ Decision system active (${Memory.engine.decisions.length} decisions)`);
        } else {
            results.push('⚠ No decisions recorded yet');
        }
        
        results.push('\n=== OVERALL STATUS: ' + (results.filter(r => r.includes('✗')).length === 0 ? 'HEALTHY' : 'NEEDS ATTENTION') + ' ===');
        
        return results.join('\n');
    },
    
    /**
     * Test evaluation system
     */
    evaluationTest: function(roomName) {
        const Evaluator = require('evaluator');
        const room = Game.rooms[roomName || Object.keys(Game.rooms)[0]];
        
        if (!room) {
            return 'Error: Room not found';
        }
        
        console.log(`\n=== ROOM EVALUATION: ${room.name} ===\n`);
        
        const evaluation = Evaluator.evaluateRoom(room);
        
        console.log('Overall Score:', evaluation.score);
        console.log('\nControl:');
        console.log('  Level:', evaluation.control.level);
        console.log('  Progress:', evaluation.control.progressPercent.toFixed(1) + '%');
        
        console.log('\nResources:');
        console.log('  Sources:', evaluation.resources.sources.length);
        console.log('  Stored Energy:', evaluation.resources.stored);
        
        console.log('\nInfrastructure:');
        console.log('  Spawns:', evaluation.infrastructure.spawns);
        console.log('  Extensions:', evaluation.infrastructure.extensions);
        console.log('  Towers:', evaluation.infrastructure.towers);
        console.log('  Storage:', evaluation.infrastructure.storage ? 'Yes' : 'No');
        
        console.log('\nMilitary:');
        console.log('  Defense Score:', evaluation.military.defense);
        console.log('  Threats:', evaluation.military.threats.length);
        
        console.log('\nEconomy:');
        console.log('  Income Rate:', evaluation.economy.income);
        console.log('  Harvesters:', evaluation.economy.harvesters);
        console.log('  Upgraders:', evaluation.economy.upgraders);
        console.log('  Builders:', evaluation.economy.builders);
        
        return evaluation;
    },
    
    /**
     * Test decision making
     */
    decisionTest: function() {
        const Engine = require('engine.core');
        const DecisionTree = require('decision.tree');
        
        console.log('\n=== DECISION SYSTEM TEST ===\n');
        
        const gameState = Engine.evaluateGameState();
        console.log('Game State Score:', gameState.score);
        
        const strategy = DecisionTree.generateStrategy(gameState);
        
        console.log('\nStrategic Priorities:');
        strategy.priority.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.type} (weight: ${p.weight})`);
        });
        
        console.log('\nSpawn Queue:');
        strategy.spawning.slice(0, 5).forEach((s, i) => {
            console.log(`  ${i + 1}. ${s.role} (priority: ${s.priority}) - ${s.body.length} parts`);
        });
        
        console.log('\nDefense Status:', strategy.defense.active ? 'ACTIVE' : 'Passive');
        console.log('Expansion:', strategy.expansion ? 'Recommended' : 'Not yet');
        
        return strategy;
    },
    
    /**
     * Test analytics
     */
    analyticsTest: function() {
        const Analytics = require('analytics');
        
        console.log('\n=== ANALYTICS TEST ===\n');
        
        // Show available metrics
        const stats = Memory.engine.stats;
        console.log('Data Categories:', Object.keys(stats).length);
        
        for (const category in stats) {
            console.log(`\n${category.toUpperCase()}:`);
            for (const metric in stats[category]) {
                const data = stats[category][metric];
                console.log(`  ${metric}: ${data.length} data points`);
                
                if (data.length > 0) {
                    const latest = data[data.length - 1];
                    console.log(`    Latest: ${latest.value} (tick ${latest.tick})`);
                }
            }
        }
        
        // Run analysis
        console.log('\n--- Running Analysis ---');
        const insights = Analytics.analyze();
        
        if (insights.anomalies.length > 0) {
            console.log('\nAnomalies:');
            insights.anomalies.forEach(a => console.log('  ⚠', a));
        }
        
        if (insights.recommendations.length > 0) {
            console.log('\nRecommendations:');
            insights.recommendations.forEach(r => console.log('  →', r));
        }
        
        return insights;
    },
    
    /**
     * Test specific creep
     */
    creepTest: function(creepName) {
        const creep = Game.creeps[creepName];
        
        if (!creep) {
            // List available creeps
            console.log('Available creeps:');
            Object.keys(Game.creeps).forEach(name => {
                const c = Game.creeps[name];
                console.log(`  ${name} (${c.memory.role})`);
            });
            return 'Specify a creep name';
        }
        
        console.log(`\n=== CREEP TEST: ${creep.name} ===\n`);
        
        const Evaluator = require('evaluator');
        const evaluation = Evaluator.evaluateCreep(creep);
        
        console.log('Role:', creep.memory.role);
        console.log('Body:', creep.body.map(p => p.type).join(', '));
        console.log('Body Value:', evaluation.value);
        console.log('Energy:', creep.store[RESOURCE_ENERGY], '/', creep.store.getCapacity());
        console.log('Lifetime:', creep.ticksToLive, '/', CREEP_LIFE_TIME, `(${evaluation.efficiency.toFixed(1)}%)`);
        console.log('Overall Score:', evaluation.score.toFixed(1));
        
        console.log('\nMemory:');
        console.log('  Working:', creep.memory.working);
        console.log('  Target:', creep.memory.targetId);
        console.log('  Source:', creep.memory.sourceId);
        
        console.log('\nStats:');
        for (const stat in creep.memory.stats) {
            console.log(`  ${stat}: ${creep.memory.stats[stat]}`);
        }
        
        return evaluation;
    },
    
    /**
     * Performance test
     */
    performanceTest: function() {
        console.log('\n=== PERFORMANCE TEST ===\n');
        
        const samples = 10;
        const cpuSamples = [];
        
        const Engine = require('engine.core');
        
        console.log(`Running ${samples} engine cycles...`);
        
        for (let i = 0; i < samples; i++) {
            const start = Game.cpu.getUsed();
            Engine.evaluateGameState();
            const used = Game.cpu.getUsed() - start;
            cpuSamples.push(used);
        }
        
        const avg = cpuSamples.reduce((a, b) => a + b) / cpuSamples.length;
        const max = Math.max(...cpuSamples);
        const min = Math.min(...cpuSamples);
        
        console.log('\nResults:');
        console.log('  Average CPU:', avg.toFixed(3));
        console.log('  Max CPU:', max.toFixed(3));
        console.log('  Min CPU:', min.toFixed(3));
        console.log('  Total limit:', Game.cpu.limit);
        console.log('  Usage:', (avg / Game.cpu.limit * 100).toFixed(1) + '%');
        
        return {
            average: avg,
            max: max,
            min: min,
            percentage: (avg / Game.cpu.limit * 100)
        };
    },
    
    /**
     * Show trends
     */
    trends: function(category, metric, ticks = 20) {
        const MemoryManager = require('memory.manager');
        const data = MemoryManager.getStat(category, metric, ticks);
        
        if (data.length === 0) {
            return `No data for ${category}.${metric}`;
        }
        
        console.log(`\n=== TREND: ${category}.${metric} (last ${ticks} ticks) ===\n`);
        
        // Simple text graph
        const values = data.map(d => d.value);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min;
        
        console.log('Latest:', values[values.length - 1]);
        console.log('Min:', min);
        console.log('Max:', max);
        console.log('Range:', range);
        
        // Calculate trend
        const Analytics = require('analytics');
        const trend = Analytics.calculateTrend(data);
        console.log('Slope:', trend.slope.toFixed(3), trend.slope > 0 ? '(increasing)' : '(decreasing)');
        
        return { data, trend };
    }
};

// Export for console use
module.exports = testEngine;

// Also make globally available if running in game
if (typeof global !== 'undefined') {
    global.testEngine = testEngine;
}
