import React, { useState } from 'react';
import { Plus, Edit, Trash2, Lock } from 'lucide-react';
import { TokenInput } from './TokenInput';

export function AccessControlPanel({ project }) {
  const [features, setFeatures] = useState(project.utilityFeatures || []);
  const [isCreating, setIsCreating] = useState(false);
  const [newFeature, setNewFeature] = useState({
    featureName: '',
    description: '',
    minTokenAmount: '',
    featureType: 'premium-content'
  });

  const handleCreateFeature = () => {
    const feature = {
      featureId: Date.now(),
      ...newFeature,
      accessCriteria: { minTokenAmount: parseInt(newFeature.minTokenAmount) }
    };
    setFeatures([...features, feature]);
    setNewFeature({ featureName: '', description: '', minTokenAmount: '', featureType: 'premium-content' });
    setIsCreating(false);
  };

  const handleDeleteFeature = (featureId) => {
    setFeatures(features.filter(f => f.featureId !== featureId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">
            Access Control Features
          </h2>
          <p className="text-text-secondary">
            Manage token-gated features and access requirements
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Feature</span>
        </button>
      </div>

      {isCreating && (
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Create Access Control Feature
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Feature Name
              </label>
              <input
                type="text"
                value={newFeature.featureName}
                onChange={(e) => setNewFeature(prev => ({ ...prev, featureName: e.target.value }))}
                placeholder="e.g., Premium Dashboard"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description
              </label>
              <textarea
                value={newFeature.description}
                onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this feature provides"
                rows={3}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Minimum Token Requirement
              </label>
              <TokenInput
                variant="amount"
                value={newFeature.minTokenAmount}
                onChange={(value) => setNewFeature(prev => ({ ...prev, minTokenAmount: value }))}
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Feature Type
              </label>
              <select
                value={newFeature.featureType}
                onChange={(e) => setNewFeature(prev => ({ ...prev, featureType: e.target.value }))}
                className="input-field"
              >
                <option value="premium-content">Premium Content</option>
                <option value="exclusive-chat">Exclusive Chat</option>
                <option value="advanced-tools">Advanced Tools</option>
                <option value="early-access">Early Access</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreateFeature}
                disabled={!newFeature.featureName || !newFeature.minTokenAmount}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Feature
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
        {features.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Lock className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No access control features
            </h3>
            <p className="text-text-secondary mb-4">
              Create your first token-gated feature to get started
            </p>
          </div>
        ) : (
          features.map((feature) => (
            <div key={feature.featureId} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-text-primary">
                      {feature.featureName}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {feature.featureType.replace('-', ' ')}
                    </span>
                  </div>
                  
                  {feature.description && (
                    <p className="text-text-secondary mb-3">
                      {feature.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-text-secondary">
                      Minimum tokens: <strong>{feature.accessCriteria.minTokenAmount}</strong>
                    </span>
                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-text-secondary hover:text-text-primary">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFeature(feature.featureId)}
                    className="p-2 text-text-secondary hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}