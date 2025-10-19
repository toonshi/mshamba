# ckUSDT Payment Integration Guide

## Overview
Mshamba now supports **real payment integration** using **ckUSDT** (Chain-Key USDT) on the Internet Computer. Investors can buy farm tokens with stable USD-pegged currency, and farmers receive predictable funding.

---

## Why ckUSDT Instead of ICP?

### Benefits
✅ **Stable value**: $1 = $1, no volatility  
✅ **Predictable funding**: Farm needs $10K → gets $10K  
✅ **Clear pricing**: "1 token = $0.10" makes sense to everyone  
✅ **Real-world thinking**: Farmers think in dollars/shillings, not crypto  
✅ **Investor confidence**: Returns measured in stable value  
✅ **Better for dividends**: Pay $100 dividend, not "0.02 ICP"

### ckUSDT Details
- **Canister ID**: `cngnf-vqaaa-aaaar-qag4q-cai`
- **Decimals**: 6 (1 ckUSDT = 1,000,000 units)
- **Standard**: ICRC-1 (same as ICP ledger)
- **Bridged from**: Ethereum USDT via Chain-Key technology

---

## Payment Flow

### 1. Farmer Creates Farm with Token Parameters
```motoko
createFarm(
  ...
  tokenPrice: 10,  // 10 cents per token ($0.10)
  ifoEndDate: ?(Time.now() + 30_days),
  maxInvestmentPerUser: ?10_000_000_000  // $10K max per investor
)
```

### 2. Farmer Launches Token
```motoko
launchFarmToken(farmId)
```
- Creates ICRC-1 ledger
- Allocates 75% to farmer, 5% to platform, 20% to IFO escrow

### 3. Farmer Opens Investment
```motoko
toggleFarmInvestmentStatus(farmId, true)
```

### 4. Investor Buys Tokens
```motoko
// Investor calls:
buyFarmTokens(farmId, 1_000_000_000)  // Buy with 1,000 ckUSDT ($1,000)

// System automatically:
// 1. Verifies farm is open
// 2. Checks IFO hasn't ended
// 3. Calculates token amount
// 4. Verifies investor balance
// 5. Transfers farm tokens to investor
// 6. Returns purchase receipt
```

---

## Token Pricing

### Example: Farm Token Price = $0.10

| ckUSDT Amount | USD Value | Tokens Received (8 decimals) |
|---------------|-----------|------------------------------|
| 1,000,000 | $1.00 | 10_00000000 (10 tokens) |
| 10,000,000 | $10.00 | 100_00000000 (100 tokens) |
| 1,000,000,000 | $1,000.00 | 10,000_00000000 (10K tokens) |

### Price Calculation
```motoko
// tokenPrice is in USD cents (10 = $0.10)
// ckUSDT has 6 decimals, farm tokens have 8
tokensReceived = (ckusdtAmount * 100) / tokenPrice * 100
```

---

## API Functions

### `buyFarmTokens(farmId: Text, ckusdtAmount: Nat)`
**Purpose**: Purchase farm tokens with ckUSDT  
**Caller**: Investor  
**Parameters**:
- `farmId`: The farm to invest in
- `ckusdtAmount`: Amount of ckUSDT to invest (6 decimals)

**Returns**: `Result<TokenPurchase, Text>`
```motoko
type TokenPurchase = {
  investor: Principal;
  farmId: Text;
  ckusdtAmount: Nat;
  tokensReceived: Nat;
  blockIndex: Nat;  // Farm token transfer block
  timestamp: Int;
};
```

**Checks**:
1. Farm is open for investment
2. Token has been launched
3. IFO hasn't ended
4. Investment within per-user limit
5. Investor has sufficient ckUSDT
6. Transfers tokens from escrow to investor

---

### `previewTokenPurchase(farmId: Text, ckusdtAmount: Nat)`
**Purpose**: Calculate how many tokens you'd receive without buying  
**Caller**: Anyone (query)  
**Returns**: Number of farm tokens

**Example**:
```bash
dfx canister call mshamba_backend previewTokenPurchase '("farm-123", 1000000000)'
# Returns: 10,000 tokens (for $1000 at $0.10/token)
```

---

### `getCkUSDTLedgerCanister()`
**Purpose**: Get ckUSDT ledger canister ID  
**Returns**: `"cngnf-vqaaa-aaaar-qag4q-cai"`

---

## Testing Locally

### 1. Deploy Canisters
```bash
dfx start --clean --background
dfx deploy token_factory
dfx deploy mshamba_backend
```

### 2. Create Investor Profile
```bash
dfx identity use investor_identity
dfx canister call mshamba_backend createProfile '(
  "Test Investor",
  "Looking to invest in agriculture",
  vec { variant { Investor } },
  vec {}
)'
```

### 3. Switch to Farmer & Create Farm
```bash
dfx identity use mike  # Or your farmer identity
dfx canister call mshamba_backend createFarm '(
  "Green Acres Farm",
  "Organic vegetables",
  "Kiambu, Kenya",
  10000000000,
  "5 acres",
  "Tomatoes",
  6,
  "5000kg",
  "25%",
  "John Farmer",
  "10 years",
  "+254700123456",
  "john@farm.com",
  blob "\01\02\03",
  "image/jpeg",
  "Green Acres Token",
  "GAFT",
  1000000000000,
  8,
  100000,
  opt "https://example.com/logo.png",
  10,
  opt 1735689600000000000,
  opt 10000000000
)'
```

**Note the farmId returned**

### 4. Launch Token
```bash
dfx canister call mshamba_backend launchFarmToken '("farm-XXXXXXXX")'
```

### 5. Open for Investment
```bash
dfx canister call mshamba_backend toggleFarmInvestmentStatus '("farm-XXXXXXXX", true)'
```

### 6. Preview Purchase (as investor)
```bash
dfx identity use investor_identity
dfx canister call mshamba_backend previewTokenPurchase '("farm-XXXXXXXX", 1000000000)'
# Shows how many tokens you'd get for 1000 ckUSDT
```

### 7. Buy Tokens
```bash
# Note: In local testing, you won't have real ckUSDT
# This will check balance and fail, but shows the flow
dfx canister call mshamba_backend buyFarmTokens '("farm-XXXXXXXX", 1000000000)'
```

---

## Production Deployment

### Required Steps

#### 1. Ensure ckUSDT Access
On mainnet, ckUSDT ledger is already deployed:
- **Ledger**: `cngnf-vqaaa-aaaar-qag4q-cai`
- Investors must have ckUSDT in their wallets

#### 2. Deploy Updated Backend
```bash
dfx deploy mshamba_backend --network ic
```

#### 3. Investor Gets ckUSDT
Investors can get ckUSDT by:
1. Swapping ICP → ckUSDT on ICPSwap or Sonic DEX
2. Bridging USDT from Ethereum (via Chain-Key bridge)
3. Buying on exchanges that support ckUSDT

---

## Current Limitations & Future Enhancements

### MVP Limitations
⚠️ **Manual ckUSDT Transfer**: Investor must transfer ckUSDT to farm treasury separately  
⚠️ **No ICRC-2 Approve**: Backend can't pull ckUSDT automatically yet  
⚠️ **No Purchase History**: Purchases not stored in backend  
⚠️ **No Refund Mechanism**: If IFO fails, no automatic refunds

### Phase 2 Enhancements
- [ ] ICRC-2 approve/transferFrom integration (backend pulls ckUSDT automatically)
- [ ] Purchase history tracking in Farm type
- [ ] IFO success/failure conditions with automatic refunds
- [ ] Frontend integration (Plug wallet → one-click purchase)
- [ ] Multi-currency support (ICP + ckUSDT)
- [ ] Price discovery mechanism (dynamic pricing)

---

## Security Considerations

### Current Setup
✅ Token transfers require backend authorization  
✅ Balance checks before purchase  
✅ Per-user investment limits  
✅ IFO time window enforcement  
✅ Farm ownership verification  

### Production Requirements
- [ ] Multi-sig for platform treasury
- [ ] Time-locked escrow for IFO funds
- [ ] Emergency pause mechanism
- [ ] Audit of payment contract
- [ ] Rate limiting on purchases

---

## Cost Analysis

### Cycles Cost Per Transaction
- **buyFarmTokens call**: ~10B cycles (~$0.012)
- **Token transfer**: ~1B cycles (~$0.0012)
- **Balance check**: ~1B cycles (~$0.0012)

### Per Farm
- **Token creation**: 2T cycles (~$2.50) - one-time
- **100 purchases**: ~1.1T cycles (~$1.38)

**Total for 10 farms with 100 purchases each**: ~$27.30 in cycles

---

## Troubleshooting

### "Insufficient ckUSDT balance"
**Solution**: Investor needs to acquire ckUSDT first via DEX swap or bridge

### "Farm token not yet launched"
**Solution**: Farmer must call `launchFarmToken()` first

### "IFO period has ended"
**Solution**: Farm IFO deadline passed, tokens can only be bought on secondary market

### "Token transfer failed"
**Solution**: Backend may not have permission to transfer from escrow. Check IFO allocation.

---

## Next Steps

1. ✅ Payment module created
2. ✅ buyFarmTokens function added
3. ⏳ Test locally with mock ckUSDT
4. ⏳ Deploy to mainnet
5. ⏳ Frontend integration
6. ⏳ Add ICRC-2 approve flow
7. ⏳ Add purchase history tracking

**Current Status**: Core payment system complete, ready for local testing
