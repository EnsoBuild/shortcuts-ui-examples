import { Address } from "viem";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { ENSO_API_KEY } from "../constants";
import { useNetworkId } from "./wallet";
import { isAddress } from "@ensofinance/shared/util";
import { EnsoClient, RouteParams, QuoteParams } from "@ensofinance/sdk";

const ensoClient = new EnsoClient({
  // baseURL: "http://localhost:3000/api/v1",
  apiKey: ENSO_API_KEY,
});

export const useEnsoApprove = (tokenAddress: Address, amount: string) => {
  const { address } = useAccount();
  const chainId = useNetworkId();

  return useQuery({
    queryKey: ["enso-approval", tokenAddress, chainId, address, amount],
    queryFn: () =>
      ensoClient.getApprovalData({
        fromAddress: address,
        tokenAddress,
        chainId,
        amount,
      }),
    enabled: +amount > 0 && !!address && !!tokenAddress,
  });
};

export const useEnsoRouterData = (params: RouteParams) => {
  return useQuery({
    queryKey: [
      "enso-router",
      params.chainId,
      params.fromAddress,
      params.amountIn,
      params.tokenIn,
      params.tokenOut,
    ],
    queryFn: () => ensoClient.getRouterData(params),
    enabled:
      +params.amountIn > 0 &&
      isAddress(params.fromAddress) &&
      isAddress(params.tokenIn) &&
      isAddress(params.tokenOut),
  });
};

export const useEnsoQuote = (params: QuoteParams) => {
  return useQuery({
    queryKey: [
      "enso-quote",
      params.chainId,
      params.fromAddress,
      params.amountIn,
      params.tokenIn,
      params.tokenOut,
    ],
    queryFn: () => ensoClient.getQuoteData(params),
    enabled: +params.amountIn > 0,
  });
};
