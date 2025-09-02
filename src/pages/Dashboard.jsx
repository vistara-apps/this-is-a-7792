import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Plus, Coins, Users, TrendingUp, Lock, Vote, Layers } from 'lucide-react';
import { FeatureCard } from '../components/FeatureCard';
import { ProjectCard } from '../components/ProjectCard';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { mockProjects } from '../data/mockData';

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const [projects, setProjects] = useState([]);
  const [paidFeatures, setPaidFeatures] = useState(new Set());
  const { createSession } = usePaymentContext();

  useEffect(() => {
    // Load user's projects (mock data for now)
    if (isConnected && address) {
      const userProjects = mockProjects.filter(p => 
        p.creatorId.toLowerCase() === address.toLowerCase()
      );
      setProjects(userProjects);
    }
  }, [isConnected, address]);

  const handleUpgrade = async (feature) => {
    try {
      await createSession();
      setPaidFeatures(prev => new Set([...prev, feature]));
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const stats = [
    {
      name: 'Total Projects',
      value: projects.length,
      icon: Layers,
      color: 'text-blue-600'
    },
    {
      name: 'Active Features',
      value: projects.reduce((acc, p) => acc + p.utilityFeatures.length, 0),
      icon: Lock,
      color: 'text-green-600'
    },
    {
      name: 'Total Holders',
      value: projects.reduce((acc, p) => acc + (p.holderCount || 0), 0),
      icon: Users,
      color: 'text-purple-600'
    },
    {
      name: 'Governance Proposals',
      value: projects.reduce((acc, p) => acc + (p.proposalCount || 0), 0),
      icon: Vote,
      color: 'text-orange-600'
    }
  ];

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <Coins className="w-16 h-16 text-text-secondary mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-text-secondary mb-6">
          Connect your wallet to start creating token utility projects
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Unlock Token Utility
        </h1>
        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Create exclusive access, governance, and staking features for your token holders
        </p>
        <Link
          to="/create"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Project</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-text-primary">
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Core Features */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text-primary">
            Core Features
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FeatureCard
            variant="accessControl"
            title="Exclusive Access Control"
            description="Gate premium features behind token ownership"
            icon={Lock}
            isPaid={paidFeatures.has('access')}
            onUpgrade={() => handleUpgrade('access')}
          />
          <FeatureCard
            variant="governance"
            title="Community Governance"
            description="Enable token holder voting on key decisions"
            icon={Vote}
            isPaid={paidFeatures.has('governance')}
            onUpgrade={() => handleUpgrade('governance')}
          />
          <FeatureCard
            variant="staking"
            title="Staking Rewards"
            description="Incentivize long-term holding with staking pools"
            icon={TrendingUp}
            isPaid={paidFeatures.has('staking')}
            onUpgrade={() => handleUpgrade('staking')}
          />
        </div>
      </div>

      {/* User Projects */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text-primary">
            Your Projects
          </h2>
          {projects.length > 0 && (
            <Link to="/create" className="btn-secondary">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Link>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Layers className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No projects yet
            </h3>
            <p className="text-text-secondary mb-4">
              Create your first token utility project to get started
            </p>
            <Link to="/create" className="btn-primary">
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}