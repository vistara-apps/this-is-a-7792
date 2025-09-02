import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Shield, 
  Vote, 
  Coins,
  AlertTriangle
} from 'lucide-react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { useBlockchain } from '../hooks/useBlockchain';
import { useToast } from '../context/ToastContext';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { AccessControlPanel } from '../components/AccessControlPanel';
import { GovernancePanel } from '../components/GovernancePanel';
import { StakingPanel } from '../components/StakingPanel';

/**
 * Project Detail page component
 * Shows detailed information about a token project and its features
 */
export function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, deleteProject, refreshProjects } = useDatabaseContext();
  const { shortenAddress } = useBlockchain();
  const toast = useToast();
  
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('access');
  const [isDeleting, setIsDeleting] = useState(false);

  // Load project on mount
  useEffect(() => {
    loadProject();
  }, [projectId]);

  // Load project data
  const loadProject = async () => {
    setIsLoading(true);
    try {
      const projectData = await getProject(projectId);
      setProject(projectData);
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle project deletion
  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      toast.success('Project deleted successfully');
      await refreshProjects();
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
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

  if (isLoading) {
    return <LoadingIndicator text="Loading project..." />;
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Project Not Found
        </h2>
        <p className="text-text-secondary mb-6">
          The project you're looking for doesn't exist or you don't have access to it.
        </p>
        <Link to="/projects" className="btn-primary">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center space-x-2 text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">
              {project.tokenName} ({project.tokenSymbol})
            </h1>
            
            <div className="flex items-center text-text-secondary">
              <span>{shortenAddress(project.tokenAddress)}</span>
              <a 
                href={`https://basescan.org/token/${project.tokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary hover:underline flex items-center"
              >
                View on Explorer
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Link
              to={`/projects/${projectId}/edit`}
              className="btn-secondary flex items-center"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Link>
            
            <button
              onClick={handleDeleteProject}
              className="btn-secondary text-red-600 hover:bg-red-50 flex items-center"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-1">
              Chain
            </h3>
            <p className="text-text-primary font-medium">
              {project.chain}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-1">
              Created
            </h3>
            <p className="text-text-primary font-medium">
              {formatDate(project.createdAt)}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-1">
              Status
            </h3>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-text-primary font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => handleTabChange('access')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'access' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
              }
            `}
          >
            <Shield className="w-4 h-4 mr-2" />
            Access Control
          </button>
          
          <button
            onClick={() => handleTabChange('governance')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'governance' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
              }
            `}
          >
            <Vote className="w-4 h-4 mr-2" />
            Governance
          </button>
          
          <button
            onClick={() => handleTabChange('staking')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'staking' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
              }
            `}
          >
            <Coins className="w-4 h-4 mr-2" />
            Staking
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'access' && (
          <AccessControlPanel 
            project={project} 
            onUpdate={loadProject} 
          />
        )}
        
        {activeTab === 'governance' && (
          <GovernancePanel 
            project={project} 
            onUpdate={loadProject} 
          />
        )}
        
        {activeTab === 'staking' && (
          <StakingPanel 
            project={project} 
            onUpdate={loadProject} 
          />
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;

