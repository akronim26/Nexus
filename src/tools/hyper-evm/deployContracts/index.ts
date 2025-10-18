import type { DeployContractsInput } from "./schemas.js";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hyperEvmConfig, publicClient } from "../../../config.js";

export async function deployContracts(input: DeployContractsInput) {
  let { privateKey, abi, bytecode, constructorArguments } = input;
  if (!bytecode.startsWith("0x")) bytecode = "0x" + bytecode;

  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    chain: hyperEvmConfig,
    transport: http(),
  });

  const hash = await walletClient.deployContract({
    abi: abi as any,
    account: account,
    args: constructorArguments,
    bytecode: bytecode as `0x${string}`,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  return {
    content: [
      {
        type: "text",
        text: `Contract deployed successfully!
Deployer: ${account.address}
Transaction hash: ${hash}
Contract address: ${receipt.contractAddress}`,
      },
    ],
  };
}
