import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";
import {
  GET_BALANCE_TOOL,
  GET_LATEST_BLOCK_TOOL,
  DEPLOY_CONTRACTS_TOOL,
  SEND_FUNDS_TOOL,
  GET_TRANSACTION_RECEIPT_TOOL,
  GET_TOKEN_BALANCE_TOOL,
  STAKE_TOOL,
  UNSTAKE_TOOL,
  GET_LOGS_TOOL,
  GET_HISTORICAL_ORDERS_TOOL,
} from "./tools/tools.js";
import { getBalance } from "./tools/hyper-evm/getBalance/index.js";
import { getLatestBlock } from "./tools/hyper-evm/getBlockNumber/index.js";
import { deployContracts } from "./tools/hyper-evm/deployContracts/index.js";
import type { DeployContractsInput } from "./tools/hyper-evm/deployContracts/schemas.js";
import { sendFunds } from "./tools/hyper-evm/sendFunds/index.js";
import { sendFundsInputSchema } from "./tools/hyper-evm/sendFunds/schemas.js";
import { getTransactionReceipt } from "./tools/hyper-evm/getTransactionReceipt/index.js";
import type { getTransactionReceiptInput } from "./tools/hyper-evm/getTransactionReceipt/schemas.js";
import { getTokenBalanceInputSchema } from "./tools/hyper-evm/getTokenBalance/schemas.js";
import { getTokenBalance } from "./tools/hyper-evm/getTokenBalance/index.js";
import {
  performStaking,
  performUnstaking,
} from "./tools/hyper-evm/handleStake/index.js";
import {
  getStakingInputSchema,
  getUnstakingInputSchema,
} from "./tools/hyper-evm/handleStake/schemas.js";
import { getLogs } from "./tools/hyper-evm/getLogs/index.js";
import { getHistoricalOrders } from "./tools/hypercore/getHistoricalOrders/index.js";
import http from "http";

async function main() {
  console.error("Starting Hyperliquid MCP server...");
  const server = new Server(
    {
      name: "hyperliquid",
      version: "0.0.1",
    },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.error("Received request:", request);
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "get_latest_block": {
            const latestBlock = await getLatestBlock();
            return latestBlock;
          }

          case "get_balance": {
            const userAddress = (args as { userAddress: `0x${string}` })
              .userAddress;
            const balance = await getBalance({ userAddress });
            return balance;
          }

          case "deploy_contracts": {
            const input = args as DeployContractsInput;
            const result = await deployContracts(input);
            return result;
          }

          case "send_funds": {
            const {
              privateKey,
              receiverAddress,
              amountToSend,
              maxFeePerGas,
              maxPriorityFeePerGas,
            } = args as {
              privateKey: string;
              receiverAddress: string;
              amountToSend: string;
              maxFeePerGas?: string;
              maxPriorityFeePerGas?: string;
            };

            const validatedInput = sendFundsInputSchema.parse({
              privateKey,
              receiverAddress,
              amountToSend,
              maxFeePerGas,
              maxPriorityFeePerGas,
            });

            const result = await sendFunds(validatedInput);
            return result;
          }

          case "get_transaction_receipt": {
            const input = args as getTransactionReceiptInput;
            const result = await getTransactionReceipt(input);
            return result;
          }

          case "get_token_balance": {
            const { contractAddress, userAddress } = args as {
              contractAddress: string;
              userAddress: string;
            };

            const validatedInput = getTokenBalanceInputSchema.parse({
              contractAddress,
              userAddress,
            });

            const result = await getTokenBalance(validatedInput);
            return result;
          }

          case "stake": {
            const input = args as {
              privateKey: string;
              amountToStake: string;
              validatorAddress: string;
              isTestnet: boolean | string;
            };

            const validatedInput = getStakingInputSchema.parse(input);
            const result = await performStaking(validatedInput);
            return result;
          }

          case "unstake": {
            const input = args as {
              privateKey: string;
              amountToUnstake: string;
              validatorAddress: string;
              isTestnet: boolean | string;
            };

            const validatedInput = getUnstakingInputSchema.parse(input);
            const result = await performUnstaking(validatedInput);
            return result;
          }

          case "get_logs": {
            const { contractAddress, from, to } = args as {
              contractAddress: string;
              from?: number;
              to?: number;
            };
            const logs = await getLogs({ contractAddress, from, to });
            return logs;
          }

          case "get_historical_orders": {
            const userAddress = (args as { userAddress: `0x${string}` })
              .userAddress;
            const result = await getHistoricalOrders({ userAddress });
            return result;
          }

          default: {
            throw new Error(
              `Tool '${name}' not found. Available tools: get_latest_block, get_balance, deploy_contracts, send_funds, get_transaction_receipt, get_token_balance, stake, unstake, get_logs, get_historical_orders`
            );
          }
        }
      } catch (error) {
        console.error("Error handling request:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("Received ListToolsRequest");
    return {
      tools: [
        GET_LATEST_BLOCK_TOOL,
        GET_BALANCE_TOOL,
        DEPLOY_CONTRACTS_TOOL,
        SEND_FUNDS_TOOL,
        GET_TRANSACTION_RECEIPT_TOOL,
        GET_TOKEN_BALANCE_TOOL,
        STAKE_TOOL,
        UNSTAKE_TOOL,
        GET_LOGS_TOOL,
        GET_HISTORICAL_ORDERS_TOOL,
      ],
    };
  });

  const port = parseInt(process.env.PORT || "3000", 10);

  const httpServer = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "running",
          service: "Hyperliquid MCP Server",
          timestamp: new Date().toISOString(),
          endpoints: {
            mcp: "/mcp (POST)",
            health: "/ (GET)",
          },
        })
      );
      return;
    }

    if (req.method === "POST" && req.url === "/mcp") {
      let body = "";

      req.on("data", chunk => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const request = JSON.parse(body);
          console.error("HTTP Request received:", request);

          let handler;
          let handlerInput;

          switch (request.method) {
            case "tools/list":
              handler = (server as any)._requestHandlers?.get(
                ListToolsRequestSchema
              );
              handlerInput = {};
              break;
            case "tools/call":
              handler = (server as any)._requestHandlers?.get(
                CallToolRequestSchema
              );
              handlerInput = request;
              break;
            default:
              throw new Error(`Unknown method: ${request.method}`);
          }

          if (!handler) {
            throw new Error(`No handler found for method: ${request.method}`);
          }

          const response = await handler(handlerInput);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(response));
        } catch (error) {
          console.error("HTTP Error:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            })
          );
        }
      });
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  httpServer.listen(port, () => {
    console.error(`Hyperliquid MCP Server running on port ${port}`);
    console.error(`Health check: http://localhost:${port}/`);
  });
}

main().catch(error => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
