# Payment Integration Guide

## Overview

Mshamba supports multiple payment methods for farm token purchases, giving investors flexibility to use whichever asset they prefer:

1. **ckUSDT** (Chain-Key USDT) - Stable USD value
2. **ICP** - Native Internet Computer token

All farm tokens are priced in USD cents for consistency, regardless of payment method.

---

## Payment Methods Comparison

| Feature | ckUSDT | ICP |
|---------|--------|-----|
| **Volatility** | Stable ($1 = $1) | Volatile (±30%) |
| **Acquisition** | Swap ICP → ckUSDT on DEX | Buy directly on exchanges |
| **Decimals** | 6 | 8 |
| **Ledger ID** | `cngnf-vqaaa-aaaar-qag4q-cai` | `ryjl3-tyaaa-aaaaa-aaaba-cai` |
| **Best For** | Investors who want predictable value | Investors who already hold ICP |

---

## ckUSDT Payment

### Benefits

- **Stable value**: $1 = $1, no volatility
- **Predictable funding**: Farm needs $10K → gets $10K
- **Clear pricing**: "1 token = $0.10" makes sense to everyone
- **Real-world thinking**: Farmers think in dollars/shillings, not crypto
- **Investor confidence**: Returns measured in stable value
- **Better for dividends**: Pay $100 dividend, not "0.02 ICP"

### ckUSDT Details

- **Canister ID**: `cngnf-vqaaa-aaaar-qag4q-cai`
- **Decimals**: 6 (1 ckUSDT = 1,000,000 units)
- **Standard**: ICRC-1 (same as ICP ledger)
- **Bridged from**: Ethereum USDT via Chain-Key technology

### Token Pricing with ckUSDT

**Example: Farm Token Price = $0.10**

| ckUSDT Amount | USD Value | Tokens Received (8 decimals) |
|---------------|-----------|------------------------------|
| 1,000,000 | $1.00 | 10_00000000 (10 tokens) |
| 10,000,000 | $10.00 | 100_00000000 (100 tokens) |
| 1,000,000,000 | $1,000.00 | 10,000_00000000 (10K tokens) |

**Formula**: `tokens = (ckusdtAmount * 100) / tokenPrice`

---

## ICP Payment

### Benefits

- No DEX swap required for ICP holders
- Immediate investment from exchanges
- More accessible for new crypto users
- Potential upside if ICP price increases

### Token Pricing with ICP

**Step 1**: Convert ICP to USD
```
1 ICP × $10.00 = $10.00
```

**Step 2**: Calculate tokens
```
$10.00 / $0.10 = 100 tokens
```

**Formula**: `tokens = ((icpAmount * icpPriceUSD) / 1e8) / (tokenPrice / 100)`

### ICP Price Oracle

**Current Approach (MVP)**

Frontend passes ICP price manually:
```javascript
// Get price from CoinGecko or another API
const icpPrice = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd')
const icpPriceInCents = icpPrice.icp.usd * 100

// Pass to backend
buyFarmTokensWithICP(farmId, icpAmount, icpPriceInCents)
```

**Future Approach (Phase 2)**

Backend queries price oracle directly:
```motoko
// Example with XRC (Exchange Rate Canister)
let xrc = actor("uf6dk-hyaaa-aaaaq-qaaaq-cai") : XRCInterface;
let rate = await xrc.get_exchange_rate({
  base_asset = "ICP";
  quote_asset = "USD";
  timestamp = null;
});
```

---

## API Functions

### Preview Purchase (ckUSDT)

```motoko
previewTokenPurchase(farmId: Text, ckusdtAmount: Nat) : async Result<Nat, Text>
```

**Example**:
```bash
dfx canister call mshamba_backend previewTokenPurchase '("farm-123", 1000000000)'
# Returns: 10,000 tokens (for 1000 ckUSDT at $0.10/token)
```

### Preview Purchase (ICP)

```motoko
previewTokenPurchaseWithICP(
  farmId: Text,
  icpAmount: Nat,
  icpPriceUSD: Nat  // Current ICP price in cents
) : async Result<Nat, Text>
```

**Example** (ICP = $10.00):
```bash
dfx canister call mshamba_backend previewTokenPurchaseWithICP '("farm-123", 100000000, 1000)'
# Returns: 10,000 tokens (for 1 ICP at $10 = $10 worth / $0.10 per token)
```

### Buy with ckUSDT

```motoko
buyFarmTokens(farmId: Text, ckusdtAmount: Nat) : async Result<TokenPurchase, Text>
```

**Returns**:
```motoko
type TokenPurchase = {
  investor: Principal;
  farmId: Text;
  ckusdtAmount: Nat;
  tokensReceived: Nat;
  blockIndex: Nat;
  timestamp: Int;
};
```

### Buy with ICP

```motoko
buyFarmTokensWithICP(
  farmId: Text,
  icpAmount: Nat,
  icpPriceUSD: Nat  // Must pass current price
) : async Result<TokenPurchase, Text>
```

---

## User Flows

### Flow 1: Investor with ICP (Simplest)

1. User has 10 ICP in Plug wallet
2. Clicks "Invest in Farm"
3. Selects "Pay with ICP"
4. Frontend shows: "1 ICP = $10.00, you'll get X tokens"
5. User approves
6. Backend transfers farm tokens → User

### Flow 2: Investor with Fiat

1. User has $100 in bank account
2. Buys 10 ICP on Binance ($10/ICP)
3. Sends ICP to Plug wallet
4. Same as Flow 1

### Flow 3: Investor wants ckUSDT

1. User has 10 ICP
2. Goes to ICPSwap.com
3. Swaps 10 ICP → 100 ckUSDT
4. Returns to Mshamba
5. Selects "Pay with ckUSDT"
6. Gets tokens

---

## Testing Locally

### Test ckUSDT Payment

```bash
# 1. Deploy canisters
dfx start --clean --background
dfx deploy token_factory
dfx deploy mshamba_backend

# 2. Create investor profile
dfx identity use investor_identity
dfx canister call mshamba_backend createProfile '(
  "Test Investor",
  "Looking to invest in agriculture",
  vec { variant { Investor } },
  vec {}
)'

# 3. Switch to farmer & create farm
dfx identity use mike
dfx canister call mshamba_backend createFarm '(...)'

# 4. Launch token
dfx canister call mshamba_backend launchFarmToken '("farm-XXXXXXXX")'

# 5. Open for investment
dfx canister call mshamba_backend toggleFarmInvestmentStatus '("farm-XXXXXXXX", true)'

# 6. Preview purchase (as investor)
dfx identity use investor_identity
dfx canister call mshamba_backend previewTokenPurchase '("farm-XXXXXXXX", 1000000000)'

# 7. Buy tokens
dfx canister call mshamba_backend buyFarmTokens '("farm-XXXXXXXX", 1000000000)'
```

### Test ICP Payment

```bash
# 1-5. Same as above

# 6. Preview ICP purchase (ICP = $10.00)
dfx canister call mshamba_backend previewTokenPurchaseWithICP '(
  "farm-123",
  100000000,  # 1 ICP (8 decimals)
  1000        # $10.00 in cents
)'

# 7. Buy with ICP
dfx canister call mshamba_backend buyFarmTokensWithICP '(
  "farm-123",
  100000000,
  1000
)'
```

---

## Frontend Integration

### Dual Currency Toggle

```javascript
<div>
  <button onClick={() => setCurrency('ICP')}>Pay with ICP</button>
  <button onClick={() => setCurrency('ckUSDT')}>Pay with ckUSDT</button>
</div>

{currency === 'ICP' && (
  <ICPPayment farmId={farmId} onSuccess={handleSuccess} />
)}

{currency === 'ckUSDT' && (
  <CkUSDTPayment farmId={farmId} onSuccess={handleSuccess} />
)}
```

### ICP Payment Component

```javascript
const ICPPayment = ({ farmId }) => {
  const [icpAmount, setIcpAmount] = useState('');
  const [icpPrice, setIcpPrice] = useState(null);
  
  useEffect(() => {
    fetchICPPrice().then(setIcpPrice);
  }, []);
  
  const handleBuy = async () => {
    const result = await actor.buyFarmTokensWithICP(
      farmId,
      parseICP(icpAmount),
      icpPrice * 100  // Convert to cents
    );
  };
  
  return (
    <div>
      <input
        value={icpAmount}
        onChange={(e) => setIcpAmount(e.target.value)}
        placeholder="Amount in ICP"
      />
      <p>≈ ${(icpAmount * icpPrice).toFixed(2)} USD</p>
      <button onClick={handleBuy}>Buy Tokens with ICP</button>
    </div>
  );
};
```

---

## Security Considerations

### Current Protections

- Token transfers require backend authorization
- Balance checks before purchase
- Per-user investment limits
- IFO time window enforcement
- Farm ownership verification

### ICP Price Manipulation

**Risk**: User passes fake ICP price to get more tokens

**Mitigation**:
- Phase 1: Frontend-controlled (trust assumption)
- Phase 2: Use decentralized oracle (XRC)
- Phase 3: Multi-oracle consensus

### Investment Limit Bypass

**Protected**: Both functions check USD equivalent against limit

```motoko
let usdEquivalent = (icpAmount * icpPriceUSD) / 100_000_000
```

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

## Roadmap

### Phase 1 (Complete)
- ckUSDT payment support
- ICP payment support
- Dual currency preview functions
- USD-denominated pricing

### Phase 2
- ICRC-2 approve/transferFrom integration (backend pulls funds automatically)
- On-chain ICP price oracle (XRC canister)
- Purchase history tracking
- IFO success/failure conditions with automatic refunds

### Phase 3
- M-Pesa integration (Kenya)
- Accept more stablecoins (ckUSDC, ckETH)
- Multi-currency portfolio tracking
- Built-in DEX swap widget
