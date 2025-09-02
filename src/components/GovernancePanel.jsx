import React, { useState, useEffect } from 'react';
import { Plus, Vote, ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle, Info } from 'lucide-react';
import { useGovernance } from '../hooks/useGovernance';
import { useToast } from '../context/ToastContext';
import { LoadingIndicator } from './LoadingIndicator';
import { useAccount } from 'wagmi';

/**
 * Governance Panel component
 * Manages governance proposals for a project
 */
export function GovernancePanel({ project, onUpdate }) {
  const { address } = useAccount();
  const { 
    getProposals, 
    createProposal, 
    castVote, 
    checkVoteStatus, 
    isLoading, 
    error 
  } = useGovernance();
  const toast = useToast();
  
  const [proposals, setProposals] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    voteEndDate: '',
    options: ['For', 'Against']
  });

  // Load proposals on mount
  useEffect(() => {
    if (project) {
      loadProposals();
    }
  }, [project]);

  // Load proposals from the database
  const loadProposals = async () => {
    try {
      const projectProposals = await getProposals(project.projectId);
      setProposals(projectProposals);
      
      // Check user's vote status for each proposal
      if (address) {
        const voteStatuses = {};
        
        await Promise.all(
          projectProposals.map(async (proposal) => {
            const hasVoted = await checkVoteStatus(proposal.proposalId);
            voteStatuses[proposal.proposalId] = hasVoted;
          })
        );
        
        setUserVotes(voteStatuses);
      }
    } catch (err) {
      toast.error('Failed to load proposals');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle proposal creation
  const handleCreateProposal = async (e) => {
    e.preventDefault();
    
    try {
      // Calculate vote end date (7 days from now if not specified)
      const endDate = formData.voteEndDate 
        ? new Date(formData.voteEndDate).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      await createProposal(project.projectId, {
        title: formData.title,
        description: formData.description,
        voteEndDate: endDate,
        options: formData.options
      });
      
      toast.success('Proposal created successfully');
      setIsCreating(false);
      setFormData({
        title: '',
        description: '',
        voteEndDate: '',
        options: ['For', 'Against']
      });
      
      await loadProposals();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to create proposal');
    }
  };

  // Handle voting on a proposal
  const handleVote = async (proposalId, support) => {
    try {
      const success = await castVote(proposalId, support, project);
      
      if (success) {
        toast.success('Vote cast successfully');
        setUserVotes(prev => ({
          ...prev,
          [proposalId]: true
        }));
        await loadProposals();
      } else {
        toast.error('Failed to cast vote');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cast vote');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if a proposal is active
  const isProposalActive = (proposal) => {
    const endDate = new Date(proposal.voteEndDate);
    return endDate > new Date();
  };

  // Calculate proposal status
  const getProposalStatus = (proposal) => {
    if (!isProposalActive(proposal)) {
      return proposal.forVotes > proposal.againstVotes ? 'passed' : 'rejected';
    }
    return 'active';
  };

  // Cancel creating a proposal
  const cancelCreate = () => {
    setIsCreating(false);
    setFormData({
      title: '',
      description: '',
      voteEndDate: '',
      options: ['For', 'Against']
    });
  };

  if (isLoading && proposals.length === 0) {
    return <LoadingIndicator text="Loading proposals..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">
          Governance
        </h2>
        
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Proposal
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      )}
      
      {/* Proposal Creation Form */}
      {isCreating && (
        <div className="card">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Create New Proposal
          </h3>
          
          <form onSubmit={handleCreateProposal}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Proposal Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Add new feature X"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field w-full min-h-[120px]"
                  placeholder="Describe your proposal in detail..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Voting End Date
                </label>
                <input
                  type="date"
                  name="voteEndDate"
                  value={formData.voteEndDate}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-text-secondary mt-1">
                  If not specified, voting will end in 7 days
                </p>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Proposal'}
                </button>
                
                <button
                  type="button"
                  onClick={cancelCreate}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Proposals List */}
      {proposals.length > 0 ? (
        <div className="space-y-4">
          {proposals.map(proposal => {
            const status = getProposalStatus(proposal);
            const hasVoted = userVotes[proposal.proposalId];
            const totalVotes = proposal.forVotes + proposal.againstVotes;
            const forPercentage = totalVotes > 0 ? (proposal.forVotes / totalVotes) * 100 : 0;
            
            return (
              <div 
                key={proposal.proposalId}
                className="card"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-text-primary">
                        {proposal.title}
                      </h3>
                      
                      {status === 'active' && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                          Active
                        </span>
                      )}
                      
                      {status === 'passed' && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                          Passed
                        </span>
                      )}
                      
                      {status === 'rejected' && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                          Rejected
                        </span>
                      )}
                    </div>
                    
                    <p className="text-text-secondary text-sm mb-2">
                      Created by {proposal.creatorAddress.slice(0, 6)}...{proposal.creatorAddress.slice(-4)} on {formatDate(proposal.creationDate)}
                    </p>
                    
                    <div className="flex items-center text-text-secondary text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>
                        {status === 'active' 
                          ? `Voting ends on ${formatDate(proposal.voteEndDate)}`
                          : `Voting ended on ${formatDate(proposal.voteEndDate)}`
                        }
                      </span>
                    </div>
                  </div>
                  
                  {status === 'active' && !hasVoted && (
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <button
                        onClick={() => handleVote(proposal.proposalId, true)}
                        className="btn-secondary flex items-center text-green-600 hover:bg-green-50"
                        disabled={isLoading}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        For
                      </button>
                      
                      <button
                        onClick={() => handleVote(proposal.proposalId, false)}
                        className="btn-secondary flex items-center text-red-600 hover:bg-red-50"
                        disabled={isLoading}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Against
                      </button>
                    </div>
                  )}
                  
                  {hasVoted && (
                    <div className="mt-4 md:mt-0 text-text-secondary text-sm flex items-center">
                      <Vote className="w-4 h-4 mr-1" />
                      You've voted
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-text-primary whitespace-pre-line">
                    {proposal.description}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <ThumbsUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-text-primary font-medium">For: {proposal.forVotes}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <ThumbsDown className="w-4 h-4 text-red-600 mr-1" />
                      <span className="text-text-primary font-medium">Against: {proposal.againstVotes}</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${forPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between mt-1 text-xs text-text-secondary">
                    <span>{forPercentage.toFixed(1)}%</span>
                    <span>{totalVotes} votes</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Vote className="w-6 h-6 text-text-secondary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-1">
            No Proposals Yet
          </h3>
          <p className="text-text-secondary mb-4">
            Create your first governance proposal to let token holders vote on project decisions
          </p>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary mx-auto"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Proposal
            </button>
          )}
        </div>
      )}
      
      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">
              About Governance
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Governance allows token holders to vote on proposals using their tokens.
              The more tokens a user holds, the more voting power they have.
              Proposals can be used for feature prioritization, treasury allocation, or other project decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GovernancePanel;

