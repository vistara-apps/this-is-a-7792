import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { useTokenMetadata } from '../hooks/useTokenMetadata';
import { useToast } from '../context/ToastContext';
import { TokenInput } from '../components/TokenInput';

/**
 * Create Project page component
 * Form for creating a new token project
 */
export function CreateProject() {
  const navigate = useNavigate();
  const { createProject } = useDatabaseContext();
  const { validateToken, isLoading: isValidating } = useTokenMetadata();
  const toast = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tokenAddress: '',
    tokenName: '',
    tokenSymbol: '',
    chain: 'base'
  });
  const [validationState, setValidationState] = useState({
    isValid: false,
    metadata: null
  });

  // Available chains
  const chains = [
    { id: 'base', name: 'Base' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'polygon', name: 'Polygon' },
    { id: 'optimism', name: 'Optimism' },
    { id: 'arbitrum', name: 'Arbitrum' }
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle token address change
  const handleTokenAddressChange = (value) => {
    setFormData(prev => ({
      ...prev,
      tokenAddress: value
    }));
  };

  // Handle token validation
  const handleTokenValidation = (isValid, metadata) => {
    setValidationState({
      isValid,
      metadata
    });
    
    if (isValid && metadata) {
      setFormData(prev => ({
        ...prev,
        tokenName: metadata.name,
        tokenSymbol: metadata.symbol
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validationState.isValid) {
      toast.error('Please enter a valid token address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newProject = await createProject({
        tokenAddress: formData.tokenAddress,
        tokenName: formData.tokenName,
        tokenSymbol: formData.tokenSymbol,
        chain: formData.chain
      });
      
      toast.success('Project created successfully');
      navigate(`/projects/${newProject.projectId}`);
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          to="/projects"
          className="flex items-center space-x-2 text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
        
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Create New Project
        </h1>
        <p className="text-text-secondary">
          Add a new token project to manage utility features, governance, and staking
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Important Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      You'll need to provide the contract address of your ERC-20 token.
                      Make sure you're using the correct address on the selected chain.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Blockchain Network
              </label>
              <select
                name="chain"
                value={formData.chain}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              >
                {chains.map(chain => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>
            
            <TokenInput
              value={formData.tokenAddress}
              onChange={handleTokenAddressChange}
              onValidation={handleTokenValidation}
              chain={formData.chain}
              label="Token Contract Address"
              placeholder="0x..."
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Token Name
              </label>
              <input
                type="text"
                name="tokenName"
                value={formData.tokenName}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="My Token"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Token Symbol
              </label>
              <input
                type="text"
                name="tokenSymbol"
                value={formData.tokenSymbol}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="TKN"
                required
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isSubmitting || isValidating || !validationState.isValid}
              >
                {isSubmitting ? 'Creating Project...' : 'Create Project'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;

