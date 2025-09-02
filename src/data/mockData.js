export const mockProjects = [
  {
    projectId: 1,
    creatorId: '0x1234567890123456789012345678901234567890',
    tokenName: 'Community Token',
    tokenSymbol: 'COMM',
    tokenAddress: '0x1234567890123456789012345678901234567890',
    chain: 'base',
    holderCount: 1250,
    proposalCount: 3,
    utilityFeatures: [
      {
        featureId: 1,
        featureName: 'Premium Dashboard',
        featureType: 'access-control',
        accessCriteria: { minTokenAmount: 100 }
      },
      {
        featureId: 2,
        featureName: 'Exclusive Chat',
        featureType: 'access-control',
        accessCriteria: { minTokenAmount: 50 }
      }
    ],
    stakingPools: [
      {
        poolId: 1,
        name: 'Standard Pool',
        apy: 12,
        totalStaked: 50000,
        minLength: 30
      }
    ]
  },
  {
    projectId: 2,
    creatorId: '0x2345678901234567890123456789012345678901',
    tokenName: 'Governance Token',
    tokenSymbol: 'GOV',
    tokenAddress: '0x2345678901234567890123456789012345678901',
    chain: 'ethereum',
    holderCount: 850,
    proposalCount: 7,
    utilityFeatures: [
      {
        featureId: 3,
        featureName: 'Advanced Analytics',
        featureType: 'access-control',
        accessCriteria: { minTokenAmount: 200 }
      }
    ],
    stakingPools: []
  }
];