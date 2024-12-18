import { Address } from "@enso/shared/types";

export type RoutingStrategy = "router" | "delegate" | "ensowallet";

export type RouteParams = {
  fromAddress: Address;
  receiver: Address;
  spender: Address;
  chainId: number;
  amountIn: string;
  slippage?: number;
  tokenIn: Address;
  tokenOut: Address;
  routingStrategy: RoutingStrategy;
  fee?: number;
  feeReceiver?: Address;
};

export type RouteData = {
  route: {
    tokenIn: string;
    positionInId: string;
    tokenOut: string;
    positionOutId: string;
    protocol: string;
    action: string;
  }[];
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

export type RouteSegment = {
  action: string;
  protocol: string;
  tokenIn: string[];
  tokenOut: string[];
  positionInId: string[];
  positionOutId: string[];
};

export type QuoteParams = Omit<
  RouteParams,
  "spender" | "receiver" | "slippage"
>;

export type QuoteData = {
  amountOut: string;
  route: RouteSegment[];
  gas: string;
};
