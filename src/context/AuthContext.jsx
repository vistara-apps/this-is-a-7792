import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { getCurrentUser, signOut } from '../lib/supabase';
import { useDatabaseContext } from './DatabaseContext';

// Create context
const AuthContext = createContext(null);

/**
 * Authentication Provider component
 * Manages user authentication state and provides auth methods
 */
export function AuthProvider({ children }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { getCreatorProfile, saveCreatorProfile } = useDatabaseContext();
  
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Session check failed:', err);
        setError('Failed to check authentication status');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Load user profile when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      const loadProfile = async () => {
        setIsLoading(true);
        try {
          const profile = await getCreatorProfile();
          setUserProfile(profile);
        } catch (err) {
          console.error('Failed to load user profile:', err);
        } finally {
          setIsLoading(false);
        }
      };

      loadProfile();
    } else {
      setUserProfile(null);
    }
  }, [isConnected, address, getCreatorProfile]);

  /**
   * Update user profile
   */
  const updateProfile = async (profileData) => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await saveCreatorProfile({
        ...profileData,
        walletAddress: address
      });
      
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign out the current user
   */
  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signOut();
      disconnect();
      setUser(null);
      setUserProfile(null);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to sign out');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    // State
    user,
    userProfile,
    isAuthenticated: !!user,
    isLoading,
    error,
    
    // Methods
    updateProfile,
    signOut: handleSignOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use the auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

