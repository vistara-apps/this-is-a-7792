import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ArrowLeft, Settings, Users, TrendingUp, Plus } from 'lucide-react';
import { StakingForm } from '../components/StakingForm';
import { ProposalForm } from '../components/ProposalForm';
import { AccessControlPanel } from '../components/AccessControlPanel';
import { mockProjects } from '../data/mockData';

export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address } = useAccount();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const foundProject = mockProjects.find(p => p.projectId === parseInt(id));
    setProject(foundProject);
  }, [id]);

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Project Not Found
        </h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'access', name: 'Access Control', icon: Settings },
    { id: 'governance', name: 'Governance', icon: Users },
    { id: 'staking', name: 'Staking', icon: Plus }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              {project.tokenName}
            </h1>
            <p className="text-text-secondary">
              ${project.tokenSymbol} • {project.chain}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-text-secondary">Token Address</p>
          <p className="font-mono text-sm text-text-primary">
            {project.tokenAddress}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-2xl font-bold text-text-primary">
            {project.holderCount || 0}
          </div>
          <div className="text-text-secondary text-sm">Token Holders</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-text-primary">
            {project.utilityFeatures.length}
          </div>
          <div className="text-text-secondary text-sm">Active Features</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-text-primary">
            {project.proposalCount || 0}
          </div>
          <div className="text-text-secondary text-sm">Proposals</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-text-primary">
            {project.stakingPools?.length || 0}
          </div>
          <div className="text-text-secondary text-sm">Staking Pools</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Utility Features
                </h3>
                <div className="space-y-3">
                  {project.utilityFeatures.map((feature) => (
                    <div key={feature.featureId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">
                          {feature.featureName}
                        </p>
                        <p className="text-sm text-text-secondary">
                          Requires {feature.accessCriteria.minTokenAmount} tokens
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary">
                        Feature Access Granted
                      </p>
                      <p className="text-sm text-text-secondary">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary">
                        New Governance Proposal
                      </p>
                      <p className="text-sm text-text-secondary">
                        1 day ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'access' && (
          <AccessControlPanel project={project} />
        )}

        {activeTab === 'governance' && (
          <ProposalForm variant="create" project={project} />
        )}

        {activeTab === 'staking' && (
          <StakingForm variant="stake" project={project} />
        )}
      </div>
    </div>
  );
}