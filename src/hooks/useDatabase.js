import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import databaseService from '../services/database';

/**
 * Custom hook for database operations
 * Provides methods for interacting with the database and manages loading/error states
 */
export function useDatabase() {
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
   * Get creator profile for the connected wallet
   */
  const getCreatorProfile = useCallback(async () => {
    if (!address) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const creator = await databaseService.creators.getByWalletAddress(address);
      return creator;
    } catch (err) {
      setError(err.message || 'Failed to fetch creator profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Create or update creator profile
   */
  const saveCreatorProfile = useCallback(async (profileData) => {
    if (!address) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const existingCreator = await databaseService.creators.getByWalletAddress(address);
      
      if (existingCreator) {
        return await databaseService.creators.update(existingCreator.creatorId, profileData);
      } else {
        return await databaseService.creators.create({
          ...profileData,
          walletAddress: address
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to save creator profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Get all projects for the connected wallet
   */
  const getProjects = useCallback(async () => {
    if (!address) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const creator = await databaseService.creators.getByWalletAddress(address);
      if (!creator) return [];
      
      const projects = await databaseService.projects.getByCreator(creator.creatorId);
      return projects;
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Get a project by ID
   */
  const getProject = useCallback(async (projectId) => {
    if (!projectId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const project = await databaseService.projects.getById(projectId);
      return project;
    } catch (err) {
      setError(err.message || 'Failed to fetch project');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new token project
   */
  const createProject = useCallback(async (projectData) => {
    if (!address) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const creator = await databaseService.creators.getByWalletAddress(address);
      if (!creator) {
        // Create creator profile if it doesn't exist
        const newCreator = await databaseService.creators.create({
          name: 'Creator',
          email: '',
          walletAddress: address
        });
        
        const project = await databaseService.projects.create({
          ...projectData,
          creatorId: newCreator.creatorId
        });
        
        return project;
      }
      
      const project = await databaseService.projects.create({
        ...projectData,
        creatorId: creator.creatorId
      });
      
      return project;
    } catch (err) {
      setError(err.message || 'Failed to create project');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Update an existing project
   */
  const updateProject = useCallback(async (projectId, updates) => {
    if (!projectId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const project = await databaseService.projects.update(projectId, updates);
      return project;
    } catch (err) {
      setError(err.message || 'Failed to update project');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a project
   */
  const deleteProject = useCallback(async (projectId) => {
    if (!projectId) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await databaseService.projects.delete(projectId);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get all utility features for a project
   */
  const getFeatures = useCallback(async (projectId) => {
    if (!projectId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const features = await databaseService.features.getByProject(projectId);
      return features;
    } catch (err) {
      setError(err.message || 'Failed to fetch features');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new utility feature
   */
  const createFeature = useCallback(async (projectId, featureData) => {
    if (!projectId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const feature = await databaseService.features.create({
        ...featureData,
        projectId
      });
      
      return feature;
    } catch (err) {
      setError(err.message || 'Failed to create feature');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update an existing feature
   */
  const updateFeature = useCallback(async (featureId, updates) => {
    if (!featureId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const feature = await databaseService.features.update(featureId, updates);
      return feature;
    } catch (err) {
      setError(err.message || 'Failed to update feature');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a feature
   */
  const deleteFeature = useCallback(async (featureId) => {
    if (!featureId) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await databaseService.features.delete(featureId);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete feature');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get all governance proposals for a project
   */
  const getProposals = useCallback(async (projectId) => {
    if (!projectId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const proposals = await databaseService.proposals.getByProject(projectId);
      return proposals;
    } catch (err) {
      setError(err.message || 'Failed to fetch proposals');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new governance proposal
   */
  const createProposal = useCallback(async (projectId, proposalData) => {
    if (!projectId || !address) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const proposal = await databaseService.proposals.create({
        ...proposalData,
        projectId,
        creatorAddress: address,
        creationDate: new Date().toISOString(),
        forVotes: 0,
        againstVotes: 0
      });
      
      return proposal;
    } catch (err) {
      setError(err.message || 'Failed to create proposal');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Vote on a governance proposal
   */
  const voteOnProposal = useCallback(async (proposalId, support, weight) => {
    if (!proposalId || !address) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await databaseService.proposals.recordVote(proposalId, address, support, weight);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to record vote');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Get all staking pools for a project
   */
  const getStakingPools = useCallback(async (projectId) => {
    if (!projectId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const pools = await databaseService.stakingPools.getByProject(projectId);
      
      // For each pool, get the user's staked balance
      if (address) {
        const poolsWithUserBalance = await Promise.all(
          pools.map(async (pool) => {
            const userStaked = await databaseService.stakingPools.getUserStakedBalance(
              pool.poolId,
              address
            );
            
            return {
              ...pool,
              userStaked
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
   * Create a new staking pool
   */
  const createStakingPool = useCallback(async (projectId, poolData) => {
    if (!projectId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const pool = await databaseService.stakingPools.create({
        ...poolData,
        projectId,
        totalStaked: 0
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
   * Stake tokens in a pool
   */
  const stakeTokens = useCallback(async (poolId, amount) => {
    if (!poolId || !address || !amount) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await databaseService.stakingPools.recordStakingAction(
        poolId,
        address,
        amount,
        true // isStaking = true
      );
      
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
    if (!poolId || !address || !amount) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await databaseService.stakingPools.recordStakingAction(
        poolId,
        address,
        amount,
        false // isStaking = false
      );
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to unstake tokens');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Update a user's token balance
   */
  const updateTokenBalance = useCallback(async (tokenAddress, chain, balance) => {
    if (!address || !tokenAddress || !chain) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await databaseService.userTokenBalances.updateUserBalance(
        address,
        tokenAddress,
        chain,
        balance
      );
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update token balance');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Get a user's token balance
   */
  const getTokenBalance = useCallback(async (tokenAddress, chain) => {
    if (!address || !tokenAddress || !chain) return 0;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const balance = await databaseService.userTokenBalances.getUserBalance(
        address,
        tokenAddress,
        chain
      );
      
      return balance;
    } catch (err) {
      setError(err.message || 'Failed to fetch token balance');
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  return {
    // State
    isLoading,
    error,
    clearError,
    
    // Creator methods
    getCreatorProfile,
    saveCreatorProfile,
    
    // Project methods
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    
    // Feature methods
    getFeatures,
    createFeature,
    updateFeature,
    deleteFeature,
    
    // Proposal methods
    getProposals,
    createProposal,
    voteOnProposal,
    
    // Staking methods
    getStakingPools,
    createStakingPool,
    stakeTokens,
    unstakeTokens,
    
    // Token balance methods
    updateTokenBalance,
    getTokenBalance
  };
}

export default useDatabase;

