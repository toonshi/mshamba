import { initializeHCS, logSupplyChainEvent, getTopicInfo, closeHCS } from './hcsService.js';

async function testHCSIntegration() {
  console.log('🧪 Testing Hedera HCS Integration for Mshamba\n');

  try {
    // Step 1: Initialize HCS
    console.log('1️⃣ Initializing HCS...');
    const topicId = await initializeHCS();
    console.log(`✅ Topic ID: ${topicId}\n`);

    // Step 2: Get topic info
    console.log('2️⃣ Fetching topic info...');
    const info = await getTopicInfo();
    console.log('✅ Topic Info:');
    console.log(JSON.stringify(info, null, 2));
    console.log('');

    // Step 3: Log a test harvest event
    console.log('3️⃣ Logging test harvest event...');
    const harvestEvent = {
      eventType: 'HARVEST_RECORDED',
      farmId: 'FARM_TEST_001',
      farmName: 'Green Valley Test Farm',
      product: 'Maize',
      quantity: '2500 kg',
      quality: 'Grade A',
      date: new Date().toISOString(),
      location: 'Nakuru, Kenya',
    };

    const result1 = await logSupplyChainEvent(harvestEvent);
    console.log('✅ Event logged:');
    console.log(`   Transaction: ${result1.transactionId}`);
    console.log(`   Timestamp: ${result1.consensusTimestamp}`);
    console.log(`   Explorer: ${result1.explorerUrl}`);
    console.log('');

    // Step 4: Log a test quality check event
    console.log('4️⃣ Logging test quality check event...');
    const qualityEvent = {
      eventType: 'QUALITY_CHECK',
      farmId: 'FARM_TEST_001',
      farmName: 'Green Valley Test Farm',
      shipmentId: 'SH_TEST_001',
      result: 'PASSED',
      inspector: 'John Doe',
      notes: 'Product meets all quality standards',
      date: new Date().toISOString(),
    };

    const result2 = await logSupplyChainEvent(qualityEvent);
    console.log('✅ Event logged:');
    console.log(`   Transaction: ${result2.transactionId}`);
    console.log(`   Timestamp: ${result2.consensusTimestamp}`);
    console.log(`   Explorer: ${result2.explorerUrl}`);
    console.log('');

    // Step 5: Summary
    console.log('🎉 Test completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Topic ID: ${topicId}`);
    console.log(`   Events logged: 2`);
    console.log(`   View on explorer: https://hashscan.io/testnet/topic/${topicId}`);
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Copy the Topic ID to your .env file as HCS_TOPIC_ID');
    console.log('   2. Start the API server: npm start');
    console.log('   3. Integrate with your React frontend');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await closeHCS();
  }
}

testHCSIntegration();
