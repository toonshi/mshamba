import {
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicInfoQuery,
} from '@hashgraph/sdk';
import { createHederaClient, config } from './config.js';

let client = null;
let topicId = null;

/**
 * Initialize the HCS service
 * Creates a topic if one doesn't exist
 */
export async function initializeHCS() {
  try {
    client = createHederaClient();

    if (config.hcsTopicId) {
      // Use existing topic
      topicId = config.hcsTopicId;
      console.log(`📋 Using existing HCS topic: ${topicId}`);

      // Verify topic exists
      await new TopicInfoQuery()
        .setTopicId(topicId)
        .execute(client);

      console.log('✅ Topic verified successfully');
    } else {
      // Create a new topic
      console.log('📝 Creating new HCS topic for Mshamba supply chain...');
      const transaction = new TopicCreateTransaction()
        .setTopicMemo('Mshamba Supply Chain Audit Trail')
        .setSubmitKey(client.operatorPublicKey);

      const txResponse = await transaction.execute(client);
      const receipt = await txResponse.getReceipt(client);
      topicId = receipt.topicId.toString();

      console.log('✅ HCS Topic created successfully!');
      console.log(`   Topic ID: ${topicId}`);
      console.log('   ⚠️  Add this to your .env file as HCS_TOPIC_ID');
    }

    return topicId;
  } catch (error) {
    console.error('❌ Failed to initialize HCS:', error.message);
    throw error;
  }
}

/**
 * Submit a supply chain event to the HCS topic
 * @param {Object} event - The event data to log
 * @returns {Object} - Transaction details including consensus timestamp
 */
export async function logSupplyChainEvent(event) {
  if (!client || !topicId) {
    throw new Error('HCS not initialized. Call initializeHCS() first.');
  }

  try {
    // Prepare event data with timestamp
    const eventData = {
      ...event,
      timestamp: new Date().toISOString(),
      platform: 'Mshamba',
      version: '1.0',
    };

    // Convert to JSON string
    const message = JSON.stringify(eventData);

    console.log(`📤 Submitting event to HCS: ${event.eventType}`);

    // Submit message to topic
    const transaction = new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(message);

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);

    // Get the transaction record for consensus timestamp
    const record = await txResponse.getRecord(client);
    const consensusTimestamp = record.consensusTimestamp;

    console.log('✅ Event logged to Hedera HCS');
    console.log(`   Consensus Timestamp: ${consensusTimestamp.toString()}`);
    console.log(`   Transaction ID: ${txResponse.transactionId.toString()}`);
    console.log(`   Sequence Number: ${record.receipt.topicSequenceNumber.toString()}`);

    return {
      success: true,
      topicId: topicId,
      transactionId: txResponse.transactionId.toString(),
      consensusTimestamp: consensusTimestamp.toString(),
      sequenceNumber: record.receipt.topicSequenceNumber.toString(),
      message: eventData,
      explorerUrl: `https://hashscan.io/testnet/transaction/${txResponse.transactionId.toString()}`,
    };
  } catch (error) {
    console.error('❌ Failed to log event:', error.message);
    throw error;
  }
}

/**
 * Get topic information
 */
export async function getTopicInfo() {
  if (!client || !topicId) {
    throw new Error('HCS not initialized');
  }

  try {
    const info = await new TopicInfoQuery()
      .setTopicId(topicId)
      .execute(client);

    return {
      topicId: topicId,
      memo: info.topicMemo,
      sequenceNumber: info.sequenceNumber.toString(),
      explorerUrl: `https://hashscan.io/testnet/topic/${topicId}`,
    };
  } catch (error) {
    console.error('❌ Failed to get topic info:', error);
    throw error;
  }
}

/**
 * Close the client connection
 */
export async function closeHCS() {
  if (client) {
    client.close();
    console.log('🔒 Hedera client closed');
  }
}
