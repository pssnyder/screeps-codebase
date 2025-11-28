/**
 * CONSOLE HELPER
 * 
 * Quick commands for testing and debugging in the console
 */

class ConsoleHelper {
    /**
     * Show all available commands
     */
    static help() {
        console.log('═══════════════════════════════════════════');
        console.log('🎮 SCREEPS ENGINE - Console Commands');
        console.log('═══════════════════════════════════════════');
        console.log('');
        console.log('📊 STATUS & INFO:');
        console.log('  help()           - Show this help');
        console.log('  status()         - Show colony status');
        console.log('  creeps()         - List all creeps');
        console.log('  strategy()       - Show current strategy');
        console.log('');
        console.log('🚀 SPAWNING:');
        console.log('  SpawnHelper.quick()  - Spawn commands');
        console.log('  SpawnHelper.h()      - Spawn harvester');
        console.log('  SpawnHelper.u()      - Spawn upgrader');
        console.log('  SpawnHelper.b()      - Spawn builder');
        console.log('  SpawnHelper.auto()   - Auto-spawn');
        console.log('');
        console.log('🧪 TESTING:');
        console.log('  testEngine.quick()   - Run quick tests');
        console.log('  Analytics.analyze()  - Force analytics');
        console.log('');
        console.log('🔧 DEBUG:');
        console.log('  Memory.engine        - View engine memory');
        console.log('  clear()              - Clear screen');
        console.log('═══════════════════════════════════════════');
    }
    
    /**
     * Show current colony status
     */
    static status() {
        console.log('═══════════════════════════════════════════');
        console.log(`📊 COLONY STATUS - Tick ${Game.time}`);
        console.log('═══════════════════════════════════════════');
        
        // Count creeps by role
        const creepsByRole = {};
        const creepsByRoom = {};
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            const role = creep.memory.role || 'unknown';
            const roomName = creep.memory.room || creep.room.name;
            
            creepsByRole[role] = (creepsByRole[role] || 0) + 1;
            
            if (!creepsByRoom[roomName]) creepsByRoom[roomName] = {};
            creepsByRoom[roomName][role] = (creepsByRoom[roomName][role] || 0) + 1;
        }
        
        console.log('');
        console.log('👥 CREEPS:');
        console.log(`  Total: ${Object.keys(Game.creeps).length}`);
        for (const role in creepsByRole) {
            console.log(`  ${role}: ${creepsByRole[role]}`);
        }
        
        console.log('');
        console.log('🏠 ROOMS:');
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            if (room.controller && room.controller.my) {
                const progress = room.controller.progress;
                const total = room.controller.progressTotal;
                const pct = total > 0 ? (progress / total * 100).toFixed(1) : 0;
                const sites = room.find(FIND_MY_CONSTRUCTION_SITES).length;
                
                console.log(`  ${roomName}:`);
                console.log(`    RCL: ${room.controller.level}`);
                console.log(`    Progress: ${pct}%`);
                console.log(`    Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`);
                console.log(`    Sources: ${room.find(FIND_SOURCES).length}`);
                console.log(`    Construction: ${sites} sites`);
                
                // Show creeps assigned to this room
                if (creepsByRoom[roomName]) {
                    const roomComp = Object.keys(creepsByRoom[roomName])
                        .map(r => `${r}:${creepsByRoom[roomName][r]}`)
                        .join(', ');
                    console.log(`    Creeps: ${roomComp}`);
                }
            }
        }
        
        console.log('');
        console.log(`⚡ CPU: ${Game.cpu.getUsed().toFixed(2)}/${Game.cpu.limit || 'unlimited'}`);
        console.log(`🪣 Bucket: ${Game.cpu.bucket}/10000`);
        
        // CPU trend warning
        if (Game.cpu.bucket < 5000) {
            console.log(`⚠️  WARNING: Low bucket! Consider optimizing.`);
        }
        
        console.log('═══════════════════════════════════════════');
    }
    
    /**
     * Show current strategy decisions
     */
    static strategy() {
        const lastDecision = Memory.engine.decisions ? 
            Memory.engine.decisions[Memory.engine.decisions.length - 1] : null;
        
        if (!lastDecision) {
            console.log('No strategy decisions yet!');
            return;
        }
        
        console.log('═══════════════════════════════════════════');
        console.log(`🎯 CURRENT STRATEGY - Tick ${lastDecision.tick}`);
        console.log('═══════════════════════════════════════════');
        console.log('');
        console.log('📋 PRIORITIES:');
        lastDecision.strategy.priority.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.type} (weight: ${p.weight})`);
        });
        
        console.log('');
        console.log('🚀 SPAWN QUEUE:');
        if (lastDecision.strategy.spawning.length === 0) {
            console.log('  No spawn needs');
        } else {
            lastDecision.strategy.spawning.slice(0, 5).forEach((s, i) => {
                console.log(`  ${i + 1}. ${s.role} in ${s.room} (priority: ${s.priority})`);
            });
        }
        
        console.log('');
        console.log(`📊 Score: ${lastDecision.score.toFixed(2)}`);
        console.log('═══════════════════════════════════════════');
    }
    
    /**
     * List all creeps with details
     */
    static creeps() {
        console.log('═══════════════════════════════════════════');
        console.log('👥 CREEP LIST');
        console.log('═══════════════════════════════════════════');
        
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            const role = creep.memory.role || 'unknown';
            const working = creep.memory.working ? '🔨' : '🔄';
            const capacity = creep.store.getCapacity(RESOURCE_ENERGY);
            const energy = capacity !== null ? `${creep.store.energy}/${capacity}` : 'spawning';
            const ttl = creep.ticksToLive;
            
            console.log(`${working} ${name}:`);
            console.log(`    Role: ${role} | Energy: ${energy} | TTL: ${ttl}`);
        }
        console.log('═══════════════════════════════════════════');
    }
    
    /**
     * Clear console (just log separator)
     */
    static clear() {
        console.log('\n\n\n\n\n\n\n\n\n\n');
    }
    
    /**
     * Kill a problematic creep
     */
    static kill(creepName) {
        const creep = Game.creeps[creepName];
        if (!creep) {
            console.log(`❌ Creep ${creepName} not found`);
            return;
        }
        creep.suicide();
        console.log(`💀 Killed ${creepName}`);
    }
}

// Expose to global scope
global.help = () => ConsoleHelper.help();
global.status = () => ConsoleHelper.status();
global.strategy = () => ConsoleHelper.strategy();
global.creeps = () => ConsoleHelper.creeps();
global.clear = () => ConsoleHelper.clear();
global.kill = (name) => ConsoleHelper.kill(name);

module.exports = ConsoleHelper;
