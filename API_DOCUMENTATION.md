# Mshamba Enhanced Tokenization API Documentation

## Overview

Mshamba is a decentralized agricultural investment platform built on the Internet Computer Protocol (ICP). This API provides comprehensive functionality for farm tokenization, automated valuation, profit distribution, and secondary market trading.

**Base URL**: `http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai`

---

## 🌾 Farm Management

### Create Farm with Automated Valuation
Creates a new farm with algorithmic valuation based on multiple factors.

**Endpoint**: `createFarm`
**Method**: `POST`
**Authentication**: Required (caller identity)

**Parameters**:
```motoko
createFarm(
  name: Text,              // Farm name
  description: Text,       // Farm description
  location: Text,          // Geographic location
  fundingGoal: Nat,        // Target funding amount (in e8s)
  landSize: Float,         // Farm size in acres
  cropType: CropType,      // Type of crop (#Vegetables, #Grains, #Fruits, #Livestock, #Cash_Crops)
  soilQuality: Nat,        // Soil quality rating (1-10)
  waterAccess: Bool,       // Has reliable water access
  infrastructure: Nat,     // Infrastructure quality (1-10)
  marketAccess: Nat,       // Distance to markets (1-10, lower = closer)
  climateRisk: Nat         // Climate risk assessment (1-10)
)
```

**Response**:
```motoko
Result<Farm> = {
  farmId: Text;
  name: Text;
  owner: Principal;
  description: Text;
  location: Text;
  fundingGoal: Nat;
  fundedAmount: Nat;
  totalShares: Nat;        // Always 1,000,000
  sharePrice: Nat;         // Calculated automatically
  isOpenForInvestment: Bool;
  createdAt: Int;
  status: FarmStatus;      // #Open, #Funded, #InProgress, #Harvested, #Closed
  investors: [Principal];
  valuationHistory: [(Int, Nat)];
}
```

**Example**:
```bash
dfx canister call mshamba_backend createFarm '(
  "Sarah'\''s Maize Farm", 
  "High-yield maize production in Rift Valley", 
  "Rift Valley, Kenya", 
  50_000_00000000, 
  25.0, 
  variant { Grains }, 
  8, 
  true, 
  7, 
  3, 
  4
)'
```

### Get Farm Details
Retrieves detailed information about a specific farm.

**Endpoint**: `getFarm`
**Method**: `GET`
**Parameters**: `farmId: Text`

**Example**:
```bash
dfx canister call mshamba_backend getFarm '("farm-1752959971338117398")'
```

### List All Farms
Returns all farms in the system.

**Endpoint**: `listFarms`
**Method**: `GET`
**Parameters**: None

---

## 💰 Investment & Tokenization

### Invest in Farm
Invests in a farm and automatically mints tokens for the investor.

**Endpoint**: `investInFarm`
**Method**: `POST`
**Authentication**: Required

**Parameters**:
```motoko
investInFarm(
  farmId: Text,    // Target farm ID
  amount: Nat      // Investment amount (in e8s)
)
```

**Process**:
1. Updates farm with investment amount
2. Automatically mints farm tokens based on share price
3. Records investment in ledger
4. Updates investor's token balance

**Example**:
```bash
dfx canister call mshamba_backend investInFarm '("farm-1752959971338117398", 500_000_000_000)'
```

### Get Token Balance
Returns the caller's token balance for a specific farm.

**Endpoint**: `getTokenBalance`
**Method**: `GET`
**Authentication**: Required
**Parameters**: `farmId: Text`

**Example**:
```bash
dfx canister call mshamba_backend getTokenBalance '("farm-1752959971338117398")'
```

### Get User Token Portfolio
Returns all tokens owned by the caller across all farms.

**Endpoint**: `getUserTokens`
**Method**: `GET`
**Authentication**: Required

**Response**: `[(Text, Nat)]` - Array of (farmId, tokenAmount) pairs

---

## 📊 Farm Valuation

### Calculate Farm Valuation
Performs algorithmic valuation of farm parameters without creating a farm.

**Endpoint**: `calculateFarmValuation`
**Method**: `POST`

**Parameters**: Same as `createFarm` but without name, description, fundingGoal

**Response**:
```motoko
ValuationMetrics = {
  totalValuation: Nat;        // Total farm value (in e8s)
  sharePrice: Nat;           // Price per token (in e8s)
  qualityScore: Float;       // Calculated quality score (0.5-1.5)
  cropMultiplier: Float;     // Crop-specific multiplier
  locationMultiplier: Float; // Location-based multiplier
  calculatedAt: Int;         // Timestamp
  factors: ValuationFactors; // Input parameters used
}
```

### Get Valuation Trend
Returns the valuation trend for a farm (bullish/bearish/stable).

**Endpoint**: `getValuationTrend`
**Method**: `GET`
**Parameters**: `farmId: Text`

**Response**: `Text` - "bullish", "bearish", "stable", or "insufficient_data"

---

## 🏪 Secondary Market Trading

### Create Market Order
Creates a buy or sell order for farm tokens.

**Endpoint**: `createMarketOrder`
**Method**: `POST`
**Authentication**: Required

**Parameters**:
```motoko
createMarketOrder(
  farmId: Text,
  orderType: OrderType,    // #Buy or #Sell
  quantity: Nat,           // Number of tokens
  pricePerShare: Nat       // Price per token (in e8s)
)
```

**Example**:
```bash
dfx canister call mshamba_backend createMarketOrder '(
  "farm-1752959971338117398", 
  variant { Sell }, 
  10000, 
  6000
)'
```

### Cancel Order
Cancels an open market order.

**Endpoint**: `cancelOrder`
**Method**: `POST`
**Authentication**: Required
**Parameters**: `orderId: Text`

### Match Orders
Automatically matches buy and sell orders for a farm.

**Endpoint**: `matchOrders`
**Method**: `POST`
**Parameters**: `farmId: Text`

**Returns**: `[TradeMatch]` - Array of executed trades

### Get Order Book
Returns all open buy and sell orders for a farm.

**Endpoint**: `getOrderBook`
**Method**: `GET`
**Parameters**: `farmId: Text`

**Response**:
```motoko
{
  buyOrders: [TradeOrder];
  sellOrders: [TradeOrder];
}
```

### Get Market Price
Returns the last traded price for a farm's tokens.

**Endpoint**: `getMarketPrice`
**Method**: `GET`
**Parameters**: `farmId: Text`
**Response**: `?Nat` - Price in e8s, null if no trades

### Get User Orders
Returns all orders (open and closed) for the caller.

**Endpoint**: `getUserOrders`
**Method**: `GET`
**Authentication**: Required

### Get User Trades
Returns all trades (as buyer or seller) for the caller.

**Endpoint**: `getUserTrades`
**Method**: `GET**
**Authentication**: Required

---

## 🌾 Harvest & Profit Distribution

### Record Harvest
Records harvest results for a farm (farmer only).

**Endpoint**: `recordHarvest`
**Method**: `POST`
**Authentication**: Required (must be farm owner)

**Parameters**:
```motoko
recordHarvest(
  farmId: Text,
  totalYield: Float,      // Total harvest yield
  totalRevenue: Nat,      // Revenue from sales (in e8s)
  expenses: Nat,          // Production expenses (in e8s)
  qualityGrade: Text,     // Quality assessment
  landSize: Float         // Farm size for yield calculation
)
```

### Create Profit Distribution
Creates a profit distribution plan based on harvest results.

**Endpoint**: `createProfitDistribution`
**Method**: `POST**
**Authentication**: Required

**Parameters**:
```motoko
createProfitDistribution(
  farmId: Text,
  harvestReportId: Text,
  farmerShare: Float      // Farmer's percentage (0.0-1.0)
)
```

### Execute Profit Distribution
Executes the profit distribution to token holders.

**Endpoint**: `executeProfitDistribution`
**Method**: `POST`
**Authentication**: Required
**Parameters**: `distributionId: Text`

### Get Farm Profit History
Returns all profit distributions for a farm.

**Endpoint**: `getFarmProfitHistory`
**Method**: `GET`
**Parameters**: `farmId: Text`

### Get Investor Profit History
Returns profit distributions received by the caller.

**Endpoint**: `getInvestorProfitHistory`
**Method**: `GET`
**Authentication**: Required

---

## 👤 User Management

### Create/Update Profile
Creates or updates user profile.

**Endpoint**: `upsertProfile`
**Method**: `POST`
**Authentication**: Required

**Parameters**:
```motoko
upsertProfile(
  name: Text,
  email: Text,
  role: Role,        // #Investor, #Farmer, #LandOwner, #SupplyPartner, #Admin
  bio: Text,
  location: Text
)
```

### Get My Profile
Returns the caller's profile.

**Endpoint**: `myProfile`
**Method**: `GET`
**Authentication**: Required

### Get User Profile
Returns another user's profile.

**Endpoint**: `getProfileOf`
**Method**: `GET`
**Parameters**: `Principal`

---

## 🏞️ Land Management

### Register Land
Registers land for leasing.

**Endpoint**: `registerLand`
**Method**: `POST`
**Authentication**: Required

**Parameters**:
```motoko
registerLand(
  location: Text,
  sizeInAcres: Float,
  leaseRatePerMonth: Nat
)
```

### Get Available Land
Returns all available land listings.

**Endpoint**: `listAvailableLand`
**Method**: `GET`

---

## 📈 Analytics & Reporting

### Get Token Holders
Returns all token holders for a farm.

**Endpoint**: `getTokenHolders`
**Method**: `GET`
**Parameters**: `farmId: Text`
**Response**: `[(Principal, Nat)]` - Array of (holder, tokenAmount) pairs

### Get Total Supply
Returns total token supply for a farm.

**Endpoint**: `getTotalSupply`
**Method**: `GET`
**Parameters**: `farmId: Text`

### Transfer Tokens
Transfers tokens between users.

**Endpoint**: `transferTokens`
**Method**: `POST`
**Authentication**: Required

**Parameters**:
```motoko
transferTokens(
  to: Principal,
  farmId: Text,
  amount: Nat
)
```

---

## 🔧 Data Types

### Core Types

```motoko
// Farm Status
type FarmStatus = {
  #Open;        // Accepting investments
  #Funded;      // Funding goal reached
  #InProgress;  // Farm operations ongoing
  #Harvested;   // Harvest completed
  #Closed;      // Farm closed
};

// Crop Types
type CropType = {
  #Vegetables;  // 1.2x multiplier
  #Grains;      // 1.0x multiplier (baseline)
  #Fruits;      // 1.5x multiplier
  #Livestock;   // 1.8x multiplier
  #Cash_Crops;  // 2.0x multiplier
};

// Order Types
type OrderType = {
  #Buy;
  #Sell;
};

// User Roles
type Role = {
  #Investor;
  #Farmer;
  #LandOwner;
  #SupplyPartner;
  #Admin;
};
```

---

## 🚨 Error Handling

All API endpoints return `Result<T>` types:

```motoko
type Result<T> = {
  #ok: T;      // Success with data
  #err: Text;  // Error with message
};
```

**Common Error Messages**:
- `"Farm not found"`
- `"Insufficient token balance"`
- `"Only order creator can cancel"`
- `"Investment amount must be positive"`
- `"Farm is not open for investment"`
- `"Valuation failed: [reason]"`

---

## 💡 Best Practices

1. **Always check Result types** before using returned data
2. **Use e8s format** for all monetary amounts (1 ICP = 100,000,000 e8s)
3. **Validate farm status** before attempting investments
4. **Check token balances** before creating sell orders
5. **Monitor order book** for optimal trading prices
6. **Regular profit distribution** to maintain investor engagement

---

## 🔗 Integration Examples

### JavaScript/TypeScript Integration
```javascript
import { mshamba_backend } from "./declarations/mshamba_backend";

// Create farm with automated valuation
const farmResult = await mshamba_backend.createFarm(
  "My Farm",
  "Description",
  "Location",
  BigInt(50_000_00000000), // $50,000 in e8s
  25.0,                    // 25 acres
  { Grains: null },        // Crop type
  8,                       // Soil quality
  true,                    // Water access
  7,                       // Infrastructure
  3,                       // Market access
  4                        // Climate risk
);

if ('ok' in farmResult) {
  console.log("Farm created:", farmResult.ok);
} else {
  console.error("Error:", farmResult.err);
}
```

### React Hook Example
```javascript
const useFarmData = (farmId) => {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarm = async () => {
      const result = await mshamba_backend.getFarm(farmId);
      if ('ok' in result) {
        setFarm(result.ok);
      }
      setLoading(false);
    };
    fetchFarm();
  }, [farmId]);

  return { farm, loading };
};
```

---

This API provides a complete foundation for building sophisticated agricultural DeFi applications with automated valuation, tokenization, and secondary market trading.
