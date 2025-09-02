import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Coins, Filter, X } from 'lucide-react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingIndicator, SkeletonLoader } from '../components/LoadingIndicator';

/**
 * Projects List page component
 * Shows all token projects with filtering and search
 */
export function ProjectsList() {
  const navigate = useNavigate();
  const { projects, isLoadingProjects, refreshProjects } = useDatabaseContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Available chains for filtering
  const chains = [
    { id: '', name: 'All Chains' },
    { id: 'base', name: 'Base' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'polygon', name: 'Polygon' },
    { id: 'optimism', name: 'Optimism' },
    { id: 'arbitrum', name: 'Arbitrum' }
  ];

  // Refresh projects on mount
  useEffect(() => {
    refreshProjects();
  }, []);

  // Filter projects when search term, chain filter, or projects change
  useEffect(() => {
    if (!projects) {
      setFilteredProjects([]);
      return;
    }
    
    let filtered = [...projects];
    
    // Filter by chain
    if (selectedChain) {
      filtered = filtered.filter(project => project.chain === selectedChain);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.tokenName.toLowerCase().includes(term) ||
        project.tokenSymbol.toLowerCase().includes(term) ||
        project.tokenAddress.toLowerCase().includes(term)
      );
    }
    
    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedChain]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle chain filter change
  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedChain('');
  };

  // Handle create project button click
  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          Token Projects
        </h1>
        
        <button
          onClick={handleCreateProject}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Create Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="input-field w-full pl-10"
            placeholder="Search projects..."
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-text-secondary" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={selectedChain}
              onChange={handleChainChange}
              className="input-field pl-9 pr-8 appearance-none"
            >
              {chains.map(chain => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="w-4 h-4 text-text-secondary" />
            </div>
          </div>
          
          {(searchTerm || selectedChain) && (
            <button
              onClick={clearFilters}
              className="btn-icon"
              aria-label="Clear filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoadingProjects ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <SkeletonLoader key={i} type="card" className="h-64" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          {projects.length > 0 ? (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2">
                No Matching Projects
              </h3>
              <p className="text-text-secondary mb-6">
                No projects match your current filters. Try adjusting your search or filters.
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary mx-auto"
              >
                Clear Filters
              </button>
            </>
          ) : (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Coins className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2">
                No Projects Yet
              </h3>
              <p className="text-text-secondary mb-6">
                Create your first token project to start adding utility features, governance, and staking.
              </p>
              <button
                onClick={handleCreateProject}
                className="btn-primary mx-auto"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create Project
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectsList;

