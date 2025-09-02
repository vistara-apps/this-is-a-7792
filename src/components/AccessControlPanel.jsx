import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Lock, Unlock, Info } from 'lucide-react';
import { useAccessControl } from '../hooks/useAccessControl';
import { useToast } from '../context/ToastContext';
import { LoadingIndicator } from './LoadingIndicator';

/**
 * Access Control Panel component
 * Manages token-gated features for a project
 */
export function AccessControlPanel({ project, onUpdate }) {
  const { getFeatures, createFeature, updateFeature, deleteFeature, isLoading, error } = useAccessControl();
  const toast = useToast();
  
  const [features, setFeatures] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [formData, setFormData] = useState({
    featureName: '',
    featureType: 'content',
    minTokenAmount: 1
  });

  // Load features on mount
  useEffect(() => {
    if (project) {
      loadFeatures();
    }
  }, [project]);

  // Load features from the database
  const loadFeatures = async () => {
    try {
      const projectFeatures = await getFeatures(project.projectId);
      setFeatures(projectFeatures);
    } catch (err) {
      toast.error('Failed to load features');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'minTokenAmount' ? parseFloat(value) : value
    }));
  };

  // Handle feature creation
  const handleCreateFeature = async (e) => {
    e.preventDefault();
    
    try {
      await createFeature(project.projectId, {
        featureName: formData.featureName,
        featureType: formData.featureType,
        accessCriteria: {
          minTokenAmount: formData.minTokenAmount
        }
      });
      
      toast.success('Feature created successfully');
      setIsCreating(false);
      setFormData({
        featureName: '',
        featureType: 'content',
        minTokenAmount: 1
      });
      
      await loadFeatures();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to create feature');
    }
  };

  // Handle feature update
  const handleUpdateFeature = async (e) => {
    e.preventDefault();
    
    try {
      await updateFeature(editingFeature.featureId, {
        featureName: formData.featureName,
        featureType: formData.featureType,
        accessCriteria: {
          minTokenAmount: formData.minTokenAmount
        }
      });
      
      toast.success('Feature updated successfully');
      setEditingFeature(null);
      setFormData({
        featureName: '',
        featureType: 'content',
        minTokenAmount: 1
      });
      
      await loadFeatures();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to update feature');
    }
  };

  // Handle feature deletion
  const handleDeleteFeature = async (featureId) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) {
      return;
    }
    
    try {
      await deleteFeature(featureId);
      toast.success('Feature deleted successfully');
      await loadFeatures();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to delete feature');
    }
  };

  // Start editing a feature
  const startEditing = (feature) => {
    setEditingFeature(feature);
    setFormData({
      featureName: feature.featureName,
      featureType: feature.featureType,
      minTokenAmount: feature.accessCriteria.minTokenAmount
    });
    setIsCreating(false);
  };

  // Cancel editing or creating
  const cancelForm = () => {
    setIsCreating(false);
    setEditingFeature(null);
    setFormData({
      featureName: '',
      featureType: 'content',
      minTokenAmount: 1
    });
  };

  // Feature type options
  const featureTypes = [
    { value: 'content', label: 'Exclusive Content' },
    { value: 'feature', label: 'App Feature' },
    { value: 'api', label: 'API Access' },
    { value: 'discount', label: 'Discount/Offer' },
    { value: 'event', label: 'Event Access' }
  ];

  if (isLoading && features.length === 0) {
    return <LoadingIndicator text="Loading features..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">
          Access Control
        </h2>
        
        {!isCreating && !editingFeature && (
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Feature
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      )}
      
      {/* Feature Form */}
      {(isCreating || editingFeature) && (
        <div className="card">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            {isCreating ? 'Create New Feature' : 'Edit Feature'}
          </h3>
          
          <form onSubmit={isCreating ? handleCreateFeature : handleUpdateFeature}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Feature Name
                </label>
                <input
                  type="text"
                  name="featureName"
                  value={formData.featureName}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Premium Dashboard"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Feature Type
                </label>
                <select
                  name="featureType"
                  value={formData.featureType}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                >
                  {featureTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Minimum Token Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="minTokenAmount"
                    value={formData.minTokenAmount}
                    onChange={handleInputChange}
                    className="input-field w-full pr-16"
                    min="0"
                    step="0.01"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary">
                    {project.tokenSymbol}
                  </div>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Users must hold at least this amount of {project.tokenSymbol} to access this feature
                </p>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : isCreating ? 'Create Feature' : 'Update Feature'}
                </button>
                
                <button
                  type="button"
                  onClick={cancelForm}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Features List */}
      {features.length > 0 ? (
        <div className="space-y-4">
          {features.map(feature => (
            <div 
              key={feature.featureId}
              className="card flex flex-col md:flex-row md:items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-medium text-text-primary">
                    {feature.featureName}
                  </h3>
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-text-secondary">
                    {featureTypes.find(t => t.value === feature.featureType)?.label || feature.featureType}
                  </span>
                </div>
                
                <div className="flex items-center text-text-secondary">
                  <Lock className="w-4 h-4 mr-1" />
                  <span>
                    Requires {feature.accessCriteria.minTokenAmount} {project.tokenSymbol}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <button
                  onClick={() => startEditing(feature)}
                  className="btn-icon"
                  disabled={isCreating || editingFeature}
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDeleteFeature(feature.featureId)}
                  className="btn-icon text-red-500 hover:text-red-700"
                  disabled={isCreating || editingFeature}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Unlock className="w-6 h-6 text-text-secondary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-1">
            No Features Yet
          </h3>
          <p className="text-text-secondary mb-4">
            Create your first token-gated feature to add utility to your token
          </p>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary mx-auto"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Feature
            </button>
          )}
        </div>
      )}
      
      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">
              About Access Control
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Access control features allow you to gate content or functionality based on token ownership.
              Users must hold the minimum required amount of your token to access these features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessControlPanel;

