# Mshamba Frontend Query Examples

This document provides example queries for all major backend endpoints, including farms, investments, users, and land. Use these examples to integrate your frontend with the Mshamba backend canister.

---

## Farms

### List All Farms
```js
const farms = await mshamba_backend.listFarms();
```

### Get a Single Farm
```js
const farmId = "farm-...";
const farm = await mshamba_backend.getFarm(farmId);
```

### Get Farm Valuation History
```js
const farmId = "farm-...";
const result = await mshamba_backend.getFarmValuationHistory(farmId);
if ('ok' in result) {
  // result.ok is an array of [timestamp, value] pairs
  const valuationHistory = result.ok;
}
```

---

## Investments

### Record an Investment (backend expects sharesReceived and pricePerShare)
```js
const result = await mshamba_backend.recordInvestment(
  farmId,
  amount,           // investment amount
  sharesReceived,   // number of shares bought
  pricePerShare     // price per share at purchase
);
```

### List My Investments (for the logged-in principal)
```js
const myInvestments = await mshamba_backend.listMyInvestments();
```

### Get Investment by ID
```js
const result = await mshamba_backend.getInvestment(investmentId);
```

---

## Users

### Upsert (Create/Update) Profile
```js
const result = await mshamba_backend.upsertProfile(
  name,
  email,
  role,    // e.g. { 'Investor': null }
  bio,
  location
);
```

### Get My Profile
```js
const result = await mshamba_backend.myProfile();
```

### Get Profile of Another User
```js
const result = await mshamba_backend.getProfileOf(principalId);
```

### List All Users
```js
const users = await mshamba_backend.listUsers();
```

---

## Land Listings

### Register Land
```js
const result = await mshamba_backend.registerLand(
  location,
  sizeInAcres,
  leaseRatePerMonth
);
```

### List All Available Land
```js
const landListings = await mshamba_backend.listAvailableLand();
```

### List My Land
```js
const myLand = await mshamba_backend.myLand();
```

### Mark Land as Leased
```js
const result = await mshamba_backend.markAsLeased(landId);
```

---

## Shares

### Add Shares
```js
const result = await mshamba_backend.addShares(
  farmId,
  sharesToAdd,
  pricePerShare
);
```

### View My Shares in a Farm
```js
const result = await mshamba_backend.mySharesIn(farmId);
```

### View All My Shares
```js
const result = await mshamba_backend.myAllShares();
```

---

## Analytics & Reporting (Multi-Investor, Multi-Farm)

### Seeded Example Data
- Investor One (principal: `4x7ip-acdba-xg5mg-d3xzf-73udy-ttnjo-7pzfq-6ta6j-zmuxl-fogrf-sqe`) invested in two farms.
- User One (Farmer, principal: `wozj7-erp7b-xdkns-vppfn-vzgar-vdosl-bpkqk-e6lnw-zhzth-yivvi-uae`) invested in one farm.

### Example: Aggregate Valuation History for All Farms
```js
const farms = await mshamba_backend.listFarms();
const allHistories = await Promise.all(
  farms.map(farm => mshamba_backend.getFarmValuationHistory(farm.farmId))
);
// allHistories is an array of valuation histories per farm
```

### Example: Aggregate Investments by Investor (Admin/Global)
```js
// Get all users
const users = await mshamba_backend.listUsers();
let allInvestments = [];
for (const user of users) {
  const invs = await mshamba_backend.listInvestmentsByInvestor(user.wallet);
  allInvestments = allInvestments.concat(invs);
}

// Aggregate: total invested per farm
const farmTotals = {};
for (const inv of allInvestments) {
  farmTotals[inv.farmId] = (farmTotals[inv.farmId] || 0) + inv.amount;
}
console.log(farmTotals);

// Aggregate: total invested per user
const userTotals = {};
for (const inv of allInvestments) {
  userTotals[inv.investor] = (userTotals[inv.investor] || 0) + inv.amount;
}
console.log(userTotals);
```

### CLI Example for Analytics
```bash
# List all users
$ dfx canister call mshamba_backend listUsers

# For each user principal, list investments
$ dfx canister call mshamba_backend listInvestmentsByInvestor '(principal "<principal_id>")'
```

---

## Notes
- All queries return a Motoko Result type: `{ ok: value }` or `{ err: message }`.
- Principal IDs are required for some queries (e.g., getProfileOf).
- For advanced analytics (e.g., all investments by all users), you may need to extend backend endpoints for admin analytics.
