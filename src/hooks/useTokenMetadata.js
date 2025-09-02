import { useState, useCallback } from 'react';
import tokenMetadataService from '../services/tokenMetadata';

/**
 * Custom hook for token metadata operations
 * Provides methods for fetching and validating token metadata
 */
export function useTokenMetadata() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({});

  /**
   * Reset error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get comprehensive token metadata
   */
  const getTokenMetadata = useCallback(async (tokenAddress, chain) => {
    if (!tokenAddress) {
      setError('Token address is required');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tokenMetadata = await tokenMetadataService.getTokenMetadata(tokenAddress, chain);
      setMetadata(prev => ({
        ...prev,
        [tokenAddress.toLowerCase()]: tokenMetadata
      }));
      
      return tokenMetadata;
    } catch (err) {
      setError(err.message || 'Failed to fetch token metadata');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Validate a token contract
   */
  const validateToken = useCallback(async (tokenAddress, chain) => {
    if (!tokenAddress) {
      setError('Token address is required');
      return { isValid: false, error: 'Token address is required' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await tokenMetadataService.validateToken(tokenAddress, chain);
      
      if (result.isValid) {
        setMetadata(prev => ({
          ...prev,
          [tokenAddress.toLowerCase()]: {
            name: result.name,
            symbol: result.symbol,
            decimals: result.decimals,
            logo: result.logo
          }
        }));
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to validate token');
      return { isValid: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get token transfers
   */
  const getTokenTransfers = useCallback(async (tokenAddress, address, chain) => {
    if (!tokenAddress) {
      setError('Token address is required');
      return [];
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const transfers = await tokenMetadataService.getTokenTransfers(tokenAddress, address, chain);
      return transfers;
    } catch (err) {
      setError(err.message || 'Failed to fetch token transfers');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get cached metadata for a token
   */
  const getCachedMetadata = useCallback((tokenAddress) => {
    if (!tokenAddress) return null;
    return metadata[tokenAddress.toLowerCase()] || null;
  }, [metadata]);

  return {
    // State
    isLoading,
    error,
    metadata,
    clearError,
    
    // Methods
    getTokenMetadata,
    validateToken,
    getTokenTransfers,
    getCachedMetadata
  };
}

export default useTokenMetadata;

