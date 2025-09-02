import React, { useState } from 'react';
import { Calendar, Users, TrendingUp } from 'lucide-react';

export function ProposalForm({ variant = 'create', project }) {
  const [proposals, setProposals] = useState([
    {
      proposalId: 1,
      title: 'Increase Staking Rewards',
      description: 'Propose to increase APY from 5% to 8% to incentivize more long-term holders.',
      creationDate: '2024-01-15',
      voteEndDate: '2024-01-22',
      forVotes: 1250,
      againstVotes: 340,
      status: 'active'
    },
    {
      proposalId: 2,
      title: 'Add New Utility Feature',
      description: 'Implement a token-gated NFT marketplace for exclusive community access.',
      creationDate: '2024-01-10',
      voteEndDate: '2024-01-17',
      forVotes: 2100,
      againstVotes: 150,
      status: 'passed'
    }
  ]);

  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    options: ['For', 'Against'],
    votingPeriod: 7
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProposal = () => {
    const proposal = {
      proposalId: Date.now(),
      ...newProposal,
      creationDate: new Date().toISOString().split('T')[0],
      voteEndDate: new Date(Date.now() + newProposal.votingPeriod * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      forVotes: 0,
      againstVotes: 0,
      status: 'active'
    };
    setProposals([proposal, ...proposals]);
    setNewProposal({ title: '', description: '', options: ['For', 'Against'], votingPeriod: 7 });
    setIsCreating(false);
  };

  const handleVote = (proposalId, vote) => {
    setProposals(proposals.map(p => 
      p.proposalId === proposalId 
        ? { 
            ...p, 
            forVotes: vote === 'for' ? p.forVotes + 100 : p.forVotes,
            againstVotes: vote === 'against' ? p.againstVotes + 100 : p.againstVotes
          }
        : p
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">
            Community Governance
          </h2>
          <p className="text-text-secondary">
            Create and manage governance proposals for token holders
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Users className="w-4 h-4" />
          <span>New Proposal</span>
        </button>
      </div>

      {isCreating && (
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Create New Proposal
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Proposal Title
              </label>
              <input
                type="text"
                value={newProposal.title}
                onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Increase Token Utility Features"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description
              </label>
              <textarea
                value={newProposal.description}
                onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed information about your proposal..."
                rows={4}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Voting Period (days)
              </label>
              <select
                value={newProposal.votingPeriod}
                onChange={(e) => setNewProposal(prev => ({ ...prev, votingPeriod: parseInt(e.target.value) }))}
                className="input-field"
              >
                <option value={3}>3 days</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreateProposal}
                disabled={!newProposal.title || !newProposal.description}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Proposal
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {proposals.map((proposal) => (
          <div key={proposal.proposalId} className="card">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {proposal.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      proposal.status === 'active' 
                        ? 'bg-blue-100 text-blue-700'
                        : proposal.status === 'passed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                  
                  <p className="text-text-secondary mb-3">
                    {proposal.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Ends {proposal.voteEndDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{proposal.forVotes + proposal.againstVotes} votes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting Results */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">For ({proposal.forVotes})</span>
                  <span className="text-text-secondary">Against ({proposal.againstVotes})</span>
                </div>
                
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-green-500"
                    style={{ 
                      width: `${(proposal.forVotes / (proposal.forVotes + proposal.againstVotes)) * 100}%` 
                    }}
                  />
                  <div 
                    className="absolute right-0 top-0 h-full bg-red-500"
                    style={{ 
                      width: `${(proposal.againstVotes / (proposal.forVotes + proposal.againstVotes)) * 100}%` 
                    }}
                  />
                </div>
              </div>

              {proposal.status === 'active' && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleVote(proposal.proposalId, 'for')}
                    className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                  >
                    Vote For
                  </button>
                  <button
                    onClick={() => handleVote(proposal.proposalId, 'against')}
                    className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Vote Against
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}