import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useAuth } from '../hooks/useAuth';
import { Coins } from 'lucide-react';

/**
 * Protected Route component
 * Redirects to login if user is not authenticated
 */
export function ProtectedRoute({ children, requireProfile = false }) {
  const { isConnected } = useAccount();
  const { userProfile, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not connected
  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <Coins className="w-16 h-16 text-text-secondary mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-text-secondary mb-6">
          Connect your wallet to access this page
        </p>
      </div>
    );
  }

  // Redirect to profile completion if required
  if (requireProfile && !userProfile) {
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;

