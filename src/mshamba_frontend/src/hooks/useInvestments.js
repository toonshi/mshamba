import { useState, useCallback } from 'react';
import { farmListings, myInvestments, investmentData, cropYieldData } from '../data/mockFarmData';

export const useInvestments = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('6M');
  const [activeTab, setActiveTab] = useState('investments');
  const [wallet, setWallet] = useState(null);
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login');

  const timeframes = ['1M', '3M', '6M', '1Y', '2Y', 'All'];

  const handleInvest = useCallback((farmId) => {
    if (!wallet) {
      setShowWalletConnect(true);
      return;
    }
    
    const farm = farmListings.find(f => f.id === farmId);
    if (farm) {
      setSelectedFarm(farm);
      setShowInvestmentModal(true);
    }
  }, [wallet]);

  const handleConnectWallet = useCallback(() => {
    setShowWalletConnect(true);
  }, []);

  const handleWalletConnect = useCallback((walletData) => {
    setWallet({
      ...walletData,
      address: 'rdmx6-jaaaa-aaaah-qcaiq-cai', // Mock address
      balance: 6526.00
    });
    setShowWalletConnect(false);
  }, []);

  const handleWalletDisconnect = useCallback(() => {
    setWallet(null);
  }, []);

  const handleInvestmentComplete = useCallback((investmentData) => {
    console.log('Investment completed:', investmentData);
    // Here you would typically update the user's portfolio
    alert(`Successfully invested ${investmentData.currency} ${investmentData.amount} in ${selectedFarm.name}! You received ${investmentData.tokens} farm tokens.`);
  }, [selectedFarm]);
  const handleListFarm = useCallback(() => {
    setCurrentPage('farm-listing');
  }, []);

  const handleBrowseInvestments = useCallback(() => {
    setCurrentPage('all-investments');
  }, []);

  const handleMarketAnalysis = useCallback(() => {
    setCurrentPage('market-analysis');
  }, []);

  const handleMyInvestments = useCallback(() => {
    setCurrentPage('my-investments');
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setCurrentPage('dashboard');
  }, []);

  const handleLogin = useCallback(() => {
    setCurrentPage('auth');
    setAuthMode('login');
  }, []);

  const handleSignup = useCallback(() => {
    setCurrentPage('auth');
    setAuthMode('signup');
  }, []);

  const handleSupplyChain = useCallback(() => {
    setCurrentPage('supply-chain');
  }, []);

  const handleChat = useCallback(() => {
    setCurrentPage('chat');
  }, []);

  const handleFarmerRecords = useCallback(() => {
    setCurrentPage('farmer-records');
  }, []);

  return {
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
  };
};