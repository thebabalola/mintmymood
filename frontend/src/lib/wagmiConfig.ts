// src/lib/wagmiConfig.ts
import { createConfig, http } from "wagmi";
// Base Sepolia (Testnet) - Commented out for mainnet deployment
// import { baseSepolia } from "wagmi/chains";
// Base Mainnet
import { base } from "wagmi/chains";
import {
  injected,
  walletConnect,
  metaMask,
  coinbaseWallet,
} from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

// Create WalletConnect connector only once
let walletConnectConnector: any = null;

const getWalletConnectConnector = () => {
  if (!walletConnectConnector) {
    walletConnectConnector = walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
      metadata: {
        name: "MintMyMood",
        description: "Mint your mood as an NFT on Base Mainnet",
        url: "https://mintmymood.vercel.app", // Updated to production URL
        icons: ["https://mintmymood.vercel.app/mym-logo.png"], // Add icon
      },
    });
  }
  return walletConnectConnector;
};

export const config = createConfig({
  // Base Sepolia (Testnet) - Commented out for mainnet deployment
  // chains: [baseSepolia],
  // Base Mainnet
  chains: [base],
  transports: {
    // Base Sepolia (Testnet) - Commented out for mainnet deployment
    // [baseSepolia.id]: http("https://sepolia.base.org"),
    // Base Mainnet
    [base.id]: http("https://mainnet.base.org"),
  },
  connectors: [
    // Farcaster Mini App connector as the primary option
    farcasterMiniApp(),
    injected({
      target: "metaMask",
    }),
    metaMask(),
    coinbaseWallet({
      appName: "MintMyMood",
    }),
    getWalletConnectConnector(),
  ],
  ssr: false, // Disable SSR to avoid indexedDB issues
  multiInjectedProviderDiscovery: true,
});
