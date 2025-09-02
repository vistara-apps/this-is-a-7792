import React, { useState } from 'react';
import { Plus, Coins, TrendingUp, Clock } from 'lucide-react';
import { TokenInput } from './TokenInput';

export function StakingForm({ variant = 'stake', project }) {
  const [stakingPools, setStakingPools] = useState([
    {
      poolId: 1,
      name: 'Standard Pool',
      apy: 12,
      totalStaked: 50000,
      minLength: 30,
      rewardToken: project.tokenSymbol,
      userStaked: 1000
    },
    {
      poolId: 2,
      name: 'Long-term Pool',
      apy: 18,
      totalStaked: 25000,
      minLength: 90,
      rewardToken: project.tokenSymbol,
      userStaked: 0
    }
  ]);

  const [isCreatingPool, setIsCreatingPool] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [newPool, setNewPool] = useState({
    name: '',
    apy: '',
    minLength: '',
    rewardToken: project.tokenSymbol
  });

  const handleCreatePool = () => {
    const pool = {
      poolId: Date.now(),
      ...newPool,
      apy: parseFloat(newPool.apy),
      minLength: parseInt(newPool.minLength),
      totalStaked: 0,
      userStaked: 0
    };
    setStakingPools([...stakingPools, pool]);
    setNewPool({ name: '', apy: '', minLength: '', rewardToken: project.tokenSymbol });
    setIsCreatingPool(false);
  };

  const handleStake = (poolId) => {
    if (!stakeAmount || !selectedPool) return;
    
    setStakingPools(pools => pools.map(pool => 
      pool.poolId === poolId 
        ? { 
            ...pool, 
            totalStaked: pool.totalStaked + parseInt(stakeAmount),
            userStaked: pool.userStaked + parseInt(stakeAmount)
          }
        : pool
    ));
    setStakeAmount('');
    setSelectedPool(null);
  };

  const handleUnstake = (poolId, amount) => {
    setStakingPools(pools => pools.map(pool => 
      pool.poolId === poolId 
        ? { 
            ...pool, 
            totalStaked: Math.max(0, pool.totalStaked - amount),
            userStaked: Math.max(0, pool.userStaked - amount)
          }
        : pool
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">
            Staking Pools
          </h2>
          <p className="text-text-secondary">
            Manage staking pools and reward mechanisms
          </p>
        </div>
        <button
          onClick={() => setIsCreatingPool(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Pool</span>
        </button>
      </div>

      {isCreatingPool && (
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Create Staking Pool
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Pool Name
              </label>
              <input
                type="text"
                value={newPool.name}
                onChange={(e) => setNewPool(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., High Yield Pool"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  APY (%)
                </label>
                <TokenInput
                  variant="amount"
                  value={newPool.apy}
                  onChange={(value) => setNewPool(prev => ({ ...prev, apy: value }))}
                  placeholder="12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Minimum Lock Period (days)
                </label>
                <TokenInput
                  variant="amount"
                  value={newPool.minLength}
                  onChange={(value) => setNewPool(prev => ({ ...prev, minLength: value }))}
                  placeholder="30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Reward Token
              </label>
              <input
                type="text"
                value={newPool.rewardToken}
                onChange={(e) => setNewPool(prev => ({ ...prev, rewardToken: e.target.value }))}
                placeholder="Token symbol"
                className="input-field"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreatePool}
                disabled={!newPool.name || !newPool.apy || !newPool.minLength}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Pool
              </button>
              <button
                onClick={() => setIsCreatingPool(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stakingPools.map((pool) => (
          <div key={pool.poolId} className="card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">
                  {pool.name}
                </h3>
                <div className="flex items-center space-x-1 text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">{pool.apy}% APY</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-secondary">Total Staked</p>
                  <p className="font-semibold text-text-primary">
                    {pool.totalStaked.toLocaleString()} {pool.rewardToken}
                  </p>
                </div>
                <div>
                  <p className="text-text-secondary">Min. Period</p>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-text-secondary" />
                    <span className="font-semibold text-text-primary">
                      {pool.minLength} days
                    </span>
                  </div>
                </div>
              </div>

              {pool.userStaked > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Your Stake</p>
                      <p className="text-lg font-bold text-blue-900">
                        {pool.userStaked.toLocaleString()} {pool.rewardToken}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUnstake(pool.poolId, pool.userStaked)}
                      className="text-sm px-3 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300 transition-colors"
                    >
                      Unstake
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {selectedPool === pool.poolId ? (
                  <div className="space-y-2">
                    <TokenInput
                      variant="amount"
                      value={stakeAmount}
                      onChange={setStakeAmount}
                      placeholder="Amount to stake"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStake(pool.poolId)}
                        disabled={!stakeAmount}
                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Confirm Stake
                      </button>
                      <button
                        onClick={() => setSelectedPool(null)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedPool(pool.poolId)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Coins className="w-4 h-4" />
                    <span>Stake Tokens</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}