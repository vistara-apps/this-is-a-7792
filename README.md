# TokenFlow

TokenFlow is a platform for token creators to define and manage utility for their tokens, offering exclusive access and community governance features to holders.

## Features

### Exclusive Access Control
Allows token creators to define specific features or content within their dApp that are only accessible to users holding a certain amount of their token.

### Community Governance Tools
Enables token creators to set up voting mechanisms where token holders can propose and vote on project decisions, such as feature prioritization or treasury allocation.

### Staking Module
Provides a simple interface for token creators to implement staking, allowing token holders to lock their tokens to earn rewards (e.g., more tokens, NFTs, or platform benefits).

## Tech Stack

- **Frontend**: React, TailwindCSS, Wagmi, Ethers.js
- **Backend**: Supabase (BaaS)
- **Blockchain Integration**: Alchemy SDK, Etherscan API
- **Authentication**: WalletConnect, Sign-In with Ethereum (SIWE)

## Getting Started

### Prerequisites

- Node.js (v16+)
- Yarn or npm
- Supabase account
- Alchemy API key
- Etherscan API key (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/tokenflow.git
cd tokenflow
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

4. Start the development server:
```bash
yarn dev
# or
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries and API clients
├── pages/            # Page components
├── services/         # Service layer for API interactions
├── App.jsx           # Main application component
├── index.css         # Global styles
└── main.jsx          # Application entry point
```

## Database Schema

The application uses Supabase as a backend service with the following tables:

- `creators`: User profiles for token creators
- `token_projects`: Token project information
- `utility_features`: Token-gated features
- `governance_proposals`: Governance proposals
- `proposal_votes`: Votes on governance proposals
- `staking_pools`: Staking pool configurations
- `user_staking_balances`: User staking balances
- `staking_actions`: Staking action history
- `user_token_balances`: User token balances

## Deployment

To build the application for production:

```bash
yarn build
# or
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Wagmi](https://wagmi.sh/)
- [Ethers.js](https://docs.ethers.io/)
- [Supabase](https://supabase.io/)
- [Alchemy](https://www.alchemy.com/)
- [Etherscan](https://etherscan.io/)

