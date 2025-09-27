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
chmod +x embed_icrc1_wasm.sh
./embed_icrc1_wasm.sh

dfx deploy
```

> **Note:**  
> The `farm1_ledger` canister requires an initialization argument, provided in the `farm1_ledger.args` file at the project root.

Once deployed, access your app at:  
`http://localhost:4943?canisterId={asset_canister_id}`  

### Frontend Development
```bash
npm run generate   # regenerate Candid after backend changes
npm start          # start dev server at http://localhost:8080
```

### Recreating Test Data (after clean deploy)
```bash
# Use default identity
dfx identity use default  

# Create farmer profile
dfx canister call mshamba_backend createProfile \
  '("Default Farmer", "Bio", variant { Farmer }, vec { "General Farming" }, "https://example.com/farmer.jpg")'

# Create a farm
dfx canister call mshamba_backend createFarm \
  '("Green Acres", "Organic vegetables", "Rural Kenya", 1000000, "https://example.com/green_acres.jpg", "Vegetables", "10 acres", 100, 365)'

# Link farm to ledger
dfx canister call mshamba_backend updateFarmLedger \
  '("FARM_ID", principal "uxrrr-q7777-77774-qaaaq-cai")'
```

---

## 🧪 Testing Canisters

### ✅ `farm1_ledger` (Token Ledger)

- Tokens initialized via `farm1_ledger.args` → `initial_balances`.  
- Behavior: `icrc1_transfer` from `minting_account` acts as **mint** (increasing supply).  

```bash
# Deploy with args
dfx deploy farm1_ledger --argument-file farm1_ledger.args --mode reinstall --yes  

# Check metadata
dfx canister call farm1_ledger icrc1_metadata  

# Check total supply
dfx canister call farm1_ledger icrc1_total_supply  

# Check balance
dfx canister call farm1_ledger icrc1_balance_of '(record { owner = principal "YOUR_ADMIN_PRINCIPAL"; subaccount = null })'
```

**Transfer Tokens (from admin):**
```bash
dfx canister call farm1_ledger icrc1_transfer \
  '(record {
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

- `farm1_ledger`: `osevl-taaaa-aaaac-a4bca-cai`  
- `farm2_ledger`: `ovft7-6yaaa-aaaac-a4bcq-cai`  
- `farm3_ledger`: `o4gyd-iqaaa-aaaac-a4bda-cai`  
- `farm4_ledger`: `o3h6x-fiaaa-aaaac-a4bdq-cai`  

---

## 🎨 Frontend Customization

- **Site Title:** edit `<title>` in `src/mshamba_frontend/index.html`  
- **Favicon:** replace `sprout.svg` in `src/mshamba_frontend/public/`  
- **Routing:** `/ProfileSelection` → `/profile-selection` (fixed)  

---



**IMPORTANT NOTE:**  
This is the stable version of the Mshamba platform. The `custom_token_factory` canister has been temporarily removed from deployment to ensure stability and address ongoing development. As a result:  
- Investment functionalities that rely on the token factory are not active.  
- The `openFarmInvestment` function in the backend currently returns an error and is non-functional.  

---

