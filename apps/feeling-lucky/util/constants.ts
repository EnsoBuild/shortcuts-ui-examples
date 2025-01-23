import { arbitrum, base, mainnet } from "viem/chains";

export const USDC_ADDRESSES = {
  [base.id]: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  [arbitrum.id]: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
  [mainnet.id]: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
};

export const ENSO_API_KEY = process.env.NEXT_PUBLIC_ENSO_API_KEY;

export const MEMES_LIST = [
  "0x532f27101965dd16442e59d40670faf5ebb142e4",
  "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
  "0xb1a03eda10342529bbf8eb700a06c60441fef25d",
  "0xac1bd2486aaf3b5c0fc3fd868558b082a531b2b4",
  "0x9a26f5433671751c3276a065f57e5a02d2817973",
  "0x52b492a33e447cdb854c7fc19f1e57e8bfa1777d",
  "0x2f20cf3466f80a5f7f532fca553c8cbc9727fef6", // AKUMA
  "0x768be13e1680b5ebe0024c42c896e3db59ec0149", // SKI
];
export const DEFI_LIST = [
  "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
  "0x22e6966b799c4d5b13be962e1d117b56327fda66",
  "0x7d49a065d17d6d4a55dc13649901fdbb98b2afba",
  "0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842",
];
export const DEFAI_LIST = [
  "0x4f9fd6be4a90f2620860d680c0d4d5fb53d1a825", // AIXBT
  "0x79bbf4508b1391af3a0f4b30bb5fc4aa9ab0e07c", // ANON
  "0x96419929d7949d6a801a6909c145c8eef6a40431", // SPEC
  "0x9d0e8f5b25384c7310cb8c6ae32c8fbeb645d083", // DRV
];

export const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const ETH_TOKEN = {
  address: ETH_ADDRESS,
  name: "Ethereum",
  symbol: "ETH",
  decimals: 18,
  logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
};

export const DEFAULT_SLIPPAGE = 50; // 0.5%
