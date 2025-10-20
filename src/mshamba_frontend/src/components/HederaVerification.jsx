import React from 'react';
import { CheckCircle, ExternalLink, Shield } from 'lucide-react';

/**
 * Component to display Hedera HCS verification badge and link
 * Shows when a supply chain event has been logged to Hedera
 */
export const HederaVerificationBadge = ({ hederaData, compact = false }) => {
  if (!hederaData || !hederaData.transactionId) {
    return null;
  }

  const { transactionId, consensusTimestamp, explorerUrl } = hederaData;

  if (compact) {
    return (
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        title="Verified on Hedera Consensus Service"
      >
        <Shield className="w-3 h-3" />
        <span>Verified on Hedera</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  return (
    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-semibold text-white">Verified on Hedera</h4>
            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              Immutable
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-2">
            This event has been permanently recorded on the Hedera public ledger
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2 text-gray-300">
              <span className="text-gray-500">Timestamp:</span>
              <span className="font-mono">{consensusTimestamp}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <span className="text-gray-500">Transaction:</span>
              <span className="font-mono truncate">{transactionId}</span>
            </div>
          </div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>View on HashScan Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * Loading state component while submitting to Hedera
 */
export const HederaVerificationLoading = () => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center animate-pulse">
          <Shield className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <p className="text-sm text-gray-300">Submitting to Hedera...</p>
          <p className="text-xs text-gray-500">Creating immutable record</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Error state component if Hedera submission fails
 */
export const HederaVerificationError = ({ error, onRetry }) => {
  return (
    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white mb-1">Hedera Verification Pending</h4>
          <p className="text-xs text-gray-400 mb-2">
            {error || 'Unable to verify on Hedera at this time'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HederaVerificationBadge;
