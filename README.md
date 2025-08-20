# `mshamba`

# 🌾 Mshamba

**Mshamba** is a decentralized platform for tokenizing agricultural projects on the Internet Computer Protocol (ICP). It enables urban investors to invest directly in farms, allows landowners to lease unused land, and empowers farmers to raise capital transparently without predatory loans. It also facilitates cooperation across the entire agricultural supply chain.

---

## 🧠 Project Architecture Overview

The project is structured into modular components, each handling a distinct domain of the system:

---

### 1. `main.mo` — Central Controller

- Acts as the orchestrator.
- Connects all modules: profiles, farms, tokens, land, investments.
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
  - `investInFarm`: fund a farm.



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

Testing token_factory: 

dfx deploy token_factory
Notice the canister id at the end of the url
dfx canister status <put the canister_id here>
dfx canister update-settings <put the canister_id here> --add-controller <put the canister_id here>
confirm controllers
dfx canister status <put the canister_id here>



 dfx canister call token_factory createFarmLedger   '("MyToken", "MTK", principal "w7x7r-cok77-xa", 1000000, vec { record { owner = principal "w7x7r-cok77-xa"; allocation = 10000 } }, null, 365, 1000, vec { principal "w7x7r-cok77-xa" }, opt 900_000_000_000)'


