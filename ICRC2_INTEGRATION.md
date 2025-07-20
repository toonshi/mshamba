# ICRC-2 Token Integration for Mshamba

## Overview

This document describes the comprehensive ICRC-2 token integration for the Mshamba agricultural tokenization platform. The integration provides proper blockchain tokenization with automated farm valuation, profit distribution mechanisms, and secondary market capabilities.

## Architecture

### Core Components

1. **ICRC-2 Token Library** (`lib/icrc2_token.mo`)
   - Farm token metadata management
   - Automated valuation algorithms
   - Profit distribution calculations
   - Token metrics and analytics

2. **Token Factory** (`lib/token_factory.mo`)
   - Token creation and registration
   - Investment tracking
   - Valuation calculations with Kenya-specific multipliers
   - Analytics and reporting

3. **Farm Token Canister** (`farm_token.mo`)
   - Individual ICRC-2 compliant token for each farm
   - Standard ICRC-1/ICRC-2 functions
   - Farm-specific metadata and operations
   - Profit distribution mechanisms

4. **Main Backend Integration** (`main.mo`)
   - Token management endpoints
   - Investment tracking
   - Profit distribution coordination
   - Analytics aggregation

## Key Features

### 1. Automated Farm Valuation

The system uses a sophisticated algorithm to calculate farm valuations based on:

- **Base Valuation**: KES 500 per acre
- **Yield Multiplier**: Based on expected annual yield percentage
- **Location Multiplier**: Kenya-specific regional adjustments
  - Premium locations (Nairobi, Kiambu, Nakuru): 1.5x
  - Good locations (Mombasa, Kisumu, Eldoret): 1.3x
  - Agricultural regions (Meru, Nyeri, Embu): 1.2x
  - Standard locations: 1.0x
- **Crop Multiplier**: Based on crop type profitability
  - High-value exports (Coffee, Tea, Avocado): 1.4x
  - Premium floriculture (Flowers, Roses): 1.6x
  - Staple crops (Maize, Wheat, Beans): 1.1x
  - Vegetables: 1.25x
- **Sustainability Bonus**: 1.2x for organic/sustainable farms

### 2. ICRC-2 Token Standards

Each farm token is fully ICRC-2 compliant, supporting:

- **ICRC-1 Functions**: Basic token operations (transfer, balance, metadata)
- **ICRC-2 Functions**: Approval mechanisms (approve, transfer_from, allowance)
- **Custom Functions**: Farm-specific operations and profit distribution

### 3. Profit Distribution

Automated profit distribution system:

- Calculate profit per token based on harvest reports
- Distribute profits proportionally to token holders
- Track distribution history
- Support for multiple distribution events

### 4. Investment Tracking

Comprehensive investment management:

- Record all token investments
- Track token prices at time of investment
- Calculate investor returns
- Generate investment analytics

## API Endpoints

### Token Management

```motoko
// Create ICRC-2 token for a farm
createFarmToken(farmId: Text, initialSupply: ?Nat, decimals: ?Nat8, fee: ?Nat, logo: ?Text) : async Result<FarmTokenMetadata>

// Get token metadata
getTokenMetadata(farmId: Text) : async Result<FarmTokenMetadata>

// Get all farm tokens
getAllFarmTokens() : async [FarmTokenMetadata]

// Calculate token price
getTokenPrice(farmId: Text) : async Result<Float>

// Get token metrics
getTokenMetrics(farmId: Text) : async Result<TokenMetrics>

// Update farm valuation (admin only)
updateFarmValuation(farmId: Text, newValuation: Nat) : async Result<FarmTokenMetadata>

// Calculate market cap
getFarmMarketCap(farmId: Text) : async Result<Nat>
```

### Profit Distribution

```motoko
// Distribute farm profits
distributeFarmProfits(farmId: Text, totalProfit: Nat, tokenHolders: [(Account, Nat)]) : async Result<ProfitDistribution>

// Get profit distributions for a farm
getFarmProfitDistributions(farmId: Text) : async [ProfitDistribution]
```

### Investment Tracking

```motoko
// Record token investment
recordTokenInvestment(farmId: Text, investor: Principal, amount: Nat, tokensReceived: Nat) : async Result<InvestmentRecord>

// Get investments for a farm
getFarmInvestments(farmId: Text) : async [InvestmentRecord]

// Get investor's investments
getInvestorInvestments(investor: Principal) : async [InvestmentRecord]

// Get token analytics
getTokenAnalytics() : async TokenAnalytics
```

## Frontend Integration

### Token Dashboard Component

The `TokenDashboard.jsx` component provides:

- **Analytics Overview**: Total tokens, investments, value locked
- **Token Listing**: All farm tokens with key metrics
- **Investment Tracking**: User's investment portfolio
- **Token Creation**: Interface for creating new farm tokens
- **Investment Recording**: Track new investments

### Key Features

- Real-time token metrics
- Interactive token cards
- Investment portfolio management
- Token creation wizard
- Responsive design with modern UI

## Deployment

### Prerequisites

1. Install mops package manager
2. Add ICRC dependencies to `mops.toml`
3. Update `dfx.json` with new canisters

### Steps

1. **Install Dependencies**
   ```bash
   mops install
   ```

2. **Deploy Canisters**
   ```bash
   dfx deploy --network local
   ```

3. **Initialize Token System**
   ```bash
   # Create tokens for existing farms
   dfx canister call mshamba_backend createFarmToken '("farm-001", opt 1000000, opt 8, opt 10000, null)'
   ```

## Usage Examples

### Creating a Farm Token

```javascript
// Frontend JavaScript
const result = await actor.createFarmToken(
  "farm-001",           // Farm ID
  [1000000],           // Initial supply (optional)
  [8],                 // Decimals (optional)
  [10000],             // Fee (optional)
  []                   // Logo URL (optional)
);
```

### Recording an Investment

```javascript
const result = await actor.recordTokenInvestment(
  "farm-001",          // Farm ID
  principal,           // Investor principal
  5000000,             // Amount in cents (KES 50,000)
  500                  // Tokens received
);
```

### Distributing Profits

```javascript
const tokenHolders = [
  [{ owner: principal1, subaccount: [] }, 100],  // 100 tokens
  [{ owner: principal2, subaccount: [] }, 200],  // 200 tokens
];

const result = await actor.distributeFarmProfits(
  "farm-001",          // Farm ID
  1000000,             // Total profit in cents (KES 10,000)
  tokenHolders         // Token holders and balances
);
```

## Security Considerations

1. **Access Control**: Only farm owners and admins can distribute profits
2. **Valuation Updates**: Only admins can manually update farm valuations
3. **Token Creation**: Requires valid farm registration
4. **Investment Tracking**: Proper principal verification

## Future Enhancements

1. **DEX Integration**: Connect to Internet Computer DEXs for secondary trading
2. **Price Oracles**: Real-time market data integration
3. **Staking Mechanisms**: Token staking for additional rewards
4. **Governance**: Token holder voting on farm decisions
5. **Cross-Chain Bridges**: Integration with other blockchain networks

## Troubleshooting

### Common Issues

1. **Token Creation Fails**
   - Verify farm exists
   - Check if token already created
   - Ensure proper permissions

2. **Investment Recording Errors**
   - Verify token exists
   - Check amount calculations
   - Ensure proper principal format

3. **Profit Distribution Issues**
   - Verify caller permissions
   - Check token holder data format
   - Ensure sufficient profit amount

### Debug Commands

```bash
# Check token metadata
dfx canister call mshamba_backend getTokenMetadata '("farm-001")'

# Get token price
dfx canister call mshamba_backend getTokenPrice '("farm-001")'

# View token analytics
dfx canister call mshamba_backend getTokenAnalytics '()'
```

## Support

For technical support or questions about the ICRC-2 integration:

1. Check the troubleshooting section
2. Review the API documentation
3. Examine the frontend component examples
4. Test with the provided usage examples

## License

This integration is part of the Mshamba platform and follows the same licensing terms.
