import { createPublicClient, http, defineChain } from "viem";
import dotenv from "dotenv";
import * as hyper from "@nktkas/hyperliquid";

dotenv.config();

export const hyperEvmConfig = defineChain({
  id: parseInt(process.env.CHAIN_ID || "998", 10),
  name: "HyperEVM",
  nativeCurrency: {
    decimals: 18,
    name: "HyperEVM",
    symbol: "HYPE",
  },
  rpcUrls: {
    default: {
      http: [
        process.env.CHAIN_RPC_URL || "https://hyperliquid-testnet.drpc.org",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "HyperEVM Explorer",
      url: process.env.BLOCK_EXPLORER_URL || "https://testnet.purrsec.com/",
    },
  },
  testnet: true,
});

export const publicClient = createPublicClient({
  chain: hyperEvmConfig,
  transport: http(),
});

export const transport = new hyper.HttpTransport({
  isTestnet: true,
  timeout: 30000,
});
