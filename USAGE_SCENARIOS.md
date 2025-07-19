# Mshamba Enhanced Tokenization - Usage Scenarios

This document demonstrates real-world usage scenarios for Mshamba's enhanced tokenization system with automated valuation, profit distribution, and secondary market trading.

---

## 🌾 Scenario 1: Farm Creation with Automated Valuation

### Background
**Sarah**, a farmer in Kenya's Rift Valley, wants to expand her maize farm but needs $50,000 in funding.

### Traditional Process (Old System)
- Sarah manually sets share price at $5 per share
- Creates 10,000 shares to raise $50,000
- No scientific basis for valuation

### Enhanced Process (New System)
```motoko
// Sarah provides farm details for automated valuation
let valuationResult = Valuation.calculateFarmValuation(
  landSize: 25.0,              // 25 acres
  cropType: #Grains,           // Maize
  location: "Rift Valley, Kenya",
  soilQuality: 8,              // Excellent soil (1-10 scale)
  waterAccess: true,           // Has irrigation
  infrastructure: 7,           // Good roads, storage
  marketAccess: 3,             // Close to markets (1-10, lower = closer)
  historicalYield: ?1.1,       // 10% above average yield
  climateRisk: 4               // Low climate risk
);

// System calculates:
// - Base value: $5,000/acre × 25 acres = $125,000
// - Quality score: 0.85 (very good)
// - Crop multiplier: 1.0 (grains baseline)
// - Location multiplier: 1.1 (Rift Valley bonus)
// - Yield multiplier: 1.1 (historical performance)
// 
// Total valuation: $125,000 × 0.85 × 1.0 × 1.1 × 1.1 = $128,562
// Share price: $128,562 ÷ 1,000,000 shares = $0.13 per share
```

**Result**: Sarah's farm is scientifically valued at $128,562 with shares at $0.13 each. To raise $50,000, she needs to sell ~385,000 shares (38.5% of her farm).

---

## 💰 Scenario 2: Investment and Token Minting

### Background
**James**, an urban investor in Nairobi, wants to invest $5,000 in Sarah's farm.

### Investment Process
```motoko
// James invests $5,000
let investmentResult = Farms.investInFarm(
  caller: james_principal,
  farmId: "farm-sarah-maize-001",
  amount: 5_000_00000000,  // $5,000 in e8s format
  farms: farmStore
);

// System automatically mints tokens
let tokenResult = Tokens.mintFarmTokens(
  farmId: "farm-sarah-maize-001",
  investor: james_principal,
  amount: 5_000_00000000,
  sharePrice: 13000000,    // $0.13 in e8s
  tokens: tokenStore,
  balances: balanceStore
);

// James receives: 5,000 ÷ 0.13 = 38,461 farm tokens
// Ownership: 38,461 ÷ 1,000,000 = 3.85% of the farm
```

**Result**: James owns 38,461 MFT-farm-sarah-maize-001 tokens, representing 3.85% ownership in Sarah's farm.

---

## 🚜 Scenario 3: Harvest and Profit Distribution

### Background
After 6 months, Sarah harvests her maize crop with excellent results.

### Harvest Reporting
```motoko
let harvestResult = Profits.recordHarvest(
  farmId: "farm-sarah-maize-001",
  farmer: sarah_principal,
  totalYield: 750.0,           // 750 bags of maize
  totalRevenue: 75_000_00000000, // $75,000 revenue
  expenses: 25_000_00000000,     // $25,000 expenses
  qualityGrade: "Grade A",
  landSize: 25.0,
  harvests: harvestStore
);

// Net profit: $75,000 - $25,000 = $50,000
// Yield per acre: 750 ÷ 25 = 30 bags/acre (excellent)
```

### Profit Distribution
```motoko
let distributionResult = Profits.createProfitDistribution(
  farmId: "farm-sarah-maize-001",
  harvestReport: harvestResult,
  farmerShare: 0.3,  // Sarah gets 30% = $15,000
  tokenBalances: balanceStore,
  distributions: distributionStore
);

// Investor share: $50,000 × 0.7 = $35,000
// Total tokens issued: 385,000 (from $50,000 investment)
// Profit per token: $35,000 ÷ 385,000 = $0.091 per token

// James's profit: 38,461 tokens × $0.091 = $3,500
// James's ROI: $3,500 ÷ $5,000 = 70% return in 6 months!
```

**Result**: James receives $3,500 in profit distributions, achieving a 70% ROI in 6 months.

---

## 📈 Scenario 4: Secondary Market Trading

### Background
**Maria**, another investor, wants to buy farm tokens but the original investment round is closed. **David** wants to sell some of his tokens for quick cash.

### Creating Market Orders
```motoko
// David creates a sell order (he owns 50,000 tokens)
let sellOrder = Market.createOrder(
  user: david_principal,
  farmId: "farm-sarah-maize-001",
  orderType: #Sell,
  quantity: 20_000,        // Selling 20,000 tokens
  pricePerShare: 18000000, // $0.18 per token (38% markup from original $0.13)
  tokenBalances: balanceStore,
  orders: orderStore
);

// Maria creates a buy order
let buyOrder = Market.createOrder(
  user: maria_principal,
  farmId: "farm-sarah-maize-001",
  orderType: #Buy,
  quantity: 15_000,        // Buying 15,000 tokens
  pricePerShare: 17000000, // $0.17 per token
  tokenBalances: balanceStore,
  orders: orderStore
);
```

### Order Matching
```motoko
// System automatically matches orders
let matches = Market.matchOrders(
  farmId: "farm-sarah-maize-001",
  orders: orderStore,
  trades: tradeStore,
  tokenBalances: balanceStore,
  transfers: transferStore
);

// Trade executed:
// - 15,000 tokens transferred from David to Maria
// - Price: $0.17 per token (Maria's bid price)
// - Total value: 15,000 × $0.17 = $2,550
// - David receives $2,550, Maria gets 15,000 tokens
```

**Result**: Maria acquires 15,000 farm tokens at $0.17 each, while David liquidates part of his position for $2,550.

---

## 🔄 Scenario 5: Dynamic Valuation Updates

### Background
Sarah's farm performance attracts attention, increasing demand for her tokens.

### Market-Driven Valuation
```motoko
// High trading volume and positive performance trigger revaluation
let updatedValuation = Valuation.calculateDynamicSharePrice(
  baseValuation: originalMetrics,
  demandFactor: 1.4,      // 40% increase in demand
  marketSentiment: 1.1,   // 10% positive market sentiment
  farmPerformance: 1.2    // 20% above projected performance
);

// New share price: $0.13 × 1.4 × 1.1 × 1.2 = $0.24 per token
// Sarah's farm valuation increases to ~$240,000
```

### Impact on Stakeholders
- **Sarah**: Her remaining 61.5% ownership is now worth $147,600 (vs. $79,000 originally)
- **James**: His 38,461 tokens are now worth $9,231 (vs. $5,000 invested)
- **Market**: New investors must pay $0.24 per token for new positions

---

## 📊 Scenario 6: Multi-Season Performance Tracking

### Background
After 2 years and 4 harvest seasons, let's see the complete picture.

### Performance Analytics
```motoko
let farmPerformance = Profits.calculateFarmPerformance(
  farmId: "farm-sarah-maize-001",
  harvests: harvestStore
);

// Results over 4 seasons:
// - Average yield: 28 bags/acre (consistently high)
// - Total revenue: $280,000
// - Total profit: $180,000 (after expenses)
// - Average ROI per season: 65%
// - Harvest count: 4
```

### Investor Returns Summary
```motoko
let jamesROI = Profits.calculateROI(
  investor: james_principal,
  farmId: "farm-sarah-maize-001",
  originalInvestment: 5_000_00000000,
  distributions: distributionStore
);

// James's total returns:
// - Season 1: $3,500 (70% ROI)
// - Season 2: $3,200 (64% ROI)  
// - Season 3: $3,800 (76% ROI)
// - Season 4: $3,100 (62% ROI)
// - Total profit: $13,600
// - Total ROI: 272% over 2 years
// - Current token value: $9,231 (if he sells)
// - Total potential return: $13,600 + $4,231 = $17,831 (356% total return)
```

---

## 🎯 Key Benefits Demonstrated

### For Farmers (Sarah)
- ✅ **Scientific valuation** instead of guesswork
- ✅ **Fair market pricing** based on actual farm quality
- ✅ **Retained ownership** of majority stake
- ✅ **Increased farm value** through performance

### For Investors (James, Maria, David)
- ✅ **Transparent returns** based on actual harvests
- ✅ **Liquidity** through secondary market
- ✅ **Portfolio diversification** across multiple farms
- ✅ **Performance-based pricing** reflecting real value

### For the Platform
- ✅ **Automated operations** reducing manual intervention
- ✅ **Market-driven pricing** ensuring fair valuations
- ✅ **Sustainable tokenomics** with real underlying value
- ✅ **Scalable system** supporting multiple farms and investors

---

## 🚀 Advanced Scenarios

### Scenario A: Cross-Farm Portfolio
An investor holds tokens in 10 different farms (maize, coffee, livestock) with automated rebalancing based on performance.

### Scenario B: Institutional Investment
A pension fund invests $1M across 50 farms, receiving quarterly profit distributions and annual performance reports.

### Scenario C: Farmer Cooperation
Multiple small farmers pool their land into a single tokenized entity, sharing resources and profits proportionally.

### Scenario D: Supply Chain Integration
Buyers pre-purchase harvest tokens, providing farmers with guaranteed sales and investors with commodity exposure.

---

This enhanced tokenization system transforms Mshamba from a simple crowdfunding platform into a sophisticated **agricultural DeFi ecosystem** with real-world utility and sustainable economics.
