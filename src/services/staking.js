import { supabase } from '../lib/supabase';
import blockchainService from './blockchain';

/**
 * Staking service for TokenFlow
 * Handles staking, unstaking, and rewards
 */
export const stakingService = {
  /**
   * Create a new staking pool
   * @param {Object} pool - Staking pool data
   */
  async createPool(pool) {
    try {
      const { data, error } = await supabase
        .from('staking_pools')
        .insert([{
          ...pool,
          totalStaked: 0,
          createdAt: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating staking pool:', error);
      throw error;
    }
  },
  
  /**
   * Get all staking pools for a project
   * @param {string} projectId - Project ID
   */
  async getPools(projectId) {
    try {
      const { data, error } = await supabase
        .from('staking_pools')
        .select('*')
        .eq('projectId', projectId);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching staking pools:', error);
      return [];
    }
  },
  
  /**
   * Get a staking pool by ID
   * @param {string} poolId - Pool ID
   */
  async getPool(poolId) {
    try {
      const { data, error } = await supabase
        .from('staking_pools')
        .select('*')
        .eq('poolId', poolId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching staking pool:', error);
      return null;
    }
  },
  
  /**
   * Stake tokens in a pool
   * @param {string} poolId - Pool ID
   * @param {number} amount - Amount to stake
   * @param {string} userAddress - User's wallet address
   * @param {Object} project - Project data
   */
  async stakeTokens(poolId, amount, userAddress, project) {
    try {
      // First, try to stake on-chain
      try {
        const pool = await this.getPool(poolId);
        
        const onChainResult = await blockchainService.staking.stakeTokens(
          pool,
          amount,
          userAddress
        );
        
        if (!onChainResult.success) {
          throw new Error('On-chain staking failed');
        }
      } catch (onChainError) {
        console.warn('On-chain staking failed:', onChainError);
        // Continue with off-chain staking
      }
      
      // Record the staking action
      const { error: actionError } = await supabase
        .from('staking_actions')
        .insert([{
          poolId,
          userAddress: userAddress.toLowerCase(),
          amount,
          action: 'stake',
          timestamp: new Date().toISOString()
        }]);
        
      if (actionError) throw actionError;
      
      // Update the pool's total staked amount
      const { data: updatedPool, error: poolError } = await supabase
        .from('staking_pools')
        .update({
          totalStaked: supabase.rpc('increment', { value: amount, field: 'totalStaked' })
        })
        .eq('poolId', poolId)
        .select()
        .single();
        
      if (poolError) throw poolError;
      
      // Update or create the user's staking balance
      const { data: existingBalance, error: balanceError } = await supabase
        .from('user_staking_balances')
        .select('*')
        .eq('poolId', poolId)
        .eq('userAddress', userAddress.toLowerCase())
        .single();
        
      if (balanceError && balanceError.code !== 'PGRST116') throw balanceError;
      
      if (existingBalance) {
        // Update existing balance
        await supabase
          .from('user_staking_balances')
          .update({
            amount: existingBalance.amount + amount,
            updatedAt: new Date().toISOString()
          })
          .eq('id', existingBalance.id);
      } else {
        // Create new balance record
        await supabase
          .from('user_staking_balances')
          .insert([{
            poolId,
            userAddress: userAddress.toLowerCase(),
            amount,
            stakedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }]);
      }
      
      return updatedPool;
    } catch (error) {
      console.error('Error staking tokens:', error);
      throw error;
    }
  },
  
  /**
   * Unstake tokens from a pool
   * @param {string} poolId - Pool ID
   * @param {number} amount - Amount to unstake
   * @param {string} userAddress - User's wallet address
   */
  async unstakeTokens(poolId, amount, userAddress) {
    try {
      // Check if user has enough staked tokens
      const { data: userBalance, error: balanceError } = await supabase
        .from('user_staking_balances')
        .select('*')
        .eq('poolId', poolId)
        .eq('userAddress', userAddress.toLowerCase())
        .single();
        
      if (balanceError) throw balanceError;
      
      if (!userBalance || userBalance.amount < amount) {
        throw new Error('Insufficient staked balance');
      }
      
      // First, try to unstake on-chain
      try {
        const pool = await this.getPool(poolId);
        
        const onChainResult = await blockchainService.staking.unstakeTokens(
          pool,
          amount,
          userAddress
        );
        
        if (!onChainResult.success) {
          throw new Error('On-chain unstaking failed');
        }
      } catch (onChainError) {
        console.warn('On-chain unstaking failed:', onChainError);
        // Continue with off-chain unstaking
      }
      
      // Record the unstaking action
      const { error: actionError } = await supabase
        .from('staking_actions')
        .insert([{
          poolId,
          userAddress: userAddress.toLowerCase(),
          amount,
          action: 'unstake',
          timestamp: new Date().toISOString()
        }]);
        
      if (actionError) throw actionError;
      
      // Update the pool's total staked amount
      const { data: updatedPool, error: poolError } = await supabase
        .from('staking_pools')
        .update({
          totalStaked: supabase.rpc('decrement', { value: amount, field: 'totalStaked' })
        })
        .eq('poolId', poolId)
        .select()
        .single();
        
      if (poolError) throw poolError;
      
      // Update the user's staking balance
      await supabase
        .from('user_staking_balances')
        .update({
          amount: userBalance.amount - amount,
          updatedAt: new Date().toISOString()
        })
        .eq('id', userBalance.id);
      
      return updatedPool;
    } catch (error) {
      console.error('Error unstaking tokens:', error);
      throw error;
    }
  },
  
  /**
   * Get a user's staked balance in a pool
   * @param {string} poolId - Pool ID
   * @param {string} userAddress - User's wallet address
   */
  async getUserStakedBalance(poolId, userAddress) {
    try {
      const { data, error } = await supabase
        .from('user_staking_balances')
        .select('amount')
        .eq('poolId', poolId)
        .eq('userAddress', userAddress.toLowerCase())
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      return data ? data.amount : 0;
    } catch (error) {
      console.error('Error fetching staked balance:', error);
      return 0;
    }
  },
  
  /**
   * Calculate rewards for a user
   * @param {string} poolId - Pool ID
   * @param {string} userAddress - User's wallet address
   */
  async calculateRewards(poolId, userAddress) {
    try {
      // Get the user's staking balance
      const { data: userBalance, error: balanceError } = await supabase
        .from('user_staking_balances')
        .select('*')
        .eq('poolId', poolId)
        .eq('userAddress', userAddress.toLowerCase())
        .single();
        
      if (balanceError && balanceError.code !== 'PGRST116') throw balanceError;
      
      if (!userBalance || userBalance.amount <= 0) {
        return 0;
      }
      
      // Get the pool details
      const { data: pool, error: poolError } = await supabase
        .from('staking_pools')
        .select('*')
        .eq('poolId', poolId)
        .single();
        
      if (poolError) throw poolError;
      
      // Calculate time staked in days
      const stakedAt = new Date(userBalance.stakedAt);
      const now = new Date();
      const daysStaked = Math.max(0, (now - stakedAt) / (1000 * 60 * 60 * 24));
      
      // Calculate rewards based on APY
      const apy = pool.apy / 100;
      const rewards = userBalance.amount * (apy * daysStaked / 365);
      
      return rewards;
    } catch (error) {
      console.error('Error calculating rewards:', error);
      return 0;
    }
  },
  
  /**
   * Claim staking rewards
   * @param {string} poolId - Pool ID
   * @param {string} userAddress - User's wallet address
   */
  async claimRewards(poolId, userAddress) {
    try {
      // Calculate rewards
      const rewards = await this.calculateRewards(poolId, userAddress);
      
      if (rewards <= 0) {
        throw new Error('No rewards to claim');
      }
      
      // First, try to claim on-chain
      try {
        const pool = await this.getPool(poolId);
        
        const onChainResult = await blockchainService.staking.claimRewards(
          pool,
          userAddress
        );
        
        if (!onChainResult.success) {
          throw new Error('On-chain claim failed');
        }
      } catch (onChainError) {
        console.warn('On-chain claim failed:', onChainError);
        // Continue with off-chain claim
      }
      
      // Record the claim action
      const { error: actionError } = await supabase
        .from('staking_actions')
        .insert([{
          poolId,
          userAddress: userAddress.toLowerCase(),
          amount: rewards,
          action: 'claim',
          timestamp: new Date().toISOString()
        }]);
        
      if (actionError) throw actionError;
      
      // Reset the staking start time for future rewards calculation
      const { data: userBalance, error: balanceError } = await supabase
        .from('user_staking_balances')
        .select('*')
        .eq('poolId', poolId)
        .eq('userAddress', userAddress.toLowerCase())
        .single();
        
      if (balanceError) throw balanceError;
      
      await supabase
        .from('user_staking_balances')
        .update({
          stakedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('id', userBalance.id);
      
      return rewards;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      throw error;
    }
  },
  
  /**
   * Get staking history for a user
   * @param {string} userAddress - User's wallet address
   * @param {string} poolId - Pool ID (optional)
   */
  async getStakingHistory(userAddress, poolId = null) {
    try {
      let query = supabase
        .from('staking_actions')
        .select('*')
        .eq('userAddress', userAddress.toLowerCase())
        .order('timestamp', { ascending: false });
        
      if (poolId) {
        query = query.eq('poolId', poolId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching staking history:', error);
      return [];
    }
  }
};

export default stakingService;

