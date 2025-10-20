# Next Steps After Internet Identity 2.0 Upgrade

## Immediate Actions Required

### 1. Install Updated Dependencies
```bash
cd src/mshamba_frontend
npm install
```

This will install:
- `@dfinity/agent@3.2.4`
- `@dfinity/auth-client@3.2.4`
- `@dfinity/principal@3.2.4`

### 2. Deploy Internet Identity Locally
```bash
# From project root
dfx deploy internet_identity
```

The "pull" type will automatically download the latest II 2.0 canister from mainnet.

### 3. Test Authentication Locally
```bash
# Start local replica if not running
dfx start --clean --background

# Deploy all canisters
dfx deploy

# Start frontend dev server
cd src/mshamba_frontend
npm run dev
```

Visit the app and test:
- ✅ Login with Internet Identity
- ✅ Check that authentication works
- ✅ Verify delegation lasts 8 days
- ✅ Test logout functionality

## Optional: Configure Alternative Origins (Production)

### When You Have a Custom Domain

1. **Edit the alternative origins file:**
   ```bash
   vim src/mshamba_frontend/public/.well-known/ii-alternative-origins
   ```

2. **Add your custom domains:**
   ```json
   {
     "alternativeOrigins": [
       "https://mshamba.com",
       "https://www.mshamba.com"
     ]
   }
   ```

3. **Deploy to production:**
   ```bash
   dfx deploy --network ic
   ```

4. **Verify the file is accessible:**
   ```bash
   curl https://<your-canister-id>.icp0.io/.well-known/ii-alternative-origins
   ```

## Verification Checklist

- [ ] Dependencies installed successfully
- [ ] Internet Identity deployed locally
- [ ] Login works in local development
- [ ] Logout works correctly
- [ ] No console errors during authentication
- [ ] Delegation token has 8-day expiry
- [ ] `.well-known/ii-alternative-origins` file exists
- [ ] File is accessible via HTTP

## Common Issues & Solutions

### Issue: `npm install` fails
**Solution**: 
```bash
cd src/mshamba_frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Internet Identity deployment fails
**Solution**:
```bash
dfx stop
dfx start --clean --background
dfx deploy internet_identity
```

### Issue: "Cannot find module @dfinity/principal"
**Solution**: The package is now explicitly added. Run:
```bash
cd src/mshamba_frontend
npm install @dfinity/principal@3.2.4
```

## Production Deployment

When ready to deploy to mainnet:

```bash
# Build frontend
cd src/mshamba_frontend
npm run build

# Deploy to IC
cd ../..
dfx deploy --network ic
```

## Testing in Production

1. Visit your canister URL: `https://<canister-id>.icp0.io`
2. Click login and authenticate with Internet Identity
3. Check browser console for any errors
4. Verify principal remains consistent across sessions
5. Test that delegation expires after 8 days

## Documentation

For detailed information, see:
- `INTERNET_IDENTITY_2.0_UPGRADE.md` - Complete upgrade documentation
- [Internet Identity Spec](https://internetcomputer.org/docs/references/ii-spec)
- [Alternative Origins Guide](https://internetcomputer.org/docs/building-apps/authentication/alternative-origins)

## Support

If you encounter issues:
1. Check the console for error messages
2. Review `INTERNET_IDENTITY_2.0_UPGRADE.md`
3. Visit [DFINITY Forum](https://forum.dfinity.org/)
4. Check [Internet Identity GitHub](https://github.com/dfinity/internet-identity)

---

**Ready to test?** Start with step 1 above! 🚀
