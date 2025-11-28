/**
 * MISSION CONTROL - Main Application
 * Coordinates all components
 */

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    startClock();
});

function initializeApp() {
    addConsoleMessage('system', 'INITIALIZING MISSION CONTROL...');
    window.WebSocket.init();
}

function setupEventListeners() {
    // Console input
    const consoleInput = document.getElementById('console-input');
    const consoleSend = document.getElementById('console-send');
    
    consoleSend.addEventListener('click', () => {
        const command = consoleInput.value.trim();
        if (command) {
            window.WebSocket.sendCommand(command);
            consoleInput.value = '';
        }
    });
    
    consoleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            consoleSend.click();
        }
    });
}

function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('timestamp').textContent = timeString;
}

function updateTelemetry(data) {
    // Update gauges
    window.Gauges.updateCPU(data.cpu, data.cpuLimit);
    window.Gauges.updateBucket(data.bucket);
    window.Gauges.updateEnergy(data.energy, data.energyCapacity);
    
    // Add to graphs
    window.Graphs.addCPUData(data.cpu);
    window.Graphs.addEnergyData(data.energy);
    
    // Update room info
    document.getElementById('room-name').textContent = data.room;
    document.getElementById('rcl-level').textContent = data.rcl;
    
    const rclPercent = ((data.rclProgress / data.rclProgressTotal) * 100).toFixed(2);
    document.getElementById('rcl-progress').textContent = rclPercent + '%';
    
    document.getElementById('creep-count').textContent = data.creepCount;
    document.getElementById('spawn-count').textContent = data.structures.spawns;
    document.getElementById('ext-count').textContent = data.structures.extensions;
    document.getElementById('tower-count').textContent = data.structures.towers;
    
    // Check for alerts
    if (data.cpu / data.cpuLimit > 0.9) {
        showAlert('HIGH CPU USAGE');
    }
    if (data.bucket < 1000) {
        showAlert('LOW BUCKET');
    }
    if (data.energy / data.energyCapacity < 0.2) {
        showAlert('LOW ENERGY');
    }
}

function updateStatus(data) {
    // Update version
    document.getElementById('engine-version').textContent = data.version;
    
    // Update creep roster
    const rosterContent = document.getElementById('creep-roster-content');
    rosterContent.innerHTML = '';
    
    for (const role in data.creeps.byRole) {
        const item = document.createElement('div');
        item.className = 'roster-item';
        item.textContent = `${role}: ${data.creeps.byRole[role]}`;
        rosterContent.appendChild(item);
    }
    
    // Update construction
    const constructionContent = document.getElementById('construction-content');
    constructionContent.innerHTML = '';
    
    if (data.construction.total === 0) {
        const item = document.createElement('div');
        item.className = 'construction-item';
        item.textContent = 'No active construction';
        item.style.color = '#8b92a0';
        constructionContent.appendChild(item);
    } else {
        for (const type in data.construction.byType) {
            const item = document.createElement('div');
            item.className = 'construction-item';
            item.textContent = `${type}: ${data.construction.byType[type]}`;
            constructionContent.appendChild(item);
        }
    }
}

function addConsoleMessage(type, message) {
    const output = document.getElementById('console-output');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = message;
    output.appendChild(line);
    
    // Auto-scroll to bottom
    output.scrollTop = output.scrollHeight;
    
    // Keep only last 100 lines
    while (output.children.length > 100) {
        output.removeChild(output.firstChild);
    }
}

function showAlert(message) {
    const alertBar = document.getElementById('alert-bar');
    const alertMessage = document.getElementById('alert-message');
    
    alertMessage.textContent = message;
    alertBar.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertBar.style.display = 'none';
    }, 5000);
}

// Quick command shortcuts
window.quickCommand = {
    status: () => window.WebSocket.sendCommand('status()'),
    profile: () => window.WebSocket.sendCommand('profile()'),
    debug: () => window.WebSocket.sendCommand('debug()'),
    strategy: () => window.WebSocket.sendCommand('strategy()')
};
