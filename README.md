# MintMyMood 🌟

**Transform your daily emotions into unique NFTs and share your mood journey with friends on Base Sepolia!**

## 🎯 Overview

MintMyMood is a revolutionary Web3 application that allows users to mint their daily emotions as unique NFTs on the Base Sepolia network. Built with modern web technologies and integrated with Farcaster, it provides a seamless experience for capturing, sharing, and tracking your emotional journey.

## 📁 Project Structure

This repository contains the complete MintMyMood project with the following components:

```
mintmymoods/
├── mintmymood-contract/     # Smart contract (Solidity + Foundry)
├── mintmymood-frontend/     # Next.js frontend application
└── badge-n-metadata/        # Badge images and metadata
```

### 🏗️ Smart Contract (`mintmymood-contract/`)

- **Network**: Base Sepolia testnet
- **Contract Address**: `0x4868cdcb72decb774d3154d72e572dc0094d8e41`
- **Framework**: Foundry
- **Features**: ERC-721 NFTs with mood-based minting

### 🎨 Frontend (`mintmymood-frontend/`)

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Web3**: Wagmi + Viem
- **Wallet Integration**: Farcaster Mini App Connector
- **Live Demo**: [mintmymood.vercel.app](https://mintmymood.vercel.app)

### 🏆 Badge System (`badge-n-metadata/`)

- **Badge Images**: PNG files for achievements
- **Metadata**: JSON files for badge descriptions and requirements

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Foundry (for smart contract development)
- MetaMask or any Web3 wallet
- Base Sepolia testnet ETH

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd mintmymood-frontend/frontends-mym
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x4868cdcb72decb774d3154d72e572dc0094d8e41
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_CDP_CLIENT_API_KEY=your_coinbase_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to http://localhost:3000

### Smart Contract Setup

1. **Navigate to contract directory**
   ```bash
   cd mintmymood-contract
   ```

2. **Install Foundry dependencies**
   ```bash
   forge install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file with:
   BASE_SEPOLIA_RPC_URL=your_base_sepolia_rpc_url
   BASESCAN_API_KEY=your_basescan_api_key
   PRIVATE_KEY=your_private_key
   ```

4. **Compile contracts**
   ```bash
   forge build
   ```

5. **Run tests**
   ```bash
   forge test
   ```

## ✨ Key Features

- **🎨 Mood Minting**: Transform your emotions into beautiful, AI-generated NFT artwork
- **📱 Farcaster Integration**: Seamless wallet connection and sharing within the Farcaster ecosystem
- **🏆 Achievement System**: Earn badges and track your minting streaks
- **📊 AI-Powered Reviews**: Get personalized weekly and monthly mood analysis
- **🖼️ Gallery**: Browse and showcase your minted moods
- **📈 Leaderboard**: Compete with other users for top minter status
- **🌐 Multi-Wallet Support**: Connect with MetaMask, WalletConnect, and more

## 🔗 Links

- **Live App**: [mintmymood.vercel.app](https://mintmymood.vercel.app)
- **Farcaster Mini App**: [Farcaster Mini App](https://farcaster.xyz/miniapps/oXpRXDCzmUMJ/mintmymood)
- **Smart Contract**: [Base Sepolia Explorer](https://sepolia.basescan.org/address/0x4868cdcb72decb774d3154d72e572dc0094d8e41)
- **GitHub**: [github.com/thebabalola/mintmymood](https://github.com/thebabalola/mintmymood)

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ by the MintMyMood team**

_Transform your emotions into art, one mood at a time._
