import { arbitrum, base, mainnet } from "viem/chains";

export const USDC_ADDRESSES = {
  [base.id]: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  [arbitrum.id]: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
  [mainnet.id]: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
};

export const DECIMALS = {
  usdc: 6,
  wbtc: 8,
  weth: 18,
  eth: 18,
} as any;

export const USE_POSITIONS_DATA_SOURCE =
  "https://enso-scrape.s3.us-east-2.amazonaws.com/output/backend/positions.json";

export const ENSO_API_KEY = process.env.NEXT_PUBLIC_ENSO_API_KEY;

console.log(ENSO_API_KEY);
