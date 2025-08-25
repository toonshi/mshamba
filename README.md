# `mshamba`

# 🌾 Mshamba

**IMPORTANT NOTE:** This is the stable version of the Mshamba platform. The `custom_token_factory` canister has been temporarily removed from the deployment to ensure stability and address ongoing development. Investment functionalities that rely on the token factory are currently not active.

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
  * [Testing `token_factory`](#testing-token_factory)
  * [Testing `mshamba_backend` (User Profiles)](#testing-mshamba_backend-user-profiles)

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
  - `getProfileOf`: view another user's profile.
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
dfx start --background


# Make sure that you have node
node --version

# Install Frontend Dependencies
npm install --save-dev vite @types/node

Run the embed_icrc1_wasm.sh script after making it into an executable
using chmod ....
# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

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


TO:DO: Rewrite the embed_icrc1 script in the root folder  so that it divides the wasm bytes into chunks. Canisters can only take in 2mb.

## Testing Canisters

This section provides examples of how to interact with the deployed canisters using `dfx canister call`.

### Testing `token_factory`

**Note:** The `token_factory` canister is currently not part of the stable deployment. The instructions below are provided for reference in case the token factory is re-enabled or for development purposes.

First, ensure your `token_factory` canister has enough cycles. You can deposit cycles using:
```bash
dfx canister deposit-cycles 10000000000000 $(dfx canister id token_factory)
```

Then, you can deploy the `token_factory` canister:
```bash
dfx deploy token_factory
```

Notice the canister id at the end of the url
```bash
dfx canister status <put the canister_id here>
dfx canister update-settings <put the canister_id here> --add-controller <put the canister_id here>
confirm controllers
dfx canister status <put the canister_id here>
```

Example `createFarmLedger` call (note the `opt 900_000_000_000` for `cyclesToSpend`):
```bash
dfx canister call token_factory createFarmLedger '(
  "MyToken",
  "MTK",
  principal "w7x7r-cok77-xa",
  1000000,
  vec { record { owner = principal "w7x7r-cok77-xa"; allocation = 10000 } },
  null,
  365,
  1000,
  vec { principal "w7x7r-cok77-xa" },
  opt 900_000_000_000
)'
```

### Testing `mshamba_backend` (User Profiles)

First, deploy the `mshamba_backend` canister:
```bash
dfx deploy mshamba_backend
```

**Create a Farmer Profile:**
```bash
dfx canister call mshamba_backend createProfile '(
  "John Doe",
  "Experienced organic farmer.",
  variant { #Farmer },
  vec { "Organic Farming", "Sustainable Agriculture" }
)'
```

**Create an Investor Profile:**
```bash
dfx canister call mshamba_backend createProfile '(
  "Jane Smith",
  "Passionate about sustainable investments.",
  variant { #Investor },
  vec { "Financial Analysis" }
)'
```

**Get a Profile (replace <principal_id> with the principal of the user who created the profile):**
```bash
dfx canister call mshamba_backend getProfile '(principal "<principal_id>")'
```