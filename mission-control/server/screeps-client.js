/**
 * SCREEPS CLIENT - API Wrapper
 * 
 * Handles communication with Screeps API
 * Provides methods for telemetry, status, and command execution
 */

const { ScreepsAPI } = require('screeps-api');

class ScreepsClient {
    constructor(credentials) {
        // Handle token-based or email/password authentication
        const apiConfig = {};
        
        if (credentials.token) {
            apiConfig.token = credentials.token;
        } else if (credentials.email && credentials.password) {
            apiConfig.email = credentials.email;
            apiConfig.password = credentials.password;
        } else {
            throw new Error('No valid credentials provided. Need token or email/password');
        }
        
        this.api = new ScreepsAPI(apiConfig);
        this.connected = false;
        this.memory = null;
        this.lastUpdate = null;
    }
    
    async connect() {
        try {
            // For token-based auth, we don't need to call auth()
            // The token is automatically used in API calls
            if (this.api.token) {
                // Test connection with a simple API call
                await this.api.me();
                this.connected = true;
                console.log('[Screeps Client] Token authentication successful');
            } else {
                // For email/password, we need to auth first
                await this.api.auth();
                this.connected = true;
                console.log('[Screeps Client] Email/password authentication successful');
            }
        } catch (error) {
            console.error('[Screeps Client] Authentication failed:', error.message);
            throw error;
        }
    }
    
    disconnect() {
        this.connected = false;
        console.log('[Screeps Client] Disconnected');
    }
    
    isConnected() {
        return this.connected;
    }
    
    /**
     * Get real-time telemetry (CPU, bucket, energy)
     */
    async getTelemetry(roomName, shard) {
        if (!this.connected) throw new Error('Not connected to Screeps API');
        
        try {
            // Get room terrain and objects
            const room = await this.api.getRoomTerrain(roomName, shard);
            const roomObjects = await this.api.getRoomObjects(roomName, shard);
            
            // Get user info for CPU/bucket
            const user = await this.api.me();
            
            // Parse room objects
            const creeps = roomObjects.filter(o => o.type === 'creep');
            const spawns = roomObjects.filter(o => o.type === 'spawn');
            const extensions = roomObjects.filter(o => o.type === 'extension');
            const towers = roomObjects.filter(o => o.type === 'tower');
            const controller = roomObjects.find(o => o.type === 'controller');
            
            // Calculate totals
            const totalEnergy = extensions.reduce((sum, e) => sum + (e.store?.energy || 0), 0)
                + spawns.reduce((sum, s) => sum + (s.store?.energy || 0), 0);
            const totalCapacity = extensions.reduce((sum, e) => sum + (e.storeCapacity || 0), 0)
                + spawns.reduce((sum, s) => sum + (s.storeCapacity || 0), 0);
            
            return {
                timestamp: Date.now(),
                room: roomName,
                shard: shard,
                cpu: user.cpu || 0,
                cpuLimit: user.cpuAvailable || 20,
                bucket: user.bucket || 0,
                energy: totalEnergy,
                energyCapacity: totalCapacity,
                rcl: controller?.level || 0,
                rclProgress: controller?.progress || 0,
                rclProgressTotal: controller?.progressTotal || 1,
                creepCount: creeps.length,
                structures: {
                    spawns: spawns.length,
                    extensions: extensions.length,
                    towers: towers.length
                }
            };
        } catch (error) {
            console.error('[Screeps Client] Telemetry error:', error.message);
            throw error;
        }
    }
    
    /**
     * Get full colony status (like status() command)
     */
    async getStatus(roomName, shard) {
        if (!this.connected) throw new Error('Not connected to Screeps API');
        
        try {
            const roomObjects = await this.api.getRoomObjects(roomName, shard);
            const memory = await this.api.memory.get('', shard);
            
            // Parse objects by type
            const creeps = roomObjects.filter(o => o.type === 'creep');
            const constructionSites = roomObjects.filter(o => o.type === 'constructionSite');
            const controller = roomObjects.find(o => o.type === 'controller');
            const mineral = roomObjects.find(o => o.type === 'mineral');
            
            // Group creeps by role
            const creepsByRole = {};
            creeps.forEach(c => {
                const role = c.name.split('_')[0]; // Extract role from name
                creepsByRole[role] = (creepsByRole[role] || 0) + 1;
            });
            
            // Group construction sites by type
            const sitesByType = {};
            constructionSites.forEach(s => {
                sitesByType[s.structureType] = (sitesByType[s.structureType] || 0) + 1;
            });
            
            return {
                timestamp: Date.now(),
                room: roomName,
                shard: shard,
                rcl: controller?.level || 0,
                rclProgress: controller?.progress || 0,
                rclProgressTotal: controller?.progressTotal || 1,
                mineral: mineral ? {
                    type: mineral.mineralType,
                    amount: mineral.mineralAmount
                } : null,
                creeps: {
                    total: creeps.length,
                    byRole: creepsByRole
                },
                construction: {
                    total: constructionSites.length,
                    byType: sitesByType
                },
                version: memory?.engine?.version || 'unknown'
            };
        } catch (error) {
            console.error('[Screeps Client] Status error:', error.message);
            throw error;
        }
    }
    
    /**
     * Get list of all controlled rooms
     */
    async getRooms(shard) {
        if (!this.connected) throw new Error('Not connected to Screeps API');
        
        try {
            const user = await this.api.me();
            // Screeps API doesn't directly list rooms, need to check memory
            const memory = await this.api.memory.get('', shard);
            
            // Extract rooms from Game.rooms memory structure
            const rooms = [];
            if (memory && memory.rooms) {
                for (const roomName in memory.rooms) {
                    rooms.push(roomName);
                }
            }
            
            return rooms;
        } catch (error) {
            console.error('[Screeps Client] Get rooms error:', error.message);
            throw error;
        }
    }
    
    /**
     * Execute console command
     */
    async executeCommand(command, shard) {
        if (!this.connected) throw new Error('Not connected to Screeps API');
        
        try {
            const result = await this.api.console(command, shard);
            return {
                ok: result.ok,
                output: result.results || [],
                error: result.error || null
            };
        } catch (error) {
            console.error('[Screeps Client] Command error:', error.message);
            throw error;
        }
    }
}

module.exports = ScreepsClient;
