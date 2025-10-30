'use client'

import { wagmiAdapter, projectId } from '@/lib/appkitConfig'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
// Re-enabled: Base Sepolia (Testnet)
import { baseSepolia } from '@reown/appkit/networks'
// Disabled: Base Mainnet
// import { base } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata for MintMyMood
const metadata = {
  name: 'MintMyMood',
  description: 'Transform your daily emotions into unique NFTs and share your mood journey with friends',
  url: 'https://mintmymood.vercel.app',
  icons: ['https://mintmymood.vercel.app/mym-logo.png']
}

// Create the AppKit modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  // Use Base Sepolia (Testnet)
  networks: [baseSepolia],
  defaultNetwork: baseSepolia,
  // Disabled: Base Mainnet
  // networks: [base],
  // defaultNetwork: base,
  metadata: metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

function AppKitProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default AppKitProvider
