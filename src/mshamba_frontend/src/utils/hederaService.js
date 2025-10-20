/**
 * Hedera HCS Integration Utility
 * 
 * This module provides easy-to-use functions for logging supply chain events
 * to Hedera Consensus Service from React components.
 */

const HEDERA_SERVICE_URL = import.meta.env.VITE_HEDERA_SERVICE_URL || 'http://localhost:3001';

/**
 * Log a supply chain event to Hedera HCS
 * @param {Object} event - Event data to log
 * @returns {Promise<Object>} - Hedera transaction details
 */
export async function logToHedera(event) {
  try {
    const response = await fetch(`${HEDERA_SERVICE_URL}/api/log-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to log to Hedera');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Hedera logging error:', error);
    throw error;
  }
}

/**
 * Get Hedera topic information
 * @returns {Promise<Object>} - Topic details
 */
export async function getTopicInfo() {
  try {
    const response = await fetch(`${HEDERA_SERVICE_URL}/api/topic-info`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch topic info');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching topic info:', error);
    throw error;
  }
}

/**
 * Check if Hedera service is available
 * @returns {Promise<boolean>}
 */
export async function isHederaAvailable() {
  try {
    const response = await fetch(`${HEDERA_SERVICE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Event type builders for common supply chain events
 * These ensure consistent data structures
 */

export const HederaEvents = {
  /**
   * Create a harvest event
   */
  harvest: (farmId, farmName, product, quantity, quality, date) => ({
    eventType: 'HARVEST_RECORDED',
    farmId,
    farmName,
    product,
    quantity,
    quality,
    date: date || new Date().toISOString(),
  }),

  /**
   * Create an input purchase event (seeds, fertilizers, etc.)
   */
  inputPurchase: (farmId, farmName, category, subcategory, name, cost, date, supplier = null) => ({
    eventType: 'INPUT_PURCHASED',
    farmId,
    farmName,
    category,
    subcategory,
    name,
    cost,
    supplier,
    date: date || new Date().toISOString(),
  }),

  /**
   * Create a labor activity event
   */
  laborActivity: (farmId, farmName, activity, date, cost = null, workers = null) => ({
    eventType: 'LABOR_ACTIVITY',
    farmId,
    farmName,
    activity,
    cost,
    workers,
    date: date || new Date().toISOString(),
  }),

  /**
   * Create a quality check event
   */
  qualityCheck: (farmId, farmName, shipmentId, result, inspector = null, notes = null) => ({
    eventType: 'QUALITY_CHECK',
    farmId,
    farmName,
    shipmentId,
    result, // e.g., 'PASSED', 'FAILED'
    inspector,
    notes,
    date: new Date().toISOString(),
  }),

  /**
   * Create a packaging event
   */
  packaging: (farmId, farmName, shipmentId, quantity, packagingType = null, location = null) => ({
    eventType: 'PACKAGING_COMPLETED',
    farmId,
    farmName,
    shipmentId,
    quantity,
    packagingType,
    location,
    date: new Date().toISOString(),
  }),

  /**
   * Create a shipment started event
   */
  shipmentStarted: (farmId, farmName, shipmentId, origin, destination, carrier = null, estimatedDelivery = null) => ({
    eventType: 'SHIPMENT_STARTED',
    farmId,
    farmName,
    shipmentId,
    origin,
    destination,
    carrier,
    estimatedDelivery,
    date: new Date().toISOString(),
  }),

  /**
   * Create a delivery event
   */
  shipmentDelivered: (farmId, farmName, shipmentId, receiver = null, condition = null) => ({
    eventType: 'SHIPMENT_DELIVERED',
    farmId,
    farmName,
    shipmentId,
    receiver,
    condition,
    date: new Date().toISOString(),
  }),

  /**
   * Create a sale completed event
   */
  sale: (farmId, farmName, product, quantity, price, buyer = null, saleType = null) => ({
    eventType: 'SALE_COMPLETED',
    farmId,
    farmName,
    product,
    quantity,
    price,
    buyer,
    saleType,
    date: new Date().toISOString(),
  }),
};

/**
 * React Hook for managing Hedera logging state
 * Usage:
 * 
 * const { logEvent, isLogging, hederaData, error } = useHederaLogger();
 * 
 * const handleSave = async () => {
 *   const event = HederaEvents.harvest('FARM_001', 'Green Valley', 'Maize', '2500kg', 'A');
 *   await logEvent(event);
 * };
 */
export function createHederaLogger() {
  return {
    logEvent: async (event) => {
      try {
        const result = await logToHedera(event);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
  };
}

export default {
  logToHedera,
  getTopicInfo,
  isHederaAvailable,
  HederaEvents,
  createHederaLogger,
};
