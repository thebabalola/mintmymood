# MintMyMood 🌟

**Transform your daily emotions into unique NFTs and share your mood journey with friends on Base Sepolia!**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-MintMyMood-blue?style=for-the-badge&logo=ethereum)](https://mintmymood.vercel.app)
[![Farcaster Mini App](https://img.shields.io/badge/Farcaster%20Mini%20App-Available-purple?style=for-the-badge)](https://farcaster.xyz/miniapps/oXpRXDCzmUMJ/mintmymood)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

## 🎯 Overview

MintMyMood is a revolutionary Web3 application that allows users to mint their daily emotions as unique NFTs on the Base Sepolia network. Built with modern web technologies and integrated with Farcaster, it provides a seamless experience for capturing, sharing, and tracking your emotional journey.

### ✨ Key Features

- **🎨 Mood Minting**: Transform your emotions into beautiful, AI-generated NFT artwork
- **📱 Farcaster Integration**: Seamless wallet connection and sharing within the Farcaster ecosystem
- **🏆 Achievement System**: Earn badges and track your minting streaks
- **📊 AI-Powered Reviews**: Get personalized weekly and monthly mood analysis
- **🖼️ Gallery**: Browse and showcase your minted moods
- **📈 Leaderboard**: Compete with other users for top minter status
- **🌐 Multi-Wallet Support**: Connect with MetaMask, WalletConnect, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or any Web3 wallet
- Base Sepolia testnet ETH

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thebabalola/mintmymood.git
   cd mintmymood/frontend
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
   NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_CDP_CLIENT_API_KEY=your_coinbase_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Frontend Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Web3**: Wagmi + Viem
- **Wallet Integration**: Farcaster Mini App Connector
- **UI Components**: Custom components with React Icons
- **State Management**: React hooks + TanStack Query

### Smart Contract

- **Network**: Base Sepolia testnet
- **Language**: Solidity
- **Framework**: Foundry
- **Features**: ERC-721 NFTs with metadata storage

### Key Components

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page with mood minting
│   ├── profile/           # User profile and achievements
│   ├── gallery/           # NFT gallery
│   └── leaderboard/       # Top minters leaderboard
├── components/            # Reusable React components
│   ├── MoodForm.tsx       # Mood input and minting form
│   ├── NFTGallery.tsx     # NFT display gallery
│   ├── ConnectButton.tsx  # Wallet connection
│   └── ...
├── contexts/              # React contexts
│   └── wallet/           # Wallet connection context
├── lib/                   # Utility functions and configs
│   ├── wagmiConfig.ts    # Wagmi configuration
│   ├── MintMyMoodABI.ts  # Smart contract ABI
│   └── ...
└── types/                 # TypeScript type definitions
```

## 🌟 Features in Detail

### Mood Minting
- **AI-Generated Artwork**: Each mood is transformed into unique visual art
- **Metadata Storage**: Mood data stored on IPFS for decentralization
- **Gas Optimization**: Efficient smart contract for cost-effective minting

### Farcaster Integration
- **Auto-Connection**: Seamless wallet connection in Farcaster Frame
- **Simplified UX**: Clean interface when accessed through Farcaster
- **Social Sharing**: Easy sharing of moods and achievements

### Achievement System
- **Streak Tracking**: Monitor your daily minting consistency
- **Badge Collection**: Earn badges for milestones and achievements
- **Progress Visualization**: Beautiful UI for tracking your journey

### AI Reviews
- **Weekly Analysis**: Personalized mood insights every week
- **Monthly Summaries**: Comprehensive monthly mood reports
- **Trend Analysis**: Identify patterns in your emotional journey

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Smart contract address | ✅ |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | ✅ |
| `NEXT_PUBLIC_CDP_CLIENT_API_KEY` | Coinbase API key | ✅ |

### Smart Contract Deployment

1. **Deploy to Base Sepolia**
   ```bash
   cd smart-contracts
   forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
   ```

2. **Update environment variables** with the deployed contract address

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** with automatic builds on push

### Manual Deployment

```bash
npm run build
npm start
```

## 📱 Farcaster Mini App

MintMyMood is available as a Farcaster Mini App, providing a native experience within the Farcaster ecosystem.

**Access**: [https://farcaster.xyz/miniapps/oXpRXDCzmUMJ/mintmymood](https://farcaster.xyz/miniapps/oXpRXDCzmUMJ/mintmymood)

### Mini App Features
- **Automatic Wallet Connection**: No manual wallet selection needed
- **Optimized UI**: Tailored for Farcaster Frame experience
- **Social Integration**: Seamless sharing with Farcaster community

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   ```
5. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Base Network** for the scalable L2 infrastructure
- **Farcaster** for the social Web3 platform
- **IPFS** for decentralized storage
- **OpenAI** for AI-powered mood analysis
- **Vercel** for hosting and deployment

## 📞 Support

- **Documentation**: [https://mintmymood.vercel.app](https://mintmymood.vercel.app)
- **Issues**: [GitHub Issues](https://github.com/thebabalola/mintmymood/issues)
- **Discord**: Join our community for support and discussions

## 🔗 Links

- **Live App**: [https://mintmymood.vercel.app](https://mintmymood.vercel.app)
- **Farcaster Mini App**: [https://farcaster.xyz/miniapps/oXpRXDCzmUMJ/mintmymood](https://farcaster.xyz/miniapps/oXpRXDCzmUMJ/mintmymood)
- **Smart Contract**: [Base Sepolia Explorer](https://sepolia.basescan.org)
- **GitHub**: [https://github.com/thebabalola/mintmymood](https://github.com/thebabalola/mintmymood)

---

**Made with ❤️ by the MintMyMood team**

*Transform your emotions into art, one mood at a time.*
