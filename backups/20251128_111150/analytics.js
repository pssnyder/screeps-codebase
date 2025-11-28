/**
 * ANALYTICS ENGINE
 * 
 * Data science and machine learning framework
 * Collects metrics, identifies patterns, and enables adaptive behavior
 */

const MemoryManager = require('./memory.manager');

class Analytics {
    /**
     * Record metrics for current tick - v2.0 optimized
     * Only record every 10 ticks (1 tick = ~3 seconds, so this is every 30 sec)
     */
    static recordTick() {
        // Only record stats every 10 ticks to save CPU
        if (Game.time % 10 !== 0) return;
        
        // Count creeps by role (simplified)
        const totalCreeps = Object.keys(Game.creeps).length;
        
        // Record total energy across all rooms (optimized loop)
        let totalEnergy = 0;
        let totalStorage = 0;
        
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            if (room.controller && room.controller.my) {
                totalEnergy += room.energyAvailable;
                if (room.storage) {
                    totalStorage += room.storage.store.energy;
                }
            }
        }
        
        // Store only essential metrics (reduced from 8+ to 4)
        MemoryManager.recordStat('economy', 'totalEnergy', totalEnergy);
        MemoryManager.recordStat('economy', 'totalStorage', totalStorage);
        MemoryManager.recordStat('population', 'totalCreeps', totalCreeps);
        MemoryManager.recordStat('performance', 'cpu', Game.cpu.getUsed());
        
        // Skip per-role tracking and bucket tracking to save CPU
        // Can add back if needed, but these are rarely used
    }
    
    /**
     * Analyze collected data and generate insights
     * This is where machine learning patterns can be applied
     */
    static analyze() {
        const insights = {
            trends: {},
            anomalies: [],
            recommendations: []
        };
        
        // Analyze energy trends
        const energyHistory = MemoryManager.getStat('economy', 'totalEnergy', 100);
        if (energyHistory.length > 10) {
            const trend = this.calculateTrend(energyHistory);
            insights.trends.energy = trend;
            
            if (trend.slope < -5) {
                insights.anomalies.push('Energy declining rapidly');
                insights.recommendations.push('Spawn more harvesters');
            }
        }
        
        // Analyze CPU efficiency
        const cpuHistory = MemoryManager.getStat('performance', 'cpu', 100);
        if (cpuHistory.length > 10) {
            const avgCpu = cpuHistory.reduce((sum, s) => sum + s.value, 0) / cpuHistory.length;
            insights.trends.cpu = { average: avgCpu };
            
            if (avgCpu > Game.cpu.limit * 0.9) {
                insights.anomalies.push('CPU usage high');
                insights.recommendations.push('Optimize code or reduce creep count');
            }
        }
        
        // Log insights
        if (insights.anomalies.length > 0) {
            console.log(`[Analytics] Anomalies detected: ${insights.anomalies.join(', ')}`);
        }
        if (insights.recommendations.length > 0) {
            console.log(`[Analytics] Recommendations: ${insights.recommendations.join(', ')}`);
        }
        
        return insights;
    }
    
    /**
     * Calculate linear trend from time series data
     * Simple linear regression for trend analysis
     */
    static calculateTrend(data) {
        if (data.length < 2) return { slope: 0, intercept: 0 };
        
        const n = data.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        
        data.forEach((point, i) => {
            sumX += i;
            sumY += point.value;
            sumXY += i * point.value;
            sumX2 += i * i;
        });
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return { slope, intercept };
    }
    
    /**
     * Predict future values based on trends
     * Basic forecasting using linear extrapolation
     */
    static predict(category, key, ticksAhead = 10) {
        const history = MemoryManager.getStat(category, key, 100);
        if (history.length < 10) return null;
        
        const trend = this.calculateTrend(history);
        const lastTick = history[history.length - 1].tick;
        const prediction = trend.slope * (lastTick + ticksAhead) + trend.intercept;
        
        return {
            value: prediction,
            confidence: Math.min(history.length / 100, 1.0)
        };
    }
}

module.exports = Analytics;
