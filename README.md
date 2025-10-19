# 🌾 Mshamba: Agricultural Equity Tokenization Platform

> **Transforming Kenyan farms into publicly traded companies through blockchain technology**

The site is live on mainnet at: [https://pri4n-hyaaa-aaaac-a4beq-cai.icp0.io/](https://pri4n-hyaaa-aaaac-a4beq-cai.icp0.io/)

---

## 🎯 Vision

**Mshamba** is the **NASDAQ for Kenyan farms** — a decentralized platform that enables farmers to raise capital by tokenizing farm equity, allowing anyone to invest in real agricultural businesses without traditional loans or banks.

### The Problem We Solve

**For Farmers:**
- 🏦 Bank loans have predatory 15-25% interest rates
- 📄 Heavy collateral requirements risk losing land
- ⏰ Slow approval processes miss market opportunities
- 💸 Debt obligations regardless of harvest success

**For Investors:**
- 🚫 No access to agricultural investment opportunities
- 📊 Lack of transparency in farm operations
- 🔒 Illiquid investments with no exit strategy
- 🌍 Limited to local opportunities only

### Our Solution

**Mshamba enables farmers to:**
- ✅ Raise capital by selling tokenized equity (not taking loans)
- ✅ Keep majority ownership (75%+) and operational control
- ✅ Access global investor pool via M-Pesa and crypto
- ✅ Get funds released via milestone verification (transparency)
- ✅ Share profits through dividend distributions
- ✅ Scale with follow-on funding rounds

**Investors get:**
- ✅ Direct ownership in real agricultural businesses
- ✅ Fractional investments starting from 1,000 KES (~$10)
- ✅ Tradable tokens on secondary markets (liquidity)
- ✅ Dividend income from farm profits
- ✅ Transparent milestone tracking and reporting
- ✅ Portfolio diversification across multiple farms

---

## 💡 How It Works

### Example: Joseph's Potato Farm Expansion

**Situation:**
- Joseph owns 100 acres in Nakuru
- Currently farming 60 acres (supplies St. Mary's School)
- Gets new contract opportunity with St. John's School
- Needs 2,000,000 KES to expand to remaining 40 acres
- Can't get bank loan (15% interest, heavy collateral)

**Mshamba Solution:**

1. **Farm Valuation**
   - Python API analyzes farm data + national agricultural benchmarks
   - Farm valued at 25,000,000 KES (post-expansion)
   - Recommendation: Raise 2M by selling 8% equity

2. **Token Creation**
   - Total: 1,000,000 tokens created
   - Joseph keeps: 870,000 tokens (87% ownership, vesting)
   - Mshamba gets: 50,000 tokens (5% for platform services)
   - IFO sale: 80,000 tokens @ 25 KES each = 2,000,000 KES

3. **Investment (IFO - Initial Farm Offering)**
   - 30-day fundraising period
   - Investors pay via M-Pesa (KES) or crypto (USDC)
   - ~200 investors contribute (avg. 10,000 KES each)
   - Fully funded! 🎉

4. **Milestone-Based Fund Release**
   - Funds held in escrow, released in stages:
     - Milestone 1: Equipment purchase (800K) - Month 1
     - Milestone 2: Land preparation (600K) - Month 2  
     - Milestone 3: Planting complete (400K) - Month 3
     - Milestone 4: First delivery (200K) - Month 5
   - Evidence required: Photos, receipts, GPS coordinates
   - Platform verifies before releasing funds

5. **Harvest & Returns**
   - Year 1 profit: 1,700,000 KES
   - Joseph gets: 87% = 1,479,000 KES (no loan interest!)
   - Investors get: 8% = 136,000 KES (~6.8% ROI)
   - Mshamba gets: 5% = 85,000 KES
   - Token value increases (farm proven successful)

6. **Secondary Trading**
   - Post-milestone trading windows
   - P2P marketplace for liquidity
   - Investors can exit or hold for more dividends
   - Token price reflects farm performance

---

## 📌 Key Features  

---

### 🏗️ Platform Components

**1. Dynamic ICRC-1 Token Factory**
- Each farm gets its own ICRC-1 compliant token
- Customizable name, symbol, supply, and decimals
- ~2T cycles (~$2.50) per token creation
- Instant deployment (~7 seconds)

**2. Equity Structure**
- Farmer: Retains 75%+ ownership with vesting
- Investors: Purchase 8-20% through IFO
- Platform: Earns 5% for valuation & services

**3. Payment Integration**
- M-Pesa STK Push for Kenyan investors (KES)
- Stablecoin (ckUSDC) for international investors
- Automatic KES ↔ USDC conversion
- Milestone-based escrow release

**4. Milestone Verification System**
- Evidence submission (photos, receipts, GPS)
- Platform verification before fund release
- Real-time progress tracking for investors
- Builds trust and accountability

**5. Secondary Market**
- Post-milestone trading windows
- P2P marketplace for token exchange
- Price discovery based on farm performance
- Liquidity for investor exits

**6. Dividend Distribution**
- Automatic profit sharing via ICRC-1 transfers
- Proportional to token ownership
- Smart contract enforced fairness

---

## 📑 Table of Contents

- [🌾 Mshamba](#-mshamba-agricultural-equity-tokenization-platform)
  - [🎯 Vision](#-vision)
  - [💡 How It Works](#-how-it-works)
  - [📌 Key Features](#-key-features)
  - [🧠 Technical Architecture](#-technical-architecture)
  - [⚙️ Quick Start](#️-quick-start)
  - [🧪 Testing & Development](#-testing--development)
  - [📚 Documentation](#-documentation)
  - [🌍 Deployment](#-deployment)
  - [🤝 Contributing](#-contributing)

---

## 🧠 Technical Architecture

### Backend (Internet Computer - Motoko)

**Core Canisters:**

```
src/mshamba_backend/
├── main.mo              # Central orchestrator
├── lib/
│   ├── farms.mo         # Farm equity management
│   ├── userProfiles.mo  # KYC & user identity
│   ├── types.mo         # Shared data structures
│   └── farm_escrow.mo   # Milestone-based fund management
```

**Key Modules:**

**1. Farm Management (`farms.mo`)**
- Farm creation with equity parameters
- Token price calculation
- Investor tracking with timestamps
- Dividend distribution logic

**2. Token Factory (`token_factory/` - Rust)**
- Dynamic ICRC-1 ledger creation
- Embeds official ICRC-1 WASM
- Each farm gets unique token canister
- Automatic minting to farm owner

**3. Escrow System (`farm_escrow.mo`)**
- Multi-signature milestone verification
- Evidence submission and review
- Staged fund release mechanism
- Investment tracking and reporting

**4. User Profiles (`userProfiles.mo`)**
- Internet Identity integration
- Role management (Farmer/Investor)
- KYC data storage
- Principal to user mapping

### Frontend (React + Vite)

```
src/mshamba_frontend/src/
├── pages/
│   ├── farmer/           # Farmer dashboards
│   │   ├── FarmListing.jsx
│   │   ├── SetupInvestment.jsx
│   │   └── Valuation.jsx
│   └── investor/         # Investor interfaces
│       ├── FarmDetails.jsx
│       ├── MyAccount.jsx
│       └── Marketplace.jsx
├── components/
│   └── Layout.jsx        # Navigation & layout
├── hooks/
│   └── useAuth.js        # Internet Identity auth
└── App.jsx               # Routing
```

### External Integrations

**1. Farm Intelligence API** (Python - Separate Repo)
- Farm valuation algorithm
- National agricultural data integration
- DCF modeling and benchmarking
- Token economics calculation

**2. Payment Gateway** (To Be Implemented)
- M-Pesa STK Push integration (IntaSend)
- KES → USDC conversion
- USDC escrow management
- Milestone-based disbursement

**3. Chain-Key USDC** (ICP Native)
- Stablecoin pricing and settlement
- 1:1 backed by real USDC
- Fast, cheap transactions
- Multi-chain bridge ready

---

## 🏗️ Data Model

### Farm Token Structure

```motoko
type Farm = {
  farmId: Text;
  owner: Principal;          // Farmer's principal
  name: Text;
  location: Text;
  
  // Financials
  fundingGoal: Nat;          // Total capital to raise
  fundedAmount: Nat;         // Current funding
  tokenPrice: Nat;           // Price per token (in USDC e6s)
  totalShares: Nat;          // Total tokens issued
  
  // Token Info
  tokenName: Text;           // "Sunrise Coffee Token"
  tokenSymbol: Text;         // "SCFT"
  tokenSupply: Nat;          // 1,000,000
  ledgerCanister: ?Principal; // ICRC-1 ledger canister ID
  
  // Equity Structure
  investors: [FarmInvestor]; // All token holders
  isOpenForInvestment: Bool;
  ifoEndDate: ?Int;          // IFO deadline
  
  // Operations
  status: FarmStatus;        // Registered | Funded | Trading
  milestones: [Milestone];   // Fund release schedule
};

type FarmInvestor = {
  investor: Principal;
  amount: Nat;               // USDC invested
  shares: Nat;               // Tokens received
  timestamp: Int;            // Investment date (nanoseconds)
};
```

### Equity Distribution Example

```
Farm Valuation: 25,000,000 KES
Capital Needed: 2,000,000 KES (8%)

Equity Split:
├─ Farmer: 87% (21,750,000 KES worth)
├─ Investors: 8% (2,000,000 KES - IFO)
└─ Mshamba: 5% (1,250,000 KES - services)

Token Creation:
├─ Total: 1,000,000 tokens
├─ Farmer: 870,000 (vested 4 years)
├─ Investors: 80,000 (liquid after IFO)
└─ Mshamba: 50,000 (vested 2 years)
```  

---

## ⚙️ Running Locally

Start the replica and install dependencies:  

```bash
# Start replica in background
dfx start --background  

# Check Node installation
node --version  

# Install frontend dependencies
npm install --save-dev vite @types/node  
```

Deploy canisters:  

```bash
dfx deploy

# Top up token_factory with cycles for creating farm tokens
dfx canister deposit-cycles 10000000000000 token_factory
```

> **Note:**  
> The `token_factory` canister needs cycles to dynamically create ICRC-1 ledgers for each farm (~2T cycles per token).

Once deployed, access your app at:  
`http://localhost:4943?canisterId={asset_canister_id}`  

### Frontend Development
```bash
npm run generate   # regenerate Candid after backend changes
npm start          # start dev server at http://localhost:8080
```

### Creating a Farm with Dynamic Token (after clean deploy)
```bash
# 1. Create farmer profile
dfx canister call mshamba_backend createProfile \
  '("John Farmer", "Organic farming expert", variant { Farmer }, vec { "Certification" })'

# 2. Create a farm with token parameters
dfx canister call mshamba_backend createFarm '(
  "Green Acres Farm",
  "Organic vegetables",
  "Rural Kenya",
  1000000,
  "10 acres",
  "Vegetables",
  12,
  "5000kg",
  "25%",
  "John Doe",
  "10 years",
  "+254123456789",
  "john@farm.com",
  blob "\00\01\02",
  "image/jpeg",
  "Green Acres Token",
  "GAFT",
  1000000000,
  8,
  10000,
  null
)'

# 3. Launch the farm token (creates ICRC-1 ledger)
dfx canister call mshamba_backend launchFarmToken '("FARM_ID")'

# 4. Open farm for investment
dfx canister call mshamba_backend toggleFarmInvestmentStatus '("FARM_ID", true)'
```

---

## 🧪 Testing Token Creation

### ✅ Dynamic ICRC-1 Token Creation

Each farm gets its own ICRC-1 ledger canister when you call `launchFarmToken`:

```bash
# After creating a farm, launch its token
dfx canister call mshamba_backend launchFarmToken '("farm-1234567890")'

# Get the farm details to see the token canister ID
dfx canister call mshamba_backend listFarms

# Query the token ledger (replace LEDGER_ID with actual ID)
dfx canister call LEDGER_ID icrc1_name
dfx canister call LEDGER_ID icrc1_symbol
dfx canister call LEDGER_ID icrc1_total_supply

# Check farm owner's token balance
dfx canister call LEDGER_ID icrc1_balance_of '(record {
  owner = principal "FARMER_PRINCIPAL";
  subaccount = null
})'
```

**Transfer Tokens (farm owner to investor):**
```bash
dfx canister call LEDGER_ID icrc1_transfer '(record {
  to = record { owner = principal "INVESTOR_PRINCIPAL"; subaccount = null };
  amount = 1_000_000_000;
  fee = null;
  memo = null;
  from_subaccount = null;
  created_at_time = null
})'
```

---

### ✅ `mshamba_backend` (User Profiles)

```bash
# Deploy backend
dfx deploy mshamba_backend  

# Create profiles
dfx canister call mshamba_backend createProfile ("John Doe", "Organic farmer", variant { Farmer }, vec { "Organic" })
dfx canister call mshamba_backend createProfile ("Jane Smith", "Sustainable investor", variant { Investor }, vec { "Finance" })

# Fetch profile
dfx canister call mshamba_backend getProfile '(principal "<principal_id>")'

# Manage farms
dfx canister call mshamba_backend createFarm ("Green Acres", "Organic vegetables", "Rural Kenya", 1000000)
dfx canister call mshamba_backend listFarms
dfx canister call mshamba_backend myFarms
```

---

### 🔎 `handleInvest` Function
```motoko
handleInvest: (farmId: text, amount: nat) -> Result
```
- **Params:** `farmId` (Text), `amount` (Nat).  
- **Returns:**  
  - `#ok(Farm)` → updated farm  
  - `#err(Text)` → error message  

Steps:  
1. Retrieve farm by `farmId`.  
2. Check if open for investment.  
3. Verify linked ledger canister.  
4. Simulate token transfer (placeholder).  
5. Update funding & investors.  
6. Record new `Investment`.  
7. Return updated farm.  

---

## 🌍 Mainnet Canister IDs

- `mshamba_backend`: TBD
- `token_factory`: TBD
- `mshamba_frontend`: TBD

> **Note:** Farm token ledgers are created dynamically. Each farm gets its own ICRC-1 canister when `launchFarmToken` is called.  

---

## 🎨 Frontend Customization

- **Site Title:** edit `<title>` in `src/mshamba_frontend/index.html`  
- **Favicon:** replace `sprout.svg` in `src/mshamba_frontend/public/`  
- **Routing:** `/ProfileSelection` → `/profile-selection` (fixed)  

---



**TOKEN FACTORY ACTIVE:**  
Mshamba now uses a dynamic token factory system. Each farm project can launch its own ICRC-1 token with customizable parameters:
- **Token name and symbol** - Farmer chooses during farm creation
- **Total supply and decimals** - Customizable token economics
- **Transfer fee** - Set by farm owner
- **Automatic minting** - Entire supply minted to farm owner on launch

See `TOKEN_FACTORY_INTEGRATION.md` for detailed documentation.  

---

