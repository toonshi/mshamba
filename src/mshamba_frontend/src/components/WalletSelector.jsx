import React from 'react';
import { useAuth } from '../hooks/useAuth';

const WalletSelector = () => {
  const { login, connectPlugWallet, isMobile } = useAuth();

  return (
    <div className="wallet-selector">
      <h2>Connect Your Wallet</h2>
      <p className="subtitle">Choose how you want to sign in</p>

      <div className="wallet-options">
        {/* Internet Identity */}
        <button 
          className="wallet-option ii-option"
          onClick={() => login('ii')}
        >
          <div className="wallet-icon">🔐</div>
          <div className="wallet-info">
            <h3>Internet Identity</h3>
            <p>Secure login with biometrics</p>
            <span className="badge recommended">Works Everywhere</span>
          </div>
        </button>

        {/* NFID */}
        <button 
          className="wallet-option nfid-option"
          onClick={() => login('nfid')}
        >
          <div className="wallet-icon">📧</div>
          <div className="wallet-info">
            <h3>NFID</h3>
            <p>Sign in with email or Google</p>
            <span className="badge easy">Easiest for Beginners</span>
          </div>
        </button>

        {/* Plug Wallet */}
        <button 
          className={`wallet-option plug-option ${isMobile ? 'mobile-limited' : ''}`}
          onClick={connectPlugWallet}
        >
          <div className="wallet-icon">⚡</div>
          <div className="wallet-info">
            <h3>Plug Wallet</h3>
            <p>{isMobile ? 'Use Plug in-app browser' : 'Browser extension'}</p>
            {isMobile ? (
              <span className="badge warning">Desktop Recommended</span>
            ) : (
              <span className="badge crypto">For Crypto Users</span>
            )}
          </div>
        </button>
      </div>

      <div className="wallet-help">
        <h4>Need help choosing?</h4>
        <div className="help-grid">
          {isMobile ? (
            <>
              <div className="help-item">
                <strong>📱 On Mobile? Use Internet Identity</strong>
                <p>Works perfectly with Face ID or fingerprint. Fast, secure, and reliable on any phone.</p>
              </div>
              <div className="help-item">
                <strong>⚡ Want to use Plug?</strong>
                <p>Open this website in the Plug app's browser, or use a desktop computer.</p>
              </div>
            </>
          ) : (
            <>
              <div className="help-item">
                <strong>First time?</strong>
                <p>Use <strong>Internet Identity</strong> - works everywhere and needs no setup</p>
              </div>
              <div className="help-item">
                <strong>Have crypto?</strong>
                <p>Use <strong>Plug Wallet</strong> - manage ICP and tokens easily</p>
              </div>
              <div className="help-item">
                <strong>Privacy focused?</strong>
                <p>Use <strong>Internet Identity</strong> - anonymous and secure</p>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .wallet-selector {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h2 {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          text-align: center;
          color: #7f8c8d;
          margin-bottom: 2rem;
        }

        .wallet-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .wallet-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border: 2px solid #e1e8ed;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .wallet-option:hover {
          border-color: #3498db;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
        }

        .wallet-icon {
          font-size: 3rem;
          line-height: 1;
        }

        .wallet-info {
          flex: 1;
        }

        .wallet-info h3 {
          margin: 0 0 0.25rem 0;
          color: #2c3e50;
          font-size: 1.25rem;
        }

        .wallet-info p {
          margin: 0 0 0.5rem 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge.recommended {
          background: #27ae60;
          color: white;
        }

        .badge.easy {
          background: #3498db;
          color: white;
        }

        .badge.crypto {
          background: #9b59b6;
          color: white;
        }

        .badge.warning {
          background: #f39c12;
          color: white;
        }

        .wallet-option.mobile-limited {
          opacity: 0.7;
          border-color: #f39c12;
        }

        .wallet-help {
          border-top: 1px solid #e1e8ed;
          padding-top: 1.5rem;
        }

        .wallet-help h4 {
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .help-grid {
          display: grid;
          gap: 1rem;
        }

        .help-item {
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .help-item strong {
          color: #2c3e50;
          display: block;
          margin-bottom: 0.25rem;
        }

        .help-item p {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .wallet-selector {
            padding: 1.5rem;
          }

          .wallet-option {
            padding: 1rem;
          }

          .wallet-icon {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default WalletSelector;
