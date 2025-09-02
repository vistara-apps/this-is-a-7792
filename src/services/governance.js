import { supabase } from '../lib/supabase';
import blockchainService from './blockchain';

/**
 * Governance service for TokenFlow
 * Handles proposal creation, voting, and execution
 */
export const governanceService = {
  /**
   * Create a new governance proposal
   * @param {Object} proposal - Proposal data
   * @param {string} userAddress - Creator's wallet address
   */
  async createProposal(proposal, userAddress) {
    try {
      // First, create the proposal in the database
      const { data, error } = await supabase
        .from('governance_proposals')
        .insert([{
          ...proposal,
          creatorAddress: userAddress.toLowerCase(),
          creationDate: new Date().toISOString(),
          forVotes: 0,
          againstVotes: 0,
          status: 'active'
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      // Then, try to create the proposal on-chain
      try {
        const onChainResult = await blockchainService.governance.createProposal(
          data,
          userAddress
        );
        
        if (onChainResult.success) {
          // Update the proposal with the transaction hash
          await supabase
            .from('governance_proposals')
            .update({ txHash: onChainResult.txHash })
            .eq('proposalId', data.proposalId);
        }
      } catch (onChainError) {
        console.warn('On-chain proposal creation failed:', onChainError);
        // Continue with the off-chain proposal
      }
      
      return data;
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  },
  
  /**
   * Get all proposals for a project
   * @param {string} projectId - Project ID
   */
  async getProposals(projectId) {
    try {
      const { data, error } = await supabase
        .from('governance_proposals')
        .select('*')
        .eq('projectId', projectId)
        .order('creationDate', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching proposals:', error);
      return [];
    }
  },
  
  /**
   * Get a proposal by ID
   * @param {string} proposalId - Proposal ID
   */
  async getProposal(proposalId) {
    try {
      const { data, error } = await supabase
        .from('governance_proposals')
        .select('*')
        .eq('proposalId', proposalId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching proposal:', error);
      return null;
    }
  },
  
  /**
   * Vote on a proposal
   * @param {string} proposalId - Proposal ID
   * @param {boolean} support - Whether to support the proposal
   * @param {string} userAddress - Voter's wallet address
   * @param {number} weight - Vote weight (token amount)
   */
  async castVote(proposalId, support, userAddress, weight) {
    try {
      // First, record the vote in the database
      const { error: voteError } = await supabase
        .from('proposal_votes')
        .insert([{
          proposalId,
          voterAddress: userAddress.toLowerCase(),
          support,
          weight,
          timestamp: new Date().toISOString()
        }]);
        
      if (voteError) throw voteError;
      
      // Then, update the proposal vote counts
      const voteField = support ? 'forVotes' : 'againstVotes';
      const { data: proposal, error: updateError } = await supabase
        .from('governance_proposals')
        .update({
          [voteField]: supabase.rpc('increment', { value: weight, field: voteField })
        })
        .eq('proposalId', proposalId)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      // Try to cast the vote on-chain
      try {
        await blockchainService.governance.castVote(
          proposalId,
          support,
          userAddress
        );
      } catch (onChainError) {
        console.warn('On-chain vote failed:', onChainError);
        // Continue with the off-chain vote
      }
      
      return proposal;
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  },
  
  /**
   * Check if a user has already voted on a proposal
   * @param {string} proposalId - Proposal ID
   * @param {string} userAddress - User's wallet address
   */
  async hasVoted(proposalId, userAddress) {
    try {
      const { data, error } = await supabase
        .from('proposal_votes')
        .select('*')
        .eq('proposalId', proposalId)
        .eq('voterAddress', userAddress.toLowerCase())
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      
      return !!data;
    } catch (error) {
      console.error('Error checking vote status:', error);
      return false;
    }
  },
  
  /**
   * Get all votes for a proposal
   * @param {string} proposalId - Proposal ID
   */
  async getVotes(proposalId) {
    try {
      const { data, error } = await supabase
        .from('proposal_votes')
        .select('*')
        .eq('proposalId', proposalId)
        .order('timestamp', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching votes:', error);
      return [];
    }
  },
  
  /**
   * Execute a passed proposal
   * @param {string} proposalId - Proposal ID
   * @param {string} userAddress - Executor's wallet address
   */
  async executeProposal(proposalId, userAddress) {
    try {
      // Check if the proposal has passed
      const { data: proposal, error } = await supabase
        .from('governance_proposals')
        .select('*')
        .eq('proposalId', proposalId)
        .single();
        
      if (error) throw error;
      
      if (proposal.status !== 'passed') {
        throw new Error('Proposal has not passed');
      }
      
      // Update the proposal status
      const { data: updatedProposal, error: updateError } = await supabase
        .from('governance_proposals')
        .update({ status: 'executed', executedAt: new Date().toISOString() })
        .eq('proposalId', proposalId)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      // In a real implementation, this would execute the proposal on-chain
      
      return updatedProposal;
    } catch (error) {
      console.error('Error executing proposal:', error);
      throw error;
    }
  }
};

export default governanceService;

