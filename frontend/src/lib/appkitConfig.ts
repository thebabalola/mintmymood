import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
// Base Sepolia (Testnet) - Commented out for mainnet deployment
// import { baseSepolia } from '@reown/appkit/networks'
// Base Mainnet
import { base } from '@reown/appkit/networks'

// Get projectId from existing env variable
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Base Sepolia (Testnet) - Commented out for mainnet deployment
// export const networks = [baseSepolia]
// Base Mainnet
export const networks = [base]

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
