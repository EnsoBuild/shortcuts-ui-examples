import { useAccount, useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { isAddress, Address } from "viem";
import { EnsoClient, RouteParams } from "@ensofinance/sdk";
import { Token } from "./common";
import { useSendEnsoTransaction } from "./wallet";
import { DEFAULT_SLIPPAGE, ONEINCH_ONLY_TOKENS } from "./constants";

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

export const useEnsoData = ({
  chainId,
  amountIn,
  tokenIn,
  tokenOut,
  slippage = DEFAULT_SLIPPAGE,
  active,
}: {
  amountIn: string;
  tokenIn: Address;
  tokenOut: Address;
  slippage?: number;
  chainId?: number;
  active?: boolean;
}) => {
  const { address } = useAccount();
  const wagmiChainId = useChainId();
  const addressToUse = address ?? "0x0000000000000000000000000000000000000001";

  if (!chainId) chainId = wagmiChainId;

  const routerParams: RouteParams = {
    amountIn,
    tokenIn,
    tokenOut,
    slippage,
    fromAddress: addressToUse,
    receiver: addressToUse,
    spender: addressToUse,
    routingStrategy: "router",
    chainId,
  };
  if (
    ONEINCH_ONLY_TOKENS.includes(tokenIn) ||
    ONEINCH_ONLY_TOKENS.includes(tokenOut)
  ) {
    // @ts-ignore
    routerParams.ignoreAggregators =
      "0x,paraswap,openocean,odos,kyberswap,native,barter";
  }

  const { data: routeData, isLoading: routeLoading } = useEnsoRouterData(
    routerParams,
    active,
  );

  const sendTransaction = useSendEnsoTransaction(routeData?.tx, routerParams);

  return {
    routeData,
    routeLoading,
    sendTransaction,
  };
};

const useEnsoRouterData = (params: RouteParams, active?: boolean) =>
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
      active &&
      +params.amountIn > 0 &&
      isAddress(params.fromAddress) &&
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
  underlyingTokensExact,
  type,
  chainId,
}: {
  address?: Address | Address[];
  underlyingTokensExact?: Address | Address[];
  type?: "defi" | "base";
  chainId?: number;
}) => {
  const wagmiChainId = useChainId();
  const enabled =
    areAddressesValid(address) || areAddressesValid(underlyingTokensExact);

  if (!chainId) chainId = wagmiChainId;

  return useQuery({
    queryKey: ["enso-token-details", address, underlyingTokensExact, chainId, type],
    queryFn: () =>
      ensoClient
        .getTokenData({
          underlyingTokensExact,
          address,
          chainId,
          includeMetadata: true,
          type,
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
