import { Address, isAddress } from "viem";
import { useAccount, useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { ENSO_API_KEY } from "../constants";
import { EnsoClient, RouteParams, QuoteParams } from "@ensofinance/sdk";

const ensoClient = new EnsoClient({
  // baseURL: "http://localhost:3000/api/v1",
  apiKey: ENSO_API_KEY,
});

export const useEnsoApprove = (tokenAddress: Address, amount: string) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const debouncedAmount = useDebounce(amount, 500);

  return useQuery({
    queryKey: [
      "enso-approval",
      tokenAddress,
      chainId,
      address,
      debouncedAmount,
    ],
    queryFn: () =>
      ensoClient.getApprovalData({
        fromAddress: address,
        tokenAddress,
        chainId,
        amount,
      }),
    enabled: +amount > 0 && isAddress(address) && isAddress(tokenAddress),
  });
};

export const useEnsoRouterData = (params: RouteParams) => {
  const debouncedAmount = useDebounce(params.amountIn, 500);

  return useQuery({
    queryKey: [
      "enso-router",
      params.chainId,
      params.fromAddress,
      debouncedAmount,
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
  const debouncedAmount = useDebounce(params.amountIn, 500);

  return useQuery({
    queryKey: [
      "enso-quote",
      params.chainId,
      params.fromAddress,
      debouncedAmount,
      params.tokenIn,
      params.tokenOut,
    ],
    queryFn: () => ensoClient.getQuoteData(params),
    enabled:
      +debouncedAmount > 0 &&
      isAddress(params.fromAddress) &&
      isAddress(params.tokenIn) &&
      isAddress(params.tokenOut),
  });
};
