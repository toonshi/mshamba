# `mshamba`

# 🌾 Mshamba

**IMPORTANT NOTE:** This is the stable version of the Mshamba platform. The `custom_token_factory` canister has been temporarily removed from the deployment to ensure stability and address ongoing development. Investment functionalities that rely on the token factory are currently not active. The `openFarmInvestment` function in the backend currently returns an error and is not functional.

**Mshamba** is a decentralized platform for tokenizing agricultural projects on the Internet Computer Protocol (ICP). It enables urban investors to invest directly in farms, allows landowners to lease unused land, and empowers farmers to raise capital transparently without predatory loans. It also facilitates cooperation across the entire agricultural supply chain.

---

## Table of Contents
* [🧠 Project Architecture Overview](#-project-architecture-overview)
  * [1. `main.mo` — Central Controller](#1-mainmo--central-controller)
  * [2. `profiles.mo` — User Identity & Roles](#2-profilesmo--user-identity--roles)
  * [3. `farms.mo` — Farm Project Management](#3-farmsmo--farm-project-management)
  * [7. `types.mo` — Shared Type Definitions](#7-typesmo--shared-type-definitions)
* [Running the project locally](#running-the-project-locally)
* [Testing Canisters](#testing-canisters)
  * [Testing `farm1_ledger` (Token Ledger)](#testing-farm1_ledger-token-ledger)
  * [Testing `mshamba_backend` (User Profiles)](#testing-mshamba_backend-user-profiles)
* [Frontend Customization](#frontend-customization)

---

## 🧠 Project Architecture Overview

The project is structured into modular components, each handling a distinct domain of the system:

---

### 1. `main.mo` — Central Controller

- Acts as the orchestrator.
- Connects all modules: profiles, farms, land, investments. (Token-related functionalities are currently inactive).
- Routes API calls from the frontend or other actors.

---

### 2. `profiles.mo` — User Identity & Roles

Manages user profiles across all roles:
- Stores: name, email, role, bio, location, joinedAt, wallet address.
- Functions:
  - `upsertProfile`: create or update your profile.
  - `myProfile`: view your own profile.
  - `getProfile`: view another user's profile.
  - `listUsers`: get all registered users.

---

### 3. `farms.mo` — Farm Project Management

Handles creation and funding of farms:
- Tracks: farm name, description, owner, funding goal, shares, status, investors.
- Functions:
  - `createFarm`: farmer posts a project.
  - `getFarm`: retrieve a specific farm.
  - `listFarms`: all farms in the system.
  - `listFarmsByOwner`: farms owned by the caller.



### 7. `types.mo` — Shared Type Definitions

Defines global data types:
- `Farm`, `UserProfile`, `FarmShare`, `Investment`, `LandListing`, `Role`, etc.
- `Result<T>`: standard way to return success or error.

---



## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash

# Starts the replica, running in the background
dfxt start --background


# Make sure that you have node
node --version

# Install Frontend Dependencies
npm install --save-dev vite @types/node

Run the embed_icrc1_wasm.sh script after making it into an executable
using chmod ....
# Deploys your canisters to the replica and generates your candid interface
dfxt deploy

*Note: The `farm1_ledger` canister requires an initialization argument. This is provided via the `farm1_ledger.args` file located in the project root directory. This file contains the Candid initialization argument for the `farm1_ledger` canister.*
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

*Note: The site name is "Mshamba" and the favicon is `sprout.svg`.*
*Note: The routing issue for `/ProfileSelection` has been fixed to `/profile-selection`.*

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

### Recreating Test Data After Clean Deploy

If you run `dfx start --clean` or `dfx deploy --mode reinstall` on your canisters, their state will be wiped. To recreate a farmer profile, a farm, and link it to the `farm1_ledger` for testing, follow these steps:

1.  **Ensure you are using the `default` identity:**
    ```bash
    dfx identity use default
    ```

2.  **Create a farmer profile for the `default` identity:**
    ```bash
    dfx canister call mshamba_backend createProfile '("Default Farmer", "Bio for default farmer", variant { Farmer }, vec { "General Farming" }, "https://example.com/default_farmer.jpg")'
    ```

3.  **Create a farm:**
    ```bash
    dfx canister call mshamba_backend createFarm '("Green Acres", "A farm specializing in organic vegetables", "Rural Area, Kenya", 1000000, "https://example.com/green_acres.jpg", "Vegetables", "10 acres", 100, 365)'
    ```
    *Note down the `farmId` from the output (e.g., `farm-1756380362474759593`). You will need it for the next step.*

*Note: The `farm1_ledger.args` file is located in the project root directory (`/home/toonshi/production/mshamba/farm1_ledger.args`). This file contains the Candid initialization argument for the `farm1_ledger` canister.*

4.  **Link the newly created farm to the `farm1_ledger`:**
    ```bash
    dfx canister call mshamba_backend updateFarmLedger '("YOUR_NEW_FARM_ID_HERE", principal "uxrrr-q7777-77774-qaaaq-cai")'
    ```
    *Replace `YOUR_NEW_FARM_ID_HERE` with the actual `farmId` from the previous step.*

## Testing Canisters

---

### Testing `farm1_ledger` (Token Ledger)

**Note on Token Transfer Behavior:**
The `icrc1_mint` method is not available in the standard ICRC-1 ledger WASM. Tokens are initialized via `initial_balances` in the `farm1_ledger.args` file during deployment.

**Important:** When `icrc1_transfer` is called by the `minting_account` (e.g., the `mike` identity in our setup), it currently behaves as a **minting function**, increasing the total supply and adding tokens to the recipient's balance without deducting from the sender. Transfers from non-minting accounts will likely fail due to insufficient funds. This behavior is being investigated.

After deploying the `farm1_ledger` canister (e.g., using `dfx deploy farm1_ledger --argument-file farm1_ledger.args --mode reinstall --yes`), you can verify its state:

**Check Token Metadata:**
```bash
dfx canister call farm1_ledger icrc1_metadata
```

**Check Total Supply:**
```bash
dfx canister call farm1_ledger icrc1_total_supply
```

**Check Admin Balance (replace with your admin principal):**
```bash
dfx canister call farm1_ledger icrc1_balance_of '(record { owner = principal "YOUR_ADMIN_PRINCIPAL"; subaccount = null })'
```

**Transfer Tokens to an Investor (from your admin identity):**
First, ensure you are using your admin identity (e.g., `dfx identity use mike`).
Then, get the investor's principal (e.g., `dfx identity get-principal --identity investor`).
Finally, execute the transfer (replace `INVESTOR_PRINCIPAL` with the actual principal and adjust `amount` as needed):
```bash
dfx canister call farm1_ledger icrc1_transfer \
  '(record {
     to = record { owner = principal "INVESTOR_PRINCIPAL"; subaccount = null };
     amount = 1_000_000_000; # Example: 10 tokens (10 * 10^8 smallest units)
     fee = null;
     memo = null;
     from_subaccount = null;
     created_at_time = null
   })'
```

### Testing `mshamba_backend` (User Profiles)

First, deploy the `mshamba_backend` canister:
```bash
dfx deploy mshamba_backend
```

**Create a Farmer Profile:**
```bash
dfx canister call mshamba_backend createProfile (
  "John Doe",
  "Experienced organic farmer.",
  variant { #Farmer },
  vec { "Organic Farming", "Sustainable Agriculture" }
)
```

**Create an Investor Profile:**
```bash
dfx canister call mshamba_backend createProfile (
  "Jane Smith",
  "Passionate about sustainable investments.",
  variant { #Investor },
  vec { "Financial Analysis" }
)
```

**Get a Profile (replace <principal_id> with the principal of the user who created the profile):**
```bash
dfx canister call mshamba_backend getProfile '(principal "<principal_id>")'
```

**Create a Farm:**
```bash
dfx canister call mshamba_backend createFarm (
  "Green Acres",
  "A farm specializing in organic vegetables",
  "Rural Area, Kenya",
  1000000
)
```

**List All Farms:**
```bash
dfx canister call mshamba_backend listFarms
```

**List Farms by Current User:**
```bash
dfx canister call mshamba_backend myFarms
```

#### `handleInvest` Function Explained

The `handleInvest` function allows an investor to invest a certain `amount` into a specific farm identified by its `farmId`.

**Function Signature:**
`handleInvest: (farmId: text, amount: nat) -> (Result);

**Parameters:**
- `farmId`: A `Text` (string) representing the unique identifier of the farm the investor wants to invest in.
- `amount`: A `Nat` (natural number) representing the amount of investment.

**Return Type:**
- `Result`: A Candid `variant` type that can be either:
    - `#ok(Farm)`: If the investment is successful, it returns the updated `Farm` record.
    - `#err(Text)`: If there's an error, it returns an error message as `Text`.

**Internal Logic:**

1.  **Retrieve the Farm:** The function retrieves the farm record using the provided `farmId`.
2.  **Check Investment Status:** It verifies if the farm is open for investment.
3.  **Verify Ledger Canister:** It ensures the farm has a `ledgerCanister` associated, as investments are tied to the token ledger.
4.  **Simulate Token Transfer (Placeholder):** This section is currently a placeholder. In a real-world scenario, this is where the investor's tokens would be transferred to the farm's ledger canister.
5.  **Update Farm Funding and Investors:** It updates the farm's `fundedAmount` and adds the caller (investor's principal) to the `investors` list.
6.  **Store Investment Record:** It creates and stores a new `Investment` record with details like `investmentId`, `investor`, `farmId`, `amount`, and timestamp.
7.  **Return Updated Farm:** If successful, it returns the updated farm record.

**In essence, `handleInvest` orchestrates the process of recording an investment in a farm, updating the farm's state, and (in a complete implementation) facilitating the actual token transfer.**

## Mainnet Canister IDs

The following canisters have been deployed to the mainnet:

- `farm1_ledger`: `osevl-taaaa-aaaac-a4bca-cai`
- `farm2_ledger`: `ovft7-6yaaa-aaaac-a4bcq-cai`
- `farm3_ledger`: `o4gyd-iqaaa-aaaac-a4bda-cai`
- `farm4_ledger`: `o3h6x-fiaaa-aaaac-a4bdq-cai`

## Frontend Customization

This section provides guidance on customizing the frontend of the Mshamba application.

### Changing Site Name and Logo

The site name "Mshamba" and the logo (favicon and header icon) can be customized.

-   **Site Title (Browser Tab):**
    To change the title displayed in the browser tab, modify the `<title>` tag in `src/mshamba_frontend/index.html`.

-   **Favicon (Browser Icon):**
    The favicon is the small icon displayed in the browser tab. It is currently set to `sprout.svg`. To change it, replace the `sprout.svg` file in `src/mshamba_frontend/public/` with your desired SVG file, and update the `<link rel=