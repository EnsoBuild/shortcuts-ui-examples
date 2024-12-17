import { Address } from "viem";
import { useAccount, useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { ENSO_API_KEY } from "../constants";
import { useExtendedSendTransaction, useNetworkId } from "./wallet";
import { formatNumber, isAddress, normalizeValue } from "@enso/shared/util";
import {
  EnsoClient,
  ApproveData,
  RouteParams,
  RouteData,
  QuoteData,
  QuoteParams,
} from "@enso/sdk";
import { useTokenFromList } from "./common";

const ENSO_BASE_URL = "https://api.enso.finance/api/v1";
// const ENSO_BASE_URL = "http://localhost:3000/api/v1";

const ensoClient = new EnsoClient(ENSO_BASE_URL, ENSO_API_KEY);

export const useEnsoApprove = (tokenAddress: Address, amount: string) => {
  const { address } = useAccount();
  const chainId = useNetworkId();

  return useQuery<ApproveData>({
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
  return useQuery<RouteData>({
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

export const useSendEnsoTransaction = (
  amountIn: string,
  tokenOut: Address,
  tokenIn: Address,
  slippage: number,
) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const preparedData = {
    fromAddress: address,
    receiver: address,
    spender: address,
    chainId,
    amountIn,
    slippage,
    tokenIn,
    tokenOut,
    routingStrategy: "router",
  };
  // @ts-ignore
  const { data: ensoData } = useEnsoRouterData(preparedData);
  const tokenData = useTokenFromList(tokenOut);
  const tokenFromData = useTokenFromList(tokenIn);

  const sendTransaction = useExtendedSendTransaction(
    `Purchase ${formatNumber(normalizeValue(+amountIn, tokenFromData?.decimals))} ${tokenFromData?.symbol} of ${tokenData?.symbol}`,
    ensoData?.tx,
  );

  return {
    sendTransaction,
    ensoData,
  };
};

export const useEnsoQuote = (params: QuoteParams) => {
  return useQuery<QuoteData>({
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
