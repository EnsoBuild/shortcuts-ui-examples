
# Enso SDK

The Enso SDK provides a set of tools and methods to interact with the Enso API. It includes functionalities for token approvals, routing, quoting, and balance checking.

## Introduction

The Route API is a highly-efficient DeFi aggregation and smart order routing REST API. With it, developers can easily tap into optimized routes for DeFi tokens/positions and multi-token swaps across various chains.

With a single API integration, unlock a host of DeFi strategies in your application. The Route API finds the optimal execution path across a multitude of DeFi protocols such as liquidity pools, lending platforms, automated market makers, yield optimizers, and more.

This allows for maximized capital efficiency and yield optimization, taking into account return rates, gas costs, and slippage. The Route API is your key to navigating the intricate DeFi landscape with ease and efficiency.

## Routing options

There are 3 options for routing strategies depending upon your use case of EOA, Smart Account, or new Smart Account:  
- `router` - single contract, which can be seen as the universal router 
- `delegate` - returns calldata in the form of delegateCalls for smart accounts 
- `ensowallet` - returns calldata for deploying an Enso smart account, and executing all the logic inside of the smart account in the same transaction

## Installation

To install the SDK, use npm:

```bash
npm install @ensofinance/sdk
```

## Usage

### Importing the SDK

```typescript
import { EnsoClient, ApproveParams, RouteParams, QuoteParams, BalanceParams } from "@ensofinance/sdk";
```

### Initializing the Client

Create an instance of `EnsoClient` with your API key:

```typescript
const ensoClient = new EnsoClient({
    apiKey: "YOUR_API_KEY",
});
```

### Methods

#### Get Approval Data

Get approval data to spend a token:

```typescript
const approvalData = await ensoClient.getApprovalData({
    fromAddress: "0xYourAddress",
    tokenAddress: "0xTokenAddress",
    chainId: 1,
    amount: "1000000000000000000",
});
```

#### Get Router Data

Get execution data for the best route from one token to another:

```typescript
const routeData = await ensoClient.getRouterData({
    fromAddress: "0xYourAddress",
    receiver: "0xReceiverAddress",
    spender: "0xSpenderAddress",
    chainId: 1,
    amountIn: "1000000000000000000",
    tokenIn: "0xTokenInAddress",
    tokenOut: "0xTokenOutAddress",
    routingStrategy: "router", // optional
});
```

#### Get Quote Data

Get a quote for swapping from one token to another:

```typescript
const quoteData = await ensoClient.getQuoteData({
    fromAddress: "0xYourAddress",
    chainId: 1,
    amountIn: "1000000000000000000",
    tokenIn: "0xTokenInAddress",
    tokenOut: "0xTokenOutAddress",
});
```

#### Get Balances

Get wallet balances per chain:

```typescript
const balances = await ensoClient.getBalances({
    address: "0xYourAddress",
    chainId: 1,
});
```

## License

This project is licensed under the MIT License.
```