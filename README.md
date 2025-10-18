# 🌾 Mshamba
The site is live on main net at: [https://pri4n-hyaaa-aaaac-a4beq-cai.icp0.io/](url)

## 📌 Overview

**Mshamba** is a decentralized platform for tokenizing agricultural projects on the **Internet Computer Protocol (ICP)**.  
It enables:  
- Urban investors to invest directly in farms.  
- Landowners to lease unused land.  
- Farmers to raise capital transparently without predatory loans.  
- Cooperation across the entire agricultural supply chain.  

---

## 📑 Table of Contents

- [🌾 Mshamba](#-mshamba)
  - [📌 Overview](#-overview)
  - [🧠 Project Architecture](#-project-architecture)
    - [Central Controller (`main.mo`)](#1-mainmo--central-controller)
    - [User Identity & Roles (`profiles.mo`)](#2-profilesmo--user-identity--roles)
    - [Farm Project Management (`farms.mo`)](#3-farmsmo--farm-project-management)
    - [Shared Type Definitions (`types.mo`)](#7-typesmo--shared-type-definitions)
  - [⚙️ Running Locally](#️-running-locally)
  - [🧪 Testing Canisters](#-testing-canisters)
    - [Token Ledger (`farm1_ledger`)](#-farm1_ledger-token-ledger)
    - [User Profiles (`mshamba_backend`)](#-mshamba_backend-user-profiles)
  - [🎨 Frontend Customization](#-frontend-customization)
  - [🌍 Mainnet Canister IDs](#-mainnet-canister-ids)
  - [🌱 Farm Image References](#-farm-image-references)

---

## 🧠 Project Architecture

### 1. `main.mo` — Central Controller
- Orchestrates all modules (`profiles`, `farms`, `land`, `investments`).  
- Routes API calls from the frontend or other actors.  
- Token-related functionalities are currently **inactive**.  

---

### 2. `profiles.mo` — User Identity & Roles
Stores and manages user data:  
- **Fields:** name, email, role, bio, location, joinedAt, wallet address.  
- **Functions:**  
  - `upsertProfile` → create or update a profile  
  - `myProfile` → view your own profile  
  - `getProfile` → view another user’s profile  
  - `listUsers` → list all registered users  

---

### 3. `farms.mo` — Farm Project Management
Handles creation and funding of farms:  
- **Fields:** farm name, description, owner, funding goal, shares, status, investors.  
- **Functions:**  
  - `createFarm` → post a new project  
  - `getFarm` → retrieve a farm  
  - `listFarms` → list all farms  
  - `listFarmsByOwner` → farms owned by caller  

---

### 7. `types.mo` — Shared Type Definitions
Defines core data structures:  
- Types: `Farm`, `UserProfile`, `FarmShare`, `Investment`, `LandListing`, `Role`, etc.  
- `Result<T>`: standard success/error response wrapper.  

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

