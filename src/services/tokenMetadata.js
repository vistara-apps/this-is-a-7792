import alchemyService from '../lib/alchemy';
import etherscanService from '../lib/etherscan';

/**
 * Token Metadata service for TokenFlow
 * Combines data from multiple sources to provide comprehensive token information
 */
export const tokenMetadataService = {
  /**
   * Get comprehensive token metadata from multiple sources
   * @param {string} tokenAddress - Token contract address
   * @param {string} chain - Blockchain network
   */
  async getTokenMetadata(tokenAddress, chain) {
    try {
      // Get basic metadata from Alchemy
      const alchemyMetadata = await alchemyService.getTokenMetadata(tokenAddress, chain);
      
      // Try to get additional metadata from Etherscan
      let etherscanMetadata = {};
      let contractVerification = { verified: false };
      let holderCount = 0;
      
      try {
        [etherscanMetadata, contractVerification, holderCount] = await Promise.all([
          etherscanService.getTokenMetadata(tokenAddress, chain).catch(() => ({})),
          etherscanService.verifyContractSource(tokenAddress, chain).catch(() => ({ verified: false })),
          etherscanService.getTokenHolderCount(tokenAddress, chain).catch(() => 0)
        ]);
      } catch (error) {
        console.warn('Failed to fetch additional metadata:', error);
      }
      
      // Combine metadata from all sources
      return {
        // Basic token info
        name: alchemyMetadata.name || etherscanMetadata.name || 'Unknown Token',
        symbol: alchemyMetadata.symbol || etherscanMetadata.symbol || '???',
        decimals: alchemyMetadata.decimals || etherscanMetadata.decimals || 18,
        logo: alchemyMetadata.logo || null,
        
        // Additional info from Etherscan
        totalSupply: etherscanMetadata.totalSupply || '0',
        website: etherscanMetadata.website || '',
        socialLinks: etherscanMetadata.socialLinks || {
          twitter: '',
          telegram: '',
          discord: ''
        },
        
        // Contract verification
        contract: {
          verified: contractVerification.verified,
          name: contractVerification.name || '',
          compiler: contractVerification.compiler || '',
          optimizationUsed: contractVerification.optimizationUsed || false
        },
        
        // Holder statistics
        holderCount: holderCount,
        
        // Metadata source info
        sources: {
          alchemy: !!alchemyMetadata.name,
          etherscan: !!etherscanMetadata.name
        }
      };
    } catch (error) {
      console.error('Failed to fetch token metadata:', error);
      throw error;
    }
  },
  
  /**
   * Validate a token contract
   * @param {string} tokenAddress - Token contract address
   * @param {string} chain - Blockchain network
   */
  async validateToken(tokenAddress, chain) {
    try {
      // Get basic metadata from Alchemy
      const alchemyMetadata = await alchemyService.getTokenMetadata(tokenAddress, chain);
      
      if (!alchemyMetadata || !alchemyMetadata.name || !alchemyMetadata.symbol) {
        return {
          isValid: false,
          error: 'Invalid token contract'
        };
      }
      
      // Try to verify contract source
      let contractVerification = { verified: false };
      
      try {
        contractVerification = await etherscanService.verifyContractSource(tokenAddress, chain);
      } catch (error) {
        console.warn('Failed to verify contract source:', error);
      }
      
      return {
        name: alchemyMetadata.name,
        symbol: alchemyMetadata.symbol,
        decimals: alchemyMetadata.decimals,
        logo: alchemyMetadata.logo,
        isValid: true,
        isVerified: contractVerification.verified
      };
    } catch (error) {
      console.error('Token validation failed:', error);
      return {
        isValid: false,
        error: error.message
      };
    }
  },
  
  /**
   * Get token transfers
   * @param {string} tokenAddress - Token contract address
   * @param {string} address - Wallet address (optional)
   * @param {string} chain - Blockchain network
   */
  async getTokenTransfers(tokenAddress, address = null, chain) {
    try {
      // Try to get transfers from Etherscan
      const etherscanTransfers = await etherscanService.getTokenTransfers(
        tokenAddress,
        address,
        chain
      );
      
      if (etherscanTransfers.length > 0) {
        return etherscanTransfers;
      }
      
      // Fallback to Alchemy if Etherscan fails
      if (address) {
        const alchemyTransfers = await alchemyService.getTokenTransactions(
          address,
          tokenAddress,
          chain
        );
        
        return alchemyTransfers;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch token transfers:', error);
      return [];
    }
  }
};

export default tokenMetadataService;

