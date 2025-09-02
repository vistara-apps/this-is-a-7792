import React, { useState, useEffect } from 'react';
import { Plus, Coins, ArrowUpDown, Clock, TrendingUp, Info } from 'lucide-react';
import { useStaking } from '../hooks/useStaking';
import { useBlockchain } from '../hooks/useBlockchain';
import { useToast } from '../context/ToastContext';
import { LoadingIndicator } from './LoadingIndicator';

/**
 * Staking Panel component
 * Manages staking pools for a project
 */
export function StakingPanel({ project, onUpdate }) {
  const { 
    getPools, 
    createPool, 
    stakeTokens, 
    unstakeTokens, 
    claimRewards, 
    isLoading, 
    error 
  } = useStaking();
  const { formatTokenAmount, parseTokenAmount } = useBlockchain();
  const toast = useToast();
  
  const [pools, setPools] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [action, setAction] = useState('stake'); // 'stake', 'unstake', or 'claim'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rewardTokenAddress: '',
    rewardTokenSymbol: '',
    apy: 5,
    minLength: 7
  });

  // Load pools on mount
  useEffect(() => {
    if (project) {
      loadPools();
    }
  }, [project]);

  // Load pools from the database
  const loadPools = async () => {
    try {
      const projectPools = await getPools(project.projectId);
      setPools(projectPools);
    } catch (err) {
      toast.error('Failed to load staking pools');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'apy' || name === 'minLength' ? parseFloat(value) : value
    }));
  };

  // Handle pool creation
  const handleCreatePool = async (e) => {
    e.preventDefault();
    
    try {
      await createPool(project.projectId, {
        name: formData.name,
        description: formData.description,
        rewardTokenAddress: formData.rewardTokenAddress || project.tokenAddress,
        rewardTokenSymbol: formData.rewardTokenSymbol || project.tokenSymbol,
        apy: formData.apy,
        minLength: formData.minLength
      });
      
      toast.success('Staking pool created successfully');
      setIsCreating(false);
      setFormData({
        name: '',
        description: '',
        rewardTokenAddress: '',
        rewardTokenSymbol: '',
        apy: 5,
        minLength: 7
      });
      
      await loadPools();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to create staking pool');
    }
  };

  // Handle staking tokens
  const handleStake = async (e) => {
    e.preventDefault();
    
    if (!selectedPool || !stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    try {
      const success = await stakeTokens(selectedPool.poolId, stakeAmount, project);
      
      if (success) {
        toast.success(`Successfully staked ${stakeAmount} ${project.tokenSymbol}`);
        setStakeAmount('');
        setSelectedPool(null);
        setAction('');
        await loadPools();
      } else {
        toast.error('Failed to stake tokens');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to stake tokens');
    }
  };

  // Handle unstaking tokens
  const handleUnstake = async (e) => {
    e.preventDefault();
    
    if (!selectedPool || !unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(unstakeAmount) > selectedPool.userStaked) {
      toast.error(`You only have ${selectedPool.userStaked} ${project.tokenSymbol} staked`);
      return;
    }
    
    try {
      const success = await unstakeTokens(selectedPool.poolId, unstakeAmount);
      
      if (success) {
        toast.success(`Successfully unstaked ${unstakeAmount} ${project.tokenSymbol}`);
        setUnstakeAmount('');
        setSelectedPool(null);
        setAction('');
        await loadPools();
      } else {
        toast.error('Failed to unstake tokens');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to unstake tokens');
    }
  };

  // Handle claiming rewards
  const handleClaim = async () => {
    if (!selectedPool) {
      return;
    }
    
    try {
      const rewards = await claimRewards(selectedPool.poolId);
      
      if (rewards) {
        toast.success(`Successfully claimed ${formatTokenAmount(rewards)} ${selectedPool.rewardTokenSymbol}`);
        setSelectedPool(null);
        setAction('');
        await loadPools();
      } else {
        toast.error('Failed to claim rewards');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to claim rewards');
    }
  };

  // Cancel creating a pool
  const cancelCreate = () => {
    setIsCreating(false);
    setFormData({
      name: '',
      description: '',
      rewardTokenAddress: '',
      rewardTokenSymbol: '',
      apy: 5,
      minLength: 7
    });
  };

  // Cancel staking/unstaking/claiming
  const cancelAction = () => {
    setSelectedPool(null);
    setStakeAmount('');
    setUnstakeAmount('');
    setAction('');
  };

  if (isLoading && pools.length === 0) {
    return <LoadingIndicator text="Loading staking pools..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">
          Staking
        </h2>
        
        {!isCreating && !selectedPool && (
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Pool
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      )}
      
      {/* Pool Creation Form */}
      {isCreating && (
        <div className="card">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Create Staking Pool
          </h3>
          
          <form onSubmit={handleCreatePool}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Pool Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Community Staking Pool"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Stake your tokens to earn rewards..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Reward Token Address (Optional)
                  </label>
                  <input
                    type="text"
                    name="rewardTokenAddress"
                    value={formData.rewardTokenAddress}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="0x..."
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Leave empty to use project token
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Reward Token Symbol (Optional)
                  </label>
                  <input
                    type="text"
                    name="rewardTokenSymbol"
                    value={formData.rewardTokenSymbol}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder={project.tokenSymbol}
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Leave empty to use project token symbol
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Annual Percentage Yield (APY)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="apy"
                      value={formData.apy}
                      onChange={handleInputChange}
                      className="input-field w-full pr-8"
                      min="0.1"
                      step="0.1"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary">
                      %
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Minimum Staking Period (Days)
                  </label>
                  <input
                    type="number"
                    name="minLength"
                    value={formData.minLength}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Pool'}
                </button>
                
                <button
                  type="button"
                  onClick={cancelCreate}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Staking/Unstaking Form */}
      {selectedPool && (
        <div className="card">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            {action === 'stake' && 'Stake Tokens'}
            {action === 'unstake' && 'Unstake Tokens'}
            {action === 'claim' && 'Claim Rewards'}
          </h3>
          
          <div className="mb-4">
            <h4 className="font-medium text-text-primary">
              {selectedPool.name}
            </h4>
            <p className="text-text-secondary text-sm">
              {selectedPool.description}
            </p>
          </div>
          
          {action === 'stake' && (
            <form onSubmit={handleStake}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Amount to Stake
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="input-field w-full pr-16"
                      min="0.000001"
                      step="0.000001"
                      placeholder="0.0"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary">
                      {project.tokenSymbol}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">APY:</span>
                    <span className="text-text-primary font-medium">{selectedPool.apy}%</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Minimum Period:</span>
                    <span className="text-text-primary font-medium">{selectedPool.minLength} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Reward Token:</span>
                    <span className="text-text-primary font-medium">{selectedPool.rewardTokenSymbol}</span>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                  >
                    {isLoading ? 'Processing...' : 'Stake Tokens'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={cancelAction}
                    className="btn-secondary"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {action === 'unstake' && (
            <form onSubmit={handleUnstake}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Amount to Unstake
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      className="input-field w-full pr-16"
                      min="0.000001"
                      max={selectedPool.userStaked}
                      step="0.000001"
                      placeholder="0.0"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary">
                      {project.tokenSymbol}
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    You have {selectedPool.userStaked} {project.tokenSymbol} staked
                  </p>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={
                      isLoading || 
                      !unstakeAmount || 
                      parseFloat(unstakeAmount) <= 0 ||
                      parseFloat(unstakeAmount) > selectedPool.userStaked
                    }
                  >
                    {isLoading ? 'Processing...' : 'Unstake Tokens'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={cancelAction}
                    className="btn-secondary"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {action === 'claim' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Available Rewards:</span>
                  <span className="text-text-primary font-medium text-lg">
                    {formatTokenAmount(selectedPool.rewards)} {selectedPool.rewardTokenSymbol}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleClaim}
                  className="btn-primary"
                  disabled={isLoading || selectedPool.rewards <= 0}
                >
                  {isLoading ? 'Processing...' : 'Claim Rewards'}
                </button>
                
                <button
                  type="button"
                  onClick={cancelAction}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Pools List */}
      {pools.length > 0 ? (
        <div className="space-y-4">
          {pools.map(pool => (
            <div 
              key={pool.poolId}
              className="card"
            >
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-1">
                    {pool.name}
                  </h3>
                  
                  {pool.description && (
                    <p className="text-text-secondary mb-2">
                      {pool.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center text-text-secondary">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>APY: <span className="text-text-primary font-medium">{pool.apy}%</span></span>
                    </div>
                    
                    <div className="flex items-center text-text-secondary">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Min Period: <span className="text-text-primary font-medium">{pool.minLength} days</span></span>
                    </div>
                    
                    <div className="flex items-center text-text-secondary">
                      <Coins className="w-4 h-4 mr-1" />
                      <span>Total Staked: <span className="text-text-primary font-medium">{formatTokenAmount(pool.totalStaked)} {project.tokenSymbol}</span></span>
                    </div>
                  </div>
                </div>
                
                {!isCreating && !selectedPool && (
                  <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                    <button
                      onClick={() => {
                        setSelectedPool(pool);
                        setAction('stake');
                      }}
                      className="btn-primary flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Stake
                    </button>
                    
                    {pool.userStaked > 0 && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedPool(pool);
                            setAction('unstake');
                          }}
                          className="btn-secondary flex items-center justify-center"
                        >
                          <ArrowUpDown className="w-4 h-4 mr-1" />
                          Unstake
                        </button>
                        
                        {pool.rewards > 0 && (
                          <button
                            onClick={() => {
                              setSelectedPool(pool);
                              setAction('claim');
                            }}
                            className="btn-secondary flex items-center justify-center text-green-600"
                          >
                            <Coins className="w-4 h-4 mr-1" />
                            Claim
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {pool.userStaked > 0 && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-text-secondary text-sm mb-1">Your Staked Balance</div>
                      <div className="text-text-primary font-medium">
                        {formatTokenAmount(pool.userStaked)} {project.tokenSymbol}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-text-secondary text-sm mb-1">Pending Rewards</div>
                      <div className="text-text-primary font-medium">
                        {formatTokenAmount(pool.rewards)} {pool.rewardTokenSymbol}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Coins className="w-6 h-6 text-text-secondary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-1">
            No Staking Pools Yet
          </h3>
          <p className="text-text-secondary mb-4">
            Create your first staking pool to incentivize long-term token holding
          </p>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary mx-auto"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Pool
            </button>
          )}
        </div>
      )}
      
      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">
              About Staking
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Staking allows token holders to lock their tokens for a period of time to earn rewards.
              This helps reduce circulating supply and incentivizes long-term holding.
              You can create multiple staking pools with different APYs and lock periods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakingPanel;

