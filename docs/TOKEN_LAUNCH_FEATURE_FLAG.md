# Token Launch Feature Flag

## Overview

Token launch feature is currently **DISABLED** on mainnet to save cycles costs until the platform is ready for production token launches.

---

## Current Status

| Environment | Token Launch | Reason |
|-------------|--------------|--------|
| **Mainnet (Production)** | ❌ Disabled | Save cycles (~2T per token = ~$2.50) |
| **Local (Development)** | ❌ Disabled | Consistent behavior |

---

## What's Disabled

### ❌ Blocked Functions
- `launchFarmToken(farmId)` - Returns error message
- Token creation via token_factory
- ICRC-1 ledger deployment for farms

### ✅ Still Works
- Farm creation (farmers can create farms normally)
- Farm editing
- Profile management  
- Investment opening (without token requirement)
- Viewing farms
- All authentication flows

---

## How It Works

### Code Implementation

**Feature Flag** (`src/mshamba_backend/main.mo`):
```motoko
// Line 27
let ENABLE_TOKEN_LAUNCH : Bool = false;  // Set to true when ready
```

**Query Function** (check from frontend):
```motoko
public query func isTokenLaunchEnabled() : async Bool {
  ENABLE_TOKEN_LAUNCH
}
```

**Guard in launchFarmToken**:
```motoko
if (not ENABLE_TOKEN_LAUNCH) {
  return #err("Token launch is currently disabled. Please contact platform support.");
}
```

**Investment Status Update**:
- When `ENABLE_TOKEN_LAUNCH = false`: Farms can open for investment without tokens
- When `ENABLE_TOKEN_LAUNCH = true`: Requires token launch before opening

---

## User Experience

### When Feature is Disabled (Current)

**Farmer tries to launch token:**
```
❌ Error: "Token launch is currently disabled. Please contact platform support."
```

**Farmer can still:**
- ✅ Create farms with all token parameters
- ✅ Edit farm details
- ✅ Open farm for investment (without token)
- ✅ View their farms

**Investor can still:**
- ✅ Browse farms
- ✅ View farm details
- ✅ See investment opportunities
- ❌ Cannot invest (requires ICRC-2 tokens)

### When Feature is Enabled (Future)

**Full flow works:**
1. Farmer creates farm ✅
2. Farmer launches token (costs 2T cycles) ✅
3. ICRC-1 ledger deployed (~7 seconds) ✅
4. Farmer opens investment ✅
5. Investors can buy tokens with ICP/ckUSDT ✅

---

## Enabling Token Launch

### Step 1: Ensure Token Factory Has Cycles

```bash
# Check current balance
dfx canister status token_factory --network ic

# Should show at least 2T cycles per token you want to create
# Add cycles if needed:
dfx cycles convert --amount 1.5 --network ic  # Get more cycles
dfx canister deposit-cycles 10000000000000 token_factory --network ic  # 10T = 5 tokens
```

### Step 2: Update Feature Flag

Edit `src/mshamba_backend/main.mo`:
```motoko
// Change line 27 from:
let ENABLE_TOKEN_LAUNCH : Bool = false;

// To:
let ENABLE_TOKEN_LAUNCH : Bool = true;
```

### Step 3: Deploy Backend

```bash
# Build and deploy
dfx deploy mshamba_backend --network ic

# Verify it's enabled
dfx canister call mshamba_backend isTokenLaunchEnabled --network ic
# Should return: (true)
```

### Step 4: Test

```bash
# Try launching a token
dfx canister call mshamba_backend launchFarmToken '("your-farm-id")' --network ic

# Should succeed and return ledger canister ID
# Should deduct 2T cycles from token_factory
```

---

## Cost Calculation

### Per Token Launch
- **Cycles**: 2,000,000,000,000 (2T)
- **USD**: ~$2.50
- **Time**: ~7 seconds

### Example Scenarios

**5 Test Farms:**
- Cost: 10T cycles = ~$12.50
- Recommended cycles: 12T (buffer included)
- ICP needed: ~1.5 ICP (at $8/ICP)

**20 Production Farms:**
- Cost: 40T cycles = ~$50
- Recommended cycles: 45T (buffer)
- ICP needed: ~6 ICP (at $8/ICP)

**50 Farms (Launch Phase):**
- Cost: 100T cycles = ~$125
- Recommended cycles: 110T (buffer)
- ICP needed: ~15 ICP (at $8/ICP)

---

## Frontend Integration

### Check Feature Status

```javascript
// In your React component
const [tokenLaunchEnabled, setTokenLaunchEnabled] = useState(false);

useEffect(() => {
  const checkFeature = async () => {
    const enabled = await backend.isTokenLaunchEnabled();
    setTokenLaunchEnabled(enabled);
  };
  checkFeature();
}, [backend]);

// Conditionally show/hide launch button
{tokenLaunchEnabled && (
  <button onClick={handleLaunchToken}>
    Launch Farm Token
  </button>
)}

// Or show disabled state
<button 
  onClick={handleLaunchToken}
  disabled={!tokenLaunchEnabled}
>
  {tokenLaunchEnabled ? 'Launch Token' : 'Token Launch Disabled'}
</button>
```

---

## Migration Path

### Current State (Token Launch Disabled)
```
Farmer → Create Farm → Open Investment → (Manual investment tracking)
                                      ↓
                            No automatic token delivery
                            Farmers track offline
```

### Future State (Token Launch Enabled)
```
Farmer → Create Farm → Launch Token → Open Investment → ICRC-2 Payments
                            ↓                                ↓
                    2T cycles spent                  Automatic token delivery
                    ICRC-1 ledger deployed          Investors get tokens instantly
```

---

## Monitoring

### Check Feature Status
```bash
dfx canister call mshamba_backend isTokenLaunchEnabled --network ic
```

### Check Token Factory Balance
```bash
dfx canister status token_factory --network ic | grep Balance
```

### Count Tokens That Could Be Created
```bash
# Get balance in cycles
BALANCE=$(dfx canister status token_factory --network ic | grep "Balance:" | awk '{print $2}')

# Calculate number of tokens (2T per token)
TOKENS=$((BALANCE / 2000000000000))
echo "Can create $TOKENS farm tokens"
```

---

## FAQ

**Q: Why is it disabled?**
A: To save cycles costs (~$2.50 per token) until platform is ready for production launch.

**Q: Can farmers still create farms?**
A: Yes! Farms can be created and opened for investment without tokens.

**Q: Can investors invest without tokens?**
A: Not automatically. Current ICRC-2 payment system requires tokens. Manual payment tracking would be needed.

**Q: When should I enable it?**
A: When:
  1. Token factory has sufficient cycles (at least 10T for 5 tokens)
  2. You're ready for real investors
  3. You've tested the full flow
  4. Platform is officially launching

**Q: Can I enable it temporarily?**
A: Yes! Just flip the flag, deploy, test, then flip back and redeploy. State is preserved.

**Q: What happens to farms created before enabling?**
A: They can launch tokens after it's enabled. All token parameters are stored in the farm data.

---

## Related Files

- `src/mshamba_backend/main.mo` - Feature flag implementation
- `src/token_factory/` - Token creation canister (Rust)
- `TOKEN_FACTORY_INTEGRATION.md` - Full token system documentation

---

**Current Status**: ❌ **DISABLED** on mainnet  
**To Enable**: Fund token_factory + flip flag + deploy  
**Cost to Enable**: ~1.5 ICP minimum (~$12)
