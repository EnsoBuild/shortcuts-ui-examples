## Feeling lucky

#### Cannot decide where to ape in? Feeling lucky is here to help you out.

It allows users to ape into random meme for amount and token of their choice.
Gets use of `@ensofinance/sdk` to access API. Showcases a way to easily implement a telegram mini-app utilizing `Privy` functionality

### Main file page.tsx

- **State Management**: Manages the state for `swapValue`, `tokenIn` and `randomMeme`
- **Token Approval**:Validates user allowance and prepares approval data
- **Quoting**: Uses sdk to get swap quote even in case user doesn't have `balance`/`allowance`.
- **Swapping**: Sends a transaction to swap tokens with data received from `/route`.
- **Token List**: Retrieves token information from a list.
- **UI**: Renders essential UI elements and components

### Components

- **WalletButton**: Connects the user's wallet.
- **TokenSelector**: Allows users to select a token from a list.

### Hooks

#### enso.tsx

- **useEnsoApprove**: Used to get approval data for a token.
- **useEnsoQuote**: Used to get a quote for a token swap.
- **useEnsoRouterData**: Used to get router data for a token swap.

#### common.tsx

- **useTokenList**: Used to get a list of tokens.

#### wallet.tsx

- **useErc20Balance**: Used to get the balance of an ERC20 token.
- **useAllowance**: Used to get the allowance of an ERC20 token.
- **useApprove**: Used to approve an ERC20 token.
- other app specific functions to handle txs progress tracking

### Environment Variables

- **NEXT_PUBLIC_ENSO_API_KEY**: API key for Enso Finance.
- **NEXT_PUBLIC_COINGECKO_KEY**: API key for CoinGecko.
- **NEXT_PUBLIC_PRIVY_KEY**: API key for Privy.
- **NEXT_PUBLIC_ONE_INCH_API_KEY**: API key for 1inch.
