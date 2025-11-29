# Screeps Market Operations Strategy Guide
**Version: 2.0 Alpha**  
**Author: Pat Snyder**  
**Last Updated: November 29, 2025**

---

## 📊 Table of Contents
1. [Market Overview](#market-overview)
2. [Prerequisites & Requirements](#prerequisites--requirements)
3. [Market Fundamentals](#market-fundamentals)
4. [Trading Strategies](#trading-strategies)
5. [API Integration](#api-integration)
6. [Economic Formulas](#economic-formulas)
7. [Commodity Trading](#commodity-trading)
8. [Automated Trading Patterns](#automated-trading-patterns)
9. [Risk Management](#risk-management)
10. [Advanced Strategies](#advanced-strategies)

---

## Market Overview

The Screeps market is an MMO-wide economic system where players trade resources, minerals, and commodities using **Credits** as currency. This creates a real-time economy similar to stock markets, with supply/demand dynamics, arbitrage opportunities, and strategic resource manipulation.

### Why Market Operations Matter Early
- **Capital Accumulation**: Convert surplus resources into credits early
- **Resource Acquisition**: Buy critical minerals not available in your starting area
- **Economic Warfare**: Manipulate prices to disadvantage competitors
- **Passive Income**: Create buy/sell spreads for profit
- **Technology Acceleration**: Trade commodities to unlock advanced features faster

---

## Prerequisites & Requirements

### Structural Requirements
| Requirement | RCL | Notes |
|------------|-----|-------|
| **Terminal** | RCL 6 | Core trading structure (300,000 capacity) |
| **Storage** | RCL 4 | Recommended for resource buffering (1M capacity) |
| **Factory** | RCL 7 | Optional: For commodity production |
| **Labs** | RCL 6 | Optional: For compound production |

### Credit Acquisition (Cold Start Problem)
Since you need credits to trade, but trading generates credits, early-game options:
1. **Sell to NPC Terminals**: Located at highway crossroads (W0N0, W10N0, etc.)
   - Lower prices but guaranteed liquidity
   - No need to wait for player orders
2. **Create Sell Orders**: List resources at attractive prices
   - Buyer pays transfer costs
   - 5% fee deducted from proceeds
3. **Initial Capital**: Consider buying starter credits if game allows

### Energy Requirements
Terminal operations require energy for transfers:
```javascript
// Energy cost formula (see API section)
transferCost = Math.ceil(amount * (1 - Math.exp(-distance/30)))
```

---

## Market Fundamentals

### Market Mechanics

#### Order Types
```javascript
// Sell Order: You have resources, want credits
Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_UTRIUM,
    price: 9.95,              // Credits per unit
    totalAmount: 10000,
    roomName: "W1N1"
});

// Buy Order: You have credits, want resources  
Game.market.createOrder({
    type: ORDER_BUY,
    resourceType: RESOURCE_LEMERGIUM,
    price: 8.50,
    totalAmount: 5000,
    roomName: "W1N1"
});
```

#### Fee Structure
- **Order Creation**: 5% of `(price × totalAmount)`
- **Price Increase**: 5% of `(newPrice - oldPrice) × remainingAmount`
- **Transfer Energy**: Paid by deal executor, NOT order owner

#### Transaction Execution
```javascript
// Execute someone else's order
Game.market.deal(
    orderId,           // From getAllOrders()
    amount,            // Units to trade
    "W1N1"            // Your terminal room
);
```

**Critical**: The executor pays energy transfer costs, even when buying from a sell order!

---

## Market Fundamentals (Continued)

### Resource Categories

#### Base Minerals (Tier 0)
Harvested from mineral deposits, foundation of all trading:
- **H** (Hydrogen), **O** (Oxygen), **U** (Utrium), **L** (Lemergium)
- **K** (Keanium), **Z** (Zynthium), **X** (Catalyst), **G** (Ghodium)

**Market Strategy**: 
- High volume, low margin
- Great for early capital accumulation
- Geographic arbitrage (some minerals rare in certain sectors)

#### Compounds (Tier 1-3)
Lab-produced combinations (e.g., UH, ZK, GH2O, XGH2O):
- **Tier 1**: 2 base minerals (10 tick cooldown)
- **Tier 2**: Tier 1 + base minerals (20+ tick cooldown) 
- **Tier 3**: Tier 2 + minerals (60+ tick cooldown)

**Market Strategy**:
- Higher margins than base minerals
- Time investment creates barrier to entry
- Used for creep boosting (high demand in warfare)

#### Commodities (Tier 1-5)
Factory-produced trade goods (requires RCL 7):
- **Mechanical**: wire → switch → transistor → microchip → circuit → device
- **Biological**: cell → phlegm → tissue → muscle → organoid → organism
- **Metallurgical**: alloy → tube → fixtures → frame → hydraulics → machine
- **Mystical**: condensate → concentrate → extract → spirit → emanation → essence

**Market Strategy**:
- Highest margins (tier 5 commodities are very valuable)
- Complex production chains = scarcity premium
- End-game focus for established economies

---

## Trading Strategies

### 1. Geographic Arbitrage
Exploit price differences between room locations:

```javascript
// Find cheap source far away
const cheapOrders = Game.market.getAllOrders({
    type: ORDER_SELL,
    resourceType: RESOURCE_UTRIUM
}).sort((a, b) => a.price - b.price);

// Calculate profit after transfer costs
for (let order of cheapOrders) {
    const transferCost = Game.market.calcTransactionCost(
        1000, 
        "W1N1",      // Your room
        order.roomName
    );
    
    const totalCost = (order.price * 1000) + (transferCost * energyPrice);
    const revenue = mySellingPrice * 1000;
    const profit = revenue - totalCost - (order.price * 1000 * 0.05); // 5% fee
    
    if (profit > threshold) {
        // Execute trade
        Game.market.deal(order.id, 1000, "W1N1");
    }
}
```

### 2. Market Making (Bid-Ask Spread)
Place both buy and sell orders to profit from spread:

```javascript
// Create spread for Utrium
Game.market.createOrder({
    type: ORDER_BUY,
    resourceType: RESOURCE_UTRIUM,
    price: 8.00,              // Bid
    totalAmount: 5000,
    roomName: "W1N1"
});

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_UTRIUM,
    price: 10.00,             // Ask (25% spread)
    totalAmount: 5000,
    roomName: "W1N1"
});

// Profit per unit: 2.00 credits (minus fees)
// Requires active inventory management
```

**Key Metrics**:
- Spread: `(ask - bid) / bid * 100` (aim for 20-30% on minerals)
- Turnover: How quickly inventory cycles
- Inventory risk: Holding costs in terminal capacity

### 3. Vertical Integration
Control entire production chain:

```javascript
// Mine Utrium (U) + Lemergium (L)
// ↓
// Lab produces UL (Utrium Lemergite)
// ↓
// Sell UL at premium (2-3x base mineral cost)
// ↓
// Buy back U + L if prices drop

// Profit: Value-added processing
// Barrier: Requires labs (RCL 6) and production time
```

### 4. Seasonal Trading
Exploit predictable market cycles:

- **War Seasons**: Boost compounds spike (XGH2O, XZHO2, XLHO2)
- **Expansion Waves**: Energy and basic minerals surge
- **Post-Reset**: Commodities crash, minerals rise
- **RCL Thresholds**: Demand patterns around RCL 3,5,6,8 milestones

**Implementation**: Track historical prices with `Game.market.getHistory()`

### 5. NPC Terminal Arbitrage
NPC terminals have fixed (but varying) prices:

```javascript
// Find NPC terminals at highway crossroads
const npcRooms = ['E0N0', 'E0N10', 'E10N0', 'E10N10']; // etc.

// Check NPC orders
const npcOrders = Game.market.getAllOrders({
    type: ORDER_SELL,
    resourceType: RESOURCE_HYDROGEN
}).filter(order => npcRooms.includes(order.roomName));

// Compare to player market
// Buy from NPC if cheaper, sell to players
```

---

## API Integration

### Core Market Functions

#### Get All Orders (with Smart Filtering)
```javascript
// SLOW: Returns entire market (thousands of orders)
const allOrders = Game.market.getAllOrders();

// FAST: Use built-in indexing
const sellOrders = Game.market.getAllOrders({
    type: ORDER_SELL,
    resourceType: RESOURCE_GHODIUM
});

// CUSTOM: Complex filtering
const profitableDeals = Game.market.getAllOrders(order => {
    return order.type === ORDER_SELL &&
           order.resourceType === RESOURCE_UTRIUM &&
           order.price < 5.0 &&
           Game.market.calcTransactionCost(
               order.amount,
               "W1N1",
               order.roomName
           ) < 500;
});
```

#### Calculate Transfer Costs
```javascript
// Energy cost formula
const cost = Game.market.calcTransactionCost(
    amount,        // Number of resource units
    roomName1,     // Source room
    roomName2      // Destination room
);

// Formula: Math.ceil(amount * (1 - Math.exp(-distance/30)))
// Example: 1000 units over 10 rooms ≈ 284 energy
```

#### Execute Trades
```javascript
// Deal with existing order
const result = Game.market.deal(
    orderId,           // "5bfc2c9bd719fb605037c06d"
    1000,              // Amount to trade
    "W1N1"            // Your terminal room
);

if (result === OK) {
    console.log("Trade executed successfully");
} else if (result === ERR_TIRED) {
    console.log("Terminal cooling down (10 tick cooldown)");
} else if (result === ERR_NOT_ENOUGH_RESOURCES) {
    console.log("Insufficient resources or energy");
}
```

#### Manage Your Orders
```javascript
// View your active orders
console.log(JSON.stringify(Game.market.orders, null, 2));

// Cancel order (5% fee not refunded)
Game.market.cancelOrder(orderId);

// Change price (costs 5% of price increase)
Game.market.changeOrderPrice(orderId, newPrice);

// Extend order capacity
Game.market.extendOrder(orderId, additionalAmount); // 5% fee on addition
```

#### Transaction History
```javascript
// Incoming transactions (last 100)
Game.market.incomingTransactions.forEach(tx => {
    console.log(`Received ${tx.amount} ${tx.resourceType} from ${tx.sender.username}`);
});

// Outgoing transactions (last 100)
Game.market.outgoingTransactions.forEach(tx => {
    console.log(`Sent ${tx.amount} ${tx.resourceType} to ${tx.recipient.username}`);
});
```

#### Price History
```javascript
// Get 14-day price history
const history = Game.market.getHistory(RESOURCE_UTRIUM);

history.forEach(day => {
    console.log(`${day.date}: ${day.avgPrice} credits (${day.volume} volume, ${day.transactions} tx)`);
});

// Calculate moving averages for trading signals
const prices = history.map(d => d.avgPrice);
const ma7 = prices.slice(-7).reduce((a,b) => a+b) / 7;
const ma14 = prices.reduce((a,b) => a+b) / 14;

if (ma7 > ma14) {
    console.log("Bullish signal - consider buying");
} else {
    console.log("Bearish signal - consider selling");
}
```

---

## Economic Formulas

### Profitability Analysis

#### Basic Profit Calculation
```javascript
function calculateProfit(order, amount, myRoom) {
    // Costs
    const purchaseCost = order.price * amount;
    const creationFee = purchaseCost * 0.05;  // Only if creating order
    const transferCost = Game.market.calcTransactionCost(
        amount, 
        myRoom, 
        order.roomName
    );
    const energyCost = transferCost * energyMarketPrice;
    
    // Revenue
    const sellingPrice = mySellingPrice * amount;
    
    // Net profit
    const profit = sellingPrice - purchaseCost - creationFee - energyCost;
    const margin = (profit / purchaseCost) * 100;
    
    return { profit, margin };
}
```

#### Break-Even Distance
```javascript
// Maximum distance to maintain profitability
function maxProfitableDistance(resourcePrice, energyPrice, margin) {
    // transferCost = amount * (1 - exp(-distance/30))
    // Solve for distance where profit = 0
    
    const maxEnergyCost = (resourcePrice * margin) / energyPrice;
    const distance = -30 * Math.log(1 - maxEnergyCost);
    
    return Math.floor(distance);
}

// Example: Utrium at 10 credits, energy at 0.5 credits, 20% margin
// maxDistance ≈ 6.7 rooms
```

#### Market Efficiency Ratio
```javascript
function marketEfficiency(resourceType) {
    const orders = Game.market.getAllOrders({
        resourceType: resourceType
    });
    
    const buyOrders = orders.filter(o => o.type === ORDER_BUY);
    const sellOrders = orders.filter(o => o.type === ORDER_SELL);
    
    if (!buyOrders.length || !sellOrders.length) return 0;
    
    const highestBid = Math.max(...buyOrders.map(o => o.price));
    const lowestAsk = Math.min(...sellOrders.map(o => o.price));
    
    // Spread percentage (lower = more efficient market)
    return ((lowestAsk - highestBid) / lowestAsk) * 100;
}

// Interpretation:
// < 5%:  Very efficient (mature market)
// 5-15%: Normal (opportunity for market making)
// > 15%: Inefficient (arbitrage opportunities)
```

---

## Commodity Trading

### Factory Production Chains

Factories (RCL 7) produce **commodities** - high-value trade goods:

#### Tier Progression
```javascript
const COMMODITY_CHAINS = {
    // Mechanical Chain (Silicon + Utrium)
    mechanical: [
        'wire',        // Tier 0: 20 units (8 tick cooldown)
        'switch',      // Tier 1: 5 units (70 tick cooldown)
        'transistor',  // Tier 2: 1 unit (59 tick cooldown)
        'microchip',   // Tier 3: 1 unit (250 tick cooldown)
        'circuit',     // Tier 4: 1 unit (800 tick cooldown)
        'device'       // Tier 5: 1 unit (600 tick cooldown)
    ],
    
    // Biological Chain (Biomass + Lemergium)
    biological: [
        'cell', 'phlegm', 'tissue', 'muscle', 'organoid', 'organism'
    ],
    
    // Metallurgical Chain (Metal + Zynthium)
    metallurgical: [
        'alloy', 'tube', 'fixtures', 'frame', 'hydraulics', 'machine'
    ],
    
    // Mystical Chain (Mist + Keanium)
    mystical: [
        'condensate', 'concentrate', 'extract', 'spirit', 'emanation', 'essence'
    ]
};
```

#### Production Economics
```javascript
// Example: Producing 'device' (Tier 5 mechanical)
const DEVICE_RECIPE = {
    inputs: {
        circuit: 1,           // Previous tier
        microchip: 3,
        crystal: 110,         // Cross-chain dependency
        ghodium_melt: 150,
        energy: 64
    },
    output: {
        device: 1
    },
    cooldown: 600,           // 600 ticks per unit
    level: 5                 // Factory must be level 5
};

// Cost calculation
function calculateProductionCost(commodity) {
    const recipe = COMMODITIES[commodity];
    let totalCost = 0;
    
    for (let [resource, amount] of Object.entries(recipe.components)) {
        const marketPrice = getAveragePrice(resource);
        totalCost += marketPrice * amount;
    }
    
    // Add factory operation time cost
    const timeCost = recipe.cooldown * CPU_COST_PER_TICK;
    
    return totalCost + timeCost;
}

// Profit margin
const productionCost = calculateProductionCost(RESOURCE_DEVICE);
const marketPrice = getAveragePrice(RESOURCE_DEVICE);
const profit = marketPrice - productionCost;
const margin = (profit / productionCost) * 100;

console.log(`Device margin: ${margin}%`);
// Typical margins: 40-100% for tier 4-5 commodities
```

### Commodity Trading Strategy
1. **Vertical Integration**: Produce full chain (wire → device)
2. **Specialization**: Focus on one chain, trade for others
3. **Market Timing**: Stockpile during surplus, sell during shortage
4. **Cross-Chain Arbitrage**: Some recipes need multiple chain outputs

---

## Automated Trading Patterns

### Trading Bot Architecture

```javascript
// market.manager.js - Autonomous trading system

class MarketManager {
    constructor() {
        this.config = {
            maxOrdersPerResource: 3,
            minProfitMargin: 0.15,        // 15%
            maxTransferDistance: 10,
            orderRefreshInterval: 1000,    // Ticks
            inventoryBuffer: 0.2           // 20% reserve
        };
    }
    
    run() {
        if (Game.time % this.config.orderRefreshInterval === 0) {
            this.updateMarketAnalysis();
            this.manageOrders();
            this.executeTrades();
        }
        
        this.monitorTransactions();
    }
    
    updateMarketAnalysis() {
        // Scan market, update price database
        for (let resource of TRADEABLE_RESOURCES) {
            const orders = Game.market.getAllOrders({
                resourceType: resource
            });
            
            Memory.market[resource] = {
                avgBuyPrice: this.calculateAvg(orders, ORDER_BUY),
                avgSellPrice: this.calculateAvg(orders, ORDER_SELL),
                volume: orders.reduce((sum, o) => sum + o.amount, 0),
                spread: this.calculateSpread(orders),
                timestamp: Game.time
            };
        }
    }
    
    manageOrders() {
        // Cancel unprofitable orders
        for (let orderId in Game.market.orders) {
            const order = Game.market.orders[orderId];
            
            if (!this.isOrderProfitable(order)) {
                console.log(`Canceling unprofitable order: ${orderId}`);
                Game.market.cancelOrder(orderId);
            }
        }
        
        // Create new orders based on inventory
        this.createSellOrders();
        this.createBuyOrders();
    }
    
    createSellOrders() {
        const terminal = Game.rooms['W1N1'].terminal;
        if (!terminal) return;
        
        for (let resource in terminal.store) {
            // Skip if we have enough sell orders
            const existingOrders = Object.values(Game.market.orders)
                .filter(o => o.type === ORDER_SELL && 
                           o.resourceType === resource);
            
            if (existingOrders.length >= this.config.maxOrdersPerResource) {
                continue;
            }
            
            // Check if we have surplus
            const amount = terminal.store[resource];
            const buffer = this.getInventoryTarget(resource) * this.config.inventoryBuffer;
            const surplus = amount - buffer;
            
            if (surplus > 1000) {
                const price = this.calculateOptimalSellPrice(resource);
                
                Game.market.createOrder({
                    type: ORDER_SELL,
                    resourceType: resource,
                    price: price,
                    totalAmount: Math.floor(surplus),
                    roomName: terminal.room.name
                });
                
                console.log(`Created sell order: ${surplus} ${resource} @ ${price}`);
            }
        }
    }
    
    createBuyOrders() {
        const priorityResources = this.getResourceNeeds();
        
        for (let [resource, amount] of Object.entries(priorityResources)) {
            const existingOrders = Object.values(Game.market.orders)
                .filter(o => o.type === ORDER_BUY && 
                           o.resourceType === resource);
            
            if (existingOrders.length > 0) continue;
            
            const price = this.calculateOptimalBuyPrice(resource);
            
            Game.market.createOrder({
                type: ORDER_BUY,
                resourceType: resource,
                price: price,
                totalAmount: amount,
                roomName: "W1N1"
            });
        }
    }
    
    executeTrades() {
        // Arbitrage opportunities
        const opportunities = this.findArbitrageOpportunities();
        
        for (let opp of opportunities) {
            if (opp.profit > 1000) {  // Min profit threshold
                const result = Game.market.deal(
                    opp.orderId,
                    opp.amount,
                    opp.myRoom
                );
                
                if (result === OK) {
                    console.log(`Arbitrage executed: ${opp.profit} credit profit`);
                }
            }
        }
    }
    
    findArbitrageOpportunities() {
        const opportunities = [];
        
        for (let resource of TRADEABLE_RESOURCES) {
            const sellOrders = Game.market.getAllOrders({
                type: ORDER_SELL,
                resourceType: resource
            }).sort((a, b) => a.price - b.price);
            
            const buyOrders = Game.market.getAllOrders({
                type: ORDER_BUY,
                resourceType: resource
            }).sort((a, b) => b.price - a.price);
            
            if (sellOrders.length === 0 || buyOrders.length === 0) continue;
            
            const cheapestSell = sellOrders[0];
            const highestBuy = buyOrders[0];
            
            // Check if we can buy cheap and sell high
            if (cheapestSell.price < highestBuy.price) {
                const amount = Math.min(
                    cheapestSell.amount,
                    highestBuy.amount,
                    1000  // Max trade size
                );
                
                const buyCost = cheapestSell.price * amount;
                const sellRevenue = highestBuy.price * amount;
                const transferCost = Game.market.calcTransactionCost(
                    amount,
                    cheapestSell.roomName,
                    highestBuy.roomName
                ) * this.getEnergyPrice();
                
                const profit = sellRevenue - buyCost - transferCost;
                const margin = profit / buyCost;
                
                if (margin > this.config.minProfitMargin) {
                    opportunities.push({
                        resource: resource,
                        orderId: cheapestSell.id,
                        amount: amount,
                        profit: profit,
                        margin: margin,
                        myRoom: "W1N1"
                    });
                }
            }
        }
        
        return opportunities.sort((a, b) => b.profit - a.profit);
    }
    
    calculateOptimalSellPrice(resource) {
        const market = Memory.market[resource];
        if (!market) return 1.0;
        
        // Price slightly below average to ensure sale
        const competitivePrice = market.avgSellPrice * 0.95;
        
        // But not below production cost
        const productionCost = this.getProductionCost(resource) * 1.1;
        
        return Math.max(competitivePrice, productionCost);
    }
    
    calculateOptimalBuyPrice(resource) {
        const market = Memory.market[resource];
        if (!market) return 1.0;
        
        // Price slightly above average to ensure purchase
        const competitivePrice = market.avgBuyPrice * 1.05;
        
        // But not above market value
        const marketCeiling = market.avgSellPrice * 0.9;
        
        return Math.min(competitivePrice, marketCeiling);
    }
    
    isOrderProfitable(order) {
        const market = Memory.market[order.resourceType];
        if (!market) return false;
        
        if (order.type === ORDER_SELL) {
            // Selling below market average is unprofitable
            return order.price >= market.avgSellPrice * 0.8;
        } else {
            // Buying above market average is unprofitable
            return order.price <= market.avgBuyPrice * 1.2;
        }
    }
    
    monitorTransactions() {
        // Track successful trades for analytics
        const recentTx = Game.market.outgoingTransactions.filter(
            tx => tx.time > Game.time - 100
        );
        
        if (recentTx.length > 0) {
            console.log(`Recent trades: ${recentTx.length}`);
            const revenue = recentTx.reduce(
                (sum, tx) => sum + (tx.order?.price || 0) * tx.amount, 
                0
            );
            console.log(`Revenue: ${revenue} credits`);
        }
    }
}

module.exports = MarketManager;
```

### Integration with Main Loop
```javascript
// main.js
const MarketManager = require('market.manager');

module.exports.loop = function() {
    // Initialize market manager
    if (!Memory.marketManager) {
        Memory.marketManager = new MarketManager();
    }
    
    // Run market operations every tick (with internal throttling)
    Memory.marketManager.run();
    
    // ... rest of game logic
};
```

---

## Risk Management

### Trading Risks & Mitigation

#### 1. Price Volatility
**Risk**: Prices crash after you stockpile  
**Mitigation**:
```javascript
// Stop-loss orders (manual)
function checkStopLoss(resource, purchasePrice) {
    const currentPrice = getAveragePrice(resource);
    const loss = (purchasePrice - currentPrice) / purchasePrice;
    
    if (loss > 0.20) {  // 20% stop-loss
        console.log(`Stop-loss triggered for ${resource}`);
        liquidateInventory(resource);
    }
}

// Diversification
const PORTFOLIO_ALLOCATION = {
    energy: 0.30,        // 30% in energy (stable)
    minerals: 0.40,      // 40% in minerals (medium volatility)
    compounds: 0.20,     // 20% in compounds (high margin)
    commodities: 0.10    // 10% in commodities (highest risk/reward)
};
```

#### 2. Liquidity Risk
**Risk**: Can't find buyers/sellers when needed  
**Mitigation**:
```javascript
// Check order book depth
function checkLiquidity(resource) {
    const orders = Game.market.getAllOrders({ resourceType: resource });
    const totalVolume = orders.reduce((sum, o) => sum + o.amount, 0);
    const avgOrderSize = totalVolume / orders.length;
    
    return {
        volume: totalVolume,
        depth: orders.length,
        avgSize: avgOrderSize,
        liquid: orders.length > 10 && totalVolume > 50000
    };
}

// Only trade liquid markets
const liquid = checkLiquidity(RESOURCE_UTRIUM);
if (!liquid.liquid) {
    console.log(`${RESOURCE_UTRIUM} market too thin, skipping trade`);
}
```

#### 3. Terminal Capacity
**Risk**: Terminal fills up, blocking operations  
**Mitigation**:
```javascript
// Reserve capacity management
const TERMINAL_CAPACITY = 300000;
const RESERVED_CAPACITY = 50000;  // Always keep 50k free

function canAcceptTrade(resource, amount) {
    const terminal = Game.rooms['W1N1'].terminal;
    const currentUsed = terminal.store.getUsedCapacity();
    const futureUsed = currentUsed + amount;
    
    return futureUsed <= (TERMINAL_CAPACITY - RESERVED_CAPACITY);
}

// Auto-liquidation when near capacity
if (terminal.store.getUsedCapacity() > 250000) {
    sellLowestValueResources();
}
```

#### 4. Order Fee Accumulation
**Risk**: 5% fees add up on order churn  
**Mitigation**:
```javascript
// Minimize order cancellations
const MIN_ORDER_LIFETIME = 10000;  // Ticks

function shouldCancelOrder(order) {
    const age = Game.time - order.created;
    
    // Don't cancel young orders (fees wasted)
    if (age < MIN_ORDER_LIFETIME) return false;
    
    // Only cancel if severely mispriced
    const marketPrice = getAveragePrice(order.resourceType);
    const priceDiff = Math.abs(order.price - marketPrice) / marketPrice;
    
    return priceDiff > 0.30;  // 30% mispriced
}
```

#### 5. Market Manipulation
**Risk**: Large players manipulate prices  
**Mitigation**:
```javascript
// Detect manipulation
function detectManipulation(resource) {
    const history = Game.market.getHistory(resource);
    const last3Days = history.slice(-3);
    
    // Check for abnormal price spikes
    const avgPrice = last3Days.reduce((sum, d) => sum + d.avgPrice, 0) / 3;
    const priceStdDev = calculateStdDev(last3Days.map(d => d.avgPrice));
    
    if (priceStdDev / avgPrice > 0.50) {  // 50% volatility
        console.log(`${resource} market shows manipulation signs`);
        return true;
    }
    
    return false;
}

// Avoid trading during manipulation
if (detectManipulation(RESOURCE_GHODIUM)) {
    console.log("Pausing Ghodium trades until market stabilizes");
}
```

---

## Advanced Strategies

### 1. Market Making (Providing Liquidity)
**Concept**: Simultaneously place buy/sell orders with a spread

```javascript
class LiquidityProvider {
    provideLiquidity(resource, spreadPercent = 0.15) {
        const marketPrice = getAveragePrice(resource);
        const spread = marketPrice * spreadPercent;
        
        const bidPrice = marketPrice - (spread / 2);
        const askPrice = marketPrice + (spread / 2);
        
        // Place both orders
        Game.market.createOrder({
            type: ORDER_BUY,
            resourceType: resource,
            price: bidPrice,
            totalAmount: 5000,
            roomName: "W1N1"
        });
        
        Game.market.createOrder({
            type: ORDER_SELL,
            resourceType: resource,
            price: askPrice,
            totalAmount: 5000,
            roomName: "W1N1"
        });
        
        console.log(`Market making ${resource}: ${bidPrice} / ${askPrice}`);
    }
}

// Profit: Earn spread on each round-trip
// Risk: Holding inventory if market moves against you
```

### 2. Statistical Arbitrage (Mean Reversion)
**Concept**: Prices revert to historical averages

```javascript
function meanReversionStrategy(resource) {
    const history = Game.market.getHistory(resource);
    const prices = history.map(d => d.avgPrice);
    
    const mean = prices.reduce((a, b) => a + b) / prices.length;
    const stdDev = calculateStdDev(prices);
    const currentPrice = prices[prices.length - 1];
    
    // Z-score (how many std devs from mean)
    const zScore = (currentPrice - mean) / stdDev;
    
    if (zScore < -1.5) {
        // Price abnormally low - buy signal
        console.log(`${resource} undervalued (z=${zScore}), buying`);
        createBuyOrder(resource, currentPrice * 1.05);
    } else if (zScore > 1.5) {
        // Price abnormally high - sell signal
        console.log(`${resource} overvalued (z=${zScore}), selling`);
        createSellOrder(resource, currentPrice * 0.95);
    }
}

// Run daily
if (Game.time % 10000 === 0) {
    TRADEABLE_RESOURCES.forEach(meanReversionStrategy);
}
```

### 3. Cornering the Market
**Concept**: Buy entire supply, control price (risky!)

```javascript
// WARNING: High risk, potentially game-breaking if successful
function cornerMarket(resource, targetControl = 0.70) {
    const allOrders = Game.market.getAllOrders({
        type: ORDER_SELL,
        resourceType: resource
    }).sort((a, b) => a.price - b.price);
    
    const totalSupply = allOrders.reduce((sum, o) => sum + o.amount, 0);
    const targetAmount = totalSupply * targetControl;
    
    let purchased = 0;
    let totalCost = 0;
    
    for (let order of allOrders) {
        if (purchased >= targetAmount) break;
        
        const amount = Math.min(order.amount, targetAmount - purchased);
        const result = Game.market.deal(order.id, amount, "W1N1");
        
        if (result === OK) {
            purchased += amount;
            totalCost += order.price * amount;
        }
    }
    
    if (purchased >= targetAmount) {
        console.log(`CORNERED ${resource}: ${purchased} units, ${totalCost} credits spent`);
        console.log(`Now control ${(purchased/totalSupply)*100}% of market`);
        
        // Create sell orders at inflated price
        const newPrice = (totalCost / purchased) * 2;  // 2x markup
        Game.market.createOrder({
            type: ORDER_SELL,
            resourceType: resource,
            price: newPrice,
            totalAmount: purchased,
            roomName: "W1N1"
        });
    }
}

// Risks:
// - Requires massive capital
// - Other players may counter by ramping production
// - Ties up terminal capacity
// - May violate terms of service (check with devs)
```

### 4. Futures Contracts (Manual Implementation)
**Concept**: Lock in prices for future delivery

```javascript
// Store contract in Memory
Memory.contracts = Memory.contracts || [];

function createFuturesContract(resource, amount, price, deliveryTick) {
    const contract = {
        id: Game.time + Math.random(),
        seller: "MyUsername",
        buyer: null,              // Filled when accepted
        resource: resource,
        amount: amount,
        price: price,
        deliveryTick: deliveryTick,
        status: 'OPEN'
    };
    
    Memory.contracts.push(contract);
    console.log(`Futures contract created: ${amount} ${resource} @ ${price}, delivery tick ${deliveryTick}`);
}

function executeContracts() {
    for (let contract of Memory.contracts) {
        if (contract.status === 'FILLED' && Game.time >= contract.deliveryTick) {
            // Execute delivery
            const terminal = Game.rooms['W1N1'].terminal;
            
            // In real implementation, would use terminal.send()
            // or create direct trade
            console.log(`Executing contract ${contract.id}: delivering ${contract.amount} ${contract.resource}`);
            
            contract.status = 'COMPLETED';
        }
    }
}

// Use case: Lock in Ghodium price before war
createFuturesContract(RESOURCE_GHODIUM, 10000, 15.0, Game.time + 50000);
// If war drives price to 25.0, you saved 100k credits
```

### 5. Algorithmic Trading Signals
**Concept**: Automated buy/sell based on technical indicators

```javascript
class TradingSignals {
    // Simple Moving Average (SMA)
    calculateSMA(prices, period) {
        return prices.slice(-period).reduce((a, b) => a + b) / period;
    }
    
    // Relative Strength Index (RSI)
    calculateRSI(prices, period = 14) {
        let gains = 0, losses = 0;
        
        for (let i = 1; i < period; i++) {
            const change = prices[i] - prices[i-1];
            if (change > 0) gains += change;
            else losses -= change;
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / avgLoss;
        
        return 100 - (100 / (1 + rs));
    }
    
    // Moving Average Convergence Divergence (MACD)
    calculateMACD(prices) {
        const ema12 = this.calculateEMA(prices, 12);
        const ema26 = this.calculateEMA(prices, 26);
        const macd = ema12 - ema26;
        const signal = this.calculateEMA([macd], 9);
        
        return { macd, signal, histogram: macd - signal };
    }
    
    // Generate trading signal
    generateSignal(resource) {
        const history = Game.market.getHistory(resource);
        const prices = history.map(d => d.avgPrice);
        
        // Multiple indicator confirmation
        const sma7 = this.calculateSMA(prices, 7);
        const sma14 = this.calculateSMA(prices, 14);
        const rsi = this.calculateRSI(prices);
        const macd = this.calculateMACD(prices);
        
        let signal = 'HOLD';
        let strength = 0;
        
        // SMA crossover
        if (sma7 > sma14) strength += 1;
        if (sma7 < sma14) strength -= 1;
        
        // RSI oversold/overbought
        if (rsi < 30) strength += 1;      // Oversold
        if (rsi > 70) strength -= 1;      // Overbought
        
        // MACD crossover
        if (macd.histogram > 0) strength += 1;
        if (macd.histogram < 0) strength -= 1;
        
        // Determine signal
        if (strength >= 2) signal = 'BUY';
        if (strength <= -2) signal = 'SELL';
        
        return { signal, strength, indicators: { sma7, sma14, rsi, macd } };
    }
}

// Usage
const signals = new TradingSignals();
const utriumSignal = signals.generateSignal(RESOURCE_UTRIUM);

if (utriumSignal.signal === 'BUY') {
    console.log(`BUY signal for Utrium (strength: ${utriumSignal.strength})`);
    // Execute buy order
}
```

---

## Implementation Checklist

### Phase 1: Foundation (RCL 4-5)
- [ ] Build Storage (300k credits, RCL 4)
- [ ] Start mineral harvesting
- [ ] Stockpile base minerals (H, O, U, L, K, Z, X)
- [ ] Monitor market prices daily

### Phase 2: Market Entry (RCL 6)
- [ ] Build Terminal (100k credits, RCL 6)
- [ ] Create first sell order (surplus energy or minerals)
- [ ] Obtain starting credits (NPC terminal or player order)
- [ ] Implement basic market scanning

### Phase 3: Active Trading (RCL 6+)
- [ ] Deploy MarketManager bot
- [ ] Create buy orders for missing minerals
- [ ] Establish market making strategy
- [ ] Track transaction history

### Phase 4: Production (RCL 6-7)
- [ ] Build Labs (50k each, RCL 6)
- [ ] Start compound production
- [ ] Build Factory (100k credits, RCL 7)
- [ ] Begin commodity chains

### Phase 5: Optimization (RCL 7-8)
- [ ] Implement algorithmic trading
- [ ] Optimize production pipelines
- [ ] Scale to multiple rooms
- [ ] Advanced strategies (arbitrage, futures, etc.)

---

## Key Takeaways

1. **Start Early**: Even small trades build capital and experience
2. **Automate Everything**: Market moves too fast for manual trading
3. **Risk Management**: Diversify, use stop-losses, monitor capacity
4. **Vertical Integration**: Control production chains for max profit
5. **Data-Driven**: Use price history and analytics for decisions
6. **Adapt to Meta**: Market conditions change with game events
7. **Terminal is King**: Protect your terminal - it's your economic lifeline

---

## Resources & References

### API Documentation
- [Game.market](https://docs.screeps.com/api/#Game.market) - Core market methods
- [StructureTerminal](https://docs.screeps.com/api/#StructureTerminal) - Terminal operations
- [StructureFactory](https://docs.screeps.com/api/#StructureFactory) - Commodity production
- [RESOURCES Constants](https://docs.screeps.com/api/#Constants) - Resource type reference

### Economic Concepts
- **Arbitrage**: Exploiting price differences between markets
- **Market Making**: Providing liquidity via bid-ask spreads
- **Mean Reversion**: Betting on price return to historical average
- **Vertical Integration**: Controlling supply chain from raw materials to finished goods
- **Liquidity**: Ease of buying/selling without affecting price
- **Opportunity Cost**: What you give up to pursue a strategy

### Further Reading
- Market Guide: https://docs.screeps.com/market.html
- Resources Guide: https://docs.screeps.com/resources.html
- Community Trading Bots: https://github.com/screepers (search "market")

---

**Version History**:
- v2.0 Alpha: Initial strategic planning document (Nov 29, 2025)
- Future: Will be updated as market strategies are tested and refined

**Next Steps**:
1. Implement basic MarketManager in `simulation/`
2. Test with small trades on NPC terminals
3. Scale up as capital accumulates
4. Document learnings in this guide

---

*"The market is a device for transferring wealth from the impatient to the patient."* 
— Adapted for Screeps
