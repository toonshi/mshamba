import dotenv from 'dotenv';
import { Client, AccountId, PrivateKey, Hbar } from '@hashgraph/sdk';

dotenv.config();

export function createHederaClient() {
  // Validate environment variables
  if (!process.env.HEDERA_ACCOUNT_ID || !process.env.HEDERA_PRIVATE_KEY) {
    throw new Error(
      'Missing Hedera credentials. Please set HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY in .env file'
    );
  }

  try {
    const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
    const privateKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);

    // Create client for Hedera Testnet
    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);

    // Set default max transaction fee (2 HBAR)
    client.setDefaultMaxTransactionFee(new Hbar(2));
    
    console.log('✅ Hedera client initialized for testnet');
    console.log(`   Account: ${accountId.toString()}`);

    return client;
  } catch (error) {
    console.error('❌ Failed to create Hedera client:', error.message);
    throw error;
  }
}

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  hcsTopicId: process.env.HCS_TOPIC_ID || null,
};
