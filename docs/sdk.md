# W Swap SDK Modifications

The W Swap SDK (`v2-sdk`) is a modified version of the Uniswap V2 SDK, tailored to support the specific requirements of the W Chain and its integration with other networks like BSC.

## Overview

The SDK extends the original functionality to accommodate new chain identifiers, native currencies, and contract addresses required for W Swap operations. It is designed to be compatible with the standard Uniswap V2 interface while providing the necessary overrides.

## Key Modifications

### 1. Chain Support
The `ChainId` enum has been updated to include:
- **WCHAIN**: Chain ID `171717`
- **WCHAIN_TESTNET**: Chain ID `71117`
- **BSC**: Chain ID `56` (Binance Smart Chain)

### 2. Native Currency
The SDK introduces `WCO` as the native currency for the W Chain, replacing standard Ethereum logic where applicable.
- **Symbol**: `WCO` (W Chain Native)
- **Mapping**: The `Currency` entity handles native token symbols based on the chain ID (`WCO` for W Chain, `BNB` for BSC).

### 3. Contract Addresses
Factory and Router addresses have been updated to reflect deployments on the supported networks.
- **Factory Address**: Includes mappings for W Chain and BSC.
- **Router Address**: Includes mappings for W Chain and BSC.
- **Init Code Hash**: A custom initialization code hash is used for pair generation on W Chain.

### 4. Wrapped Tokens
The `WETH` mapping has been extended to include wrapped native tokens for the new chains:
- **WWCO**: Wrapped WCO (W Chain)
- **WBNB**: Wrapped BNB (BSC)

## Usage

The SDK is located in the `v2-sdk` directory and is imported by the interface application. It provides the core logic for:
- Token and Pair entities.
- Pricing and fractional arithmetic.
- Trade execution and routing.
- Fetching on-chain data (via `Fetcher`).

Developers working on the interface should ensure they are using the modified SDK to guarantee compatibility with W Chain's specific parameters.
