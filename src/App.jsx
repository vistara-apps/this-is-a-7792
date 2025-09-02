import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { base, mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

// Providers
import { ToastProvider } from './context/ToastContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { BlockchainProvider } from './context/BlockchainContext';
import { AuthProvider } from './context/AuthContext';

// Components
import { AppShell } from './components/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import { Dashboard } from './pages/Dashboard';
import { ProjectsList } from './pages/ProjectsList';
import { ProjectDetail } from './pages/ProjectDetail';
import { CreateProject } from './pages/CreateProject';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Subscription } from './pages/Subscription';

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base, mainnet, polygon, optimism, arbitrum],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || 'demo' }),
    publicProvider()
  ]
);

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'TokenFlow',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo',
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

/**
 * Main App component
 * Sets up providers and routes
 */
function App() {
  return (
    <ErrorBoundary>
      <WagmiConfig config={config}>
        <ToastProvider>
          <DatabaseProvider>
            <BlockchainProvider>
              <AuthProvider>
                <Router>
                  <AppShell>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/login" element={<Navigate to="/" replace />} />
                      
                      {/* Protected routes */}
                      <Route 
                        path="/" 
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/projects" 
                        element={
                          <ProtectedRoute>
                            <ProjectsList />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/projects/create" 
                        element={
                          <ProtectedRoute requireProfile>
                            <CreateProject />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/projects/:projectId" 
                        element={
                          <ProtectedRoute>
                            <ProjectDetail />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/settings" 
                        element={
                          <ProtectedRoute requireProfile>
                            <Settings />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/subscription" 
                        element={
                          <ProtectedRoute requireProfile>
                            <Subscription />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Fallback route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AppShell>
                </Router>
              </AuthProvider>
            </BlockchainProvider>
          </DatabaseProvider>
        </ToastProvider>
      </WagmiConfig>
    </ErrorBoundary>
  );
}

export default App;
