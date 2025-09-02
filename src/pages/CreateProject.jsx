import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ArrowLeft, Search, Check } from 'lucide-react';
import { TokenInput } from '../components/TokenInput';
import { Callout } from '../components/Callout';

export function CreateProject() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    tokenAddress: '',
    tokenName: '',
    tokenSymbol: '',
    chain: 'base',
    features: []
  });
  const [isValidating, setIsValidating] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  const validateToken = async () => {
    if (!projectData.tokenAddress) return;
    
    setIsValidating(true);
    // Simulate API call to validate token
    setTimeout(() => {
      setProjectData(prev => ({
        ...prev,
        tokenName: 'Example Token',
        tokenSymbol: 'EXAMPLE'
      }));
      setTokenValid(true);
      setIsValidating(false);
    }, 1500);
  };

  const handleFeatureToggle = (featureType) => {
    setProjectData(prev => ({
      ...prev,
      features: prev.features.includes(featureType)
        ? prev.features.filter(f => f !== featureType)
        : [...prev.features, featureType]
    }));
  };

  const createProject = () => {
    // Simulate project creation
    const newProject = {
      projectId: Date.now(),
      creatorId: address,
      ...projectData,
      utilityFeatures: projectData.features.map(type => ({
        featureId: Date.now() + Math.random(),
        featureType: type,
        featureName: `${type.replace('-', ' ')} Feature`,
        accessCriteria: { minTokenAmount: 100 }
      }))
    };
    
    // In a real app, this would save to backend
    console.log('Created project:', newProject);
    navigate('/');
  };

  const features = [
    {
      id: 'access-control',
      name: 'Exclusive Access Control',
      description: 'Gate premium features behind token ownership',
      recommended: true
    },
    {
      id: 'governance',
      name: 'Community Governance',
      description: 'Enable token holder voting on key decisions',
      recommended: true
    },
    {
      id: 'staking',
      name: 'Staking Rewards',
      description: 'Incentivize long-term holding with staking pools',
      recommended: false
    }
  ];

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-text-secondary">
          You need to connect your wallet to create a project
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Create New Project
        </h1>
        <p className="text-text-secondary">
          Set up token utility features for your community
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
              step >= stepNum
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
            </div>
            {stepNum < 3 && (
              <div className={`w-12 h-0.5 ${
                step > stepNum ? 'bg-primary' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Token Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Token Contract Address
                </label>
                <TokenInput
                  variant="tokenAddress"
                  value={projectData.tokenAddress}
                  onChange={(value) => setProjectData(prev => ({ ...prev, tokenAddress: value }))}
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Network
                </label>
                <select
                  value={projectData.chain}
                  onChange={(e) => setProjectData(prev => ({ ...prev, chain: e.target.value }))}
                  className="input-field"
                >
                  <option value="base">Base</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                  <option value="arbitrum">Arbitrum</option>
                </select>
              </div>

              {projectData.tokenAddress && !tokenValid && (
                <button
                  onClick={validateToken}
                  disabled={isValidating}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{isValidating ? 'Validating...' : 'Validate Token'}</span>
                </button>
              )}

              {tokenValid && (
                <Callout variant="success">
                  <strong>Token validated:</strong> {projectData.tokenName} (${projectData.tokenSymbol})
                </Callout>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!tokenValid}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Select Features
            </h2>
            <p className="text-text-secondary mb-6">
              Choose which utility features to enable for your token holders
            </p>

            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    projectData.features.includes(feature.id)
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleFeatureToggle(feature.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                      projectData.features.includes(feature.id)
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}>
                      {projectData.features.includes(feature.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-text-primary">
                          {feature.name}
                        </h3>
                        {feature.recommended && (
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary text-sm mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={projectData.features.length === 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Review & Create
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-text-primary mb-2">Token Details</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-text-secondary">Name:</span> {projectData.tokenName}</p>
                  <p><span className="text-text-secondary">Symbol:</span> ${projectData.tokenSymbol}</p>
                  <p><span className="text-text-secondary">Network:</span> {projectData.chain}</p>
                  <p><span className="text-text-secondary">Address:</span> {projectData.tokenAddress}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-text-primary mb-2">Selected Features</h3>
                <div className="space-y-1">
                  {projectData.features.map((featureId) => {
                    const feature = features.find(f => f.id === featureId);
                    return (
                      <p key={featureId} className="text-sm text-text-secondary">
                        • {feature?.name}
                      </p>
                    );
                  })}
                </div>
              </div>

              <Callout variant="info">
                You can configure feature settings and access criteria after creating the project.
              </Callout>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              onClick={createProject}
              className="btn-primary"
            >
              Create Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}