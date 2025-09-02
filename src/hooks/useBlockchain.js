import { useState, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import blockchainService from '../services/blockchain';

/**
 * Custom hook for blockchain operations
 * Provides methods for interacting with blockchain networks and manages loading/error states
 */
export function useBlockchain() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Reset error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Validate a token contract
   */
  const validateToken = useCallback(async (tokenAddress, chain) => {
    if (!tokenAddress) return { isValid: false, error: 'Token address is required' };
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await blockchainService.tokens.validateToken(tokenAddress, chain);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to validate token');
      return { isValid: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get token balance for the connected wallet
   */
  const getTokenBalance = useCallback(async (tokenAddress, chain) => {
    if (!address || !tokenAddress) return '0';
    
    setIsLoading(true);
    setError(null);
    
    try {
      const balance = await blockchainService.tokens.getBalance(address, tokenAddress, chain);
      return balance;
    } catch (err) {
      setError(err.message || 'Failed to get token balance');
      return '0';
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Check if the connected wallet meets token ownership requirements
   */
  const checkAccess = useCallback(async (tokenAddress, minAmount, chain) => {
    if (!address || !tokenAddress) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const hasAccess = await blockchainService.tokens.checkAccess(
        address,
        tokenAddress,
        minAmount,
        chain
      );
      
      return hasAccess;
    } catch (err) {
      setError(err.message || 'Failed to check access');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Create a governance proposal
   */
  const createProposal = useCallback(async (proposal) => {
    if (!address || !walletClient) {
      setError('Wallet not connected');
      return { success: false, error: 'Wallet not connected' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await blockchainService.governance.createProposal(
        proposal,
        walletClient
      );
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create proposal');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient]);

  /**
   * Vote on a governance proposal
   */
  const castVote = useCallback(async (proposalId, support) => {
    if (!address || !walletClient) {
      setError('Wallet not connected');
      return { success: false, error: 'Wallet not connected' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await blockchainService.governance.castVote(
        proposalId,
        support,
        walletClient
      );
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to cast vote');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient]);

  /**
   * Stake tokens
   */
  const stakeTokens = useCallback(async (pool, amount) => {
    if (!address || !walletClient) {
      setError('Wallet not connected');
      return { success: false, error: 'Wallet not connected' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await blockchainService.staking.stakeTokens(
        pool,
        amount,
        walletClient
      );
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to stake tokens');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient]);

  /**
   * Unstake tokens
   */
  const unstakeTokens = useCallback(async (pool, amount) => {
    if (!address || !walletClient) {
      setError('Wallet not connected');
      return { success: false, error: 'Wallet not connected' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await blockchainService.staking.unstakeTokens(
        pool,
        amount,
        walletClient
      );
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to unstake tokens');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient]);

  /**
   * Claim staking rewards
   */
  const claimRewards = useCallback(async (pool) => {
    if (!address || !walletClient) {
      setError('Wallet not connected');
      return { success: false, error: 'Wallet not connected' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await blockchainService.staking.claimRewards(
        pool,
        walletClient
      );
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to claim rewards');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient]);

  /**
   * Format token amount with proper decimals
   */
  const formatTokenAmount = useCallback((amount, decimals = 18) => {
    return blockchainService.utils.formatTokenAmount(amount, decimals);
  }, []);

  /**
   * Parse token amount to wei
   */
  const parseTokenAmount = useCallback((amount, decimals = 18) => {
    return blockchainService.utils.parseTokenAmount(amount, decimals);
  }, []);

  /**
   * Shorten address for display
   */
  const shortenAddress = useCallback((addr) => {
    return blockchainService.utils.shortenAddress(addr);
  }, []);

  return {
    // State
    isLoading,
    error,
    clearError,
    
    // Token methods
    validateToken,
    getTokenBalance,
    checkAccess,
    
    // Governance methods
    createProposal,
    castVote,
    
    // Staking methods
    stakeTokens,
    unstakeTokens,
    claimRewards,
    
    // Utility methods
    formatTokenAmount,
    parseTokenAmount,
    shortenAddress
  };
}

export default useBlockchain;

