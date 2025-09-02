import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useDatabase } from '../hooks/useDatabase';
import { initializeDatabase } from '../lib/supabase';

// Create context
const DatabaseContext = createContext(null);

/**
 * Database Provider component
 * Provides database access and state throughout the application
 */
export function DatabaseProvider({ children }) {
  const { address, isConnected } = useAccount();
  const database = useDatabase();
  const [isInitialized, setIsInitialized] = useState(false);
  const [creator, setCreator] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Initialize database on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDatabase();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initialize();
  }, []);

  // Load creator profile when wallet is connected
  useEffect(() => {
    if (isConnected && address && isInitialized) {
      const loadCreator = async () => {
        const creatorProfile = await database.getCreatorProfile();
        setCreator(creatorProfile);
      };

      loadCreator();
    } else {
      setCreator(null);
    }
  }, [isConnected, address, isInitialized, database]);

  // Load projects when creator profile is loaded
  useEffect(() => {
    if (creator && isInitialized) {
      const loadProjects = async () => {
        setIsLoadingProjects(true);
        try {
          const userProjects = await database.getProjects();
          setProjects(userProjects || []);
        } catch (error) {
          console.error('Failed to load projects:', error);
        } finally {
          setIsLoadingProjects(false);
        }
      };

      loadProjects();
    } else {
      setProjects([]);
    }
  }, [creator, isInitialized, database]);

  /**
   * Refresh projects list
   */
  const refreshProjects = async () => {
    if (!creator || !isInitialized) return;
    
    setIsLoadingProjects(true);
    try {
      const userProjects = await database.getProjects();
      setProjects(userProjects || []);
    } catch (error) {
      console.error('Failed to refresh projects:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  /**
   * Create a new project
   */
  const createProject = async (projectData) => {
    const newProject = await database.createProject(projectData);
    if (newProject) {
      await refreshProjects();
      return newProject;
    }
    return null;
  };

  /**
   * Update creator profile
   */
  const updateCreator = async (profileData) => {
    const updatedCreator = await database.saveCreatorProfile(profileData);
    if (updatedCreator) {
      setCreator(updatedCreator);
      return updatedCreator;
    }
    return null;
  };

  // Context value
  const value = {
    // State
    isInitialized,
    creator,
    projects,
    isLoadingProjects,
    
    // Methods
    refreshProjects,
    createProject,
    updateCreator,
    
    // Pass through all database methods
    ...database
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

/**
 * Custom hook to use the database context
 */
export function useDatabaseContext() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabaseContext must be used within a DatabaseProvider');
  }
  return context;
}

export default DatabaseContext;

