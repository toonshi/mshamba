# Mshamba Scripts

Utility scripts for managing the Mshamba platform.

## Available Scripts

### create-farm-with-token.sh

Interactive wizard for creating a complete farm with token launch.

**Usage:**
```bash
./scripts/create-farm-with-token.sh
```

**Features:**
- Interactive prompts for farm details
- Token parameter configuration
- Profile creation
- Farm creation
- Token launch
- Investment status toggle

**Network:**
Set `DFX_NETWORK` environment variable to target mainnet:
```bash
DFX_NETWORK=ic ./scripts/create-farm-with-token.sh
```

### manage-token-factory.sh

Token factory canister management and cycle monitoring.

**Usage:**
```bash
./scripts/manage-token-factory.sh [command]
```

**Commands:**
- `status` - Show canister status and cycle balance
- `topup [amount]` - Top up cycles (default: 10T)
- `balance` - Show current cycle balance
- `estimate` - Estimate how many tokens can still be created
- `help` - Show help message

**Examples:**
```bash
# Check status and estimate remaining tokens
./scripts/manage-token-factory.sh status

# Top up with 20T cycles
./scripts/manage-token-factory.sh topup 20000000000000

# Check balance
./scripts/manage-token-factory.sh balance
```

**Note:** Each farm token costs approximately 2T cycles (~$2.50 USD)

## Network Configuration

All scripts respect the `DFX_NETWORK` environment variable:

**Local development (default):**
```bash
./scripts/create-farm-with-token.sh
```

**Mainnet:**
```bash
DFX_NETWORK=ic ./scripts/create-farm-with-token.sh
```

## Requirements

- dfx CLI installed and configured
- Active dfx replica (for local) or mainnet connection
- Sufficient cycles in canisters for operations
