import { supabase } from '../lib/supabase';

/**
 * Authentication service for TokenFlow
 * Handles user authentication and session management
 */
export const authService = {
  /**
   * Get the current authenticated user
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  
  /**
   * Sign in with wallet
   * @param {string} address - Wallet address
   * @param {string} signature - Signed message
   */
  async signInWithWallet(address, signature) {
    try {
      // In a real implementation, this would verify the signature
      // and create a session with Supabase Auth
      
      // For now, we'll simulate a successful sign-in
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github', // This is just a placeholder
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with wallet:', error);
      throw error;
    }
  },
  
  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
  
  /**
   * Check if a user has access to a feature
   * @param {string} userAddress - User's wallet address
   * @param {Object} feature - Feature to check access for
   * @param {Object} project - Project the feature belongs to
   */
  async checkFeatureAccess(userAddress, feature, project) {
    try {
      if (!userAddress || !feature || !project) return false;
      
      // Check if user is the creator
      if (project.creatorId.toLowerCase() === userAddress.toLowerCase()) {
        return true;
      }
      
      // Check token ownership requirements
      const { data, error } = await supabase
        .from('user_token_balances')
        .select('balance')
        .eq('userAddress', userAddress.toLowerCase())
        .eq('tokenAddress', project.tokenAddress.toLowerCase())
        .eq('chain', project.chain)
        .single();
        
      if (error) return false;
      
      const userBalance = data ? parseFloat(data.balance) : 0;
      const requiredAmount = feature.accessCriteria.minTokenAmount;
      
      return userBalance >= requiredAmount;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }
};

export default authService;

