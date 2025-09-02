import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Coins, 
  Settings, 
  LogOut, 
  User, 
  Moon, 
  Sun,
  ChevronDown
} from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

/**
 * App Shell component
 * Main layout wrapper with navigation and header
 */
export function AppShell({ children }) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { signInWithEthereum, signOut, userProfile } = useAuth();
  const toast = useToast();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Navigation items
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/projects', label: 'Projects', icon: Coins },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      await connect();
      
      // Sign in with wallet if connected
      if (isConnected && address) {
        await signInWithEthereum();
        toast.success('Wallet connected successfully');
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error(error);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      await signOut();
      disconnect();
      toast.info('Wallet disconnected');
      setIsUserMenuOpen(false);
    } catch (error) {
      toast.error('Failed to disconnect wallet');
      console.error(error);
    }
  };

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="bg-surface border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Coins className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold text-text-primary">TokenFlow</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      px-3 py-2 rounded-md text-sm font-medium flex items-center
                      ${isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                      }
                    `}
                    end={item.path === '/'}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-text-secondary hover:bg-gray-100 hover:text-text-primary"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Wallet connection */}
              {isConnected ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-text-primary bg-gray-100 hover:bg-gray-200"
                  >
                    <User className="h-4 w-4 mr-1" />
                    <span>{userProfile?.name || formatAddress(address)}</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>

                  {/* User dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleDisconnect}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90"
                >
                  Connect Wallet
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-text-secondary hover:bg-gray-100 hover:text-text-primary"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <nav className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === '/' && location.pathname === '/');
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    block px-3 py-2 rounded-md text-base font-medium flex items-center
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                  end={item.path === '/'}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.label}
                </NavLink>
              );
            })}
            
            {isConnected && (
              <button
                onClick={handleDisconnect}
                className="w-full px-3 py-2 rounded-md text-base font-medium flex items-center text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Disconnect Wallet
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Coins className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-bold text-text-primary">TokenFlow</span>
            </div>
            
            <div className="text-text-secondary text-sm">
              &copy; {new Date().getFullYear()} TokenFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppShell;

