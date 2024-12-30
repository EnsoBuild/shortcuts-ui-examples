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

export const MEMES_LIST = [
  "0x532f27101965dd16442e59d40670faf5ebb142e4",
  "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
  "0xb1a03eda10342529bbf8eb700a06c60441fef25d",
  "0xac1bd2486aaf3b5c0fc3fd868558b082a531b2b4",
  "0x9a26f5433671751c3276a065f57e5a02d2817973",
  "0x52b492a33e447cdb854c7fc19f1e57e8bfa1777d",
];
export const DEFI_LIST = [
  "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
  "0x22e6966b799c4d5b13be962e1d117b56327fda66",
  "0x7d49a065d17d6d4a55dc13649901fdbb98b2afba",
  "0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842",
];

export const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"

export const ETH_TOKEN = {
    address: ETH_ADDRESS,
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
}