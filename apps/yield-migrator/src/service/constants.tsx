import { Address } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  gnosis,
  linea,
  mainnet,
  optimism,
  polygon,
  zksync,
} from "viem/chains";
import { Token } from "./common";

export const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
export const ETH_TOKEN: Token = {
  address: ETH_ADDRESS,
  name: "Ethereum",
  symbol: "ETH",
  decimals: 18,
  logoURI:
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
};

export enum SupportedChainId {
  MAINNET = 1,
  ARBITRUM_ONE = 42161,
  OPTIMISM = 10,
  POLYGON = 137,
  BSC = 56,
  // BOBA = 288,
  BASE = 8453,
  // BLAST = 81457,
  // SCROLL = 534352,
  LINEA = 59144,
  ZKSYNC = 324,
  GNOSIS = 100,
  AVALANCHE = 43114,
  // ARBITRUM_RINKEBY = 421611,
  // OPTIMISM_GOERLI = 420,w
  // GOERLI = 5,
  // POLYGON_MUMBAI = 80001,
  // CELO = 42220,
  // CELO_ALFAJORES = 44787,
}

export const GECKO_CHAIN_NAMES: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: "ethereum",
  [SupportedChainId.ARBITRUM_ONE]: "arbitrum-one",
  [SupportedChainId.OPTIMISM]: "optimistic-ethereum",
  [SupportedChainId.POLYGON]: "polygon-pos",
  // [SupportedChainId.BOBA]: "boba",
  [SupportedChainId.BASE]: "base",
  [SupportedChainId.BSC]: "binance-smart-chain",
  // [SupportedChainId.BLAST]: "blast",
  // [SupportedChainId.SCROLL]: "scroll",
  [SupportedChainId.LINEA]: "linea",
  [SupportedChainId.ZKSYNC]: "zksync",
  [SupportedChainId.GNOSIS]: "xdai",
  [SupportedChainId.AVALANCHE]: "avalanche",
};

export const MOCK_IMAGE_URL =
  "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png";

export const CHAINS_ETHERSCAN: Record<SupportedChainId, string> = {
  [SupportedChainId.OPTIMISM]: "https://optimistic.etherscan.io",
  [SupportedChainId.MAINNET]: "https://etherscan.io",
  [SupportedChainId.ARBITRUM_ONE]: "https://arbiscan.io",
  [SupportedChainId.POLYGON]: "https://polygonscan.com",
  [SupportedChainId.BSC]: "https://bscscan.com",
  // [SupportedChainId.BOBA]: "https://bobascan.com",
  [SupportedChainId.BASE]: "https://basescan.org",
  // [SupportedChainId.BLAST]: "https://blastscan.io",
  // [SupportedChainId.SCROLL]: "https://scrollscan.com",
  [SupportedChainId.LINEA]: "https://lineascan.build",
  [SupportedChainId.ZKSYNC]: "https://explorer.zksync.io/",
  [SupportedChainId.GNOSIS]: "https://gnosisscan.io/",
  [SupportedChainId.AVALANCHE]: "https://cchain.explorer.avax.network",
};

export const USDC_ADDRESS: Record<SupportedChainId, Address> = {
  [mainnet.id]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  [arbitrum.id]: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
  [base.id]: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  [zksync.id]: "0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4",
  [optimism.id]: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
  [linea.id]: "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
  [polygon.id]: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  [avalanche.id]: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
  [gnosis.id]: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
  [bsc.id]: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
};

export const NATIVE_ETH_CHAINS = [
  SupportedChainId.MAINNET,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.OPTIMISM,
  SupportedChainId.BASE,
  SupportedChainId.LINEA,
  SupportedChainId.ZKSYNC,
];

export const SWAP_LIMITS: Record<Address, number> = {
  ["0x09def5abc67e967d54e8233a4b5ebbc1b3fbe34b"]: 100000, // WABTC limit
};

export const SWAP_REDIRECT_TOKENS: Address[] = [
  "0x09def5abc67e967d54e8233a4b5ebbc1b3fbe34b", // WABTC
];
export const LP_REDIRECT_TOKENS: Record<Address, string> = {
  ["0x42a094364bbdca0efac8af2cf7d6b9ec885ee554"]:
    "https://app.uniswap.org/positions/create/v2?currencyA=0x09DEF5aBc67e967d54E8233A4b5EBBc1B3fbE34b&currencyB=0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599&chain=ethereum", // WABTC
};
export const ONEINCH_ONLY_TOKENS = [
  "0xcf21354360fdae8edad02c0529e55cb3e71c36c9",
  "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3",
];

export const PRICE_IMPACT_WARN_THRESHOLD = 100; // basis points
export const DEFAULT_SLIPPAGE = 25; // 0.25%

export const MAINNET_ZAP_INPUT_TOKENS: Address[] = [
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // WBTC
  "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
  "0x97ad75064b20fb2b2447fed4fa953bf7f007a706", // beraSTONE
  "0x6982508145454ce325ddbe47a25d4ec3d2311933", // PEPE
  "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // UNI
  "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf", // cbBTC
  "0x514910771af9ca656af840dff83e8264ecf986ca", // LINK
  "0x8236a87084f8b84306f72007f36f2618a5634494", // LBTC
  "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0", // wstETH
  "0xae78736cd615f374d3085123a210448e74fc6393", // rETH
  "0x4c9edd5852cd905f086c759e8383e09bff1e68b3", // USDe
  ETH_ADDRESS,
];

enum TOKEN_NAMES {
  WETH = "WETH",
  USDC = "USDC",
  WBTC = "WBTC",
  USDT = "USDT",
  beraSTONE = "beraSTONE",
  PEPE = "PEPE",
  DAI = "DAI",
  UNI = "UNI",
  cbBTC = "cbBTC",
  LINK = "LINK",
  LBTC = "LBTC",
  wstETH = "wstETH",
  rETH = "rETH",
  USDe = "USDe",
  ETH = "ETH",

}
