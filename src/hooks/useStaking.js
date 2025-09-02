import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import stakingService from '../services/staking';

/**
 * Custom hook for staking operations
 * Provides methods for staking, unstaking, and rewards
 */
export function useStaking() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Reset error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Create a new staking pool
   */
  const createPool = useCallback(async (projectId, poolData) => {
    if (!projectId) {
      setError('Project ID is required');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const pool = await stakingService.createPool({
        ...poolData,
        projectId
      });
      
      return pool;
    } catch (err) {
      setError(err.message || 'Failed to create staking pool');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get all staking pools for a project
   */
  const getPools = useCallback(async (projectId) => {
    if (!projectId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const pools = await stakingService.getPools(projectId);
      
      // For each pool, get the user's staked balance if wallet is connected
      if (address) {
        const poolsWithUserBalance = await Promise.all(
          pools.map(async (pool) => {
            const userStaked = await stakingService.getUserStakedBalance(
              pool.poolId,
              address
            );
            
            const rewards = await stakingService.calculateRewards(
              pool.poolId,
              address
            );
            
            return {
              ...pool,
              userStaked,
              rewards
            };
          })
        );
        
        return poolsWithUserBalance;
      }
      
      return pools;
    } catch (err) {
      setError(err.message || 'Failed to fetch staking pools');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Stake tokens in a pool
   */
  const stakeTokens = useCallback(async (poolId, amount, project) => {
    if (!address || !poolId || !amount || !project) {
      setError('Missing required parameters');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await stakingService.stakeTokens(poolId, parseFloat(amount), address, project);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to stake tokens');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Unstake tokens from a pool
   */
  const unstakeTokens = useCallback(async (poolId, amount) => {
    if (!address || !poolId || !amount) {
      setError('Missing required parameters');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await stakingService.unstakeTokens(poolId, parseFloat(amount), address);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to unstake tokens');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Get a user's staked balance in a pool
   */
  const getStakedBalance = useCallback(async (poolId) => {
    if (!address || !poolId) return 0;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const balance = await stakingService.getUserStakedBalance(poolId, address);
      return balance;
    } catch (err) {
      setError(err.message || 'Failed to fetch staked balance');
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Calculate rewards for a user
   */
  const calculateRewards = useCallback(async (poolId) => {
    if (!address || !poolId) return 0;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const rewards = await stakingService.calculateRewards(poolId, address);
      return rewards;
    } catch (err) {
      setError(err.message || 'Failed to calculate rewards');
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Claim staking rewards
   */
  const claimRewards = useCallback(async (poolId) => {
    if (!address || !poolId) {
      setError('Missing required parameters');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const rewards = await stakingService.claimRewards(poolId, address);
      return rewards;
    } catch (err) {
      setError(err.message || 'Failed to claim rewards');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Get staking history for the connected wallet
   */
  const getStakingHistory = useCallback(async (poolId = null) => {
    if (!address) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const history = await stakingService.getStakingHistory(address, poolId);
      return history;
    } catch (err) {
      setError(err.message || 'Failed to fetch staking history');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  return {
    // State
    isLoading,
    error,
    clearError,
    
    // Methods
    createPool,
    getPools,
    stakeTokens,
    unstakeTokens,
    getStakedBalance,
    calculateRewards,
    claimRewards,
    getStakingHistory
  };
}

export default useStaking;

