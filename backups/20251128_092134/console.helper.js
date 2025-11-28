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
        console.log('  status()         - Show colony status (v2.0 enhanced)');
        console.log('  profile()        - CPU profiling by module');
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
     * Show current colony status - v2.0 enhanced
     */
    static status() {
        console.log('═══════════════════════════════════════════');
        console.log('🧠 SCREEPS ENGINE v2.0 - COLONY STATUS');
        console.log('═══════════════════════════════════════════');
        
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            if (!room.controller?.my) continue;
            
            console.log(`\n🏰 Room: ${roomName} (RCL ${room.controller.level})`);
            
            // Energy Economy
            const energyPercent = (room.energyAvailable / room.energyCapacityAvailable * 100).toFixed(0);
            console.log(`  ⚡ Energy: ${room.energyAvailable}/${room.energyCapacityAvailable} (${energyPercent}%)`);
            
            if (room.storage) {
                const storageEnergy = room.storage.store[RESOURCE_ENERGY];
                const storageTotal = room.storage.store.getUsedCapacity();
                const storageCap = room.storage.store.getCapacity();
                console.log(`  📦 Storage: ${storageEnergy.toLocaleString()} energy (${storageTotal.toLocaleString()}/${storageCap.toLocaleString()} total)`);
                
                // Show other resources
                const otherResources = [];
                for (const resource in room.storage.store) {
                    if (resource !== RESOURCE_ENERGY && room.storage.store[resource] > 0) {
                        otherResources.push(`${resource}: ${room.storage.store[resource]}`);
                    }
                }
                if (otherResources.length > 0) {
                    console.log(`     Resources: ${otherResources.join(', ')}`);
                }
            }
            
            // Minerals
            const minerals = room.find(FIND_MINERALS);
            if (minerals.length > 0) {
                const m = minerals[0];
                const available = m.mineralAmount > 0 ? m.mineralAmount.toLocaleString() : 'depleted';
                const regen = m.mineralAmount === 0 ? ` (regen in ${m.ticksToRegeneration})` : '';
                console.log(`  💎 Mineral: ${m.mineralType} - ${available}${regen}`);
            }
            
            // Construction Progress
            const sites = room.find(FIND_MY_CONSTRUCTION_SITES);
            if (sites.length > 0) {
                console.log(`  🏗️  Construction: ${sites.length} site(s) active`);
                sites.forEach(s => {
                    const percent = (s.progress / s.progressTotal * 100).toFixed(0);
                    console.log(`     ${s.structureType}: ${percent}%`);
                });
            } else {
                console.log(`  🏗️  Construction: None`);
            }
            
            // Infrastructure
            const towers = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_TOWER });
            const extensions = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_EXTENSION });
            const maxExt = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
            const maxTower = CONTROLLER_STRUCTURES[STRUCTURE_TOWER][room.controller.level];
            console.log(`  🏢 Infrastructure: ${extensions.length}/${maxExt} ext, ${towers.length}/${maxTower} tower`);
            
            // Creep Population
            const creeps = room.find(FIND_MY_CREEPS);
            const byRole = {};
            creeps.forEach(c => {
                byRole[c.memory.role] = (byRole[c.memory.role] || 0) + 1;
            });
            console.log(`  🤖 Creeps: ${creeps.length} total`);
            for (const role in byRole) {
                console.log(`     ${role}: ${byRole[role]}`);
            }
            
            // Defense
            const hostiles = room.find(FIND_HOSTILE_CREEPS);
            if (hostiles.length > 0) {
                console.log(`  ⚔️  THREAT: ${hostiles.length} hostile(s)!`);
            } else {
                console.log(`  🛡️  Defense: All clear`);
            }
            
            // Controller
            const ctrlPercent = (room.controller.progress / room.controller.progressTotal * 100).toFixed(2);
            console.log(`  📈 Controller: ${ctrlPercent}% to RCL ${room.controller.level + 1}`);
            const downgrade = room.controller.ticksToDowngrade.toLocaleString();
            console.log(`     Downgrade: ${downgrade} ticks`);
        }
        
        // Performance
        console.log('\n⚙️  PERFORMANCE:');
        const cpuUsed = Game.cpu.getUsed().toFixed(2);
        const cpuPercent = (Game.cpu.getUsed() / Game.cpu.limit * 100).toFixed(0);
        console.log(`  CPU: ${cpuUsed}/${Game.cpu.limit} (${cpuPercent}%)`);
        console.log(`  Bucket: ${Game.cpu.bucket}/10000`);
        const memoryKB = (RawMemory.get().length / 1024).toFixed(0);
        console.log(`  Memory: ${memoryKB} KB`);
        
        // Alerts
        console.log('\n⚠️  ALERTS:');
        const alerts = [];
        
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            if (!room.controller?.my) continue;
            
            if (room.energyAvailable < room.energyCapacityAvailable * 0.3) {
                alerts.push(`${roomName}: Low energy (${(room.energyAvailable / room.energyCapacityAvailable * 100).toFixed(0)}%)`);
            }
            if (room.controller.ticksToDowngrade < 5000) {
                alerts.push(`${roomName}: Downgrade risk (${room.controller.ticksToDowngrade} ticks)`);
            }
            const creeps = room.find(FIND_MY_CREEPS);
            if (creeps.length < 4) {
                alerts.push(`${roomName}: Low creep count (${creeps.length})`);
            }
        }
        
        if (Game.cpu.bucket < 2000) {
            alerts.push('CRITICAL: CPU bucket low!');
        }
        if (Game.cpu.getUsed() > Game.cpu.limit * 0.9) {
            alerts.push('WARNING: CPU usage > 90%');
        }
        
        if (alerts.length === 0) {
            console.log('  ✅ All systems nominal');
        } else {
            alerts.forEach(alert => console.log(`  🔴 ${alert}`));
        }
        
        console.log('═══════════════════════════════════════════');
    }
    
    /**
     * CPU profiling by module - v2.0 new
     */
    static profile() {
        console.log('═══════════════════════════════════════════');
        console.log('⚡ CPU PROFILING - Last Tick');
        console.log('═══════════════════════════════════════════');
        
        if (!Memory.profiling) {
            console.log('\nProfiling not enabled.');
            console.log('Enable in main.js to see module CPU breakdown.');
            console.log('═══════════════════════════════════════════');
            return;
        }
        
        const profile = Memory.profiling;
        const total = profile.total || Game.cpu.getUsed();
        
        console.log(`\nTotal: ${total.toFixed(2)} CPU\n`);
        
        const modules = [];
        for (const key in profile) {
            if (key !== 'total' && key !== 'tick') {
                modules.push({
                    name: key,
                    cpu: profile[key],
                    percent: (profile[key] / total * 100)
                });
            }
        }
        
        modules.sort((a, b) => b.cpu - a.cpu);
        
        modules.forEach(m => {
            const bar = '█'.repeat(Math.ceil(m.percent / 5));
            console.log(`  ${m.name.padEnd(20)} ${m.cpu.toFixed(2).padStart(6)} CPU  ${m.percent.toFixed(1).padStart(5)}%  ${bar}`);
        });
        
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
global.profile = () => ConsoleHelper.profile();
global.strategy = () => ConsoleHelper.strategy();
global.creeps = () => ConsoleHelper.creeps();
global.clear = () => ConsoleHelper.clear();
global.kill = (name) => ConsoleHelper.kill(name);

module.exports = ConsoleHelper;
