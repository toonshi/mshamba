# 🚀 Marketplace Quick Start (5 Minutes)

## Get Running Now

### 1. Deploy Backend (2 minutes)

```bash
# Make sure dfx is running
dfx start --background

# Deploy new marketplace canisters
dfx deploy marketplace
dfx deploy hedera_integration

# Verify deployment
dfx canister call marketplace getMarketplaceStats
```

Expected output:
```
(record {
  totalUsers = 0 : nat;
  totalListings = 0 : nat;
  totalTransactions = 0 : nat;
  activeListings = 0 : nat;
})
```

### 2. Start Services (1 minute)

```bash
# Terminal 1: Hedera service
cd hedera-service
npm start

# Terminal 2: Frontend
cd src/mshamba_frontend
npm run dev
```

### 3. Test the Flow (2 minutes)

**Step 1: Register as Supplier**
- Open http://localhost:5173/register
- Choose: "Supplier"
- Name: "Test Seed Company"
- Click "Get Current Location"
- Region: "Nairobi"
- Click "Complete Registration"

**Step 2: Create Listing**
- Go to /marketplace/create-listing
- Category: Seeds
- Title: "Test Maize Seeds"
- Description: "For testing"
- Price: 10
- Unit: kg
- Quantity: 50
- Click "Get Current Location"
- Click "Create Listing"

**Step 3: Buy as Farmer**
- Open incognito/new browser
- Sign in with different identity
- Go to /register
- Choose: "Farmer"
- Name: "Test Farmer"
- Complete registration
- Go to /marketplace
- Click "Buy" on your listing
- Confirm purchase
- See "Verified on Hedera" ✅

---

## Quick Commands

```bash
# Check marketplace stats
dfx canister call marketplace getMarketplaceStats

# Get all listings
dfx canister call marketplace getAllListings

# Get your profile
dfx canister call marketplace getMyProfile

# Check Hedera service
curl http://localhost:3001/health

# View Hedera topic
# https://hashscan.io/testnet/topic/0.0.7098281
```

---

## Troubleshooting

**"Canister not found"**
→ Run `dfx deploy marketplace`

**"User not registered"**
→ Go to /register first

**"Only Suppliers can create listings"**
→ Register with role "Supplier" or "Service Provider"

**Hedera not logging**
→ Check `npm start` is running in hedera-service/

---

## What to Test

- [ ] User registration (all 4 roles)
- [ ] Create listing (as Supplier)
- [ ] Browse marketplace
- [ ] Search functionality
- [ ] Category filtering
- [ ] Distance calculation (if GPS enabled)
- [ ] Purchase flow
- [ ] Hedera verification
- [ ] Transaction history

---

## Next: Add Real ckUSDC Payments

See `MARKETPLACE_IMPLEMENTATION.md` for full integration guide.

**Status: MVP COMPLETE** ✅
