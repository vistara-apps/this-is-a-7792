import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Users, ShieldCheck, Calendar } from 'lucide-react';
import { useBlockchain } from '../hooks/useBlockchain';

/**
 * Project Card component
 * Displays a token project card with key information
 */
export function ProjectCard({ project }) {
  const { shortenAddress } = useBlockchain();
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link 
      to={`/projects/${project.projectId}`}
      className="card hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">
            {project.tokenName}
          </h3>
          <div className="flex items-center text-text-secondary">
            <span className="font-medium text-sm">{project.tokenSymbol}</span>
            <span className="mx-2">•</span>
            <span className="text-sm">{shortenAddress(project.tokenAddress)}</span>
          </div>
        </div>
        
        <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
          {project.chain}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-xs text-text-secondary">Features</div>
            <div className="font-medium text-text-primary">
              {project.utility_features?.length || 0}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-xs text-text-secondary">Proposals</div>
            <div className="font-medium text-text-primary">
              {project.governance_proposals?.length || 0}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <Coins className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-xs text-text-secondary">Staking Pools</div>
            <div className="font-medium text-text-primary">
              {project.staking_pools?.length || 0}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-xs text-text-secondary">Created</div>
            <div className="font-medium text-text-primary">
              {formatDate(project.createdAt)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-sm text-text-secondary">
            {project.utility_features?.length 
              ? `${project.utility_features.length} active features`
              : 'No features yet'
            }
          </div>
          <span className="text-primary text-sm font-medium">View Details →</span>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;

