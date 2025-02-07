import { useAccount, useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { isAddress, Address } from "viem";
import { EnsoClient, RouteParams, QuoteParams } from "@ensofinance/sdk";
import { Token } from "./common";
import { useSendEnsoTransaction } from "./wallet";
import { ONEINCH_ONLY_TOKENS } from "./constants";

let ensoClient: EnsoClient;

export const setApiKey = (apiKey: string) => {
  ensoClient = new EnsoClient({
    // baseURL: "http://localhost:3000/api/v1",
    apiKey,
  });
};

const areAddressesValid = (addresses: Address | Address[]) =>
  typeof addresses === "string"
    ? isAddress(addresses)
    : addresses?.length > 0 && addresses.every((adr) => isAddress(adr));

export const useEnsoApprove = (tokenAddress: Address, amount: string) => {
  const { address } = useAccount();
  const chainId = useChainId();

  return useQuery({
    queryKey: ["enso-approval", tokenAddress, chainId, address, amount],
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

export const useEnsoData = (params: QuoteParams, slippage: number) => {
  if (
    ONEINCH_ONLY_TOKENS.includes(params.tokenIn) ||
    ONEINCH_ONLY_TOKENS.includes(params.tokenOut)
  ) {
    // @ts-ignore
    params.ignoreAggregators =
      "0x,paraswap,openocean,odos,kyberswap,native,barter";
  }

  const routerParams: RouteParams = {
    ...params,
    slippage,
    fromAddress: params.fromAddress,
    receiver: params.fromAddress,
    spender: params.fromAddress,
  };

  const { data: routerData, isLoading: routerLoading } =
    useEnsoRouterData(routerParams);
  const { data: quoteData, isLoading: quoteLoading } = useEnsoQuote(params);

  const sendTransaction = useSendEnsoTransaction(routerData?.tx, params);

  return {
    routerData,
    routerLoading,
    quoteData,
    quoteLoading,
    sendTransaction,
  };
};

const useEnsoRouterData = (params: RouteParams) =>
  useQuery({
    queryKey: [
      "enso-router",
      params.chainId,
      params.fromAddress,
      params.tokenIn,
      params.tokenOut,
      params.amountIn,
    ],
    queryFn: () => ensoClient.getRouterData(params),
    enabled:
      +params.amountIn > 0 &&
      isAddress(params.fromAddress) &&
      isAddress(params.tokenIn) &&
      isAddress(params.tokenOut) &&
      params.tokenIn !== params.tokenOut,
    retry: 2,
  });

const useEnsoQuote = (params: QuoteParams) =>
  useQuery({
    queryKey: [
      "enso-quote",
      params.chainId,
      params.fromAddress,
      params.tokenIn,
      params.tokenOut,
      params.amountIn,
    ],
    queryFn: () => ensoClient.getQuoteData(params),
    enabled:
      +params.amountIn > 0 &&
      isAddress(params.tokenIn) &&
      isAddress(params.tokenOut) &&
      params.tokenIn !== params.tokenOut,
    retry: 2,
  });

export const useEnsoBalances = () => {
  const { address } = useAccount();
  const chainId = useChainId();

  return useQuery({
    queryKey: ["enso-balances", chainId, address],
    queryFn: () =>
      ensoClient.getBalances({ useEoa: true, chainId, eoaAddress: address }),
    enabled: isAddress(address),
  });
};

export const useEnsoTokenDetails = ({
  address,
  underlyingTokens,
}: {
  address?: Address | Address[];
  underlyingTokens?: Address | Address[];
}) => {
  const chainId = useChainId();
  const enabled =
    areAddressesValid(address) || areAddressesValid(underlyingTokens);

  return useQuery({
    queryKey: ["enso-token-details", address, underlyingTokens, chainId],
    queryFn: () =>
      ensoClient
        .getTokenData({
          underlyingTokens,
          address,
          chainId,
          includeMetadata: true,
        })
        .then((data) =>
          data.data.map((token) => ({
            ...token,
            address: token.address.toLowerCase() as Address,
          })),
        ),
    enabled,
  });
};

export const useEnsoToken = (address?: Address | Address[]) => {
  const { data: tokens } = useEnsoTokenDetails({ address });

  const token: Token | null = useMemo(() => {
    if (!tokens?.length) return null;
    const ensoToken = tokens[0];
    let logoURI = ensoToken.logosUri[0];

    if (!logoURI && ensoToken.underlyingTokens?.length === 1) {
      logoURI = ensoToken.underlyingTokens[0].logosUri[0];
    }

    return {
      address: ensoToken.address.toLowerCase() as Address,
      symbol: ensoToken.symbol,
      name: ensoToken.name,
      decimals: ensoToken.decimals,
      logoURI,
      underlyingTokens: ensoToken.underlyingTokens?.map((token) => ({
        address: token.address.toLowerCase() as Address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        logoURI: token.logosUri[0],
      })),
    };
  }, [tokens]);

  return token;
};

export const useEnsoPrice = (address: Address) => {
  const chainId = useChainId();

  return useQuery({
    queryKey: ["enso-token-price", address, chainId],
    queryFn: () => ensoClient.getPriceData({ address, chainId }),
    enabled: chainId && isAddress(address),
  });
};
