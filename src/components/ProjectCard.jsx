import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Users, Lock, Vote, TrendingUp } from 'lucide-react';

export function ProjectCard({ project }) {
  const featureIcons = {
    'access-control': Lock,
    'governance': Vote,
    'staking': TrendingUp
  };

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
              {project.tokenName}
            </h3>
            <p className="text-text-secondary text-sm">
              ${project.tokenSymbol}
            </p>
          </div>
          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            {project.chain}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Users className="w-4 h-4" />
            <span>{project.holderCount || 0} holders</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {project.utilityFeatures.slice(0, 3).map((feature, index) => {
              const Icon = featureIcons[feature.featureType] || Lock;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded-full"
                >
                  <Icon className="w-3 h-3" />
                  <span className="capitalize">{feature.featureType.replace('-', ' ')}</span>
                </div>
              );
            })}
            {project.utilityFeatures.length > 3 && (
              <span className="text-xs text-text-secondary">
                +{project.utilityFeatures.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Link
            to={`/project/${project.projectId}`}
            className="flex-1 btn-primary text-center"
          >
            Manage Project
          </Link>
          <a
            href={`https://etherscan.io/token/${project.tokenAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}