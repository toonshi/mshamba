# 🏦 Four-Wallet System Implementation Guide

## Overview

The Four-Wallet System is Mshamba's core innovation for de-risking agricultural investment through milestone-based escrow and transparent fund management.

---

## 🎯 The Four Wallets

### 1. **Farm Wallet (Escrow Smart Contract)**
- **Purpose:** Holds IFO proceeds, releases funds milestone-by-milestone
- **Implementation:** `FarmEscrow` canister instance per farm
- **Key Feature:** Cryptographically locked funds, requires verified evidence for release

### 2. **Farmer's Wallet**
- **Purpose:** Holds majority equity stake (tokens) + receives dividends
- **Implementation:** Farmer's ICP principal + farm token balance
- **Key Feature:** Pro-rata dividend distribution based on token ownership

### 3. **Investor's Wallet**
- **Purpose:** Holds purchased farm tokens, receives dividends
- **Implementation:** Investor's ICP principal + farm token balance
- **Key Feature:** Liquid tokens tradeable on secondary market/DEX

### 4. **Mshamba Wallet (Platform Treasury)**
- **Purpose:** Receives platform equity + transaction fees
- **Implementation:** Platform principal
- **Key Feature:** Sustainable revenue model

---

## 🔄 Complete Investment Flow

### Phase 1: Farm Creation & Token Launch
```
1. Farmer creates farm with IFO parameters
   ├─ Token price (e.g., 1 token = 0.01 ICP)
   ├─ Funding goal (e.g., 10M ICP)
   ├─ IFO deadline
   ├─ Min/max investment per user
   └─ Milestones defined

2. Farmer launches farm token
   ├─ ICRC-1 ledger created
   ├─ Total supply minted to farmer
   └─ Farm receives token canister ID

3. Farmer initializes escrow
   ├─ FarmEscrow instance created
   ├─ Milestones loaded into escrow
   └─ IFO activated
```

### Phase 2: IFO (Initial Farm Offering)
```
4. Investor browses farms
   ├─ Views farm details
   ├─ Sees token price and IFO info
   ├─ Reviews milestones
   └─ Checks farmer credentials

5. Investor invests in farm
   ├─ Sends ICP to Farm Escrow
   ├─ ICP locked in escrow
   ├─ Calculates tokens: investment / token_price
   ├─ Escrow calls token ledger
   ├─ Tokens transferred: Farmer → Investor
   └─ Investment recorded

6. IFO completes
   ├─ Target reached or deadline hit
   ├─ IFO closes
   ├─ Funds locked in escrow
   └─ Milestone process begins
```

### Phase 3: Milestone-Based Disbursement
```
7. Farmer reaches milestone
   ├─ e.g., "Irrigation system installed"
   └─ Submits evidence:
       ├─ Invoice/receipt
       ├─ Photos (IPFS hashes)
       ├─ GPS coordinates
       └─ Description

8. Platform/DAO verifies
   ├─ Authorized verifier reviews evidence
   ├─ Checks invoice authenticity
   ├─ Validates photos/GPS
   └─ Approves or rejects

9. Automatic disbursement
   ├─ Approved → ICP released from escrow
   ├─ Transferred to farmer's wallet
   ├─ Farmer uses funds for milestone expense
   └─ Process repeats for next milestone
```

### Phase 4: Harvest & Profit Distribution
```
10. Farm generates profit
    ├─ Harvest sold
    ├─ Revenue collected
    └─ Net profit calculated

11. Dividend distribution
    ├─ Platform calculates per-token dividend
    ├─ All token holders identified
    ├─ Pro-rata distribution:
        ├─ Farmer (holds remaining tokens)
        ├─ Investors (pro-rata)
        └─ Platform (treasury tokens/fee)
    └─ ICP sent to all wallets
```

---

## 📊 Data Structures

### IFO Details
```motoko
type IFODetails = {
  targetRaise: Nat;        // Goal in e8s
  currentRaised: Nat;      // Progress
  tokenPrice: Nat;         // Price per token
  ifoStartDate: Int;
  ifoEndDate: Int;
  minInvestment: Nat;
  maxInvestment: ?Nat;
  isActive: Bool;
};
```

### Milestone
```motoko
type Milestone = {
  id: Nat;
  title: Text;
  description: Text;
  requiredAmount: Nat;
  deadline: Int;
  status: MilestoneStatus;  // Pending | EvidenceSubmitted | Verified | Disbursed | Rejected
  evidence: ?MilestoneEvidence;
  verifiedBy: ?Principal;
  verificationDate: ?Int;
  disbursementDate: ?Int;
};
```

### Investment Record
```motoko
type Investment = {
  id: Nat;
  investor: Principal;
  amountICP: Nat;
  tokensReceived: Nat;
  timestamp: Int;
};
```

---

## 🔧 Backend API Endpoints

### Farm & Token Management
- `createFarm(...)` - Create farm with IFO params
- `launchFarmToken(farmId)` - Deploy ICRC-1 token
- `initializeFarmEscrow(farmId)` - Create escrow smart contract
- `toggleFarmInvestmentStatus(farmId, status)` - Open/close IFO

### Investment Flow
- `investInFarm(farmId, amountICP)` - Investor buys tokens
- `getInvestments(farmId)` - View all farm investments
- `getMyInvestments()` - View user's investments

### Milestone Management
- `addMilestone(farmId, title, description, amount, deadline)` - Define milestone
- `submitMilestoneEvidence(farmId, milestoneId, evidence)` - Farmer submits proof
- `verifyMilestone(farmId, milestoneId, approved, notes)` - Admin verifies
- `disburseMilestone(farmId, milestoneId)` - Release funds to farmer
- `getMilestones(farmId)` - View all milestones

### Dividend Distribution
- `distributeDividends(farmId, totalAmount)` - Distribute profits
- `getDividendHistory(farmId)` - View past distributions
- `getMyDividends()` - View user's dividend earnings

### Queries & Stats
- `getEscrowStats(farmId)` - View escrow statistics
- `getLockedFunds(farmId)` - See undisbursed amount
- `getVerifiers()` - List authorized verifiers
- `addVerifier(principal)` - Add new verifier (platform only)

---

## 💡 Key Features & Benefits

### Risk Mitigation
| Risk | Traditional | Mshamba Solution |
|------|------------|------------------|
| Misuse of funds | High - bulk upfront disbursement | **Eliminated** - milestone-based release |
| No accountability | Weak monitoring | **Strong** - photo/GPS/invoice evidence |
| Farmer default | Bank losses | **Mitigated** - funds already spent on verified assets |
| Investor fraud | Common | **Prevented** - transparent on-chain records |

### Transparency
- **All investments recorded on-chain**
- **Public milestone progress**
- **Verifiable evidence (IPFS)**
- **Real-time escrow statistics**
- **Immutable dividend history**

### Scalability
- **Automated disbursement** (no manual bank transfers)
- **DAO verification** (decentralized trust)
- **Secondary market** (liquidity via DEX)
- **Cross-border** (global investor access)

---

## 🚀 Implementation Status

### ✅ Completed (Phase 1)
- [x] Token factory system
- [x] Dynamic ICRC-1 token creation
- [x] Farm creation with token parameters
- [x] Basic investment tracking

### 🔨 In Progress (Current Sprint)
- [ ] FarmEscrow canister per farm
- [ ] Milestone management system
- [ ] Evidence submission flow
- [ ] Verification workflow
- [ ] Automated disbursement

### 📋 Planned (Next Sprint)
- [ ] Dividend distribution engine
- [ ] Frontend escrow UI
- [ ] Evidence storage (IPFS integration)
- [ ] DAO verification system
- [ ] Platform treasury management

---

## 📝 Usage Examples

### Example 1: Creating Farm with Milestones
```bash
# Create farm
dfx canister call mshamba_backend createFarm '(
  "Green Acres Farm",
  "Organic vegetables",
  "Kiambu, Kenya",
  10000000,  # 10M ICP goal
  ...
  100000,    # Token price: 0.001 ICP
  1735689600,  # IFO end date
  null       # No max investment
)'

# Launch token
dfx canister call mshamba_backend launchFarmToken '("farm-123")'

# Initialize escrow & add milestones
dfx canister call mshamba_backend initializeFarmEscrow '("farm-123")'
dfx canister call mshamba_backend addMilestone '(
  "farm-123",
  "Seeds & Land Prep",
  "Purchase seeds and prepare land",
  500000,  # 0.5M ICP
  1736294400  # Deadline
)'
```

### Example 2: Investing in Farm
```bash
# Investor buys tokens
dfx canister call mshamba_backend investInFarm '(
  "farm-123",
  1000000  # 1M ICP investment
)'
# Result: Investor receives 10M tokens (1M / 0.0001)
```

### Example 3: Milestone Completion
```bash
# Farmer submits evidence
dfx canister call mshamba_backend submitMilestoneEvidence '(
  "farm-123",
  0,  # Milestone ID
  record {
    invoice = "INV-2024-12345";
    photos = vec { "ipfs://Qm..."; "ipfs://Qm..." };
    gpsCoordinates = opt "1.2921° S, 36.8219° E";
    description = "Irrigation system installed, photos show pipes and water tanks"
  }
)'

# Verifier approves
dfx canister call mshamba_backend verifyMilestone '(
  "farm-123",
  0,
  true,
  "Evidence verified - system operational"
)'

# Automatic disbursement
# → 500K ICP released to farmer's wallet
```

---

## 🎓 Further Reading

- **Technical Architecture:** See `src/mshamba_backend/lib/farm_escrow.mo`
- **Type Definitions:** See `src/mshamba_backend/lib/escrow_types.mo`
- **Token Integration:** See `TOKEN_FACTORY_INTEGRATION.md`
- **Deployment Guide:** See `MAINNET_DEPLOYMENT.md`

---

**The Four-Wallet System makes agriculture investable by eliminating the primary risk: misuse of capital.** 🌾✨
