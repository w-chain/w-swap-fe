# W Swap Interface

W Swap is a decentralized exchange (DEX) interface with multi-chain support, deployed on the W Chain (Chain ID: 171717), Binance Smart Chain (BSC - Chain ID: 56), and Ethereum (Chain ID: 1).

This repository contains the frontend interface and the modified SDK for the W Swap protocol.

## Features

- **Swap**: Exchange ERC-20 tokens on supported networks.
- **Pool**: Provide liquidity and manage LP tokens.
- **Bridge**: Transfer assets across chains (W Chain, BSC, Ethereum).

For detailed information on these features, see [Features Documentation](docs/features.md).

## Project Structure

- **`uniswap-2-interface/`**: The React-based frontend application.
- **`v2-sdk/`**: The modified Uniswap V2 SDK tailored for W Swap.

### Entry Points
To understand the codebase, start by exploring the pages in `uniswap-2-interface/src/pages`:
- `Swap/`: Main swapping functionality.
- `Pool/`: Liquidity management.
- `Bridge/`: Cross-chain bridge interface.

For more details on the SDK modifications, see [SDK Documentation](docs/sdk.md).

## Quick Start

### Prerequisites
- Node version: 18.x

### Build

To build the project, run the following commands from the root directory:

```bash
yarn
yarn build:sdk
yarn build:interface
```

This will generate a `build` folder containing both the interface and the SDK, ready for deployment.

### Development

To run the interface locally for development:

1. Navigate to the interface directory:
   ```bash
   cd uniswap-2-interface
   ```
2. Start the development server:
   ```bash
   yarn start
   ```

## Documentation

- [Features Overview](docs/features.md)
- [SDK Modifications](docs/sdk.md)

## Adding Tokens

To add new tokens to the interface, update the token lists in the following locations:

1. **`uniswap-2-interface/src/constants/lists.ts`**: Update the `DEFAULT_TOKEN_LIST` variable.
2. **`uniswap-2-interface/public/token-list/token-list.json`**: Update the JSON file with the new token details.
