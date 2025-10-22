# Mshamba Technical Architecture
## Detailed System Design & Implementation

**Version 1.0** | **October 2025**

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Internet Computer Architecture](#internet-computer-architecture)
3. [Smart Contract Design](#smart-contract-design)
4. [Payment Integration](#payment-integration)
5. [Data Models](#data-models)
6. [Security Considerations](#security-considerations)
7. [Scalability & Performance](#scalability--performance)

---

## System Overview

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                            │
│   React + Vite | Internet Identity | Plug Wallet             │
└─────────────────────────┬────────────────────────────────────┘
                          │
┌─────────────────────────┴────────────────────────────────────┐
│                 INTERNET COMPUTER CANISTERS                   │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  mshamba_backend (Motoko)                            │   │
│  │  ├─ Farm management                                  │   │
│  │  ├─ User profiles & KYC                              │   │
│  │  ├─ Investment tracking                              │   │
│  │  └─ Milestone coordination                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  token_factory (Rust)                                │   │
│  │  ├─ Dynamic ICRC-1 ledger creation                   │   │
│  │  ├─ Embedded WASM management                         │   │
│  │  └─ Cycle management                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  farm_escrow (Motoko)                                │   │
│  │  ├─ Multi-sig escrow                                 │   │
│  │  ├─ Milestone verification                           │   │
│  │  ├─ Fund disbursement                                │   │
│  │  └─ Dividend distribution                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ICRC-1 Ledgers (per farm)                           │   │
│  │  ├─ Token balances                                   │   │
│  │  ├─ Transfer operations                              │   │
│  │  └─ Transaction history                              │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬─────────────────────────────────────┘
                          │
┌─────────────────────────┴────────────────────────────────────┐
│                  EXTERNAL INTEGRATIONS                        │
│  ├─ Farm Intelligence API (Python) - Valuation               │
│  ├─ M-Pesa Gateway (IntaSend) - Payments                     │
│  ├─ ckUSDC Ledger - Stablecoin settlements                   │
│  ├─ National Ag Data - Benchmarks                            │
│  └─ Weather APIs - Risk assessment                           │
└───────────────────────────────────────────────────────────────┘
```

---

## Internet Computer Architecture

### Why ICP?

**1. Performance Advantages**
- **Finality**: 1-2 seconds (vs 15-60s Ethereum)
- **Throughput**: 11,500 queries/sec per subnet
- **Cost**: $0.000001 per transaction (vs $5-50 Ethereum)

**2. Reverse Gas Model**
- Canisters pay for computation (not users)
- Predictable operational costs
- Free transactions for end-users
- Better UX (no wallet approvals for reads)

**3. Web-Serving Capability**
- Serve frontend assets directly from canisters
- No separate hosting needed
- True decentralization (frontend + backend)
- Single deployment command

**4. Chain-Key Cryptography**
- Native Bitcoin/Ethereum integration
- No bridges required
- Multi-chain interoperability built-in

### Canister Management

**Cycle Economics:**
```
Token Factory Canister:
├─ Cost per farm token: ~2T cycles (~$2.50)
├─ Monthly maintenance: ~100B cycles (~$0.12)
└─ Funding strategy: Platform tops up from IFO fees

Farm Ledger Canisters:
├─ Creation cost: 2T cycles (paid by token_factory)
├─ Monthly cost: ~10B cycles (~$0.012) per ledger
└─ Funding: Farmer pays via small token transfer fee

Backend Canister:
├─ Monthly cost: ~500B cycles (~$0.60)
└─ Scales with transaction volume
```

**Auto-Refill Strategy:**
```motoko
// Monitor cycle balance and refill
public shared func checkCycleBalance() : async () {
  let balance = ExperimentalCycles.balance();
  let threshold = 5_000_000_000_000; // 5T cycles
  
  if (balance < threshold) {
    // Alert platform or auto-refill from treasury
    await notifyLowCycles();
  };
};
```

---

## Smart Contract Design

### Core Backend Canister (`mshamba_backend`)

**File Structure:**
```
src/mshamba_backend/
├── main.mo                    # Canister entry point
├── lib/
│   ├── farms.mo              # Farm creation & management
│   ├── userProfiles.mo       # User identity & KYC
│   ├── types.mo              # Shared type definitions
│   └── farm_escrow.mo        # Milestone & escrow logic
```

**Key Data Structures:**

```motoko
// Farm representation
type Farm = {
  farmId: Text;                   // Unique identifier
  owner: Principal;               // Farmer's principal
  name: Text;
  location: Text;
  description: Text;
  
  // Financial parameters
  valuation: Nat;                 // Total farm value (USDC e6s)
  fundingGoal: Nat;               // Capital to raise
  fundedAmount: Nat;              // Currently raised
  tokenPrice: Nat;                // Price per token (USDC e6s)
  minInvestment: Nat;             // Minimum investment amount
  
  // Token information
  tokenName: Text;                // "Joseph's Potato Farm Token"
  tokenSymbol: Text;              // "JPFT"
  tokenSupply: Nat;               // 1,000,000
  tokenDecimals: Nat8;            // 8
  tokenTransferFee: Nat;          // 10000 (0.0001 tokens)
  tokenLogo: ?Text;               // Logo URL or data URI
  ledgerCanister: ?Principal;     // ICRC-1 ledger canister ID
  
  // Equity structure
  farmerEquityPercent: Nat;       // 87 (represents 87%)
  investorEquityPercent: Nat;     // 8
  platformEquityPercent: Nat;     // 5
  
  // Investment tracking
  investors: [FarmInvestor];      // All investors
  totalShares: Nat;               // Total tokens issued
  isOpenForInvestment: Bool;
  ifoStartDate: ?Int;
  ifoEndDate: ?Int;
  
  // Farm details
  crop: Text;
  size: Text;                     // "100 acres"
  duration: Nat;                  // Months
  expectedYield: Text;
  expectedROI: Text;
  
  // Farmer information
  farmerName: Text;
  experience: Text;
  phone: Text;
  email: Text;
  
  // Operational data
  status: FarmStatus;
  createdAt: Int;
  imageContent: Blob;
  imageContentType: Text;
  
  // Milestone & escrow
  hasEscrow: Bool;
  milestones: [Milestone];
  valuationHistory: [Nat];
  sharePriceHistory: [Nat];
};

type FarmInvestor = {
  investor: Principal;
  amount: Nat;                    // USDC invested (e6s)
  shares: Nat;                    // Tokens received
  timestamp: Int;                 // Nanoseconds since epoch
};

type FarmStatus = {
  #Registered;                    // Farm created, not tokenized
  #TokenLaunched;                 // Token created, not open
  #OpenForInvestment;             // IFO active
  #Funded;                        // IFO complete
  #Operating;                     // Funds being deployed
  #Harvested;                     // First harvest complete
  #Trading;                       // Secondary market active
  #Closed;                        // Farm no longer active
};
```

**Critical Functions:**

```motoko
// Farm Creation
public shared({caller}) func createFarm(
  name: Text,
  description: Text,
  location: Text,
  fundingGoal: Nat,
  minInvestment: Nat,
  // ... other parameters
) : async Result<Farm> {
  
  // Validate caller is registered farmer
  switch (getUserProfile(caller)) {
    case (#ok(profile)) {
      if (profile.role != #Farmer) {
        return #err("Only farmers can create farms");
      };
    };
    case (#err(msg)) { return #err(msg) };
  };
  
  // Generate unique farm ID
  let farmId = generateFarmId(name, caller);
  
  // Create farm record
  let farm: Farm = {
    farmId = farmId;
    owner = caller;
    name = name;
    // ... populate all fields
    status = #Registered;
    createdAt = Time.now();
  };
  
  // Store in HashMap
  farmStore.put(farmId, farm);
  
  #ok(farm)
};

// Token Launch
public shared({caller}) func launchFarmToken(
  farmId: Text
) : async Result<Principal> {
  
  // Get farm and verify ownership
  switch (getFarm(farmId, farmStore)) {
    case (#err(msg)) { return #err(msg) };
    case (#ok(farm)) {
      if (farm.owner != caller) {
        return #err("Only farm owner can launch token");
      };
      
      // Check if token already exists
      switch (farm.ledgerCanister) {
        case (?_) { return #err("Token already launched") };
        case null {};
      };
      
      // Call token factory
      let tokenParams = {
        token_name = farm.tokenName;
        token_symbol = farm.tokenSymbol;
        decimals = farm.tokenDecimals;
        total_supply = farm.tokenSupply;
        transfer_fee = farm.tokenTransferFee;
        minting_account_owner = farm.owner;
        token_logo = farm.tokenLogo;
      };
      
      try {
        let result = await TokenFactory.create_farm_token(tokenParams);
        
        switch (result) {
          case (#Ok(ledgerCanisterId)) {
            // Update farm with ledger canister
            let updatedFarm: Farm = {
              farm with
              ledgerCanister = ?ledgerCanisterId;
              status = #TokenLaunched;
            };
            farmStore.put(farmId, updatedFarm);
            
            #ok(ledgerCanisterId)
          };
          case (#Err(msg)) { #err("Token creation failed: " # msg) };
        }
      } catch (e) {
        #err("Failed to call token factory: " # Error.message(e))
      }
    }
  }
};

// Investment Processing
public shared({caller}) func investInFarm(
  farmId: Text,
  amount: Nat                     // USDC amount (e6s)
) : async Result<Farm> {
  
  switch (getFarm(farmId, farmStore)) {
    case (#err(msg)) { return #err(msg) };
    case (#ok(farm)) {
      
      // Validation
      if (not farm.isOpenForInvestment) {
        return #err("Farm not open for investment");
      };
      
      if (amount < farm.minInvestment) {
        return #err("Below minimum investment");
      };
      
      // Calculate tokens to receive
      // amount (USDC e6s) / tokenPrice (USDC e6s per token) * 10^8 (token decimals)
      let shares = (amount * 100000000) / farm.tokenPrice;
      
      // Create investor record
      let newInvestor: FarmInvestor = {
        investor = caller;
        amount = amount;
        shares = shares;
        timestamp = Time.now();
      };
      
      // Update farm
      let updatedFarm: Farm = {
        farm with
        fundedAmount = farm.fundedAmount + amount;
        totalShares = farm.totalShares + shares;
        investors = Array.append(farm.investors, [newInvestor]);
      };
      
      farmStore.put(farmId, updatedFarm);
      
      // Note: Actual USDC transfer and token minting
      // would happen here in production
      // await transferUSDCToEscrow(caller, amount);
      // await mintFarmTokens(farm.ledgerCanister, caller, shares);
      
      #ok(updatedFarm)
    }
  }
};
```

### Token Factory Canister (`token_factory`)

**Rust Implementation:**

```rust
use ic_cdk::api::management_canister::main::{
    create_canister, install_code, CanisterSettings,
    CreateCanisterArgument, InstallCodeArgument,
};
use candid::{CandidType, Principal};

// Embedded ICRC-1 ledger WASM
const ICRC1_LEDGER_WASM: &[u8] = include_bytes!("assets/icrc1_ledger.wasm.gz");

#[derive(CandidType)]
pub struct TokenParams {
    pub token_name: String,
    pub token_symbol: String,
    pub decimals: u8,
    pub total_supply: u128,
    pub transfer_fee: u128,
    pub minting_account_owner: Principal,
    pub token_logo: Option<String>,
}

#[ic_cdk::update]
pub async fn create_farm_token(params: TokenParams) -> Result<Principal, String> {
    
    // Calculate cycles needed (2T for creation + 100B buffer)
    let cycles_for_creation: u128 = 2_100_000_000_000;
    
    // Create new canister
    let create_args = CreateCanisterArgument {
        settings: Some(CanisterSettings {
            controllers: Some(vec![ic_cdk::id(), params.minting_account_owner]),
            compute_allocation: None,
            memory_allocation: None,
            freezing_threshold: None,
        }),
    };
    
    let create_response = create_canister(create_args, cycles_for_creation)
        .await
        .map_err(|e| format!("Failed to create canister: {:?}", e))?;
    
    let new_canister_id = create_response.0.canister_id;
    
    // Prepare ICRC-1 init args
    let init_args = prepare_icrc1_init_args(params);
    let serialized_args = candid::encode_one(&init_args)
        .map_err(|e| format!("Failed to serialize args: {:?}", e))?;
    
    // Install ledger code
    let install_args = InstallCodeArgument {
        canister_id: new_canister_id,
        wasm_module: ICRC1_LEDGER_WASM.to_vec(),
        arg: serialized_args,
        mode: ic_cdk::api::management_canister::main::CanisterInstallMode::Install,
    };
    
    install_code(install_args)
        .await
        .map_err(|e| format!("Failed to install code: {:?}", e))?;
    
    Ok(new_canister_id)
}
```

### Escrow & Milestone Management

```motoko
// farm_escrow.mo

type Milestone = {
  id: Nat;
  farmId: Text;
  title: Text;
  description: Text;
  requiredAmount: Nat;            // USDC needed
  deadline: Int;
  status: MilestoneStatus;
  evidence: ?MilestoneEvidence;
  verifiedBy: ?Principal;
  verificationDate: ?Int;
  disbursementDate: ?Int;
};

type MilestoneStatus = {
  #Pending;
  #EvidenceSubmitted;
  #Verified;
  #Rejected;
  #Disbursed;
};

type MilestoneEvidence = {
  invoice: Text;                  // IPFS hash or URL
  photos: [Text];                 // Array of IPFS hashes
  gpsCoordinates: ?Text;          // "lat,lon"
  description: Text;
  submissionDate: Int;
  submittedBy: Principal;
};

// Submit evidence
public shared({caller}) func submitMilestoneEvidence(
  farmId: Text,
  milestoneId: Nat,
  invoice: Text,
  photos: [Text],
  gps: ?Text,
  description: Text
) : async Result<Milestone> {
  
  // Verify caller is farm owner
  let farm = getFarm(farmId);
  if (caller != farm.owner) {
    return #err("Only farm owner can submit evidence");
  };
  
  // Find milestone
  var milestone = getMilestone(farmId, milestoneId);
  
  if (milestone.status != #Pending) {
    return #err("Milestone not in pending state");
  };
  
  // Create evidence record
  let evidence: MilestoneEvidence = {
    invoice = invoice;
    photos = photos;
    gpsCoordinates = gps;
    description = description;
    submissionDate = Time.now();
    submittedBy = caller;
  };
  
  // Update milestone
  milestone := {
    milestone with
    status = #EvidenceSubmitted;
    evidence = ?evidence;
  };
  
  saveMilestone(milestone);
  
  // Notify platform for verification
  await notifyPlatformVerificationNeeded(farmId, milestoneId);
  
  #ok(milestone)
};

// Verify milestone (platform only)
public shared({caller}) func verifyMilestone(
  farmId: Text,
  milestoneId: Nat,
  approved: Bool,
  notes: Text
) : async Result<Milestone> {
  
  // Check if caller is authorized verifier
  if (not isAuthorizedVerifier(caller)) {
    return #err("Not authorized to verify milestones");
  };
  
  var milestone = getMilestone(farmId, milestoneId);
  
  if (milestone.status != #EvidenceSubmitted) {
    return #err("No evidence submitted for this milestone");
  };
  
  // Update status
  milestone := {
    milestone with
    status = if (approved) #Verified else #Rejected;
    verifiedBy = ?caller;
    verificationDate = ?Time.now();
  };
  
  saveMilestone(milestone);
  
  // If approved, funds can be disbursed
  if (approved) {
    await notifyFarmerMilestoneApproved(farmId, milestoneId);
  };
  
  #ok(milestone)
};

// Disburse funds
public shared({caller}) func disburseMilestone(
  farmId: Text,
  milestoneId: Nat
) : async Result<Nat> {
  
  let milestone = getMilestone(farmId, milestoneId);
  
  if (milestone.status != #Verified) {
    return #err("Milestone must be verified before disbursement");
  };
  
  // Transfer USDC from escrow to farmer
  let farm = getFarm(farmId);
  let amount = milestone.requiredAmount;
  
  // Call USDC ledger
  let usdc_ledger = actor("minting_canister_id") : ICRC1;
  
  let transferResult = await usdc_ledger.icrc1_transfer({
    from_subaccount = ?farmEscrowSubaccount(farmId);
    to = {
      owner = farm.owner;
      subaccount = null;
    };
    amount = amount;
    fee = null;
    memo = null;
    created_at_time = ?Time.now();
  });
  
  switch (transferResult) {
    case (#Ok(blockIndex)) {
      // Update milestone
      milestone := {
        milestone with
        status = #Disbursed;
        disbursementDate = ?Time.now();
      };
      
      saveMilestone(milestone);
      
      #ok(amount)
    };
    case (#Err(err)) {
      #err("Transfer failed: " # debug_show(err))
    };
  }
};
```

---

## Payment Integration

### M-Pesa STK Push Flow

```javascript
// Frontend initiates payment
async function investViaMpesa(farmId, amountKES) {
  // Call platform payment gateway
  const response = await fetch('/api/mpesa/initiate', {
    method: 'POST',
    body: JSON.stringify({
      farmId,
      amountKES,
      phoneNumber: userPhone,
      investorPrincipal: principal.toText()
    })
  });
  
  const { invoiceId } = await response.json();
  
  // User receives STK push on phone
  // Platform polls for payment confirmation
  pollPaymentStatus(invoiceId);
}
```

**Backend Gateway (Node.js/Python):**

```python
# mpesa_gateway.py
from intasend import APIService

def initiate_mpesa_payment(amount_kes, phone, farm_id, investor_principal):
    # Initialize IntaSend
    service = APIService(
        token=INTASEND_TOKEN,
        publishable_key=INTASEND_PUBLIC_KEY
    )
    
    # Create STK push
    response = service.collect.mpesa_stk_push(
        phone_number=phone,
        amount=amount_kes,
        narrative=f"Investment in farm {farm_id}",
        api_ref=f"INV-{farm_id}-{investor_principal[:8]}"
    )
    
    invoice_id = response['invoice']['invoice_id']
    
    # Store pending investment
    pending_investments[invoice_id] = {
        'farm_id': farm_id,
        'investor': investor_principal,
        'amount_kes': amount_kes,
        'status': 'pending'
    }
    
    return invoice_id

# Webhook handler
@app.post('/webhook/mpesa')
def mpesa_callback(data):
    invoice_id = data['invoice_id']
    status = data['status']
    
    if status == 'COMPLETE':
        investment = pending_investments[invoice_id]
        
        # Convert KES to USDC
        amount_usdc = convert_kes_to_usdc(investment['amount_kes'])
        
        # Call ICP backend to record investment
        result = await actor.investInFarm(
            investment['farm_id'],
            amount_usdc
        )
        
        if result.ok:
            # Mint farm tokens to investor
            await mint_tokens_to_investor(
                investment['farm_id'],
                investment['investor'],
                result.shares
            )
```

### ckUSDC Integration

```motoko
// Transfer USDC from investor to escrow
let ckUSDC_ledger = actor("ckusdc_canister_id") : ICRC1;

public func transferUSDCToEscrow(
  investor: Principal,
  farmId: Text,
  amount: Nat
) : async Result<Nat> {
  
  let transferArgs = {
    from_subaccount = null;
    to = {
      owner = Principal.fromActor(this);
      subaccount = ?farmEscrowSubaccount(farmId);
    };
    amount = amount;
    fee = null;
    memo = ?Text.encodeUtf8("Investment in " # farmId);
    created_at_time = ?Time.now();
  };
  
  let result = await ckUSDC_ledger.icrc1_transfer(transferArgs);
  
  switch (result) {
    case (#Ok(blockIndex)) { #ok(blockIndex) };
    case (#Err(err)) { #err(debug_show(err)) };
  }
};
```

---

## Data Models

### User Profile

```motoko
type UserProfile = {
  principal: Principal;
  name: Text;
  email: Text;
  role: UserRole;
  bio: Text;
  location: Text;
  joinedAt: Int;
  
  // KYC data
  idVerified: Bool;
  idType: ?Text;                 // "National ID", "Passport"
  idNumber: ?Text;
  phoneVerified: Bool;
  phone: ?Text;
  
  // Investment history
  totalInvested: Nat;
  activeInvestments: Nat;
  portfolioValue: Nat;
};

type UserRole = {
  #Farmer;
  #Investor;
  #Admin;
};
```

### Investment Record

```motoko
type Investment = {
  investmentId: Text;
  investor: Principal;
  farmId: Text;
  amount: Nat;                   // USDC invested
  sharesReceived: Nat;           // Tokens received
  timestamp: Int;
  txHash: ?Text;                 // USDC transfer block index
  tokenTxHash: ?Text;            // Farm token mint block index
};
```

---

## Security Considerations

### Access Control

```motoko
// Role-based permissions
func requireFarmer(caller: Principal) : Result<()> {
  switch (getUserProfile(caller)) {
    case (#ok(profile)) {
      if (profile.role == #Farmer) { #ok(()) }
      else { #err("Farmer role required") }
    };
    case (#err(msg)) { #err(msg) };
  }
};

// Farm ownership check
func requireFarmOwner(caller: Principal, farmId: Text) : Result<()> {
  switch (getFarm(farmId)) {
    case (#ok(farm)) {
      if (farm.owner == caller) { #ok(()) }
      else { #err("Not farm owner") }
    };
    case (#err(msg)) { #err(msg) };
  }
};
```

### Input Validation

```motoko
// Sanitize user inputs
func validateFarmData(farm: FarmInput) : Result<()> {
  if (farm.name.size() < 3 or farm.name.size() > 100) {
    return #err("Farm name must be 3-100 characters");
  };
  
  if (farm.fundingGoal < 100000 or farm.fundingGoal > 100000000) {
    return #err("Funding goal must be 100K-100M KES");
  };
  
  if (farm.minInvestment < 1000) {
    return #err("Minimum investment must be at least 1000 KES");
  };
  
  #ok(())
};
```

### Reentrancy Protection

```motoko
// Use stable variables for critical state
stable var investmentLock: HashMap.HashMap<Text, Bool> = HashMap.HashMap(10, Text.equal, Text.hash);

public shared({caller}) func investInFarm(farmId: Text, amount: Nat) : async Result<Farm> {
  
  // Check lock
  switch (investmentLock.get(farmId)) {
    case (?true) { return #err("Investment in progress") };
    case _ {};
  };
  
  // Set lock
  investmentLock.put(farmId, true);
  
  // Execute investment logic
  let result = await processInvestment(caller, farmId, amount);
  
  // Release lock
  investmentLock.put(farmId, false);
  
  result
};
```

---

## Scalability & Performance

### Data Storage Optimization

```motoko
// Use stable memory for large datasets
import StableMemory "mo:base/ExperimentalStableMemory";

// Paginated queries
public query func listFarms(offset: Nat, limit: Nat) : async [Farm] {
  let farms = Iter.toArray(farmStore.vals());
  let end = Nat.min(offset + limit, farms.size());
  Array.tabulate<Farm>(end - offset, func(i) = farms[offset + i])
};
```

### Async Call Patterns

```motoko
// Parallel async calls
public func batchVerifyMilestones(milestones: [Nat]) : async [Result<Milestone>] {
  let promises = Array.map<Nat, async Result<Milestone>>(
    milestones,
    func(id) = verifyMilestone(id)
  );
  
  await* promises
};
```

---

## Deployment & DevOps

### Canister Upgrade Strategy

```bash
# Test upgrade on local replica
dfx deploy mshamba_backend --mode upgrade

# Upgrade mainnet with backup
dfx canister --network ic call mshamba_backend backup_state
dfx deploy --network ic mshamba_backend --mode upgrade
dfx canister --network ic call mshamba_backend verify_state
```

### Monitoring & Alerts

```motoko
// Health check endpoint
public query func health() : async {
  status: Text;
  cycleBalance: Nat;
  farmsCount: Nat;
  investorsCount: Nat;
} {
  {
    status = "healthy";
    cycleBalance = ExperimentalCycles.balance();
    farmsCount = farmStore.size();
    investorsCount = userStore.size();
  }
};
```

---

## Future Enhancements

1. **Oracle Integration** - Real-time commodity prices
2. **Cross-Chain** - Deploy on Sui, Hedera, Polygon
3. **Mobile SDK** - React Native integration
4. **GraphQL API** - Better data querying
5. **IPFS Integration** - Decentralized file storage
6. **Governance** - Token holder voting
7. **Insurance Protocol** - Crop insurance via smart contracts

---

**For implementation questions:** developers@mshamba.io  
**Security audits:** Contact for bug bounty program

**© 2025 Mshamba Technologies Ltd.**
