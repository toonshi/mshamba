# 🚀 Mshamba Quick Start Guide

## Setup & Deploy (Local)

```bash
# Start local replica
dfx start --clean --background

# Deploy all canisters
dfx deploy

# Top up token factory with cycles
dfx canister deposit-cycles 10000000000000 token_factory
```

## Create Your First Farm with Token

### Option 1: Interactive Script (Recommended)
```bash
./scripts/create-farm-with-token.sh
```
Follow the prompts to create a farm and launch its token!

### Option 2: Manual Commands

**Step 1: Create Farmer Profile**
```bash
dfx canister call mshamba_backend createProfile '(
  "John Farmer",
  "Organic farming expert", 
  vec { variant { Farmer } },
  vec { "Organic Certification" }
)'
```

**Step 2: Create Farm**
```bash
dfx canister call mshamba_backend createFarm '(
  "Green Acres Farm",
  "Organic vegetables",
  "Kiambu, Kenya",
  1000000,
  "10 acres",
  "Vegetables",
  12,
  "5000kg tomatoes",
  "25%",
  "John Kamau",
  "15 years",
  "+254712345678",
  "john@greenacres.ke",
  blob "\00\01\02",
  "image/jpeg",
  "Green Acres Farm Token",
  "GAFT",
  1000000000,
  8,
  10000,
  null
)'
```

**Step 3: Launch Token**
```bash
# Replace FARM_ID with the farmId from step 2
dfx canister call mshamba_backend launchFarmToken '("farm-XXXXXXXXXXXXX")'
```

**Step 4: Open for Investment**
```bash
dfx canister call mshamba_backend toggleFarmInvestmentStatus '("farm-XXXXXXXXXXXXX", true)'
```

## Common Queries

### List All Farms
```bash
dfx canister call mshamba_backend listFarms
```

### View My Farms
```bash
dfx canister call mshamba_backend myFarms
```

### Check Token Details
```bash
# Replace LEDGER_ID with the token canister ID
dfx canister call LEDGER_ID icrc1_name
dfx canister call LEDGER_ID icrc1_symbol
dfx canister call LEDGER_ID icrc1_total_supply
```

### Check Token Balance
```bash
# Replace PRINCIPAL with your principal
dfx canister call LEDGER_ID icrc1_balance_of '(record {
  owner = principal "YOUR_PRINCIPAL";
  subaccount = null
})'
```

## Token Factory Management

### Check Status
```bash
./scripts/manage-token-factory.sh status
```

### Top Up Cycles
```bash
# Add 10T cycles (default)
./scripts/manage-token-factory.sh topup

# Add custom amount
./scripts/manage-token-factory.sh topup 20000000000000
```

### Estimate Remaining Tokens
```bash
./scripts/manage-token-factory.sh estimate
```

## Token Parameters Guide

| Parameter | Description | Example |
|-----------|-------------|---------|
| **token_name** | Full name of the token | "Green Acres Farm Token" |
| **token_symbol** | Trading symbol (3-5 chars) | "GAFT" |
| **token_supply** | Total supply in smallest unit | 1000000000 (10M with 8 decimals) |
| **token_decimals** | Decimal places (usually 8) | 8 |
| **token_transfer_fee** | Fee per transfer | 10000 (0.0001 tokens if decimals=8) |
| **token_logo** | Logo URL or null | "https://example.com/logo.png" |

## Cost Breakdown

- **Token Creation:** ~2T cycles per farm token (~$2.50 USD)
- **Platform covers cost** (cycles deducted from token_factory)
- **Recommended reserve:** Keep 20T+ cycles in token_factory

## Troubleshooting

### Error: "Token must be launched before opening investment"
**Solution:** Call `launchFarmToken(farmId)` first

### Error: "Out of cycles"
**Solution:** Top up token_factory
```bash
dfx canister deposit-cycles 10000000000000 token_factory
```

### Error: "Only farmers can create farms"
**Solution:** Create a farmer profile first with `createProfile`

### Token creation takes too long
**Normal behavior:** Token deployment takes 5-15 seconds

## Useful Links

- **Full Documentation:** [TOKEN_FACTORY_INTEGRATION.md](TOKEN_FACTORY_INTEGRATION.md)
- **Main README:** [README.md](README.md)
- **Scripts:** [scripts/](scripts/)

## Quick Commands Cheat Sheet

```bash
# Development
dfx start --background              # Start replica
dfx deploy                          # Deploy all canisters
dfx stop                            # Stop replica

# Identity
dfx identity whoami                 # Current identity
dfx identity get-principal          # Your principal

# Canister Management
dfx canister status CANISTER_NAME   # Check status
dfx canister id CANISTER_NAME       # Get canister ID
dfx canister call CANISTER METHOD   # Call method

# Token Factory
./scripts/manage-token-factory.sh status
./scripts/manage-token-factory.sh topup
./scripts/manage-token-factory.sh estimate

# Farm Creation
./scripts/create-farm-with-token.sh
```

## Environment Variables

```bash
# Use mainnet
export DFX_NETWORK=ic

# Use local (default)
export DFX_NETWORK=local
```

## Need Help?

- Check [TOKEN_FACTORY_INTEGRATION.md](TOKEN_FACTORY_INTEGRATION.md) for detailed documentation
- Review test examples in README.md
- Inspect script source code in [scripts/](scripts/)

---

**Happy Farming! 🌾**
