# Project Structure

This document describes the clean, organized structure of the Mshamba project after decluttering.

## Root Directory

```
mshamba/
├── .dfx/                    # DFX build artifacts
├── .env                     # Environment variables
├── .github/                 # GitHub workflows
├── .gitignore              # Git ignore rules
├── Cargo.lock              # Rust dependencies lock
├── Cargo.toml              # Rust workspace config
├── README.md               # Main project documentation
├── canister_ids.json       # Canister IDs for deployments
├── deps/                   # Dependencies pulled by dfx
├── dfx.json                # DFX configuration
├── docs/                   # 📚 All documentation (NEW)
├── node_modules/           # Node.js dependencies
├── package-lock.json       # Node.js lock file
├── package.json            # Node.js dependencies
├── scripts/                # Utility scripts
├── src/                    # Source code
├── target/                 # Rust build artifacts
├── tsconfig.json           # TypeScript configuration
└── wasm/                   # WASM binaries and interfaces
```

## Documentation (`docs/`)

All project documentation has been organized into the `docs/` folder:

- **CHANGELOG.md** - Version history
- **CKUSDT_PAYMENT_INTEGRATION.md** - ckUSDT payment guide
- **DUAL_CURRENCY_PAYMENT.md** - Dual currency system
- **ECONOMIC_MODEL.md** - Economic model and tokenomics
- **FOUR_WALLET_SYSTEM.md** - Wallet system architecture
- **INTERNET_IDENTITY_2.0_UPGRADE.md** - II 2.0 integration
- **MAINNET_DEPLOYMENT.md** - Mainnet deployment guide
- **MOBILE_WALLET_SUPPORT.md** - Mobile wallet integration
- **NEXT_STEPS.md** - Development roadmap
- **PROJECT_STATUS.md** - Current project status
- **QUICKSTART.md** - Quick start guide
- **TECHNICAL_ARCHITECTURE.md** - System architecture
- **TOKEN_FACTORY_INTEGRATION.md** - Token factory guide
- **TOKEN_LAUNCH_FEATURE_FLAG.md** - Token launch features
- **VALUATION_SUGGESTIONS.md** - Valuation methodology
- **WHITEPAPER.md** - Project whitepaper

## Source Code (`src/`)

- **declarations/** - Auto-generated canister declarations
- **icrc1_ledger/** - ICRC-1 ledger canister
- **mshamba_backend/** - Main backend canister (Motoko)
- **mshamba_frontend/** - React frontend application
- **token_factory/** - Token factory canister (Rust)

## Scripts (`scripts/`)

- **create-farm-with-token.sh** - Create farm with token
- **create_investors.js** - Generate test investors
- **manage-token-factory.sh** - Manage token factory
- **recreate_test_data.sh** - Recreate test data
- **run_tests.sh** - Run test suite
- **seed_data.js** - Seed database

## WASM Files (`wasm/`)

Contains ICRC-1 ledger WASM binaries and interface definitions:
- **archive.did** - Archive canister interface
- **ic-icrc1-archive.wasm** - Archive WASM binary
- **ic-icrc1-index-ng.wasm** - Index canister binary
- **ic-icrc1-ledger.wasm** - Ledger canister binary
- **index-ng.did** - Index interface
- **ledger.did** - Ledger interface

## Removed During Cleanup

The following items were removed to declutter the codebase:

✅ **Duplicate files removed:**
- `archive.did` (root) - kept in `wasm/`
- `index-ng.did` (root) - kept in `wasm/`
- `ic-icrc1-ledger.wasm.gz` (root) - kept in `wasm/`

✅ **Directories removed:**
- `mshamba/` - empty directory
- `Reorg/` - separate project (not part of Mshamba)
- `wasm_unzipped/` - redundant, contained compressed files
- `hedera-service/` - incomplete, only had node_modules

✅ **Documentation organized:**
- Moved 16 .md files from root to `docs/` folder

## Benefits

1. **Cleaner root directory** - Only essential config files
2. **Organized documentation** - All docs in one place
3. **No duplicates** - Single source of truth for files
4. **Better navigation** - Clear separation of concerns
5. **Reduced confusion** - Removed incomplete/unused directories
