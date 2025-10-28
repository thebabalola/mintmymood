# MintMyMood Smart Contract

A Solidity smart contract for minting mood-based NFTs on Base Sepolia testnet.

## Contract Information

- **Contract Address**: `0x4868cdcb72decb774d3154d72e572dc0094d8e41`
- **Network**: Base Sepolia Testnet
- **Block Explorer**: [Base Sepolia Explorer](https://sepolia.basescan.org/address/0x4868cdcb72decb774d3154d72e572dc0094d8e41)

## Deployment History

| Version | Contract Address | Notes |
|---------|------------------|-------|
| Latest | `0x4868cdcb72decb774d3154d72e572dc0094d8e41` | Current production contract |
| Previous | `0xe6915322d181ce79006e4e8db227d1aba8d8a7ca` | Previous deployment |
| Earlier | `0xA06D5cB72106deF08f1458aa33ffD5Ec92fB42D8` | Earlier version |
| Initial | `0x0e09189f09609985c595099c56d1226d0a3244c1` | Initial deployment |

## Configuration

### Foundry Configuration

The project uses Foundry for development and deployment. The `foundry.toml` file is configured for Base Sepolia:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["node_modules", "lib"]
optimizer = true
optimizer_runs = 200
dotenv = true

remappings = [
    "forge-std/=lib/forge-std/src/",
    "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/",
]

[rpc_endpoints]
base_sepolia = "${BASE_SEPOLIA_RPC_URL}"

[etherscan]
base_sepolia = { key = "${BASESCAN_API_KEY}", url = "https://api-sepolia.basescan.org/api" }
```

## Deployment

### Base Sepolia Deployment

To deploy to Base Sepolia testnet:

```bash
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
```

### Environment Variables

Create a `.env` file with the following variables:

```env
BASE_SEPOLIA_RPC_URL=your_base_sepolia_rpc_url
BASESCAN_API_KEY=your_basescan_api_key
PRIVATE_KEY=your_private_key
```

## Development

### Prerequisites

- [Foundry](https://getfoundry.sh/)
- Node.js and npm

### Setup

1. Install dependencies:
```bash
forge install
```

2. Set up environment variables in `.env`

3. Compile contracts:
```bash
forge build
```

### Testing

Run tests:
```bash
forge test
```

## Contract Features

- Mood-based NFT minting
- Badge system for achievements
- Streak tracking
- Metadata storage on IPFS

## License

This project is licensed under the MIT License.
