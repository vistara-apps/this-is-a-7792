import { supabase } from '../lib/supabase';

/**
 * Database service for TokenFlow
 * Handles all interactions with Supabase database
 */
export const databaseService = {
  /**
   * Creator methods
   */
  creators: {
    /**
     * Get a creator by wallet address
     * @param {string} walletAddress - Creator's wallet address
     */
    async getByWalletAddress(walletAddress) {
      try {
        const { data, error } = await supabase
          .from('creators')
          .select('*')
          .eq('walletAddress', walletAddress.toLowerCase())
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching creator:', error);
        return null;
      }
    },
    
    /**
     * Create a new creator
     * @param {Object} creator - Creator data
     */
    async create(creator) {
      try {
        const { data, error } = await supabase
          .from('creators')
          .insert([{
            ...creator,
            walletAddress: creator.walletAddress.toLowerCase(),
          }])
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error creating creator:', error);
        throw error;
      }
    },
    
    /**
     * Update a creator
     * @param {string} creatorId - Creator ID
     * @param {Object} updates - Fields to update
     */
    async update(creatorId, updates) {
      try {
        const { data, error } = await supabase
          .from('creators')
          .update(updates)
          .eq('creatorId', creatorId)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating creator:', error);
        throw error;
      }
    }
  },
  
  /**
   * Token Project methods
   */
  projects: {
    /**
     * Get all projects for a creator
     * @param {string} creatorId - Creator ID
     */
    async getByCreator(creatorId) {
      try {
        const { data, error } = await supabase
          .from('token_projects')
          .select(`
            *,
            utility_features(*),
            governance_proposals(*),
            staking_pools(*)
          `)
          .eq('creatorId', creatorId);
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
    },
    
    /**
     * Get a project by ID
     * @param {string} projectId - Project ID
     */
    async getById(projectId) {
      try {
        const { data, error } = await supabase
          .from('token_projects')
          .select(`
            *,
            utility_features(*),
            governance_proposals(*),
            staking_pools(*)
          `)
          .eq('projectId', projectId)
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching project:', error);
        return null;
      }
    },
    
    /**
     * Create a new token project
     * @param {Object} project - Project data
     */
    async create(project) {
      try {
        const { data, error } = await supabase
          .from('token_projects')
          .insert([{
            ...project,
            tokenAddress: project.tokenAddress.toLowerCase(),
          }])
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error creating project:', error);
        throw error;
      }
    },
    
    /**
     * Update a token project
     * @param {string} projectId - Project ID
     * @param {Object} updates - Fields to update
     */
    async update(projectId, updates) {
      try {
        const { data, error } = await supabase
          .from('token_projects')
          .update(updates)
          .eq('projectId', projectId)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating project:', error);
        throw error;
      }
    },
    
    /**
     * Delete a token project
     * @param {string} projectId - Project ID
     */
    async delete(projectId) {
      try {
        const { error } = await supabase
          .from('token_projects')
          .delete()
          .eq('projectId', projectId);
          
        if (error) throw error;
        return { success: true };
      } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
      }
    }
  },
  
  /**
   * Utility Feature methods
   */
  features: {
    /**
     * Get all features for a project
     * @param {string} projectId - Project ID
     */
    async getByProject(projectId) {
      try {
        const { data, error } = await supabase
          .from('utility_features')
          .select('*')
          .eq('projectId', projectId);
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching features:', error);
        return [];
      }
    },
    
    /**
     * Create a new utility feature
     * @param {Object} feature - Feature data
     */
    async create(feature) {
      try {
        const { data, error } = await supabase
          .from('utility_features')
          .insert([feature])
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error creating feature:', error);
        throw error;
      }
    },
    
    /**
     * Update a utility feature
     * @param {string} featureId - Feature ID
     * @param {Object} updates - Fields to update
     */
    async update(featureId, updates) {
      try {
        const { data, error } = await supabase
          .from('utility_features')
          .update(updates)
          .eq('featureId', featureId)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating feature:', error);
        throw error;
      }
    },
    
    /**
     * Delete a utility feature
     * @param {string} featureId - Feature ID
     */
    async delete(featureId) {
      try {
        const { error } = await supabase
          .from('utility_features')
          .delete()
          .eq('featureId', featureId);
          
        if (error) throw error;
        return { success: true };
      } catch (error) {
        console.error('Error deleting feature:', error);
        throw error;
      }
    }
  },
  
  /**
   * Governance Proposal methods
   */
  proposals: {
    /**
     * Get all proposals for a project
     * @param {string} projectId - Project ID
     */
    async getByProject(projectId) {
      try {
        const { data, error } = await supabase
          .from('governance_proposals')
          .select('*')
          .eq('projectId', projectId);
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching proposals:', error);
        return [];
      }
    },
    
    /**
     * Create a new governance proposal
     * @param {Object} proposal - Proposal data
     */
    async create(proposal) {
      try {
        const { data, error } = await supabase
          .from('governance_proposals')
          .insert([proposal])
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error creating proposal:', error);
        throw error;
      }
    },
    
    /**
     * Update a governance proposal
     * @param {string} proposalId - Proposal ID
     * @param {Object} updates - Fields to update
     */
    async update(proposalId, updates) {
      try {
        const { data, error } = await supabase
          .from('governance_proposals')
          .update(updates)
          .eq('proposalId', proposalId)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating proposal:', error);
        throw error;
      }
    },
    
    /**
     * Record a vote on a proposal
     * @param {string} proposalId - Proposal ID
     * @param {string} voterAddress - Voter wallet address
     * @param {boolean} support - Whether the vote is in support
     * @param {number} weight - Vote weight (token amount)
     */
    async recordVote(proposalId, voterAddress, support, weight) {
      try {
        // First record the individual vote
        const { error: voteError } = await supabase
          .from('proposal_votes')
          .insert([{
            proposalId,
            voterAddress: voterAddress.toLowerCase(),
            support,
            weight
          }]);
          
        if (voteError) throw voteError;
        
        // Then update the proposal vote counts
        const voteField = support ? 'forVotes' : 'againstVotes';
        const { data, error } = await supabase.rpc('increment_proposal_votes', { 
          proposal_id: proposalId,
          vote_field: voteField,
          vote_amount: weight
        });
        
        if (error) throw error;
        return { success: true };
      } catch (error) {
        console.error('Error recording vote:', error);
        throw error;
      }
    }
  },
  
  /**
   * Staking Pool methods
   */
  stakingPools: {
    /**
     * Get all staking pools for a project
     * @param {string} projectId - Project ID
     */
    async getByProject(projectId) {
      try {
        const { data, error } = await supabase
          .from('staking_pools')
          .select('*')
          .eq('projectId', projectId);
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching staking pools:', error);
        return [];
      }
    },
    
    /**
     * Create a new staking pool
     * @param {Object} pool - Staking pool data
     */
    async create(pool) {
      try {
        const { data, error } = await supabase
          .from('staking_pools')
          .insert([pool])
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
     * Update a staking pool
     * @param {string} poolId - Pool ID
     * @param {Object} updates - Fields to update
     */
    async update(poolId, updates) {
      try {
        const { data, error } = await supabase
          .from('staking_pools')
          .update(updates)
          .eq('poolId', poolId)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating staking pool:', error);
        throw error;
      }
    },
    
    /**
     * Record a staking action
     * @param {string} poolId - Pool ID
     * @param {string} userAddress - User wallet address
     * @param {number} amount - Amount staked
     * @param {boolean} isStaking - True for staking, false for unstaking
     */
    async recordStakingAction(poolId, userAddress, amount, isStaking) {
      try {
        // Record the staking action
        const { error: actionError } = await supabase
          .from('staking_actions')
          .insert([{
            poolId,
            userAddress: userAddress.toLowerCase(),
            amount,
            action: isStaking ? 'stake' : 'unstake',
            timestamp: new Date()
          }]);
          
        if (actionError) throw actionError;
        
        // Update the pool's total staked amount
        const { data, error } = await supabase.rpc('update_pool_staked_amount', { 
          pool_id: poolId,
          stake_amount: isStaking ? amount : -amount
        });
        
        if (error) throw error;
        
        // Update the user's staked balance
        const { error: balanceError } = await supabase.rpc('update_user_staked_balance', { 
          pool_id: poolId,
          user_addr: userAddress.toLowerCase(),
          stake_amount: isStaking ? amount : -amount
        });
        
        if (balanceError) throw balanceError;
        
        return { success: true };
      } catch (error) {
        console.error('Error recording staking action:', error);
        throw error;
      }
    },
    
    /**
     * Get a user's staking balance
     * @param {string} poolId - Pool ID
     * @param {string} userAddress - User wallet address
     */
    async getUserStakedBalance(poolId, userAddress) {
      try {
        const { data, error } = await supabase
          .from('user_staking_balances')
          .select('amount')
          .eq('poolId', poolId)
          .eq('userAddress', userAddress.toLowerCase())
          .single();
          
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        
        return data ? data.amount : 0;
      } catch (error) {
        console.error('Error fetching staked balance:', error);
        return 0;
      }
    }
  },
  
  /**
   * User Token Balance methods
   */
  userTokenBalances: {
    /**
     * Get a user's token balance
     * @param {string} userAddress - User wallet address
     * @param {string} tokenAddress - Token contract address
     * @param {string} chain - Blockchain network
     */
    async getUserBalance(userAddress, tokenAddress, chain) {
      try {
        const { data, error } = await supabase
          .from('user_token_balances')
          .select('balance')
          .eq('userAddress', userAddress.toLowerCase())
          .eq('tokenAddress', tokenAddress.toLowerCase())
          .eq('chain', chain)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error;
        
        return data ? data.balance : 0;
      } catch (error) {
        console.error('Error fetching token balance:', error);
        return 0;
      }
    },
    
    /**
     * Update a user's token balance
     * @param {string} userAddress - User wallet address
     * @param {string} tokenAddress - Token contract address
     * @param {string} chain - Blockchain network
     * @param {number} balance - New token balance
     */
    async updateUserBalance(userAddress, tokenAddress, chain, balance) {
      try {
        const { data, error } = await supabase
          .from('user_token_balances')
          .upsert([{
            userAddress: userAddress.toLowerCase(),
            tokenAddress: tokenAddress.toLowerCase(),
            chain,
            balance,
            updatedAt: new Date()
          }])
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating token balance:', error);
        throw error;
      }
    }
  }
};

export default databaseService;

