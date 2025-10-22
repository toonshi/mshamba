# Internet Identity 2.0 Upgrade Guide

## Overview
This project has been upgraded to use **Internet Identity 2.0**, which provides enhanced security, better domain flexibility, and improved user experience.

## What's New in Internet Identity 2.0

### 1. **Alternative Frontend Origins**
- Support for multiple domains while maintaining the same user principals
- Enables custom domain support without losing user identities
- Better flexibility for production deployments

### 2. **Derivation Origin**
- Configure a canonical origin that determines user principals
- All alternative origins derive their principals from this canonical origin
- Ensures consistent identity across different deployment URLs

### 3. **Enhanced Security**
- Domain isolation for better protection against phishing
- Configurable delegation expiry times
- Improved mobile authentication experience

## Changes Made

### 1. Package Updates
**File:** `src/mshamba_frontend/package.json`

Updated DFINITY packages to latest versions:
```json
{
  "@dfinity/agent": "^3.2.4",
  "@dfinity/auth-client": "^3.2.4",
  "@dfinity/principal": "^3.2.4"
}
```

### 2. Authentication Implementation
**File:** `src/mshamba_frontend/src/hooks/useAuth.js`

Enhanced the `login()` function with II 2.0 features:
```javascript
await authClient.login({
  identityProvider,
  // II 2.0: Enable alternative frontend origins support
  derivationOrigin: !isLocal ? window.location.origin : undefined,
  // II 2.0: Set max time to live for delegation (8 days)
  maxTimeToLive: BigInt(8 * 24 * 60 * 60 * 1000 * 1000 * 1000),
  onSuccess: async () => { /* ... */ }
});
```

**Key Features:**
- `derivationOrigin`: Automatically set to current origin in production
- `maxTimeToLive`: 8-day delegation expiry for better security
- Local development: No derivation origin (uses default behavior)

### 3. Alternative Origins Configuration
**File:** `src/mshamba_frontend/public/.well-known/ii-alternative-origins`

Created configuration file for alternative origins:
```json
{
  "alternativeOrigins": []
}
```

This file is served at `https://<your-canister-id>.icp0.io/.well-known/ii-alternative-origins`

### 4. Internet Identity Canister Configuration
**File:** `dfx.json`

Simplified to use the "pull" type for automatic II updates:
```json
{
  "internet_identity": {
    "type": "pull",
    "id": "rdmx6-jaaaa-aaaaa-aaadq-cai"
  }
}
```

The "pull" type automatically fetches the latest Internet Identity canister from mainnet.

## How to Use Alternative Origins

### Scenario: Custom Domain Setup

If you want to use a custom domain (e.g., `https://mshamba.com`) while maintaining the same user principals as your canister URL:

#### 1. **Choose Your Derivation Origin (Primary Origin)**
Let's say your canister is deployed at:
- `https://abc123-xyz.icp0.io` (Primary/Derivation Origin)

And you want to add:
- `https://mshamba.com` (Alternative Origin)

#### 2. **Update Alternative Origins File**
Edit `src/mshamba_frontend/public/.well-known/ii-alternative-origins`:
```json
{
  "alternativeOrigins": [
    "https://mshamba.com"
  ]
}
```

**Requirements:**
- Maximum 10 alternative origins
- No trailing slashes
- No paths (only domain and protocol)
- Must be HTTPS in production

#### 3. **Deploy and Test**
After deploying, the file will be accessible at:
```
https://abc123-xyz.icp0.io/.well-known/ii-alternative-origins
```

#### 4. **Configure Custom Domain**
When users visit `https://mshamba.com`, they'll receive the same principals as if they logged in via `https://abc123-xyz.icp0.io`.

## Installation & Deployment

### 1. Install Updated Dependencies
```bash
cd src/mshamba_frontend
npm install
```

### 2. Deploy Internet Identity (Local Development)
```bash
dfx deploy internet_identity
```

The "pull" type will automatically download the latest II canister.

### 3. Deploy Your Application
```bash
# Build and deploy all canisters
dfx deploy

# Or deploy frontend only
dfx deploy mshamba_frontend
```

### 4. Test Authentication
```bash
npm run dev
```

Visit the local URL and test the login flow. You should see:
- Improved authentication flow
- 8-day delegation expiry
- Support for multiple origins (in production)

## Testing in Production

### Test Alternative Origins
1. Deploy your app to IC mainnet
2. Add your custom domain to the alternative origins file
3. Configure DNS and SSL for your custom domain
4. Test login from both the canister URL and custom domain
5. Verify that the same principal is used for both origins

### Verify Configuration
Check that your alternative origins file is accessible:
```bash
curl https://<your-canister-id>.icp0.io/.well-known/ii-alternative-origins
```

Should return:
```json
{
  "alternativeOrigins": ["https://your-custom-domain.com"]
}
```

## Migration Notes

### For Existing Users
- **No action required**: Existing users will continue to use the same principals
- **Automatic upgrade**: Next time users log in, they'll use II 2.0 automatically
- **Backward compatible**: Old delegations continue to work during transition

### For Developers
- **Update dependencies**: Run `npm install` in `src/mshamba_frontend`
- **Test locally**: Verify authentication works in local development
- **Deploy carefully**: Test on a staging environment before production
- **Monitor**: Check delegation expiry times (8 days) and adjust if needed

## Troubleshooting

### Issue: "Invalid derivation origin"
**Solution**: Ensure the alternative origins file is properly deployed and accessible at `/.well-known/ii-alternative-origins`

### Issue: Different principals on different domains
**Solution**: Verify that:
1. Both domains are listed in the alternative origins file
2. The `derivationOrigin` is set correctly in the code
3. The file is accessible via HTTPS

### Issue: Local development login fails
**Solution**: 
- Ensure Internet Identity is deployed locally: `dfx deploy internet_identity`
- Check that `CANISTER_ID_INTERNET_IDENTITY` environment variable is set
- Verify `.env` file is generated correctly

## Security Best Practices

1. **Only add domains you control** to alternative origins
2. **Never set a third-party domain** as derivation origin
3. **Use HTTPS** for all production domains
4. **Monitor delegation expiry**: Current setting is 8 days
5. **Regular updates**: Keep @dfinity packages up to date

## Additional Resources

- [Internet Identity Specification](https://internetcomputer.org/docs/references/ii-spec)
- [Alternative Origins Guide](https://internetcomputer.org/docs/building-apps/authentication/alternative-origins)
- [AuthClient Documentation](https://js.icp.build/auth/latest/)
- [Custom Domains on ICP](https://internetcomputer.org/docs/current/developer-docs/web-apps/custom-domains/using-custom-domains)

## Support

For issues or questions:
- Check the [Internet Identity GitHub](https://github.com/dfinity/internet-identity)
- Visit the [DFINITY Forum](https://forum.dfinity.org/)
- Review the [ICP Developer Docs](https://internetcomputer.org/docs)

---

**Upgrade Date**: October 20, 2025  
**II Version**: 2.0 (using pull canister)  
**Auth Client Version**: 3.2.4
