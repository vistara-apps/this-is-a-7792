import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import governanceService from '../services/governance';
import blockchainService from '../services/blockchain';

/**
 * Custom hook for governance operations
 * Provides methods for creating and voting on proposals
 */
export function useGovernance() {
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
   * Create a new governance proposal
   */
  const createProposal = useCallback(async (projectId, proposalData) => {
    if (!address || !projectId) {
      setError('Missing required parameters');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const proposal = await governanceService.createProposal(
        {
          ...proposalData,
          projectId
        },
        address
      );
      
      return proposal;
    } catch (err) {
      setError(err.message || 'Failed to create proposal');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Get all proposals for a project
   */
  const getProposals = useCallback(async (projectId) => {
    if (!projectId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const proposals = await governanceService.getProposals(projectId);
      return proposals;
    } catch (err) {
      setError(err.message || 'Failed to fetch proposals');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get a proposal by ID
   */
  const getProposal = useCallback(async (proposalId) => {
    if (!proposalId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const proposal = await governanceService.getProposal(proposalId);
      return proposal;
    } catch (err) {
      setError(err.message || 'Failed to fetch proposal');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Vote on a proposal
   */
  const castVote = useCallback(async (proposalId, support, project) => {
    if (!address || !proposalId || !project) {
      setError('Missing required parameters');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if user has already voted
      const hasVoted = await governanceService.hasVoted(proposalId, address);
      
      if (hasVoted) {
        setError('You have already voted on this proposal');
        return false;
      }
      
      // Get user's token balance for vote weight
      const balance = await blockchainService.tokens.getBalance(
        address,
        project.tokenAddress,
        project.chain
      );
      
      const weight = parseFloat(balance);
      
      if (weight <= 0) {
        setError('You need to hold tokens to vote');
        return false;
      }
      
      // Cast vote
      await governanceService.castVote(proposalId, support, address, weight);
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to cast vote');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Check if the connected wallet has already voted on a proposal
   */
  const checkVoteStatus = useCallback(async (proposalId) => {
    if (!address || !proposalId) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const hasVoted = await governanceService.hasVoted(proposalId, address);
      return hasVoted;
    } catch (err) {
      setError(err.message || 'Failed to check vote status');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Get all votes for a proposal
   */
  const getVotes = useCallback(async (proposalId) => {
    if (!proposalId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const votes = await governanceService.getVotes(proposalId);
      return votes;
    } catch (err) {
      setError(err.message || 'Failed to fetch votes');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Execute a passed proposal
   */
  const executeProposal = useCallback(async (proposalId) => {
    if (!address || !proposalId) {
      setError('Missing required parameters');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await governanceService.executeProposal(proposalId, address);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to execute proposal');
      return false;
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
    createProposal,
    getProposals,
    getProposal,
    castVote,
    checkVoteStatus,
    getVotes,
    executeProposal
  };
}

export default useGovernance;

