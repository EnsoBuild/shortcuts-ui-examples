import { Address } from "./types";

export const denormalizeValue = (value = 0, decimals = 0) =>
  (value * 10 ** decimals).toFixed();
export const normalizeValue = (value = 0, decimals = 0) =>
  value / 10 ** decimals;

export const compareCaseInsensitive = (a: string, b: string) => {
  return !!(a && b && a?.toLowerCase() === b?.toLowerCase());
};

export const shortenAddress = (address: Address) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export const formatNumber = (value: number | string) =>
  formatter.format(+Number(value));
