#  Mainnet Deployment Checklist

## Pre-Deployment

### 1. Code Review & Testing
- [ ] All tests passing locally
- [ ] Token factory tested with multiple farms
- [ ] Frontend builds without errors
- [ ] No console errors in browser
- [ ] Error handling verified

### 2. Security Review
- [ ] No hardcoded secrets in code
- [ ] Proper access control (farmer-only, owner-only checks)
- [ ] Token creation validates ownership
- [ ] Investment status checks token existence
- [ ] All imports cleaned up (no unused code)

### 3. Configuration
- [ ] Update canister IDs in `dfx.json` for IC network
- [ ] Set proper environment variables
- [ ] Configure frontend for mainnet URLs
- [ ] Update Internet Identity settings for production

## Deployment Steps

### 1. Set Network to Mainnet
```bash
export DFX_NETWORK=ic
```

### 2. Create Identity (if not exists)
```bash
dfx identity new mainnet-deployer
dfx identity use mainnet-deployer
dfx identity get-principal  # Save this principal
```

### 3. Top Up Cycles (via NNS or Cycles Wallet)
**Required cycles:**
- token_factory: **50T cycles minimum** (for 25 farm tokens)
- mshamba_backend: **10T cycles**
- mshamba_frontend: **5T cycles**

### 4. Deploy Canisters
```bash
# Deploy backend first
dfx deploy mshamba_backend --network ic

# Deploy token factory
dfx deploy token_factory --network ic

# Deploy frontend
dfx deploy mshamba_frontend --network ic

# Deploy Internet Identity (if managing your own)
dfx deploy internet_identity --network ic
```

### 5. Top Up Token Factory
```bash
dfx canister deposit-cycles 50000000000000 token_factory --network ic
```

### 6. Verify Deployments
```bash
# Check all canister statuses
dfx canister status mshamba_backend --network ic
dfx canister status token_factory --network ic
dfx canister status mshamba_frontend --network ic

# Get canister IDs
dfx canister id mshamba_backend --network ic
dfx canister id token_factory --network ic
dfx canister id mshamba_frontend --network ic
```

## Post-Deployment

### 1. Update Configuration Files
Update these files with mainnet canister IDs:
- [ ] `dfx.json` - Add IC network canister IDs
- [ ] `README.md` - Update mainnet canister IDs section
- [ ] Frontend `.env` files if applicable

### 2. Test Core Functionality
```bash
# Create test farmer profile
dfx canister call mshamba_backend createProfile '(
  "Test Farmer",
  "Testing mainnet",
  variant { Farmer },
  vec { "Test" }
)' --network ic

# Create test farm
dfx canister call mshamba_backend createFarm '(
  "Test Farm",
  "Testing",
  "Kenya",
  100000,
  "1 acre",
  "Test",
  1,
  "100kg",
  "10%",
  "Test",
  "1yr",
  "+254",
  "test@test.com",
  blob "\00",
  "image/jpeg",
  "Test Token",
  "TEST",
  100000000,
  8,
  1000,
  null
)' --network ic

# Launch token (save the farmId from previous command)
dfx canister call mshamba_backend launchFarmToken '("farm-XXXXX")' --network ic
```

### 3. Frontend Configuration
- [ ] Update frontend to use IC network URLs
- [ ] Test wallet connections (Plug, Stoic, etc.)
- [ ] Verify Internet Identity integration
- [ ] Test farm creation flow in UI
- [ ] Test token launch flow in UI

### 4. Set Controllers (Security)
```bash
# Add NNS governance or your organization's principal as controller
dfx canister update-settings mshamba_backend --add-controller PRINCIPAL --network ic
dfx canister update-settings token_factory --add-controller PRINCIPAL --network ic
dfx canister update-settings mshamba_frontend --add-controller PRINCIPAL --network ic
```

## Monitoring & Maintenance

### 1. Cycle Monitoring
Set up monitoring for:
- [ ] token_factory cycle balance (alert at 20T)
- [ ] mshamba_backend cycle balance (alert at 5T)
- [ ] mshamba_frontend cycle balance (alert at 2T)

**Recommended tool:** Use [CycleOps](https://cycleops.dev/) or similar

### 2. Regular Tasks
- [ ] Weekly cycle balance check
- [ ] Monthly token factory top-up
- [ ] Monitor farm token creation success rate
- [ ] Track failed transactions

### 3. Top-Up Strategy
```bash
# Automate top-ups when balance drops below threshold
# Example: Top up token_factory when below 20T cycles

dfx canister status token_factory --network ic
# If below threshold:
dfx canister deposit-cycles 50000000000000 token_factory --network ic
```

## Emergency Procedures

### If Token Factory Runs Out of Cycles
1. **Immediate:** Top up cycles ASAP
```bash
dfx canister deposit-cycles 50000000000000 token_factory --network ic
```
2. **Communication:** Notify users that token creation is temporarily unavailable
3. **Prevention:** Set up automated alerts

### If Backend Fails
1. Check canister status and logs
2. Verify cycles balance
3. Check for upgrade issues
4. Rollback to previous version if needed

### If Frontend Fails
1. Redeploy frontend
```bash
dfx deploy mshamba_frontend --network ic
```
2. Verify asset canister has sufficient cycles
3. Check browser console for errors

## Cost Projections

### Cycle Costs (Monthly Estimates)
- **Token Factory:** 
  - Idle: ~5T cycles
  - Per token: 2T cycles
  - 20 farms/month: ~45T cycles/month
  
- **Backend:**
  - ~3-5T cycles/month
  
- **Frontend:**
  - ~2T cycles/month

**Total:** ~50-55T cycles/month for 20 new farms

**ICP Equivalent:** ~$65-70 USD/month at current prices

## Scaling Considerations

### At 100 Farms
- Token factory needs: 200T cycles for deployment
- Keep 50T reserve: **250T total**

### At 500 Farms
- Token factory needs: 1,000T cycles for deployment
- Keep 100T reserve: **1,100T total**
- Consider multiple token factory canisters for redundancy

## Optimization Tips

1. **Batch Operations:** Deploy multiple tokens in low-traffic periods
2. **Cycle Management:** Use a cycles management canister
3. **Monitoring:** Set up real-time cycle monitoring
4. **Backup:** Keep deployment scripts and configs in version control

## Rollback Plan

### If Deployment Fails
1. Note the failed step
2. Check error messages and logs
3. Fix issues locally
4. Test fix on local network
5. Redeploy to mainnet

### Preserve Previous Version
```bash
# Before deploying new version, note current module hash
dfx canister status mshamba_backend --network ic | grep "Module hash"

# If rollback needed, use previous WASM
dfx canister install mshamba_backend --mode reinstall --wasm OLD_VERSION.wasm --network ic
```

## Documentation Updates

After successful deployment:
- [ ] Update README.md with mainnet URLs
- [ ] Update TOKEN_FACTORY_INTEGRATION.md with mainnet examples
- [ ] Document any deployment issues encountered
- [ ] Update QUICKSTART.md with mainnet commands
- [ ] Create release notes

## Support & Contact

- **Technical Issues:** Check GitHub issues or create new one
- **Cycle Top-ups:** Use NNS dapp or cycles faucet
- **Community:** Join ICP developer forum

---

## Quick Mainnet Commands

```bash
# Status checks
dfx canister status mshamba_backend --network ic
dfx canister status token_factory --network ic

# Cycle management
dfx canister deposit-cycles 50000000000000 token_factory --network ic
./scripts/manage-token-factory.sh status

# Create farm on mainnet
dfx canister call mshamba_backend createProfile '(...)' --network ic
dfx canister call mshamba_backend createFarm '(...)' --network ic
dfx canister call mshamba_backend launchFarmToken '("farm-XXX")' --network ic
```

---

**Ready for Launch! **

Remember: Test thoroughly on local network before deploying to mainnet.
