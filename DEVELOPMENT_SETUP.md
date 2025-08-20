# 🚀 Mshamba Development Setup Guide

This guide covers everything you need to know about setting up, running, and maintaining your Mshamba agricultural DeFi platform during development.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Test Data Management](#test-data-management)
3. [Development Workflow](#development-workflow)
4. [Troubleshooting](#troubleshooting)
5. [Production Deployment](#production-deployment)

---

## 🏁 Quick Start

### Prerequisites
- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/) installed
- Node.js 16+ installed
- Git installed

### Initial Setup
```bash
# Clone and navigate to project
cd /home/toonshi/projects/mshamba

# Start local ICP replica
dfx start --clean --background

# Deploy all canisters
dfx deploy

# Create test data (see Test Data Management section)
chmod +x recreate_test_data.sh
./recreate_test_data.sh
```

### Access Your Platform
- **Frontend**: http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai
- **Backend Candid UI**: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai

---

## 📊 Test Data Management

### ⚠️ Important: Data Persistence

**Test data is NOT persistent!** When you run `dfx stop`, all farm data, investments, and market history will be lost. Only your code changes persist.

### 🔄 Recreating Test Data

#### Method 1: Using the Recreation Script (Recommended)

```bash
# Make script executable (only needed once)
chmod +x recreate_test_data.sh

# Run the script
./recreate_test_data.sh
```

**What the script does:**
1. ✅ Creates 3 realistic farms with different crop types
2. ✅ Shows you the generated farm IDs
3. ✅ Provides ready-to-run commands for adding valuation history

#### Method 2: Manual Recreation

```bash
# 1. Create farms
dfx canister call mshamba_backend createFarm '("Green Valley Organic Farm", "Premium organic vegetables with sustainable farming practices", "Nakuru, Kenya", 50000000000000, 25.5, variant { Vegetables }, 8, true, 7, 9, 3)'

dfx canister call mshamba_backend createFarm '("Sunrise Coffee Plantation", "High-altitude coffee plantation producing premium arabica beans", "Kiambu, Kenya", 75000000000000, 40.0, variant { Cash_Crops }, 9, true, 8, 10, 2)'

dfx canister call mshamba_backend createFarm '("Tropical Fruit Paradise", "Diverse tropical fruit orchard including mangoes and avocados", "Mombasa, Kenya", 40000000000000, 18.5, variant { Fruits }, 8, true, 7, 9, 3)'

# 2. Get farm IDs
dfx canister call mshamba_backend listFarms

# 3. Add valuation history (replace FARM_ID with actual IDs)
dfx canister call mshamba_backend recordFarmValuation "(\"FARM_ID\", 4500000000000)"
```

### 📈 Test Data Overview

**Green Valley Organic Farm:**
- Type: Vegetables
- Funding Goal: 500 ICP
- Land Size: 25.5 hectares
- Valuation History: Steady growth pattern (45→52 ICP)

**Sunrise Coffee Plantation:**
- Type: Cash Crops (Coffee)
- Funding Goal: 750 ICP  
- Land Size: 40 hectares
- Valuation History: Volatile growth with correction (120→168→152 ICP)

**Tropical Fruit Paradise:**
- Type: Fruits
- Funding Goal: 400 ICP
- Land Size: 18.5 hectares
- Valuation History: Emerging growth (40→46 ICP)

---

## 🔄 Development Workflow

### Daily Development Cycle

```bash
# 1. Start development session
dfx start --clean --background

# 2. Deploy changes
dfx deploy

# 3. Recreate test data
./recreate_test_data.sh

# 4. Test your changes
# Open browser to frontend URL

# 5. Make code changes
# Edit files in src/

# 6. Redeploy specific canister
dfx deploy mshamba_backend  # or mshamba_frontend

# 7. End session
dfx stop
```

### Code Change Deployment

**Backend changes only:**
```bash
dfx deploy mshamba_backend
```

**Frontend changes only:**
```bash
dfx deploy mshamba_frontend
```

**Both backend and frontend:**
```bash
dfx deploy
```

### Viewing Logs and Debugging

```bash
# View replica logs
dfx replica --verbose

# Check canister status
dfx canister status mshamba_backend

# View canister info
dfx canister info mshamba_backend
```

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. White Screen on Frontend
**Causes:**
- Missing test data
- Backend not deployed
- Network connection issues

**Solutions:**
```bash
# Check if backend is running
dfx canister status mshamba_backend

# Recreate test data
./recreate_test_data.sh

# Check browser console for errors
```

#### 2. Script Permission Denied
```bash
chmod +x recreate_test_data.sh
```

#### 3. DFX Start Fails
```bash
# Kill existing processes
dfx stop
pkill dfx

# Clean start
dfx start --clean --background
```

#### 4. Farm Data Not Loading
**Causes:**
- Backend canister not responding
- Missing valuation history data

**Solutions:**
```bash
# Verify backend is deployed
dfx canister status mshamba_backend

# Check if farms exist
dfx canister call mshamba_backend listFarms

# Recreate test data if empty
./recreate_test_data.sh
```

### ✅ Previously Fixed Issues

The following issues have been resolved in the current codebase:

- **BigInt Conversion Errors**: Fixed with proper type conversions in frontend
- **Arithmetic Overflow**: Fixed with overflow protection in backend `getTokenBalance`
- **Trading Charts Crashes**: Fixed with safe data handling and error boundaries

### Debug Commands

```bash
# List all farms
dfx canister call mshamba_backend listFarms

# Get specific farm
dfx canister call mshamba_backend getFarm "(\"farm-id-here\")"

# Check valuation history
dfx canister call mshamba_backend getFarmValuationHistory "(\"farm-id-here\")"

# View token balance
dfx canister call mshamba_backend getTokenBalance "(\"farm-id-here\")"
```

---

## 🌐 Production Deployment

### Mainnet Deployment Preparation

1. **Update dfx.json for mainnet:**
```json
{
  "networks": {
    "ic": {
      "providers": ["https://ic0.app"],
      "type": "persistent"
    }
  }
}
```

2. **Deploy to mainnet:**
```bash
dfx deploy --network ic
```

3. **Set up monitoring and upgrades**

### Environment Variables

Create `.env` file for production:
```bash
# Production settings
NETWORK=ic
CANISTER_ENV=production
```

---

## 📚 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [User Guides](./USER_GUIDES.md)
- [Internet Computer Documentation](https://internetcomputer.org/docs/)
- [Motoko Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko/)

---

## 🎯 Quick Reference

### Essential Commands
```bash
# Start development
dfx start --clean --background && dfx deploy && ./recreate_test_data.sh

# Deploy changes
dfx deploy

# Stop development
dfx stop

# View frontend
http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai

# View backend API
http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
```

### File Structure
```
mshamba/
├── src/
│   ├── mshamba_backend/     # Motoko backend code
│   └── mshamba_frontend/    # React frontend code
├── recreate_test_data.sh    # Test data recreation script
├── API_DOCUMENTATION.md     # API reference
├── USER_GUIDES.md          # User documentation
└── DEVELOPMENT_SETUP.md    # This file
```

---

**Happy coding! 🌾🚀**

Your Mshamba agricultural DeFi platform is ready for development. Remember to recreate test data after each `dfx stop` to see your beautiful trading charts in action!
