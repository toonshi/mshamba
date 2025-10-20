/**
 * Demo Setup Script for Hackathon
 * 
 * This script creates a complete demo farm with multiple supply chain events
 * logged to Hedera HCS. Perfect for showcasing the integration.
 * 
 * Run: node demo-setup.js
 */

import { initializeHCS, logSupplyChainEvent, getTopicInfo, closeHCS } from './src/hcsService.js';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Wait helper for dramatic effect
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createDemoFarm() {
  log('\n🌾 Mshamba × Hedera Demo Farm Setup', 'bright');
  log('━'.repeat(50), 'cyan');
  log('\nThis will create a complete farm lifecycle with events logged to Hedera HCS\n', 'yellow');

  try {
    // Initialize HCS
    log('1️⃣  Initializing Hedera HCS...', 'cyan');
    const topicId = await initializeHCS();
    log(`   ✅ Topic ID: ${topicId}`, 'green');
    await wait(1000);

    const demoFarm = {
      id: 'DEMO_FARM_001',
      name: 'Green Valley Demo Farm',
      location: 'Nakuru, Kenya',
      farmer: 'John Kamau',
    };

    log(`\n2️⃣  Creating demo farm: ${demoFarm.name}`, 'cyan');
    log(`   📍 Location: ${demoFarm.location}`, 'yellow');
    log(`   👨‍🌾 Farmer: ${demoFarm.farmer}`, 'yellow');
    await wait(500);

    const events = [];

    // Event 1: Purchase Seeds
    log('\n3️⃣  Logging supply chain events...', 'cyan');
    log('\n   📦 Event 1: Seed Purchase', 'blue');
    const seedEvent = await logSupplyChainEvent({
      eventType: 'INPUT_PURCHASED',
      farmId: demoFarm.id,
      farmName: demoFarm.name,
      category: 'inputs',
      subcategory: 'Seeds',
      name: 'Hybrid Maize Seeds (H614)',
      quantity: '25 kg',
      cost: 15000,
      supplier: 'Kenya Seed Company',
      date: '2024-12-01T08:00:00Z',
    });
    events.push(seedEvent);
    log(`   ✅ Verified on Hedera`, 'green');
    await wait(2000); // HCS rate limiting

    // Event 2: Purchase Fertilizer
    log('\n   🌱 Event 2: Fertilizer Purchase', 'blue');
    const fertilizerEvent = await logSupplyChainEvent({
      eventType: 'INPUT_PURCHASED',
      farmId: demoFarm.id,
      farmName: demoFarm.name,
      category: 'inputs',
      subcategory: 'Fertilizers',
      name: 'NPK 23:23:0 Fertilizer',
      quantity: '200 kg',
      cost: 28000,
      supplier: 'MEA Fertilizers',
      date: '2024-12-02T10:30:00Z',
    });
    events.push(fertilizerEvent);
    log(`   ✅ Verified on Hedera`, 'green');
    await wait(2000);

    // Event 3: Planting
    log('\n   🚜 Event 3: Planting Activity', 'blue');
    const plantingEvent = await logSupplyChainEvent({
      eventType: 'LABOR_ACTIVITY',
      farmId: demoFarm.id,
      farmName: demoFarm.name,
      category: 'labor',
      activity: 'Planting',
      workers: 8,
      cost: 12000,
      date: '2024-12-05T07:00:00Z',
      description: 'Planted 2 hectares with hybrid maize',
    });
    events.push(plantingEvent);
    log(`   ✅ Verified on Hedera`, 'green');
    await wait(2000);

    // Event 4: Fertilizer Application
    log('\n   💧 Event 4: Fertilizer Application', 'blue');
    const fertilizingEvent = await logSupplyChainEvent({
      eventType: 'LABOR_ACTIVITY',
      farmId: demoFarm.id,
      farmName: demoFarm.name,
      category: 'labor',
      activity: 'Fertilizing',
      workers: 4,
      cost: 5000,
      date: '2024-12-20T09:00:00Z',
      description: 'Applied NPK fertilizer - top dressing',
    });
    events.push(fertilizingEvent);
    log(`   ✅ Verified on Hedera`, 'green');
    await wait(2000);

    // Event 5: Weeding
    log('\n   🌿 Event 5: Weeding Activity', 'blue');
    const weedingEvent = await logSupplyChainEvent({
      eventType: 'LABOR_ACTIVITY',
      farmId: demoFarm.id,
      farmName: demoFarm.name,
      category: 'labor',
      activity: 'Weeding',
      workers: 6,
      cost: 9000,
      date: '2025-01-10T08:00:00Z',
      description: 'Manual weeding of entire field',
    });
    events.push(weedingEvent);
    log(`   ✅ Verified on Hedera`, 'green');
    await wait(2000);

    // Event 6: Harvest
    log('\n   🌽 Event 6: Harvest', 'blue');
    const harvestEvent = await logSupplyChainEvent({
      eventType: 'HARVEST_RECORDED',
      farmId: demoFarm.id,
      farmName: demoFarm.name,
      product: 'Maize',
      quantity: '4,500 kg',
      quality: 'Grade A',
      date: '2025-03-15T06:00:00Z',
      storageLocation: 'Farm Storage Facility',
    });
    events.push(harvestEvent);
    log(`   ✅ Verified on Hedera`, 'green');
    await wait(2000);

    // Event 7: Quality Check
    log('\n   ✓ Event 7: Quality Inspection', 'blue');
    const qualityEvent = await logSupplyChainEvent({
      eventType: 'QUALITY_CHECK',
      farmId: demoFarm.id,
      farmName: demoFarm.name,
      shipmentId: 'SH_DEMO_001',
      result: 'PASSED',
      inspector: 'Mary Wanjiku - Kenya Bureau of Standards',
      notes: 'Moisture content: 13.5%. No aflatoxin detected. Meets export standards.',
      date: '2025-03-16T10:00:00Z',
    });
    events.push(qualityEvent);
    log(`   ✅ Verified on Hedera`, 'green');
    await wait(2000);

    // Event 8: Packaging
    log('\n   📦 Event 8: Packaging', 'blue');
    const packagingEvent = await logSupplyChainEvent({
      eventType: 'PACKAGING_COMPLETED',
      farmId: demoFarm.id,
      farmName: demoFarm.name,
      shipmentId: 'SH_DEMO_001',
      quantity: '4,500 kg',
      packagingType: '50kg sacks - food grade',
      location: 'Packaging Facility, Nakuru',
      date: '2025-03-17T14:00:00Z',
    });
    events.push(packagingEvent);
    log(`   ✅ Verified on Hedera`, 'green');
    await wait(2000);

    // Event 9: Shipment Started
    log('\n   🚚 Event 9: Shipment Started', 'blue');
    const shipmentEvent = await logSupplyChainEvent({
      eventType: 'SHIPMENT_STARTED',
      farmId: demoFarm.id,
      farmName: demoFarm.name,
      shipmentId: 'SH_DEMO_001',
      origin: 'Nakuru, Kenya',
      destination: 'Nairobi Market Hub',
      carrier: 'Fast Track Logistics Ltd',
      estimatedDelivery: '2025-03-18T12:00:00Z',
      date: '2025-03-17T16:00:00Z',
    });
    events.push(shipmentEvent);
    log(`   ✅ Verified on Hedera`, 'green');
    await wait(2000);

    // Event 10: Delivery
    log('\n   ✅ Event 10: Delivery Confirmed', 'blue');
    const deliveryEvent = await logSupplyChainEvent({
      eventType: 'SHIPMENT_DELIVERED',
      farmId: demoFarm.id,
      farmName: demoFarm.name,
      shipmentId: 'SH_DEMO_001',
      receiver: 'Peter Omondi - Market Manager',
      condition: 'Excellent - no damage',
      date: '2025-03-18T11:30:00Z',
    });
    events.push(deliveryEvent);
    log(`   ✅ Verified on Hedera`, 'green');
    await wait(2000);

    // Event 11: Sale
    log('\n   💰 Event 11: Sale Completed', 'blue');
    const saleEvent = await logSupplyChainEvent({
      eventType: 'SALE_COMPLETED',
      farmId: demoFarm.id,
      farmName: demoFarm.name,
      product: 'Maize',
      quantity: '4,500 kg',
      price: 225000,
      buyer: 'Nairobi Grain Market',
      saleType: 'Wholesale',
      date: '2025-03-18T14:00:00Z',
    });
    events.push(saleEvent);
    log(`   ✅ Verified on Hedera`, 'green');

    // Get final topic info
    log('\n4️⃣  Fetching final topic information...', 'cyan');
    const topicInfo = await getTopicInfo();

    // Summary
    log('\n' + '━'.repeat(50), 'cyan');
    log('\n🎉 DEMO FARM SETUP COMPLETE!', 'bright');
    log('\n📊 Summary:', 'cyan');
    log(`   Farm: ${demoFarm.name}`, 'yellow');
    log(`   Events logged: ${events.length}`, 'yellow');
    log(`   Topic ID: ${topicInfo.topicId}`, 'yellow');
    log(`   Topic sequence: ${topicInfo.sequenceNumber}`, 'yellow');

    log('\n🔗 View on HashScan:', 'cyan');
    log(`   ${topicInfo.explorerUrl}`, 'blue');

    log('\n📝 Event Timeline:', 'cyan');
    events.forEach((event, i) => {
      log(`   ${i + 1}. ${event.message.eventType}`, 'yellow');
      log(`      Timestamp: ${event.consensusTimestamp}`, 'reset');
      log(`      TX: ${event.explorerUrl}`, 'blue');
    });

    log('\n💡 Next Steps:', 'cyan');
    log('   1. Open the HashScan link above to see all events', 'reset');
    log('   2. Use this farm in your hackathon demo', 'reset');
    log('   3. Show how each event has an immutable timestamp', 'reset');
    log('   4. Explain the cost savings vs. ICP-only approach', 'reset');

    log('\n' + '━'.repeat(50), 'cyan');

  } catch (error) {
    log(`\n❌ Error during demo setup: ${error.message}`, 'red');
    console.error(error);
  } finally {
    await closeHCS();
  }
}

// Run the demo setup
createDemoFarm();
