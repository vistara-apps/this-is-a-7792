import { supabase } from '../lib/supabase';
import blockchainService from './blockchain';

/**
 * Access Control service for TokenFlow
 * Handles token-gated access to features
 */
export const accessControlService = {
  /**
   * Check if a user has access to a feature
   * @param {string} userAddress - User's wallet address
   * @param {Object} feature - Feature to check access for
   * @param {Object} project - Project the feature belongs to
   */
  async checkAccess(userAddress, feature, project) {
    try {
      if (!userAddress || !feature || !project) return false;
      
      // Check if user is the creator
      if (project.creatorId.toLowerCase() === userAddress.toLowerCase()) {
        return true;
      }
      
      // Check token ownership requirements
      const hasAccess = await blockchainService.tokens.checkAccess(
        userAddress,
        project.tokenAddress,
        feature.accessCriteria.minTokenAmount,
        project.chain
      );
      
      return hasAccess;
    } catch (error) {
      console.error('Error checking access:', error);
      return false;
    }
  },
  
  /**
   * Get all features a user has access to
   * @param {string} userAddress - User's wallet address
   * @param {Object} project - Project to check features for
   */
  async getUserAccessibleFeatures(userAddress, project) {
    try {
      if (!userAddress || !project) return [];
      
      // Check if user is the creator
      if (project.creatorId.toLowerCase() === userAddress.toLowerCase()) {
        // Creator has access to all features
        return project.utilityFeatures || [];
      }
      
      // Get user's token balance
      const balance = await blockchainService.tokens.getBalance(
        userAddress,
        project.tokenAddress,
        project.chain
      );
      
      const userBalance = parseFloat(balance);
      
      // Filter features based on token requirements
      const accessibleFeatures = (project.utilityFeatures || []).filter(feature => 
        userBalance >= feature.accessCriteria.minTokenAmount
      );
      
      return accessibleFeatures;
    } catch (error) {
      console.error('Error getting accessible features:', error);
      return [];
    }
  },
  
  /**
   * Record an access event
   * @param {string} userAddress - User's wallet address
   * @param {string} featureId - Feature ID
   */
  async recordAccessEvent(userAddress, featureId) {
    try {
      const { error } = await supabase
        .from('access_events')
        .insert([{
          userAddress: userAddress.toLowerCase(),
          featureId,
          timestamp: new Date()
        }]);
        
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error recording access event:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get access events for a feature
   * @param {string} featureId - Feature ID
   */
  async getFeatureAccessEvents(featureId) {
    try {
      const { data, error } = await supabase
        .from('access_events')
        .select('*')
        .eq('featureId', featureId)
        .order('timestamp', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting access events:', error);
      return [];
    }
  }
};

export default accessControlService;

