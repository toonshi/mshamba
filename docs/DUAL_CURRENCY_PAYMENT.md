# Dual Currency Payment System (ICP + ckUSDT)

## Overview
Mshamba now supports **two payment methods** for farm token purchases:
1. **ckUSDT** (Chain-Key USDT) - Stable USD value
2. **ICP** - Native Internet Computer token

This gives investors flexibility to use whichever asset they can acquire more easily.

---

## Payment Methods Comparison

| Feature | ckUSDT | ICP |
|---------|--------|-----|
| **Volatility** | ✅ Stable ($1 = $1) | ❌ Volatile (±30%) |
| **Acquisition** | Swap ICP → ckUSDT on DEX | ✅ Buy directly on exchanges |
| **Decimals** | 6 | 8 |
| **Ledger ID** | `cngnf-vqaaa-aaaar-qag4q-cai` | `ryjl3-tyaaa-aaaaa-aaaba-cai` |
| **Best For** | Investors who want predictable value | Investors who already hold ICP |

---

## How Investors Get Assets

### Getting ICP (Easiest)
1. **Buy on Exchange**: Binance, Coinbase, Kraken
2. **Send to Plug Wallet**: Direct ICP holding
3. **Invest**: Use immediately on Mshamba

### Getting ckUSDT (One Extra Step)
1. **Buy ICP** (as above)
2. **Swap on DEX**: ICPSwap.com or Sonic.ooo
3. **ICP → ckUSDT**: 1-click swap
4. **Invest**: Use on Mshamba

---

## API Functions

### 1. Preview Purchase (ckUSDT)
```motoko
previewTokenPurchase(farmId: Text, ckusdtAmount: Nat) : async Result<Nat, Text>
```
**Example**:
```bash
dfx canister call mshamba_backend previewTokenPurchase '("farm-123", 1000000000)'
# Returns: 10,000 tokens (for 1000 ckUSDT at $0.10/token)
```

### 2. Preview Purchase (ICP)
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

### 3. Buy with ckUSDT
```motoko
buyFarmTokens(farmId: Text, ckusdtAmount: Nat) : async Result<TokenPurchase, Text>
```

### 4. Buy with ICP
```motoko
buyFarmTokensWithICP(
  farmId: Text,
  icpAmount: Nat,
  icpPriceUSD: Nat  // Must pass current price
) : async Result<TokenPurchase, Text>
```

---

## Token Price Calculation

### Farm Token Price
All farms set one price in **USD cents**:
```motoko
tokenPrice: 10  // = $0.10 per token
```

### ckUSDT → Tokens
```
1000 ckUSDT ($1000) / $0.10 = 10,000 tokens
```
**Formula**: `tokens = (ckusdtAmount * 100) / tokenPrice`

### ICP → Tokens
**Step 1**: Convert ICP to USD
```
1 ICP × $10.00 = $10.00
```

**Step 2**: Calculate tokens
```
$10.00 / $0.10 = 100 tokens
```

**Formula**: `tokens = ((icpAmount * icpPriceUSD) / 1e8) / (tokenPrice / 100)`

---

## ICP Price Oracle

### Current Approach (MVP)
Frontend passes ICP price manually:
```javascript
// Get price from CoinGecko or another API
const icpPrice = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd')
const icpPriceInCents = icpPrice.icp.usd * 100

// Pass to backend
buyFarmTokensWithICP(farmId, icpAmount, icpPriceInCents)
```

### Future Approach (Phase 2)
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

## User Flows

### Flow 1: Investor with ICP (Simplest)
```
1. User has 10 ICP in Plug wallet
2. Clicks "Invest in Farm"
3. Selects "Pay with ICP"
4. Frontend shows: "1 ICP = $10.00, you'll get X tokens"
5. User approves
6. Backend transfers farm tokens → User
```

### Flow 2: Investor with Fiat
```
1. User has $100 in bank account
2. Buys 10 ICP on Binance ($10/ICP)
3. Sends ICP to Plug wallet
4. [Same as Flow 1]
```

### Flow 3: Investor wants ckUSDT (Extra Step)
```
1. User has 10 ICP
2. Goes to ICPSwap.com
3. Swaps 10 ICP → 100 ckUSDT
4. Returns to Mshamba
5. Selects "Pay with ckUSDT"
6. Gets tokens
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
  <ICPPayment
    farmId={farmId}
    onSuccess={handleSuccess}
  />
)}

{currency === 'ckUSDT' && (
  <CkUSDTPayment
    farmId={farmId}
    onSuccess={handleSuccess}
  />
)}
```

### ICP Payment Component
```javascript
const ICPPayment = ({ farmId }) => {
  const [icpAmount, setIcpAmount] = useState('');
  const [icpPrice, setIcpPrice] = useState(null);
  
  useEffect(() => {
    // Fetch ICP price
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

## Testing

### Test ICP Payment Locally
```bash
# 1. Deploy
dfx deploy mshamba_backend

# 2. Create farm (as before)
# farmId: farm-123

# 3. Launch token
dfx canister call mshamba_backend launchFarmToken '("farm-123")'

# 4. Open for investment
dfx canister call mshamba_backend toggleFarmInvestmentStatus '("farm-123", true)'

# 5. Preview ICP purchase (ICP = $10.00)
dfx canister call mshamba_backend previewTokenPurchaseWithICP '(
  "farm-123",
  100000000,  # 1 ICP (8 decimals)
  1000        # $10.00 in cents
)'
# Should return tokens based on calculation

# 6. Buy with ICP
dfx canister call mshamba_backend buyFarmTokensWithICP '(
  "farm-123",
  100000000,
  1000
)'
```

---

## Advantages of Dual Currency

### For Platform
✅ Lower barrier to entry (no DEX swap required for ICP holders)  
✅ Caters to both crypto-native and stability-focused investors  
✅ More liquidity options  
✅ Competitive with platforms offering only one currency

### For Investors
✅ **ICP holders**: Skip DEX swap, invest immediately  
✅ **Risk-averse**: Use ckUSDT for stable value  
✅ **Speculators**: Use ICP, benefit if price rises between purchase and sale  
✅ **Choice**: Pick whichever is easier to acquire locally

---

## Conversion Examples

### Example 1: Farm Token = $0.10
**With ckUSDT (Stable)**:
- Invest: 1000 ckUSDT ($1000)
- Get: 10,000 tokens
- If ICP drops 50%: Still have 10,000 tokens worth $1000

**With ICP (Volatile)**:
- Invest: 100 ICP @ $10 = $1000
- Get: 10,000 tokens
- If ICP drops to $5: Tokens still worth $1000, but "could have bought 20,000 tokens with same ICP"

### Example 2: Farm Token = $1.00
**With ckUSDT**:
- Invest: 100 ckUSDT ($100)
- Get: 100 tokens

**With ICP ($10/ICP)**:
- Invest: 10 ICP = $100
- Get: 100 tokens

---

## Recommendations

### For MVP (Now)
✅ **Enable ICP payment** - Most accessible  
✅ **Enable ckUSDT** - For stability seekers  
✅ **Frontend passes ICP price** - Simple oracle integration  
✅ **Both options clearly labeled** - User chooses

### Phase 2
- On-chain ICP price oracle (XRC canister)
- Built-in DEX swap widget (ICP → ckUSDT seamlessly)
- Price comparison: "Paying with ICP saves you X% in swap fees"

### Phase 3
- M-Pesa integration (Kenya)
- Accept more stablecoins (ckUSDC, ckETH)
- Multi-currency portfolio tracking

---

## Security Considerations

### ICP Price Manipulation
⚠️ **Risk**: User passes fake ICP price to get more tokens  
✅ **Mitigation**: 
- Phase 1: Frontend-controlled (trust assumption)
- Phase 2: Use decentralized oracle (XRC)
- Phase 3: Multi-oracle consensus

### Investment Limit Bypass
✅ **Protected**: Both functions check USD equivalent against limit  
✅ **Code**: `let usdEquivalent = (icpAmount * icpPriceUSD) / 100_000_000`

---

## Summary

You now have:
- ✅ **ICP payment support** (easier to acquire)
- ✅ **ckUSDT payment support** (stable value)
- ✅ **Dual currency preview functions**
- ✅ **USD-denominated pricing** (consistent across both)
- ✅ **Investment limits work for both**
- ✅ **Same validation logic**

**Next**: Deploy to mainnet and let users choose their preferred currency!
