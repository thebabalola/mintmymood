import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
// Re-enabled: Base Sepolia (Testnet)
import { baseSepolia } from '@reown/appkit/networks'
// Disabled: Base Mainnet
// import { base } from '@reown/appkit/networks'

// Get projectId from existing env variable
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Use Base Sepolia (Testnet)
export const networks = [baseSepolia]
// Disabled: Base Mainnet
// export const networks = [base]

// Set up the Wagmi Adapter (Config) for AppKit
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
