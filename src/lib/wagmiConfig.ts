// src/lib/wagmiConfig.ts
import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import {
  injected,
  walletConnect,
  metaMask,
  coinbaseWallet,
} from "wagmi/connectors";

export const walletConnectConnector = walletConnect({
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  metadata: {
    name: "MintMyMood",
    description: "Mint your mood as an NFT on Base Sepolia",
    url: "http://localhost:3000", // Required by WalletConnect
    icons: [], // Required by WalletConnect (can be empty array)
  },
});

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
    metaMask(),
    coinbaseWallet({
      appName: "MintMyMood",
    }),
    walletConnectConnector,
  ],
  ssr: true,
  multiInjectedProviderDiscovery: true,
});
