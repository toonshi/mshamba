import React, { useState, useEffect } from 'react';
import { mshamba_backend } from 'declarations/mshamba_backend';
import './Wallet.css';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [activeTab, setActiveTab] = useState('deposit');
  const [transactions, setTransactions] = useState([]);

  // Fetch wallet data
  const fetchWallet = async () => {
    try {
      setLoading(true);
      const result = await mshamba_backend.getMyWallet();
      if ('ok' in result) {
        const walletData = result.ok;
        // Transform transactions to match our expected format
        const transactions = walletData.transactions.map(tx => ({
          ...tx,
          transactionType: tx.transactionType._name,
          amount: tx.amount.toString(),
          timestamp: tx.timestamp / 1000000 // Convert from nanoseconds to milliseconds
        }));
        
        setWallet({
          ...walletData,
          balance: walletData.balance.toString()
        });
        setTransactions(transactions);
      } else {
        setError(result.err || 'Failed to load wallet');
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
      setError('Failed to connect to wallet service');
    } finally {
      setLoading(false);
    }
  };

  // Load wallet data on component mount
  useEffect(() => {
    fetchWallet();
  }, []);

  // Handle deposit
  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || isNaN(depositAmount) || depositAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    try {
      setLoading(true);
      const amountE8s = Math.floor(parseFloat(depositAmount) * 1e8); // Convert to e8s
      const result = await mshamba_backend.depositToMyWallet(
        amountE8s,
        'Deposit from web interface'
      );
      
      if ('ok' in result) {
        const walletData = result.ok;
        const transactions = walletData.transactions.map(tx => ({
          ...tx,
          transactionType: tx.transactionType._name,
          amount: tx.amount.toString(),
          timestamp: tx.timestamp / 1000000 // Convert from nanoseconds to milliseconds
        }));
        
        setWallet({
          ...walletData,
          balance: walletData.balance.toString()
        });
        setTransactions(transactions);
        setDepositAmount('');
        setError(null);
      } else {
        setError(result.err || 'Deposit failed');
      }
    } catch (err) {
      console.error('Deposit error:', err);
      setError('Failed to process deposit: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Handle withdrawal
  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    try {
      setLoading(true);
      const amountE8s = Math.floor(parseFloat(withdrawAmount) * 1e8); // Convert to e8s
      // For now, we'll use the same method as deposit since withdraw might not be implemented
      const result = await mshamba_backend.withdrawFromMyWallet(
        amountE8s,
        'Withdrawal to external wallet'
      );
      
      if ('ok' in result) {
        const walletData = result.ok;
        const transactions = walletData.transactions.map(tx => ({
          ...tx,
          transactionType: tx.transactionType._name,
          amount: tx.amount.toString(),
          timestamp: tx.timestamp / 1000000 // Convert from nanoseconds to milliseconds
        }));
        
        setWallet({
          ...walletData,
          balance: walletData.balance.toString()
        });
        setTransactions(transactions);
        setWithdrawAmount('');
        setError(null);
      } else {
        setError(result.err || 'Withdrawal failed: ' + (result.err || 'Unknown error'));
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
      setError('Failed to process withdrawal: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Handle transfer
  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferAmount || isNaN(transferAmount) || transferAmount <= 0 || !transferTo) {
      setError('Please enter valid amount and recipient');
      return;
    }
    
    try {
      setLoading(true);
      const amountE8s = Math.floor(parseFloat(transferAmount) * 1e8); // Convert to e8s
      
      // First try to parse the input as a principal
      let recipientPrincipal;
      try {
        recipientPrincipal = window.ic.plug.agent.getPrincipal(transferTo);
      } catch (err) {
        // If parsing as principal fails, try to convert from text
        try {
          recipientPrincipal = Principal.fromText(transferTo);
        } catch (err) {
          setError('Invalid recipient principal ID');
          setLoading(false);
          return;
        }
      }
      
      // Note: The actual method name might be different in your backend
      const result = await mshamba_backend.transferToUser(
        recipientPrincipal,
        amountE8s,
        'Transfer to ' + transferTo
      );
      
      if ('ok' in result) {
        await fetchWallet(); // Refresh wallet data
        setTransferAmount('');
        setTransferTo('');
        setError(null);
      } else {
        setError('Transfer failed: ' + (result.err || 'Unknown error'));
      }
    } catch (err) {
      console.error('Transfer error:', err);
      setError('Failed to process transfer: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Format balance for display
  const formatBalance = (e8s) => {
    if (e8s === undefined || e8s === null) return '0.00';
    return (parseInt(e8s) / 1e8).toFixed(8);
  };

  // Format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp / 1000000).toLocaleString();
  };

  if (loading && !wallet) {
    return (
      <div className="wallet-loading">
        <div className="spinner"></div>
        <p>Loading wallet data...</p>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h2>My Wallet</h2>
        <div className="wallet-balance">
          <span className="balance-amount">{formatBalance(wallet?.balance)}</span>
          <span className="balance-currency">ICP</span>
        </div>
      </div>

      {error && <div className="wallet-error">{error}</div>}

      <div className="wallet-tabs">
        <button 
          className={`tab-btn ${activeTab === 'deposit' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposit')}
        >
          Deposit
        </button>
        <button 
          className={`tab-btn ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          Withdraw
        </button>
        <button 
          className={`tab-btn ${activeTab === 'transfer' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfer')}
        >
          Transfer
        </button>
        <button 
          className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
      </div>

      <div className="wallet-content">
        {activeTab === 'deposit' && (
          <form onSubmit={handleDeposit} className="wallet-form">
            <div className="form-group">
              <label>Amount (ICP)</label>
              <input
                type="number"
                step="0.00000001"
                min="0.00000001"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount to deposit"
                disabled={loading}
              />
            </div>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Deposit ICP'}
            </button>
          </form>
        )}

        {activeTab === 'withdraw' && (
          <form onSubmit={handleWithdraw} className="wallet-form">
            <div className="form-group">
              <label>Amount (ICP)</label>
              <input
                type="number"
                step="0.00000001"
                min="0.00000001"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                disabled={loading}
              />
            </div>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Withdraw ICP'}
            </button>
          </form>
        )}

        {activeTab === 'transfer' && (
          <form onSubmit={handleTransfer} className="wallet-form">
            <div className="form-group">
              <label>Recipient Principal ID</label>
              <input
                type="text"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                placeholder="Enter recipient's principal ID"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Amount (ICP)</label>
              <input
                type="number"
                step="0.00000001"
                min="0.00000001"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter amount to transfer"
                disabled={loading}
              />
            </div>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Transfer ICP'}
            </button>
          </form>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-list">
            <h3>Transaction History</h3>
            {transactions.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount (ICP)</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={index}>
                      <td>{formatDate(tx.timestamp)}</td>
                      <td className={`tx-type-${tx.transactionType}`}>
                        {tx.transactionType}
                      </td>
                      <td className="principal-id" title={tx.from}>
                        {tx.from.substring(0, 6)}...{tx.from.substring(tx.from.length - 4)}
                      </td>
                      <td className="principal-id" title={tx.to}>
                        {tx.to.substring(0, 6)}...{tx.to.substring(tx.to.length - 4)}
                      </td>
                      <td>{formatBalance(tx.amount)}</td>
                      <td>{tx.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No transactions yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
