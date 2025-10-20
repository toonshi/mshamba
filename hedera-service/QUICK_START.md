# 🚀 Quick Start Guide

## First Time Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Get testnet credentials from https://portal.hedera.com/
# Copy your Account ID and Private Key

# 3. Create .env file
cp .env.example .env

# 4. Edit .env and add your credentials
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=your_key_here
```

## Test It Works

```bash
# Run test script
npm run test

# Expected: See "Test completed successfully!" and a Topic ID
# Copy the Topic ID to your .env file as HCS_TOPIC_ID
```

## Start the Service

```bash
# Start the API server
npm start

# Keep this running in a separate terminal
```

## Verify It's Running

```bash
# Test health endpoint
curl http://localhost:3001/health

# Should return: {"status":"ok","service":"mshamba-hedera-hcs"}
```

## Create Demo Farm (for hackathon presentation)

```bash
# Run demo setup script
node demo-setup.js

# This creates 11 supply chain events for a complete farm lifecycle
# Copy the HashScan URL from the output
```

## Common Commands

```bash
npm start          # Start API server
npm run dev        # Start with auto-reload
npm run test       # Test HCS integration
node demo-setup.js # Create demo farm with events
```

## Integration in React

```javascript
import { logToHedera, HederaEvents } from '../utils/hederaService';

// Log a harvest event
const event = HederaEvents.harvest(
  'FARM_001',
  'Green Valley Farm',
  'Maize',
  '2500kg',
  'Grade A',
  new Date().toISOString()
);

const result = await logToHedera(event);
console.log('Verified:', result.explorerUrl);
```

## Troubleshooting

**"Missing Hedera credentials"**
→ Check your .env file has HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY

**"Insufficient balance"**
→ Use the testnet faucet at portal.hedera.com

**CORS errors**
→ Make sure the API server is running on port 3001

**Events not showing on HashScan**
→ Wait 10-30 seconds for mirror node sync

## Key URLs

- **Hedera Portal**: https://portal.hedera.com/
- **HashScan Explorer**: https://hashscan.io/testnet
- **API Health**: http://localhost:3001/health
- **API Docs**: See README.md

## Demo Talking Points

1. **Problem**: Trust in agricultural supply chains
2. **Solution**: Immutable audit trail on Hedera HCS
3. **Cost**: $0.0001 per event vs. ICP canister storage
4. **Result**: Publicly verifiable, can't be altered or deleted

## Cost Comparison

| Scale | ICP Only | With Hedera | Savings |
|-------|----------|-------------|---------|
| 1,000 events | $1,250 | $1 | 99.9% |
| 10,000 events | $12,500 | $10 | 99.9% |

**Key Message**: Use ICP for smart contracts, Hedera for high-volume logs.
