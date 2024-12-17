import { useMemo } from "react";
import { isEoaMode } from "../util";
import { Address } from "@enso/shared/types";
import { useQuery } from "@tanstack/react-query";

type Token = {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

const getGeckoList = () =>
  fetch("https://tokens.coingecko.com/base/all.json").then((res) => res.json());

const getOneInchTokenList = () =>
  fetch("https://tokens.1inch.io/v1.2/8453").then((res) => res.json());

export const useGeckoList = () =>
  useQuery<{ tokens: Token[] } | undefined>({
    queryKey: ["tokenList"],
    queryFn: getGeckoList,
  });

export const useOneInchTokenList = () =>
  useQuery<Record<string, Token> | undefined>({
    queryKey: ["oneInchTokenList"],
    queryFn: getOneInchTokenList,
  });

export const useIsEoaEnabled = () => useMemo(isEoaMode, []);

export const useTokenFromList = (tokenAddress: Address) => {
  const { data } = useGeckoList();

  return data?.tokens.find((token) => token.address === tokenAddress);
};
