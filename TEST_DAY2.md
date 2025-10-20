# 🧪 Day 2 Testing Guide

## Quick Test (2 minutes)

### Test via cURL (Without Frontend)

```bash
# Test 1: Log a seed purchase event
curl -X POST http://localhost:3001/api/log-event \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "INPUT_PURCHASED",
    "farmId": "TEST_FARM_001",
    "farmName": "Your Test Farm",
    "category": "inputs",
    "subcategory": "Seeds",
    "name": "Hybrid Maize Seeds",
    "cost": 15000,
    "supplier": "Kenya Seed Company",
    "date": "2025-01-21T01:00:00Z"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "topicId": "0.0.7098281",
    "transactionId": "0.0.7045880@...",
    "consensusTimestamp": "...",
    "sequenceNumber": "3",
    "explorerUrl": "https://hashscan.io/testnet/transaction/..."
  }
}
```

Copy the `explorerUrl` and paste in your browser to see the event on Hedera!

---

### Test 2: Multiple Events

```bash
# Planting activity
curl -X POST http://localhost:3001/api/log-event \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "LABOR_ACTIVITY",
    "farmId": "TEST_FARM_001",
    "farmName": "Your Test Farm",
    "activity": "Planting",
    "cost": 8000,
    "workers": 5,
    "date": "2025-01-21T08:00:00Z"
  }'

# Harvest recorded
curl -X POST http://localhost:3001/api/log-event \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "HARVEST_RECORDED",
    "farmId": "TEST_FARM_001",
    "farmName": "Your Test Farm",
    "product": "Maize",
    "quantity": "3000 kg",
    "quality": "Grade A",
    "date": "2025-01-21T10:00:00Z"
  }'
```

---

## View All Your Events

Visit your topic on HashScan:
**https://hashscan.io/testnet/topic/0.0.7098281**

You should see all events in chronological order with:
- Sequence numbers
- Consensus timestamps
- Message contents

---

## Test with Frontend (When Dev Server Runs)

1. **Start Frontend:**
   ```bash
   cd src/mshamba_frontend
   npm run dev
   ```

2. **Navigate to Farmer Records**

3. **Fill Out Form:**
   - Category: Inputs
   - Subcategory: Seeds
   - Name: Test Seeds
   - Cost: 5000
   - Date: Today
   - Click Save

4. **Watch For:**
   - Button changes to "Saving..."
   - Loading animation appears
   - Success message
   - **Blue/green "Verified on Hedera" badge**
   - Click the badge's explorer link

---

## Verify It's Working

### ✅ Checklist:

- [ ] Hedera service running on port 3001
- [ ] Can curl the health endpoint: `curl http://localhost:3001/health`
- [ ] Can log test events via cURL
- [ ] Events appear on HashScan
- [ ] Frontend imports don't error
- [ ] Verification badge renders correctly

---

## Troubleshooting

**"Cannot connect to Hedera service"**
```bash
# Check if running
curl http://localhost:3001/health

# If not, restart:
cd hedera-service
npm start
```

**"CORS error in browser"**
- Hedera service already has CORS enabled
- Check browser console for exact error

**"Transaction failed"**
- Check Hedera service logs
- Verify account has testnet HBAR
- Use portal.hedera.com faucet if needed

---

## Current Event Count

Check your topic sequence:
```bash
curl http://localhost:3001/api/topic-info | python3 -m json.tool
```

Should show increasing `sequenceNumber` with each event.
