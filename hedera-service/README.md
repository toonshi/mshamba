# Mshamba Hedera HCS Service

This service integrates Hedera Consensus Service (HCS) with Mshamba to provide an immutable, verifiable audit trail for supply chain events.

## Why Hedera HCS?

- **Immutable Logging**: Supply chain events cannot be altered once submitted
- **Fast Finality**: 3-5 second consensus timestamps
- **Low Cost**: $0.0001 per event (vs. storing data in canisters)
- **Public Verifiability**: Anyone can verify events on HashScan explorer
- **Perfect for Compliance**: Auditors and regulators can independently verify farm records

## Setup Instructions

### 1. Get Hedera Testnet Credentials

1. Go to [Hedera Portal](https://portal.hedera.com/)
2. Create a free testnet account
3. You'll receive:
   - Account ID (format: `0.0.xxxxx`)
   - Private Key (ED25519 key)

### 2. Install Dependencies

```bash
cd hedera-service
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
PORT=3001
```

### 4. Test the Integration

Run the test script to verify everything works:

```bash
npm run test
```

This will:
- Create a new HCS topic (or use existing one)
- Submit 2 test events
- Display transaction details and explorer links

**Important**: Copy the Topic ID from the output and add it to your `.env` file:

```env
HCS_TOPIC_ID=0.0.xxxxx
```

### 5. Start the API Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```bash
GET /health
```

### Log a Supply Chain Event
```bash
POST /api/log-event
Content-Type: application/json

{
  "eventType": "HARVEST_RECORDED",
  "farmId": "FARM_001",
  "farmName": "Green Valley Farm",
  "product": "Maize",
  "quantity": "2500 kg",
  "quality": "Grade A",
  "date": "2024-12-20T10:00:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "topicId": "0.0.xxxxx",
    "transactionId": "0.0.xxxxx@1234567890.123456789",
    "consensusTimestamp": "2024-12-20T10:00:01.123456789Z",
    "explorerUrl": "https://hashscan.io/testnet/transaction/..."
  }
}
```

### Get Topic Information
```bash
GET /api/topic-info
```

### Get Available Event Types
```bash
GET /api/event-types
```

## Supported Event Types

### Farm Records
- `INPUT_PURCHASED` - Seeds, fertilizers, pesticides purchased
- `LABOR_ACTIVITY` - Planting, weeding, harvesting activities
- `HARVEST_RECORDED` - Crop yields recorded
- `SALE_COMPLETED` - Product sold

### Supply Chain
- `QUALITY_CHECK` - Quality inspection completed
- `PACKAGING_COMPLETED` - Products packaged
- `SHIPMENT_STARTED` - Shipment in transit
- `SHIPMENT_DELIVERED` - Delivery confirmed

## Integration with React Frontend

Example usage from your React components:

```javascript
// In FarmerRecords.jsx
const handleSubmit = async () => {
  const payload = {
    category: selectedCategory,
    subcategory: selectedSubcategory,
    ...formData,
  };

  // Save to ICP backend (existing)
  await onSaveRecord(payload);

  // Also log to Hedera HCS (new)
  try {
    const hederaEvent = {
      eventType: 'INPUT_PURCHASED',
      farmId: currentFarmId,
      farmName: currentFarmName,
      category: payload.category,
      subcategory: payload.subcategory,
      name: payload.name,
      cost: payload.cost,
      date: payload.date,
      supplier: payload.supplier,
    };

    const response = await fetch('http://localhost:3001/api/log-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hederaEvent),
    });

    const result = await response.json();
    console.log('Verified on Hedera:', result.data.explorerUrl);
  } catch (error) {
    console.error('Hedera logging failed:', error);
    // Non-blocking - continue even if Hedera fails
  }
};
```

## Cost Estimation

- **Topic Creation**: One-time cost of ~$0.01
- **Message Submission**: $0.0001 per event
- **100 events/day**: $0.01/day = $3.65/year
- **1,000 farms × 10 events/day**: $36.50/year

Compare to ICP canister storage for the same audit trail.

## Viewing Events

All events are publicly verifiable on the Hedera testnet explorer:

1. Get your topic ID from the API or `.env` file
2. Visit: `https://hashscan.io/testnet/topic/YOUR_TOPIC_ID`
3. View all messages and their consensus timestamps

## Deployment (Production)

For the hackathon demo, you can:

1. **Run locally**: Keep the service on your laptop during the demo
2. **Deploy to Render/Railway**: Free tier is sufficient
   ```bash
   # Add Procfile
   web: npm start
   ```
3. **Environment variables**: Set in deployment platform

For production after the hackathon, consider:
- Switching to Hedera Mainnet (requires real HBAR)
- Running as a background service on your ICP canister host
- Adding authentication/rate limiting

## Troubleshooting

**"Missing Hedera credentials" error**
- Ensure `.env` file exists and has valid `HEDERA_ACCOUNT_ID` and `HEDERA_PRIVATE_KEY`

**"Insufficient balance" error**
- Your testnet account needs HBAR. Go to portal.hedera.com and use the faucet

**"Topic not found" error**
- Remove `HCS_TOPIC_ID` from `.env` and let it create a new topic

**CORS errors from frontend**
- Make sure the API server is running on port 3001
- Check that `cors` is enabled in `api.js`

## Next Steps

1. ✅ Set up and test the service (Day 1)
2. Integrate with `FarmerRecords.jsx` (Day 2)
3. Integrate with `SupplyChain.jsx` (Day 2)
4. Build verification UI component (Day 3)
5. Prepare hackathon demo (Day 3)
