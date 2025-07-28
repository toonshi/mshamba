import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Copy, Check } from 'lucide-react';

export const WalletConnect = ({ isOpen, onClose, onConnect }) => {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const walletOptions = [
    {
      id: 'plug',
      name: 'Plug Wallet',
      icon: '🔌',
      description: 'Connect with Plug for ICP and ckBTC',
      currencies: ['ICP', 'ckBTC']
    },
    {
      id: 'nfid',
      name: 'NFID',
      icon: '🆔',
      description: 'Internet Identity with NFID',
      currencies: ['ICP', 'ckBTC']
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect with MetaMask for crypto',
      currencies: ['ETH', 'USDC']
    },
    {
      id: 'bank',
      name: 'Bank Account',
      icon: '🏦',
      description: 'Connect your bank for fiat deposits',
      currencies: ['USD', 'KES']
    }
  ];

  const handleConnect = async (wallet) => {
    setSelectedWallet(wallet.id);
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      onConnect(wallet);
      setIsConnecting(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Connect Wallet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet)}
              disabled={isConnecting}
              className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left disabled:opacity-50"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-sm text-gray-400">{wallet.description}</div>
                  <div className="flex space-x-2 mt-1">
                    {wallet.currencies.map((currency) => (
                      <span key={currency} className="text-xs bg-green-600 px-2 py-1 rounded">
                        {currency}
                      </span>
                    ))}
                  </div>
                </div>
                {isConnecting && selectedWallet === wallet.id && (
                  <div className="spinner"></div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-300">
            <strong>How it works:</strong>
            <ol className="mt-2 space-y-1 text-xs">
              <li>1. Connect your preferred wallet</li>
              <li>2. Deposit funds (ICP, ckBTC, or fiat)</li>
              <li>3. Invest in farms and receive farm tokens</li>
              <li>4. Track performance and receive profits</li>
              <li>5. Trade or sell tokens anytime</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};