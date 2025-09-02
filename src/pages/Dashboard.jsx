import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Coins, ArrowRight, TrendingUp, Users, Shield } from 'lucide-react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { useAuth } from '../hooks/useAuth';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingIndicator, SkeletonLoader } from '../components/LoadingIndicator';

/**
 * Dashboard page component
 * Main landing page showing projects and stats
 */
export function Dashboard() {
  const navigate = useNavigate();
  const { projects, isLoadingProjects, refreshProjects } = useDatabaseContext();
  const { userProfile, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalFeatures: 0,
    totalProposals: 0,
    totalStakingPools: 0
  });

  // Calculate stats when projects change
  useEffect(() => {
    if (projects && projects.length > 0) {
      const totalFeatures = projects.reduce((acc, project) => 
        acc + (project.utility_features?.length || 0), 0);
      
      const totalProposals = projects.reduce((acc, project) => 
        acc + (project.governance_proposals?.length || 0), 0);
      
      const totalStakingPools = projects.reduce((acc, project) => 
        acc + (project.staking_pools?.length || 0), 0);
      
      setStats({
        totalProjects: projects.length,
        totalFeatures,
        totalProposals,
        totalStakingPools
      });
    }
  }, [projects]);

  // Refresh projects on mount
  useEffect(() => {
    if (isAuthenticated) {
      refreshProjects();
    }
  }, [isAuthenticated]);

  // Handle create project button click
  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              Welcome{userProfile?.name ? `, ${userProfile.name}` : ''}!
            </h1>
            <p className="text-text-secondary mb-4 md:mb-0">
              Manage your token utility and drive value for your community
            </p>
          </div>
          
          <button
            onClick={handleCreateProject}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Project
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Total Projects</div>
              {isLoadingProjects ? (
                <SkeletonLoader type="text" className="w-16 h-7 mt-1" />
              ) : (
                <div className="text-2xl font-semibold text-text-primary">
                  {stats.totalProjects}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Total Features</div>
              {isLoadingProjects ? (
                <SkeletonLoader type="text" className="w-16 h-7 mt-1" />
              ) : (
                <div className="text-2xl font-semibold text-text-primary">
                  {stats.totalFeatures}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Total Proposals</div>
              {isLoadingProjects ? (
                <SkeletonLoader type="text" className="w-16 h-7 mt-1" />
              ) : (
                <div className="text-2xl font-semibold text-text-primary">
                  {stats.totalProposals}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Staking Pools</div>
              {isLoadingProjects ? (
                <SkeletonLoader type="text" className="w-16 h-7 mt-1" />
              ) : (
                <div className="text-2xl font-semibold text-text-primary">
                  {stats.totalStakingPools}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Recent Projects
          </h2>
          
          <Link 
            to="/projects" 
            className="text-primary flex items-center text-sm font-medium hover:underline"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {isLoadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <SkeletonLoader key={i} type="card" className="h-64" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map(project => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Coins className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-xl font-medium text-text-primary mb-2">
              No Projects Yet
            </h3>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Create your first token project to start adding utility features, governance, and staking.
            </p>
            <button
              onClick={handleCreateProject}
              className="btn-primary mx-auto"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Project
            </button>
          </div>
        )}
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Exclusive Access
          </h3>
          <p className="text-text-secondary mb-4">
            Create token-gated features to provide exclusive access to your community.
          </p>
          <Link 
            to="/docs/access-control" 
            className="text-primary flex items-center text-sm font-medium hover:underline"
          >
            Learn More
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Community Governance
          </h3>
          <p className="text-text-secondary mb-4">
            Let your token holders vote on proposals and participate in decision-making.
          </p>
          <Link 
            to="/docs/governance" 
            className="text-primary flex items-center text-sm font-medium hover:underline"
          >
            Learn More
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Token Staking
          </h3>
          <p className="text-text-secondary mb-4">
            Incentivize long-term holding with staking rewards and benefits.
          </p>
          <Link 
            to="/docs/staking" 
            className="text-primary flex items-center text-sm font-medium hover:underline"
          >
            Learn More
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

