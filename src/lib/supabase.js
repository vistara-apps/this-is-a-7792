import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Initialize database with required tables and functions
 */
export const initializeDatabase = async () => {
  try {
    // This is a placeholder for actual database initialization
    // In a real implementation, you would check if tables exist and create them if needed
    console.log('Database initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

/**
 * Sign in with wallet
 * @param {string} address - Wallet address
 * @param {string} signature - Signed message
 */
export const signInWithWallet = async (address, signature) => {
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
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export default supabase;

