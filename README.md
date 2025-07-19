stable...

import "./globals.css";

--- Wagmi config.. ---

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

--- connectButton ---

"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { walletConnectConnector } from "../lib/wagmiConfig";

export default function ConnectButton() {
const { address, isConnected } = useAccount();
const { connect, connectors, error, isPending } = useConnect();
const { disconnect } = useDisconnect();

const handleConnect = (connector: any) => {
connect({ connector });
};

return (

<div>
{isConnected ? (
<div className="flex flex-col items-center gap-2">
<p>Connected: {address}</p>
<button
onClick={() => disconnect()}
className="bg-red-600 text-white px-4 py-2 rounded" >
Disconnect
</button>
</div>
) : (
<div className="flex flex-col gap-2">
{connectors.map((connector) => (
<button
key={connector.id}
onClick={() => handleConnect(connector)}
disabled={isPending}
className={`px-4 py-2 rounded text-white ${
                connector.id === "injected"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } ${isPending ? "opacity-50" : ""}`} >
{isPending ? "Connecting..." : `Connect ${connector.name}`}
</button>
))}
{error && <p className="text-red-500">Error: {error.message}</p>}
</div>
)}
</div>
);
}

page.tsx

// src/app/profile/page.tsx
"use client";

import { useAccount } from "wagmi";
import WalletStatus from "../../components/WalletStatus";
import ConnectButton from "../../components/ConnectButton";
import Link from "next/link";

export default function ProfilePage() {
const { isConnected } = useAccount();

return (

<main className="flex flex-col items-center p-6 space-y-6">
<nav className="w-full max-w-md">
<Link href="/" className="text-blue-600 hover:underline">
← Back to Home
</Link>
</nav>

      <h1 className="text-3xl font-bold text-purple-600">Profile Page</h1>

      <WalletStatus />

      {!isConnected && (
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            Connect your wallet to view your profile
          </p>
          <ConnectButton />
        </div>
      )}

      {isConnected && (
        <div className="w-full max-w-md space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
            <p>
              Welcome! Your wallet is connected and working across all pages.
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold">Navigation Test</h3>
            <p className="text-sm text-gray-600">
              Try navigating between pages - your wallet will stay connected!
            </p>
          </div>
        </div>
      )}
    </main>

);
}

layout.tsx.....

"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query";

import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from "wagmi";
import { config } from "../lib/wagmiConfig";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (

<html lang="en">
<body className={inter.className}>
<QueryClientProvider client={queryClient}>
<WagmiProvider config={config}>{children}</WagmiProvider>
</QueryClientProvider>
</body>
</html>
);
}

mint-my-mood/
├── public/
│ └── assets/
│ └── favicon.ico
├── src/
│ ├── app/
│ │ ├── layout.tsx
│ │ ├── page.tsx (Home: Mood input)
│ │ ├── profile/
│ │ │ └── page.tsx (User streaks, badges)
│ │ ├── leaderboard/
│ │ │ └── page.tsx (Top minters)
│ │ ├── gallery/
│ │ │ └── page.tsx (Recent moods)
│ ├── components/
│ │ ├── MoodForm.tsx
│ │ ├── CanvasRenderer.tsx
│ │ ├── NFTGallery.tsx
│ │ ├── Leaderboard.tsx
│ │ ├── ShareButtons.tsx
│ │ └── ConnectButton.tsx
│ ├── lib/
│ │ ├── ipfs.ts
│ │ ├── hugApi.ts
│ │ ├── wagmiConfig.ts
│ │ └── MintMyMoodABI.ts
│ ├── types/
│ │ └── index.ts
│ ├── styles/
│ │ └── globals.css
├── contracts/
│ └── MintMyMood.sol
├── scripts/
│ └── deploy.ts
├── foundry.toml
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── .env.local
├── .gitignore
└── README.md
