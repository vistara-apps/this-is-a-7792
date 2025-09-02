import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';

// Alchemy API configuration
const getAlchemyConfig = (network) => {
  const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY || 'demo';
  
  // Map chain names to Alchemy Network enum
  const networkMap = {
    'ethereum': Network.ETH_MAINNET,
    'polygon': Network.MATIC_MAINNET,
    'optimism': Network.OPT_MAINNET,
    'arbitrum': Network.ARB_MAINNET,
    'base': Network.BASE_MAINNET,
    // Testnets
    'sepolia': Network.ETH_SEPOLIA,
    'goerli': Network.ETH_GOERLI,
    'mumbai': Network.MATIC_MUMBAI,
    'base-goerli': Network.BASE_GOERLI
  };
  
  return {
    apiKey,
    network: networkMap[network] || Network.BASE_MAINNET
  };
};

// Cache Alchemy instances by network
const alchemyInstances = {};

/**
 * Get an Alchemy instance for a specific network
 * @param {string} network - Network name (e.g., 'ethereum', 'base')
 * @returns {Alchemy} Alchemy instance
 */
export const getAlchemy = (network = 'base') => {
  if (!alchemyInstances[network]) {
    const config = getAlchemyConfig(network);
    alchemyInstances[network] = new Alchemy(config);
  }
  
  return alchemyInstances[network];
};

/**
 * Get token metadata
 * @param {string} tokenAddress - Token contract address
 * @param {string} network - Network name
 */
export const getTokenMetadata = async (tokenAddress, network = 'base') => {
  try {
    const alchemy = getAlchemy(network);
    const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
    return metadata;
  } catch (error) {
    console.error('Failed to fetch token metadata:', error);
    throw error;
  }
};

/**
 * Get token balance for an address
 * @param {string} address - Wallet address
 * @param {string} tokenAddress - Token contract address
 * @param {string} network - Network name
 */
export const getTokenBalance = async (address, tokenAddress, network = 'base') => {
  try {
    const alchemy = getAlchemy(network);
    
    // For native token (ETH, MATIC, etc.)
    if (tokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      const balance = await alchemy.core.getBalance(address);
      return ethers.formatEther(balance);
    }
    
    // For ERC20 tokens
    const balance = await alchemy.core.getTokenBalances(address, [tokenAddress]);
    
    if (balance.tokenBalances.length === 0) {
      return '0';
    }
    
    const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
    const rawBalance = balance.tokenBalances[0].tokenBalance;
    
    if (!rawBalance || !metadata.decimals) {
      return '0';
    }
    
    return ethers.formatUnits(rawBalance, metadata.decimals);
  } catch (error) {
    console.error('Failed to fetch token balance:', error);
    throw error;
  }
};

/**
 * Get token holders count
 * @param {string} tokenAddress - Token contract address
 * @param {string} network - Network name
 */
export const getTokenHoldersCount = async (tokenAddress, network = 'base') => {
  try {
    // Note: This is a placeholder as Alchemy doesn't directly provide holder count
    // In a real app, you might use a different API or indexer for this data
    return 0;
  } catch (error) {
    console.error('Failed to fetch token holders count:', error);
    return 0;
  }
};

/**
 * Check if an address owns a minimum amount of tokens
 * @param {string} address - Wallet address to check
 * @param {string} tokenAddress - Token contract address
 * @param {number} minAmount - Minimum token amount required
 * @param {string} network - Network name
 */
export const checkTokenOwnership = async (address, tokenAddress, minAmount, network = 'base') => {
  try {
    const balance = await getTokenBalance(address, tokenAddress, network);
    return parseFloat(balance) >= minAmount;
  } catch (error) {
    console.error('Failed to check token ownership:', error);
    return false;
  }
};

/**
 * Get ERC20 token contract interface
 * @param {string} tokenAddress - Token contract address
 * @param {string} network - Network name
 */
export const getTokenContract = async (tokenAddress, network = 'base') => {
  try {
    const alchemy = getAlchemy(network);
    const provider = await alchemy.config.getProvider();
    
    // Standard ERC20 ABI (minimal interface)
    const erc20Abi = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address) view returns (uint256)',
      'function transfer(address to, uint amount) returns (bool)',
      'function allowance(address owner, address spender) view returns (uint256)',
      'function approve(address spender, uint amount) returns (bool)',
      'function transferFrom(address from, address to, uint amount) returns (bool)',
      'event Transfer(address indexed from, address indexed to, uint amount)',
      'event Approval(address indexed owner, address indexed spender, uint amount)'
    ];
    
    return new ethers.Contract(tokenAddress, erc20Abi, provider);
  } catch (error) {
    console.error('Failed to get token contract:', error);
    throw error;
  }
};

/**
 * Get transaction history for a token
 * @param {string} address - Wallet address
 * @param {string} tokenAddress - Token contract address
 * @param {string} network - Network name
 */
export const getTokenTransactions = async (address, tokenAddress, network = 'base') => {
  try {
    const alchemy = getAlchemy(network);
    
    // Get token transfers for the address
    const transfers = await alchemy.core.getAssetTransfers({
      fromBlock: '0x0',
      toBlock: 'latest',
      fromAddress: address,
      contractAddresses: [tokenAddress],
      category: ['erc20'],
      withMetadata: true,
      maxCount: 100
    });
    
    return transfers.transfers;
  } catch (error) {
    console.error('Failed to fetch token transactions:', error);
    return [];
  }
};

export default {
  getAlchemy,
  getTokenMetadata,
  getTokenBalance,
  getTokenHoldersCount,
  checkTokenOwnership,
  getTokenContract,
  getTokenTransactions
};

