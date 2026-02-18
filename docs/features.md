# W Swap Features

This document provides a detailed overview of the key features available in the W Swap interface. The interface is built using React and interacts with the W Chain, BSC, and Ethereum networks.

## Core Features

### 1. Swap
The **Swap** feature allows users to exchange ERC-20 tokens on supported networks. It leverages the standard Uniswap V2 automated market maker (AMM) model.

- **Location**: `src/pages/Swap/index.tsx`
- **Functionality**:
  - Token selection and amount input.
  - Real-time price updates and slippage tolerance settings.
  - Route optimization using the modified SDK.
  - Transaction submission and confirmation.

### 2. Pool (Liquidity Provision)
The **Pool** feature enables users to provide liquidity to trading pairs and earn fees.

- **Location**: `src/pages/Pool/index.tsx`
- **Sub-features**:
  - **Add Liquidity**: `src/pages/AddLiquidity/index.tsx` - Users can deposit token pairs to mint LP tokens.
  - **Remove Liquidity**: `src/pages/RemoveLiquidity/index.tsx` - Users can burn LP tokens to withdraw underlying assets.
  - **Pool Finder**: `src/pages/PoolFinder/index.tsx` - Helps users discover existing pools.

### 3. Bridge
The **Bridge** is a custom feature designed for cross-chain asset transfers. It facilitates the movement of tokens between W Chain, BSC, and Ethereum.

- **Location**: `src/pages/Bridge/index.tsx`
- **Key Components**:
  - **UI**: Handles network selection (Source/Destination) and token input.
  - **State Management**: Uses dedicated Redux stores in `src/pages/Bridge/stores` to manage bridge-specific state separate from the global application state.
  - **Contract Interaction**:
    - `useBridgeContract.ts`: Manages interactions with the Bridge smart contract.
    - Handles deposit flows, fee calculation, and event listening.
  - **Transaction History**: `src/pages/Bridge/components/BridgeHistory.tsx` tracks the status of bridge transactions.
- **Supported Networks**:
  - **W Chain** (Chain ID: 171717)
  - **Binance Smart Chain (BSC)** (Chain ID: 56)
  - **Ethereum** (Chain ID: 1)

## Architecture Overview

The application is structured around pages in `src/pages`, which serve as the main entry points for each feature.

- **Routing**: React Router is used to navigate between Swap, Pool, and Bridge pages.
- **State**: Global state is managed via Redux, with feature-specific slices (e.g., for the Bridge).
- **SDK Integration**: The interface relies on the modified `v2-sdk` for core logic like pricing, routing, and trade execution.
