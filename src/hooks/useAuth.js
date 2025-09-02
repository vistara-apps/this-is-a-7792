import { useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { signInWithWallet } from '../lib/supabase';
import { useAuth as useAuthContext } from '../context/AuthContext';

/**
 * Custom hook for authentication operations
 * Extends the auth context with additional methods
 */
export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const auth = useAuthContext();

  /**
   * Sign in with wallet
   * Uses SIWE (Sign-In with Ethereum) pattern
   */
  const signInWithEthereum = useCallback(async () => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Create a message for the user to sign
      const message = `Sign this message to authenticate with TokenFlow\nAddress: ${address}\nTimestamp: ${Date.now()}`;
      
      // Request signature from the wallet
      const signature = await signMessageAsync({ message });
      
      // Verify signature and sign in
      const result = await signInWithWallet(address, signature);
      
      return result;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }, [address, isConnected, signMessageAsync]);

  /**
   * Check if the user has a complete profile
   */
  const hasCompleteProfile = useCallback(() => {
    if (!auth.userProfile) return false;
    
    // Check if required fields are filled
    return !!(
      auth.userProfile.name &&
      auth.userProfile.email
    );
  }, [auth.userProfile]);

  return {
    // Pass through all auth context values
    ...auth,
    
    // Additional methods
    signInWithEthereum,
    hasCompleteProfile
  };
}

export default useAuth;

