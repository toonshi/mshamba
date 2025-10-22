# Mobile Wallet Support Guide

## Overview

Mshamba now supports multiple authentication methods optimized for both desktop and mobile users.

---

## Supported Wallets

### 1. Internet Identity (Universal) ✅
- **Works on**: Desktop & Mobile (all browsers)
- **Login**: Biometrics (Face ID, Touch ID, PIN)
- **Best for**: Privacy-focused users
- **Setup**: None required - works instantly
- **Mobile**: ✅ Perfect support

**How it works on mobile:**
1. User clicks "Login with Internet Identity"
2. Opens II login page
3. Uses Face ID/Touch ID to authenticate
4. Redirected back to dapp

---

### 2. Plug Wallet

#### Desktop (Browser Extension) ✅
- **Works on**: Chrome, Firefox, Brave (desktop only)
- **Login**: Browser extension
- **Best for**: Crypto users who manage tokens
- **Setup**: Install extension from https://plugwallet.ooo/
- **Mobile**: ❌ Extension not available

#### Mobile (App) ⚠️ Partial Support
- **Works on**: iOS & Android (with Plug app installed)
- **Login**: Deep link to Plug mobile app
- **Best for**: Crypto users on mobile
- **Setup**: Install Plug app from app store
- **Status**: Basic support (deep links implemented)

**How Plug mobile works:**
1. User clicks "Connect Plug Wallet" on mobile
2. Website detects mobile device
3. Opens `plug://connect` deep link
4. Plug app opens and asks for permission
5. User approves in app
6. App redirects back to website
7. User is connected

**Current limitation:** Plug mobile integration is basic. Users need to:
- Have Plug app installed
- May need to manually return to browser after approval

---

### 3. NFID (Coming Soon) 🚧
- **Works on**: Desktop & Mobile (all browsers)
- **Login**: Email or Google sign-in
- **Best for**: Non-crypto users (farmers, investors)
- **Setup**: Sign in with email - that's it!
- **Mobile**: ✅ Perfect support

**Why NFID is great:**
- Easiest onboarding (like "Sign in with Google")
- No crypto knowledge needed
- Works everywhere
- Perfect for farmers in Kenya

**Status:** Package dependency conflicts. Will be added in next update.

---

## Current Implementation

### Desktop Experience
```
┌─────────────────────────────┐
│  🔐 Internet Identity       │  ← Universal
│  ⚡ Plug Wallet Extension    │  ← For crypto users
└─────────────────────────────┘
```

### Mobile Experience
```
┌─────────────────────────────┐
│  🔐 Internet Identity       │  ← Recommended
│  ⚡ Plug Wallet App          │  ← If installed
│  📧 NFID (coming soon)      │  ← Best for farmers
└─────────────────────────────┘
```

---

## Code Changes

### Files Modified
1. **src/mshamba_frontend/src/hooks/useAuth.js**
   - Added `isMobile` detection
   - Added Plug mobile deep link support
   - Added NFID provider option (ready for v2)

2. **src/mshamba_frontend/src/components/WalletSelector.jsx** (new)
   - UI component showing all wallet options
   - Mobile-optimized layout
   - Help text for beginners

### Key Functions

#### Mobile Detection
```javascript
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
  };
  checkMobile();
}, []);
```

#### Plug Mobile Connection
```javascript
const connectPlugWallet = async () => {
  if (isMobile) {
    // Use deep link
    const deepLink = `plug://connect?canisterId=${canisterId}&returnUrl=${returnUrl}`;
    window.location.href = deepLink;
  } else {
    // Use browser extension
    await window.ic.plug.requestConnect();
  }
};
```

#### NFID Login (Ready)
```javascript
const login = async (provider = "ii") => {
  let identityProvider;
  
  if (provider === "nfid") {
    identityProvider = "https://nfid.one/authenticate";
  } else {
    identityProvider = "https://identity.ic0.app";
  }
  
  await authClient.login({ identityProvider, ... });
};
```

---

## Testing

### On Desktop
1. Visit https://pri4n-hyaaa-aaaac-a4beq-cai.icp0.io/
2. Click "Login with Internet Identity" ✅
3. Or click "Connect Plug Wallet" (if extension installed) ✅

### On Mobile
1. Visit https://pri4n-hyaaa-aaaac-a4beq-cai.icp0.io/ on phone
2. Click "Login with Internet Identity" ✅
3. Or click "Connect Plug Wallet" (if app installed) ⚠️

---

## Recommendations

### For Different User Types

**Farmers (Non-crypto users):**
- **Now**: Use Internet Identity (works on any phone)
- **Soon**: Use NFID with email (easier than II)

**Investors (Crypto users):**
- **Desktop**: Use Plug extension (best token management)
- **Mobile**: Use Plug app OR Internet Identity

**First-time users:**
- **Best**: NFID when available (most familiar UX)
- **Now**: Internet Identity (works everywhere)

---

## Next Steps

### High Priority
1. ✅ Add mobile detection
2. ✅ Add Plug mobile deep links
3. 🚧 Fix NFID dependency conflicts
4. 📋 Test Plug mobile flow end-to-end

### Medium Priority
5. Add WalletConnect support
6. Add Stoic Wallet support
7. Create onboarding tutorials
8. Add wallet switching capability

### Nice to Have
9. Remember last used wallet
10. Show wallet balances in UI
11. Add multi-wallet support (connect both II + Plug)

---

## Troubleshooting

### Plug Mobile Not Opening
**Problem**: Clicking "Connect Plug" doesn't open app  
**Solution**: 
- Ensure Plug app is installed
- Try manually opening app first, then connecting
- Check if browser blocks deep links

### NFID Not Available
**Problem**: Can't see NFID option  
**Solution**: 
- NFID has dependency conflicts with current @dfinity packages
- Will be added in next update
- Use Internet Identity as alternative

### Mobile Wallet Not Persisting
**Problem**: User has to reconnect on every visit  
**Solution**: 
- This is expected with current deep link implementation
- Will improve with proper mobile SDK integration

---

## Resources

- [Internet Identity Docs](https://internetcomputer.org/docs/current/tokenomics/identity-auth/what-is-ic-identity)
- [Plug Wallet](https://plugwallet.ooo/)
- [NFID Docs](https://docs.nfid.one/)
- [ICP Developer Docs](https://internetcomputer.org/docs)

---

**Last Updated**: Oct 20, 2025  
**Status**: Mobile detection ✅ | Plug mobile ⚠️ | NFID 🚧
