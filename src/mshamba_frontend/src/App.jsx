import React from 'react';
import { Header } from './components/Header';
import { InvestmentOverview } from './components/InvestmentOverview';
import { TabNavigation } from './components/TabNavigation';
import { FarmCard } from './components/FarmCard';
import { CropYieldsChart } from './components/CropYieldsChart';
import { Sidebar } from './components/Sidebar';
import { WalletConnect } from './components/WalletConnect';
import { WalletDashboard } from './components/WalletDashboard';
import { InvestmentModal } from './components/InvestmentModal';
import { FarmListing } from './pages/FarmListing';
import { MarketAnalysis } from './pages/MarketAnalysis';
import { AllInvestments } from './pages/AllInvestments';
import { MyInvestments } from './pages/MyInvestments';
import { Auth } from './pages/Auth';
import { SupplyChain } from './pages/SupplyChain';
import { FarmerRecords } from './pages/FarmerRecords';
import { useInvestments } from './hooks/useInvestments';
import './styles/globals.css';

function App() {
  const {
    activeTimeframe,
    setActiveTimeframe,
    activeTab,
    setActiveTab,
    wallet,
    showWalletConnect,
    setShowWalletConnect,
    showInvestmentModal,
    setShowInvestmentModal,
    selectedFarm,
    currentPage,
    authMode,
    setAuthMode,
    timeframes,
    farmListings,
    myInvestments,
    investmentData,
    cropYieldData,
    handleInvest,
    handleConnectWallet,
    handleWalletConnect,
    handleWalletDisconnect,
    handleInvestmentComplete,
    handleListFarm,
    handleBrowseInvestments,
    handleMarketAnalysis,
    handleMyInvestments,
    handleBackToDashboard,
    handleLogin,
    handleSignup,
    handleSupplyChain,
    handleChat,
    handleFarmerRecords,
  } = useInvestments();

  // Render different pages based on currentPage state
  if (currentPage === 'auth') {
    return (
      <Auth 
        onBack={handleBackToDashboard} 
        mode={authMode}
        onModeChange={setAuthMode}
      />
    );
  }

  if (currentPage === 'supply-chain') {
    return <SupplyChain onBack={handleBackToDashboard} />;
  }

  if (currentPage === 'farmer-records') {
    return <FarmerRecords onBack={handleBackToDashboard} />;
  }

  if (currentPage === 'farm-listing') {
    return <FarmListing onBack={handleBackToDashboard} />;
  }

  if (currentPage === 'market-analysis') {
    return <MarketAnalysis onBack={handleBackToDashboard} />;
  }

  if (currentPage === 'all-investments') {
    return (
      <AllInvestments 
        onBack={handleBackToDashboard} 
        onInvest={handleInvest}
        hasWallet={!!wallet}
      />
    );
  }

  if (currentPage === 'my-investments') {
    return <MyInvestments onBack={handleBackToDashboard} />;
  }

  // Default dashboard view
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header 
        onListFarm={handleListFarm}
        onMyInvestments={handleMyInvestments}
        onMarketAnalysis={handleMarketAnalysis}
        onBrowseInvestments={handleBrowseInvestments}
        onSupplyChain={handleSupplyChain}
        onChat={handleChat}
        onFarmerRecords={handleFarmerRecords}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Wallet Dashboard */}
            {wallet && (
              <div className="mb-8">
                <WalletDashboard 
                  wallet={wallet}
                  onDeposit={() => alert('Deposit feature coming soon!')}
                  onWithdraw={() => alert('Withdraw feature coming soon!')}
                  onDisconnect={handleWalletDisconnect}
                />
              </div>
            )}

            <InvestmentOverview
              data={investmentData}
              activeTimeframe={activeTimeframe}
              timeframes={timeframes}
              onTimeframeChange={setActiveTimeframe}
            />

            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            {activeTab === 'investments' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in">
                {farmListings.map((farm) => (
                  <FarmCard
                    key={farm.id}
                    farm={farm}
                    onInvest={handleInvest}
                    hasWallet={!!wallet}
                  />
                ))}
              </div>
            )}

            {activeTab === 'yields' && (
              <div className="fade-in">
                <CropYieldsChart data={cropYieldData} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Sidebar
              myInvestments={myInvestments}
              wallet={wallet}
              onListFarm={handleListFarm}
              onBrowseInvestments={handleBrowseInvestments}
              onMarketAnalysis={handleMarketAnalysis}
              onSupplyChain={handleSupplyChain}
              onChat={handleChat}
              onFarmerRecords={handleFarmerRecords}
              onConnectWallet={handleConnectWallet}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <WalletConnect
        isOpen={showWalletConnect}
        onClose={() => setShowWalletConnect(false)}
        onConnect={handleWalletConnect}
      />

      {showInvestmentModal && selectedFarm && (
        <InvestmentModal
          farm={selectedFarm}
          isOpen={showInvestmentModal}
          onClose={() => setShowInvestmentModal(false)}
          onInvest={handleInvestmentComplete}
          walletBalance={wallet?.balance || 0}
        />
      )}
    </div>
  );
}

export default App;