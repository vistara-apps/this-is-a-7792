import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bell, 
  Globe, 
  Shield, 
  CreditCard, 
  Save,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

/**
 * Settings page component
 * Allows users to configure application settings
 */
export function Settings() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      governance: true,
      staking: true
    },
    privacy: {
      shareAnalytics: true,
      publicProfile: false
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true
    },
    defaultChain: 'base'
  });

  // Available chains
  const chains = [
    { id: 'base', name: 'Base' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'polygon', name: 'Polygon' },
    { id: 'optimism', name: 'Optimism' },
    { id: 'arbitrum', name: 'Arbitrum' }
  ];

  // Handle toggle change
  const handleToggleChange = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  // Handle select change
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Settings
        </h1>
        <p className="text-text-secondary">
          Configure your application preferences and account settings
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Notifications Settings */}
        <div className="card mb-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-text-primary">
              Notifications
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-primary font-medium">Email Notifications</h3>
                <p className="text-text-secondary text-sm">
                  Receive important updates via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={() => handleToggleChange('notifications', 'email')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-primary font-medium">Browser Notifications</h3>
                <p className="text-text-secondary text-sm">
                  Receive notifications in your browser
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.browser}
                  onChange={() => handleToggleChange('notifications', 'browser')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-primary font-medium">Governance Updates</h3>
                <p className="text-text-secondary text-sm">
                  Notifications about new proposals and votes
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.governance}
                  onChange={() => handleToggleChange('notifications', 'governance')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-primary font-medium">Staking Alerts</h3>
                <p className="text-text-secondary text-sm">
                  Notifications about staking rewards and events
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.staking}
                  onChange={() => handleToggleChange('notifications', 'staking')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="card mb-6">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-text-primary">
              Privacy
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-primary font-medium">Share Analytics</h3>
                <p className="text-text-secondary text-sm">
                  Help improve TokenFlow by sharing anonymous usage data
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.shareAnalytics}
                  onChange={() => handleToggleChange('privacy', 'shareAnalytics')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-primary font-medium">Public Profile</h3>
                <p className="text-text-secondary text-sm">
                  Make your profile visible to other users
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.publicProfile}
                  onChange={() => handleToggleChange('privacy', 'publicProfile')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card mb-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-text-primary">
              Security
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-primary font-medium">Two-Factor Authentication</h3>
                <p className="text-text-secondary text-sm">
                  Add an extra layer of security to your account
                </p>
              </div>
              <div className="flex items-center">
                {settings.security.twoFactorAuth ? (
                  <span className="text-green-600 text-sm font-medium flex items-center mr-3">
                    <Check className="w-4 h-4 mr-1" />
                    Enabled
                  </span>
                ) : (
                  <span className="text-yellow-600 text-sm font-medium flex items-center mr-3">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Disabled
                  </span>
                )}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={() => handleToggleChange('security', 'twoFactorAuth')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-primary font-medium">Login Notifications</h3>
                <p className="text-text-secondary text-sm">
                  Receive notifications when your account is accessed
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.loginNotifications}
                  onChange={() => handleToggleChange('security', 'loginNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="card mb-6">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-text-primary">
              General
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-text-primary font-medium mb-1">
                Default Blockchain Network
              </label>
              <select
                name="defaultChain"
                value={settings.defaultChain}
                onChange={handleSelectChange}
                className="input-field w-full"
              >
                {chains.map(chain => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
              <p className="text-text-secondary text-sm mt-1">
                This network will be selected by default when creating new projects
              </p>
            </div>
            
            <div>
              <h3 className="text-text-primary font-medium mb-1">Subscription Plan</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-text-primary">
                      {userProfile?.subscription === 'creator' ? 'Creator Plan' : 'Free Plan'}
                    </div>
                    <div className="text-text-secondary text-sm">
                      {userProfile?.subscription === 'creator' 
                        ? 'Up to 5 projects, unlimited features'
                        : 'Limited to 1 project, 2 features'
                      }
                    </div>
                  </div>
                  <Link to="/subscription" className="btn-primary text-sm">
                    {userProfile?.subscription === 'creator' ? 'Manage Plan' : 'Upgrade'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary flex items-center"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-1" />
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;

