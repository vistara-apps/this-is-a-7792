import axios from 'axios';

// Etherscan API configuration
const getEtherscanConfig = (network) => {
  const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
  
  // Map chain names to Etherscan API URLs
  const networkMap = {
    'ethereum': 'https://api.etherscan.io/api',
    'polygon': 'https://api.polygonscan.com/api',
    'optimism': 'https://api-optimistic.etherscan.io/api',
    'arbitrum': 'https://api.arbiscan.io/api',
    'base': 'https://api.basescan.org/api',
    // Testnets
    'sepolia': 'https://api-sepolia.etherscan.io/api',
    'goerli': 'https://api-goerli.etherscan.io/api',
    'mumbai': 'https://api-testnet.polygonscan.com/api',
    'base-goerli': 'https://api-goerli.basescan.org/api'
  };
  
  return {
    apiKey,
    baseUrl: networkMap[network] || networkMap['base']
  };
};

/**
 * Make a request to the Etherscan API
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @param {string} network - Network name
 */
const etherscanRequest = async (endpoint, params, network = 'base') => {
  const { apiKey, baseUrl } = getEtherscanConfig(network);
  
  try {
    const response = await axios.get(baseUrl, {
      params: {
        module: endpoint.module,
        action: endpoint.action,
        apikey: apiKey,
        ...params
      }
    });
    
    if (response.data.status === '0') {
      throw new Error(response.data.result || 'Etherscan API error');
    }
    
    return response.data.result;
  } catch (error) {
    console.error('Etherscan API error:', error);
    throw error;
  }
};

/**
 * Get token metadata from Etherscan
 * @param {string} tokenAddress - Token contract address
 * @param {string} network - Network name
 */
export const getTokenMetadata = async (tokenAddress, network = 'base') => {
  try {
    const [tokenInfo, tokenSupply] = await Promise.all([
      etherscanRequest(
        { module: 'token', action: 'tokeninfo' },
        { contractaddress: tokenAddress },
        network
      ),
      etherscanRequest(
        { module: 'stats', action: 'tokensupply' },
        { contractaddress: tokenAddress },
        network
      )
    ]);
    
    if (!tokenInfo || tokenInfo.length === 0) {
      throw new Error('Token not found');
    }
    
    const metadata = tokenInfo[0];
    
    return {
      name: metadata.name,
      symbol: metadata.symbol,
      decimals: parseInt(metadata.divisor),
      totalSupply: tokenSupply,
      website: metadata.website || '',
      socialLinks: {
        twitter: metadata.twitter || '',
        telegram: metadata.telegram || '',
        discord: metadata.discord || ''
      }
    };
  } catch (error) {
    console.error('Failed to fetch token metadata from Etherscan:', error);
    throw error;
  }
};

/**
 * Verify contract source code
 * @param {string} contractAddress - Contract address
 * @param {string} network - Network name
 */
export const verifyContractSource = async (contractAddress, network = 'base') => {
  try {
    const sourceCode = await etherscanRequest(
      { module: 'contract', action: 'getsourcecode' },
      { address: contractAddress },
      network
    );
    
    if (!sourceCode || sourceCode.length === 0) {
      return { verified: false };
    }
    
    return {
      verified: sourceCode[0].ABI !== 'Contract source code not verified',
      name: sourceCode[0].ContractName,
      compiler: sourceCode[0].CompilerVersion,
      optimizationUsed: sourceCode[0].OptimizationUsed === '1',
      sourceCode: sourceCode[0].SourceCode
    };
  } catch (error) {
    console.error('Failed to verify contract source:', error);
    return { verified: false };
  }
};

/**
 * Get token holder count
 * @param {string} tokenAddress - Token contract address
 * @param {string} network - Network name
 */
export const getTokenHolderCount = async (tokenAddress, network = 'base') => {
  try {
    // Note: This endpoint is not available on all Etherscan APIs
    // Fallback to a default value if the API call fails
    try {
      const holderCount = await etherscanRequest(
        { module: 'token', action: 'tokenholderlist' },
        { contractaddress: tokenAddress, page: 1, offset: 1 },
        network
      );
      
      return parseInt(holderCount.length || 0);
    } catch (error) {
      console.warn('Token holder count not available:', error);
      return 0;
    }
  } catch (error) {
    console.error('Failed to fetch token holder count:', error);
    return 0;
  }
};

/**
 * Get token transfers
 * @param {string} tokenAddress - Token contract address
 * @param {string} address - Wallet address (optional)
 * @param {string} network - Network name
 */
export const getTokenTransfers = async (tokenAddress, address = null, network = 'base') => {
  try {
    const params = {
      contractaddress: tokenAddress,
      page: 1,
      offset: 100,
      sort: 'desc'
    };
    
    if (address) {
      params.address = address;
    }
    
    const transfers = await etherscanRequest(
      { module: 'account', action: 'tokentx' },
      params,
      network
    );
    
    return transfers || [];
  } catch (error) {
    console.error('Failed to fetch token transfers:', error);
    return [];
  }
};

export default {
  getTokenMetadata,
  verifyContractSource,
  getTokenHolderCount,
  getTokenTransfers
};

