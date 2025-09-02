import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import accessControlService from '../services/accessControl';

/**
 * Custom hook for access control operations
 * Provides methods for checking and managing token-gated access
 */
export function useAccessControl() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessCache, setAccessCache] = useState({});

  /**
   * Reset error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check if the connected wallet has access to a feature
   */
  const checkAccess = useCallback(async (feature, project) => {
    if (!address || !feature || !project) return false;
    
    // Create a cache key
    const cacheKey = `${address.toLowerCase()}-${feature.featureId}-${project.projectId}`;
    
    // Return cached result if available
    if (accessCache[cacheKey] !== undefined) {
      return accessCache[cacheKey];
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const hasAccess = await accessControlService.checkAccess(
        address,
        feature,
        project
      );
      
      // Cache the result
      setAccessCache(prev => ({
        ...prev,
        [cacheKey]: hasAccess
      }));
      
      return hasAccess;
    } catch (err) {
      setError(err.message || 'Failed to check access');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, accessCache]);

  /**
   * Get all features the connected wallet has access to
   */
  const getAccessibleFeatures = useCallback(async (project) => {
    if (!address || !project) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const features = await accessControlService.getUserAccessibleFeatures(
        address,
        project
      );
      
      // Cache access for each feature
      features.forEach(feature => {
        const cacheKey = `${address.toLowerCase()}-${feature.featureId}-${project.projectId}`;
        setAccessCache(prev => ({
          ...prev,
          [cacheKey]: true
        }));
      });
      
      return features;
    } catch (err) {
      setError(err.message || 'Failed to get accessible features');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Record an access event
   */
  const recordAccess = useCallback(async (featureId) => {
    if (!address || !featureId) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await accessControlService.recordAccessEvent(
        address,
        featureId
      );
      
      return result.success;
    } catch (err) {
      setError(err.message || 'Failed to record access');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  /**
   * Get access events for a feature
   */
  const getAccessEvents = useCallback(async (featureId) => {
    if (!featureId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const events = await accessControlService.getFeatureAccessEvents(featureId);
      return events;
    } catch (err) {
      setError(err.message || 'Failed to get access events');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear the access cache
   */
  const clearAccessCache = useCallback(() => {
    setAccessCache({});
  }, []);

  return {
    // State
    isLoading,
    error,
    clearError,
    
    // Methods
    checkAccess,
    getAccessibleFeatures,
    recordAccess,
    getAccessEvents,
    clearAccessCache
  };
}

export default useAccessControl;

