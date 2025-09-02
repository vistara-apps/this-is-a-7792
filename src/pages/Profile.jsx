import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBlockchain } from '../hooks/useBlockchain';
import { useToast } from '../context/ToastContext';
import { LoadingIndicator } from '../components/LoadingIndicator';

/**
 * Profile page component
 * Allows users to view and edit their profile information
 */
export function Profile() {
  const navigate = useNavigate();
  const { userProfile, updateProfile, isLoading: authLoading } = useAuth();
  const { shortenAddress } = useBlockchain();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // Load user profile data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || ''
      });
    }
  }, [userProfile]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingIndicator text="Loading profile..." />;
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
          Your Profile
        </h1>
        <p className="text-text-secondary">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="card mb-8">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {userProfile?.name || 'Creator'}
            </h2>
            <p className="text-text-secondary">
              {userProfile?.walletAddress && shortenAddress(userProfile.walletAddress)}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Display Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field w-full pl-10"
                  placeholder="Your Name"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-4 h-4 text-text-secondary" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field w-full pl-10"
                  placeholder="your.email@example.com"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-4 h-4 text-text-secondary" />
                </div>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                We'll use this to notify you about important updates
              </p>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="btn-primary flex items-center"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-1" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Connected Wallet
        </h2>
        
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-text-secondary mb-1">
                Wallet Address
              </div>
              <div className="font-mono text-text-primary break-all">
                {userProfile?.walletAddress}
              </div>
            </div>
            
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
              Connected
            </div>
          </div>
        </div>
        
        <p className="text-text-secondary text-sm">
          This wallet is used to authenticate you and manage your token projects.
          To change your connected wallet, disconnect and reconnect with a different wallet.
        </p>
      </div>
    </div>
  );
}

export default Profile;

