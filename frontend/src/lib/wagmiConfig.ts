// src/lib/wagmiConfig.ts
import { createConfig, http } from "wagmi";
// Re-enabled: Base Sepolia (Testnet)
import { baseSepolia } from "wagmi/chains";
// Disabled: Base Mainnet
// import { base } from "wagmi/chains";
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
        description: "Mint your mood as an NFT on Base Sepolia",
        url: "https://mintmymood.vercel.app",
        icons: ["https://mintmymood.vercel.app/mym-logo.png"],
      },
    });
  }
  return walletConnectConnector;
};

export const config = createConfig({
  // Use Base Sepolia (Testnet)
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http("https://sepolia.base.org"),
    // Disabled: Base Mainnet
    // [base.id]: http("https://mainnet.base.org"),
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
