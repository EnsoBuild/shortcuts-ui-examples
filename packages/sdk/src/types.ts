import { Address } from "@ensofinance/shared/types";

export type RoutingStrategy = "router" | "delegate" | "ensowallet";

export type RouteParams = {
  fromAddress: Address;
  receiver: Address;
  spender: Address;
  chainId: number;
  amountIn: string;
  slippage?: number; // Slippage in basis points (1/10000). If specified, minAmountOut should not be specified
  minAmountOut?: string;
  tokenIn: Address;
  tokenOut: Address;
  routingStrategy?: RoutingStrategy;
  fee?: number; // Fee in basis points (1/10000) for each amountIn value. Must be in range 0-100. If specified, this percentage of each amountIn value will be sent to feeReceiver
  feeReceiver?: Address;
};

export type RouteSegment = {
  action: string;
  protocol: string;
  tokenIn: string[];
  tokenOut: string[];
  positionInId: string[];
  positionOutId: string[];
};

export type RouteData = {
  route: RouteSegment[];
  gas: number; // Estimated gas used by the transaction. Increase by 50% as a buffer.
  amountOut: number; // Estimated amount received.
  priceImpact: number | null; // Price impact in basis points, null if USD price not found.
  createdAt: number; // Block number the transaction was created on.
  tx: {
    data: string;
    to: string;
    from: string;
    value: string;
  };
  feeAmount: {
    [key: string]: number; // Collected fee amounts for each amountIn input.
  }[];
};

export type ApproveParams = {
  fromAddress: string;
  tokenAddress: string;
  chainId: number;
  amount: string;
  routingStrategy?: RoutingStrategy;
};

export type ApproveData = {
  amount: string;
  gas: string;
  spender: Address;
  token: Address;
  tx: {
    data: string;
    from: Address;
    to: Address;
  };
};

export type QuoteParams = Omit<
  RouteParams,
  "spender" | "receiver" | "slippage"
>;

export type QuoteData = {
  amountOut: string;
  gas: string;
  priceImpact: number;
};

export type BalanceParams = {
  chainId: number;
  eoaAddress: Address;
  useEoa?: boolean;
};

export type BalanceData = {
  amount: string;
  decimals: number;
  token: Address;
  price: string;
};
