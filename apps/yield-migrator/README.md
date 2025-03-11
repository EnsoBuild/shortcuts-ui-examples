# Yield Migrator

A DeFi application that helps users migrate their yield-bearing positions between different protocols to optimize returns.

## Overview

Yield Migrator is a web application built with React and Vite that leverages the Enso Build SDK to enable seamless migration between DeFi yield positions. The app allows users to:

1. View their current yield-bearing positions across different protocols
2. Compare APYs between similar positions on different protocols
3. Migrate funds from one yield position to another with higher returns
4. Preview the migration details including expected APY improvement and price impact

## Features

- **Position Discovery**: Automatically detects and displays user's current yield-bearing positions
- **APY Comparison**: Shows potential yield improvements when migrating to alternative protocols
- **One-Click Migration**: Seamless migration between protocols with a simple approval and confirmation flow
- **Transaction Preview**: Detailed preview of the migration including expected returns and price impact
- **Web3 Integration**: Connect with popular wallets via RainbowKit and wagmi

## Technology Stack

- **Frontend**: React, Chakra UI
- **Web3**: wagmi, viem, RainbowKit
- **DeFi Integration**: Enso Finance SDK
- **Build Tools**: Vite, TypeScript

## Getting Started

### Prerequisites

- Node.js (v16+)
- Yarn or npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Create a `.env.local` file based on `.env.example` and add your Enso API key:
   ```
   VITE_ENSO_API_KEY=your_api_key_here
   ```

### Development

Run the development server:

```
pnpm dev
```

### Building for Production

Build the application:

```
pnpm build
```

## How It Works

1. **Connect Wallet**: Users connect their Web3 wallet to the application
2. **Select Source Position**: Users select one of their current yield-bearing positions
3. **View Target Options**: The app displays alternative positions with the same underlying assets but potentially higher APYs
4. **Preview Migration**: Users can preview the migration details including expected APY improvement
5. **Approve & Migrate**: After approving the token spend (if needed), users can confirm the migration in one click
