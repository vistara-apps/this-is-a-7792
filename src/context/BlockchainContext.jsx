import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useBlockchain } from '../hooks/useBlockchain';

// Create context
const BlockchainContext = createContext(null);

/**
 * Blockchain Provider component
 * Provides blockchain access and state throughout the application
 */
export function BlockchainProvider({ children }) {
  const { address, isConnected } = useAccount();
  const blockchain = useBlockchain();
  const [tokenBalances, setTokenBalances] = useState({});
  const [accessRights, setAccessRights] = useState({});

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setTokenBalances({});
      setAccessRights({});
    }
  }, [isConnected]);

  /**
   * Get token balance and cache it
   */
  const getTokenBalance = async (tokenAddress, chain) => {
    if (!isConnected || !address || !tokenAddress) return '0';
    
    const cacheKey = `${tokenAddress.toLowerCase()}-${chain}`;
    
    // Return cached balance if available
    if (tokenBalances[cacheKey]) {
      return tokenBalances[cacheKey];
    }
    
    // Fetch and cache balance
    const balance = await blockchain.getTokenBalance(tokenAddress, chain);
    
    setTokenBalances(prev => ({
      ...prev,
      [cacheKey]: balance
    }));
    
    return balance;
  };

  /**
   * Check access rights and cache result
   */
  const checkAccess = async (tokenAddress, minAmount, chain) => {
    if (!isConnected || !address || !tokenAddress) return false;
    
    const cacheKey = `${tokenAddress.toLowerCase()}-${minAmount}-${chain}`;
    
    // Return cached result if available
    if (accessRights[cacheKey] !== undefined) {
      return accessRights[cacheKey];
    }
    
    // Check access and cache result
    const hasAccess = await blockchain.checkAccess(tokenAddress, minAmount, chain);
    
    setAccessRights(prev => ({
      ...prev,
      [cacheKey]: hasAccess
    }));
    
    return hasAccess;
  };

  /**
   * Clear cached balances and access rights
   */
  const clearCache = () => {
    setTokenBalances({});
    setAccessRights({});
  };

  // Context value
  const value = {
    // State
    tokenBalances,
    accessRights,
    
    // Methods
    getTokenBalance,
    checkAccess,
    clearCache,
    
    // Pass through all blockchain methods
    ...blockchain
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}

/**
 * Custom hook to use the blockchain context
 */
export function useBlockchainContext() {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchainContext must be used within a BlockchainProvider');
  }
  return context;
}

export default BlockchainContext;

