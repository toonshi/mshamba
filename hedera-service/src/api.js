import express from 'express';
import cors from 'cors';
import { initializeHCS, logSupplyChainEvent, getTopicInfo, closeHCS } from './hcsService.js';
import { config } from './config.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mshamba-hedera-hcs' });
});

// Log a supply chain event
app.post('/api/log-event', async (req, res) => {
  try {
    const event = req.body;

    // Validate required fields
    if (!event.eventType || !event.farmId) {
      return res.status(400).json({
        error: 'Missing required fields: eventType, farmId',
      });
    }

    // Log to Hedera HCS
    const result = await logSupplyChainEvent(event);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error logging event:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get topic information
app.get('/api/topic-info', async (req, res) => {
  try {
    const info = await getTopicInfo();
    res.json({
      success: true,
      data: info,
    });
  } catch (error) {
    console.error('Error getting topic info:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Event type definitions for frontend reference
app.get('/api/event-types', (req, res) => {
  res.json({
    eventTypes: {
      // Farm Records Events
      INPUT_PURCHASED: {
        description: 'Seeds, fertilizers, pesticides, or tools purchased',
        requiredFields: ['farmId', 'category', 'subcategory', 'name', 'cost', 'date'],
        optionalFields: ['supplier', 'quantity', 'description'],
      },
      LABOR_ACTIVITY: {
        description: 'Labor activity recorded (planting, weeding, harvesting)',
        requiredFields: ['farmId', 'category', 'activity', 'date'],
        optionalFields: ['cost', 'workers', 'description'],
      },
      HARVEST_RECORDED: {
        description: 'Harvest yield recorded',
        requiredFields: ['farmId', 'product', 'quantity', 'date'],
        optionalFields: ['quality', 'storageLocation'],
      },
      SALE_COMPLETED: {
        description: 'Product sale completed',
        requiredFields: ['farmId', 'product', 'quantity', 'price', 'date'],
        optionalFields: ['buyer', 'saleType'],
      },

      // Supply Chain Events
      QUALITY_CHECK: {
        description: 'Quality inspection completed',
        requiredFields: ['farmId', 'shipmentId', 'result', 'date'],
        optionalFields: ['inspector', 'notes'],
      },
      PACKAGING_COMPLETED: {
        description: 'Product packaging completed',
        requiredFields: ['farmId', 'shipmentId', 'quantity', 'date'],
        optionalFields: ['packagingType', 'location'],
      },
      SHIPMENT_STARTED: {
        description: 'Product shipment initiated',
        requiredFields: ['farmId', 'shipmentId', 'origin', 'destination', 'date'],
        optionalFields: ['carrier', 'estimatedDelivery'],
      },
      SHIPMENT_DELIVERED: {
        description: 'Product delivered to destination',
        requiredFields: ['farmId', 'shipmentId', 'date'],
        optionalFields: ['receiver', 'condition'],
      },
    },
  });
});

// Initialize HCS and start server
async function startServer() {
  try {
    console.log('🚀 Starting Mshamba Hedera HCS Service...\n');

    // Initialize Hedera HCS
    await initializeHCS();

    // Start Express server
    app.listen(config.port, () => {
      console.log(`\n✅ Server running on port ${config.port}`);
      console.log(`   Health check: http://localhost:${config.port}/health`);
      console.log(`   Log event: POST http://localhost:${config.port}/api/log-event`);
      console.log(`   Topic info: GET http://localhost:${config.port}/api/topic-info`);
    });
  } catch (error) {
    console.error('💥 Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await closeHCS();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await closeHCS();
  process.exit(0);
});

startServer();
