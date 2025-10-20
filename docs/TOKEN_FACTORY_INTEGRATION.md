# Token Factory Integration Guide

## Overview
The Mshamba platform now supports **dynamic ICRC-1 token creation** for each farm investment project. When a farmer creates a farm, they can customize token parameters. When they're ready to open investment, the platform automatically launches a dedicated ICRC-1 ledger canister for that farm.

## Architecture

### Components
1. **token_factory** (Rust canister) - Creates and deploys ICRC-1 ledger canisters
2. **mshamba_backend** (Motoko canister) - Main business logic, calls token_factory
3. **Farm-specific ICRC-1 ledgers** - Dynamically created token canisters

### Flow
```
1. Farmer creates farm with token params → Farm registered (token not yet created)
2. Farmer calls launchFarmToken(farmId) → token_factory creates ICRC-1 ledger
3. Farm.ledgerCanister updated with new token canister ID
4. Farmer toggles investment status → Opens for investment (only if token exists)
5. Investors buy/transfer tokens on the farm's ICRC-1 ledger
```

## Farm Type Changes

### New Fields
```motoko
tokenName: Text;         // e.g., "Green Acres Farm Token"
tokenSymbol: Text;       // e.g., "GAFT"
tokenSupply: Nat;        // e.g., 1_000_000_000 (with decimals)
tokenDecimals: Nat8;     // e.g., 8
tokenTransferFee: Nat;   // e.g., 10_000 (0.0001 tokens if decimals=8)
tokenLogo: ?Text;        // Optional logo URL/data URI
```

## New Backend Functions

### `createFarm(..., tokenName, tokenSymbol, tokenSupply, tokenDecimals, tokenTransferFee, tokenLogo)`
- Creates a farm with token parameters
- Farm starts with `isOpenForInvestment = false`
- `ledgerCanister = null` until token is launched

### `launchFarmToken(farmId)`
- **Caller:** Farm owner
- **Action:** Calls `token_factory.create_farm_token()` to deploy ICRC-1 ledger
- **Cost:** ~2T cycles (~$2.50 USD), covered by platform
- **Result:** Updates `farm.ledgerCanister` with new token canister ID
- **Errors:** 
  - "Only the farm owner can launch the token"
  - "Token already launched for this farm"

### `toggleFarmInvestmentStatus(farmId, newStatus)`
- **Enhanced:** Now checks if token exists before opening investment
- **Error if opening without token:** "Token must be launched before opening investment. Call launchFarmToken first."

## Token Factory Details

### Function: `create_farm_token(params)`
```rust
pub struct CreateTokenParams {
    pub token_name: String,
    pub token_symbol: String,
    pub token_logo: Option<String>,
    pub decimals: u8,
    pub total_supply: Nat,
    pub transfer_fee: Nat,
    pub minting_account_owner: Principal,  // Farm owner
}
```

### What it does:
1. Creates a new canister with 2T cycles
2. Installs the ICRC-1 ledger WASM (embedded at compile time)
3. Mints entire supply to `minting_account_owner`
4. Sets up archive, fee collector, metadata
5. Returns the new ledger canister ID

### Features:
- ICRC-1 + ICRC-2 (approve/transferFrom) support
- Archive for transaction history
- Fee collection to farm owner
- Configurable decimals and supply
- Optional logo metadata

## Testing Locally

### 1. Start dfx and deploy
```bash
dfx start --clean --background
dfx deploy token_factory
dfx deploy mshamba_backend
```

### 2. Create a farmer profile
```bash
dfx identity use default
dfx canister call mshamba_backend createProfile \
  '("Test Farmer", "Organic farming expert", variant { Farmer }, vec { "Organic Certification" })'
```

### 3. Create a farm with token parameters
```bash
dfx canister call mshamba_backend createFarm '(
  "Green Acres",
  "Organic vegetables and fruits",
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
  "john@example.com",
  blob "\00\01\02",
  "image/jpeg",
  "Green Acres Farm Token",
  "GAFT",
  1000000000,
  8,
  10000,
  opt "https://example.com/logo.png"
)'
```

**Note the farmId returned** (e.g., `farm-1234567890`)

### 4. Launch the farm token
```bash
dfx canister call mshamba_backend launchFarmToken '("farm-XXXXXXXX")'
```

**Expected output:** `(variant { Ok = principal "xxxxx-xxxxx-xxxxx-xxxxx-cai" })`

### 5. Check the farm details
```bash
dfx canister call mshamba_backend listFarms
```

You should see `ledgerCanister = opt principal "xxxxx..."`

### 6. Open for investment
```bash
dfx canister call mshamba_backend toggleFarmInvestmentStatus '("farm-XXXXXXXX", true)'
```

### 7. Query the token ledger
```bash
# Get token metadata
dfx canister call <LEDGER_CANISTER_ID> icrc1_metadata

# Check token name
dfx canister call <LEDGER_CANISTER_ID> icrc1_name

# Check token symbol
dfx canister call <LEDGER_CANISTER_ID> icrc1_symbol

# Check farm owner balance
dfx canister call <LEDGER_CANISTER_ID> icrc1_balance_of '(record {
  owner = principal "YOUR_FARMER_PRINCIPAL";
  subaccount = null
})'
```

## Platform Cycle Management

The token_factory needs cycles to create new canisters. Top it up:

```bash
# Check balance
dfx canister status token_factory

# Top up with 10T cycles
dfx canister deposit-cycles 10000000000000 token_factory
```

**Recommended:** Keep at least 20T cycles in token_factory for 10 farm tokens.

## Migration from farm1_ledger

Once dynamic tokens are working:
1. ✅ Dynamic tokens working → Can remove `farm1_ledger` from dfx.json
2. Remove `import Farm1Ledger` from main.mo
3. Remove `farm1LedgerPrincipal()` function
4. Update any hardcoded references to farm1_ledger

## Troubleshooting

### Error: "Token must be launched before opening investment"
**Solution:** Call `launchFarmToken(farmId)` first

### Error: "Failed to create token: out of cycles"
**Solution:** Top up token_factory canister with cycles

### Error: "Only the farm owner can launch the token"
**Solution:** Make sure you're calling from the same identity that created the farm

### Token creation takes too long
**Normal:** Creating a canister + installing WASM takes 5-15 seconds

## Next Steps

1. **Frontend integration:** Update farm creation form to include token parameters
2. **Token trading UI:** Add ICRC-1 wallet integration for buying/selling farm tokens
3. **Governance:** Consider adding DAO features (proposals, voting) using the farm tokens
4. **Secondary market:** Integrate with DEX (e.g., ICPSwap) for liquidity

## Cost Analysis

- **Per farm token creation:** ~2T cycles (~$2.50 USD)
- **Token ledger storage:** Minimal until transactions occur
- **Archive costs:** Auto-created when needed (cycles from token ledger)

For 100 farms = ~$250 USD in cycles (one-time cost per farm)
