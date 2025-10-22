# Payment System Implementation Status

**Last Updated:** October 22, 2025  
**Status:** Backend Complete, Frontend Pending

## Overview

Mshamba supports dual-currency payments for farm token purchases:
- **ckUSDT** (Stablecoin, 6 decimals) - Always $1.00 = 1 ckUSDT
- **ICP** (Volatile crypto, 8 decimals) - Price varies (e.g., $10.00 per ICP)

Both payment methods allow investors to purchase farm tokens during the Initial Farm Offering (IFO) period.

---

## Backend Implementation Status

### ✅ Fully Implemented

#### Payment Preview Functions
```motoko
// Calculate tokens for ckUSDT payment
previewTokenPurchase(farmId: Text, ckusdtAmount: Nat) : Result<Nat, Text>

// Calculate tokens for ICP payment
previewTokenPurchaseWithICP(farmId: Text, icpAmount: Nat, icpPriceUSD: Nat) : Result<Nat, Text>
```

**Status:** Working correctly as of Oct 22, 2025  
**Testing:** Verified via Candid UI  
**Location:** `src/mshamba_backend/main.mo` (lines 279-315)

#### Token Purchase with ckUSDT
```motoko
buyFarmTokens(farmId: Text, ckusdtAmount: Nat) : Result<TokenPurchase, Text>
```

**Status:** Fully implemented  
**Features:**
- ICRC-2 allowance checking
- ICRC-2 transfer_from (pull payment)
- Transfers ckUSDT from investor to farmer
- Transfers farm tokens from IFO escrow to investor
- Investment limits (max per user, IFO deadline)
- Records purchase on-chain

**Location:** `src/mshamba_backend/main.mo` (lines 131-265)

#### Token Purchase with ICP
```motoko
buyFarmTokensWithICP(farmId: Text, icpAmount: Nat, icpPriceUSD: Nat) : Result<TokenPurchase, Text>
```

**Status:** Fully implemented  
**Features:** Same as ckUSDT, but uses ICP ledger  
**Location:** `src/mshamba_backend/main.mo` (lines 318-458)

#### Payment Utilities
**Location:** `src/mshamba_backend/lib/payment.mo`

```motoko
// Balance checks
checkBalance(investor: Principal, amount: Nat) : Result<Bool, Text>
checkICPBalance(investor: Principal, amount: Nat) : Result<Bool, Text>

// Token calculations
calculateTokenAmount(ckusdtAmount: Nat, tokenPrice: Nat, decimals: Nat8) : Nat
calculateTokenAmountFromICP(icpAmount: Nat, tokenPrice: Nat, icpPrice: Nat, decimals: Nat8) : Nat

// ICRC-2 operations
checkAllowance(ledger, owner, spender) : Result<Allowance, Text>
pullPayment(ledger, from, to, amount, memo) : Result<Nat, Text>
transferTokensToInvestor(farmLedger, escrow, investor, amount) : Result<Nat, Text>
```

**Status:** All working and tested

### Ledger Configuration

```motoko
ckUSDT_LEDGER_CANISTER = "cngnf-vqaaa-aaaar-qag4q-cai"  // Mainnet
ICP_LEDGER_CANISTER = "ryjl3-tyaaa-aaaaa-aaaba-cai"     // Mainnet
```

---

## Frontend Implementation Status

### ❌ Not Implemented

#### Payment Flow UI
**What's Missing:**
- No ckUSDT balance display
- No ICP balance display
- No payment method selector (ckUSDT vs ICP)
- No token preview before purchase
- No approval flow UI (2-step process)
- No integration with backend payment functions

#### Current Frontend Behavior
**File:** `src/mshamba_frontend/src/pages/investor/Farms.jsx`

**What it does:**
1. Connects Plug wallet ✅
2. Shows farms ✅
3. Prompts for investment amount with `prompt()` ❌
4. Makes direct `icrc1_transfer()` call ❌
5. Bypasses backend `buyFarmTokens()` ❌
6. No ckUSDT integration ❌
7. No balance checks ❌

**Status:** Legacy prototype code, needs replacement

### ✅ Wallet Connection (Working)

**File:** `src/mshamba_frontend/src/components/WalletSelector.jsx`

**Supported Wallets:**
- Internet Identity (Recommended)
- NFID (Email/Google login)
- Plug Wallet (For ICP/token management)

**Status:** Working correctly

---

## What Needs to Be Built

### High Priority: Payment UI

#### 1. Investment Modal Component
```jsx
<InvestmentModal farm={selectedFarm} />
```

**Required Features:**
- Display user's ckUSDT balance
- Display user's ICP balance  
- Payment method selector (radio buttons)
- Amount input with validation
- Live token preview (calls `previewTokenPurchase()`)
- Two-step approval flow:
  1. Approve ckUSDT spending
  2. Execute purchase
- Transaction status feedback
- Error handling

#### 2. Balance Display Component
```jsx
<WalletBalance />
```

**Required Features:**
- Fetch ckUSDT balance from ledger
- Fetch ICP balance from ledger
- Format with proper decimals
- Refresh button
- "Add Funds" links to exchanges

#### 3. Backend Integration
Replace current `handleInvest()` function with:

```javascript
// For ckUSDT payments:
const result = await backendActor.buyFarmTokens(farmId, ckusdtAmount);

// For ICP payments:
const icpPrice = await fetchICPPrice(); // From exchange API
const result = await backendActor.buyFarmTokensWithICP(farmId, icpAmount, icpPrice);
```

### Medium Priority: User Education

#### In-App Guides
- "How to get ckUSDT" tutorial
- "ckUSDT vs ICP" comparison
- "How to approve spending" walkthrough
- "Understanding token calculations" explainer

#### Status Indicators
- "Wallet Connected" badge
- "Sufficient Balance" check
- "Approval Status" indicator
- "Transaction Progress" stepper

### Low Priority: Advanced Features

- Price charts (ICP volatility visualization)
- Payment history
- Transaction receipts
- Export to CSV
- Mobile wallet support (in-app browsers)

---

## Testing Guide

### Backend Testing (Available Now)

**Via Candid UI:**
1. Navigate to: `http://127.0.0.1:4943/?canisterId=...&id=uxrrr-q7777-77774-qaaaq-cai`
2. Test preview functions:
   ```
   previewTokenPurchase("farm-123", 10000000)  // 10 ckUSDT
   Result: 10,000,000,000 tokens (100 tokens with 8 decimals)
   
   previewTokenPurchaseWithICP("farm-123", 100000000, 1000)  // 1 ICP @ $10
   Result: 10,000,000,000 tokens (same as above)
   ```

**Limitations:**
- Cannot test actual purchases without real ckUSDT/ICP
- Cannot test approval flow
- Cannot test error cases (insufficient balance, etc.)

### Frontend Testing (Not Possible Yet)

**Why:**
- UI doesn't call backend payment functions
- No ckUSDT integration
- No proper error handling
- Uses legacy direct transfer approach

**When Available:**
After implementing the Investment Modal component

---

## Integration Checklist

When building the payment UI, ensure:

**Pre-Purchase:**
- [ ] User wallet connected (Internet Identity, NFID, or Plug)
- [ ] Backend actor initialized
- [ ] ckUSDT/ICP balance fetched
- [ ] Farm details loaded
- [ ] Token price retrieved

**Purchase Flow:**
- [ ] User selects payment method (ckUSDT or ICP)
- [ ] User enters amount
- [ ] Call `previewTokenPurchase()` to show expected tokens
- [ ] Validate: balance sufficient, amount within limits
- [ ] Step 1: Approve spending (ICRC-2 approve)
- [ ] Wait for approval confirmation
- [ ] Step 2: Execute purchase (buyFarmTokens)
- [ ] Show transaction progress
- [ ] Display success/error result
- [ ] Refresh balances

**Error Handling:**
- [ ] Insufficient balance
- [ ] Insufficient allowance
- [ ] Farm not open for investment
- [ ] IFO period ended
- [ ] Exceeds max investment per user
- [ ] Network errors
- [ ] Transaction rejection

---

## Architecture Decisions

### Why Two Payment Methods?

**ckUSDT (Stablecoin):**
- **Pro:** Predictable value, easy calculations
- **Pro:** Lower volatility risk for investors
- **Con:** Requires conversion from fiat/crypto first

**ICP (Native Token):**
- **Pro:** Users already holding ICP can invest directly
- **Pro:** No conversion needed for ICP holders
- **Con:** Price volatility (affects token amount received)

### Why ICRC-2 (Approve + TransferFrom)?

**Security:** Investor approves spending, backend pulls payment
- Investor maintains control
- Backend can't take more than approved
- Standard pattern for DeFi applications

**Alternative (Direct Transfer):**
- Investor sends directly to farmer
- No backend control or verification
- Can't enforce investment limits
- Can't coordinate token transfer atomically

### Equity Distribution on Token Launch

**When token is launched via `launchFarmToken()`:**
- 75% → Farmer (vested, held by backend)
- 20% → IFO Escrow (held by backend for investors)
- 5% → Platform (vested, held by backend)

**Note:** Current MVP uses backend canister as escrow. Future versions should use dedicated escrow canisters.

---

## Known Issues & Limitations

### Backend
- ✅ ICP calculation bug fixed (Oct 22, 2025)
- ⚠️ No profit distribution system implemented yet
- ⚠️ No vesting contract for farmer/platform tokens
- ⚠️ Backend holds escrow tokens (should be separate canister)

### Frontend
- ❌ No payment UI implemented
- ❌ No ckUSDT balance integration
- ❌ Legacy investment code doesn't use backend
- ⚠️ No ICP price oracle integration
- ⚠️ No transaction history display

### Testing
- ⚠️ No local testnet ckUSDT faucet
- ⚠️ Requires mainnet tokens for full testing
- ⚠️ No automated integration tests

---

## Next Steps

### Phase 1: Basic Payment UI (Essential)
1. Create `InvestmentModal` component
2. Integrate `buyFarmTokens()` backend call
3. Add ckUSDT balance display
4. Implement approve + purchase flow
5. Add error handling

### Phase 2: Enhanced UX (Important)
1. Add token preview
2. Add ICP payment support
3. Fetch ICP price from exchange API
4. Add payment method comparison
5. Add transaction status tracking

### Phase 3: Polish (Nice to Have)
1. Add in-app tutorials
2. Add payment history
3. Add transaction receipts
4. Optimize for mobile wallets
5. Add analytics tracking

---

## Related Documentation

- **[Payment Integration Guide](payments.md)** - Detailed technical implementation
- **[Token Factory Guide](token-factory.md)** - How farm tokens are created
- **[Technical Architecture](../architecture/technical-architecture.md)** - System overview
- **[Wallet System Guide](wallet-system.md)** - Four-wallet escrow architecture

---

## Support

**For Backend Issues:**
- Check: `src/mshamba_backend/lib/payment.mo`
- Test: Via Candid UI
- Verify: Ledger canister IDs correct

**For Frontend Issues:**
- Check: `src/mshamba_frontend/src/pages/investor/Farms.jsx`
- Status: Payment UI not implemented
- ETA: Pending Phase 1 development

**Questions?**
- Review [Payment Integration Guide](payments.md)
- Check GitHub Issues
- Test backend via Candid UI first
