import { z } from "zod";
import { isAddress } from "viem";

export const getStakingInputSchema = z.object({
  privateKey: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, {
      message: "Must be a valid private key (0x + 64 hex chars)",
    })
    .describe(
      "Private key in 0x-prefixed hex format, 64 characters long (32 bytes)."
    ),
  amountToStake: z
    .string()
    .regex(/^\d+(\.\d+)?$/, {
      message: "Amount must be a positive number (as a string)",
    })
    .describe(
      "The amount of funds to stake, as a string representing a positive number (e.g., '0.1')."
    ),
  isTestnet: z
    .union([
      z.boolean(),
      z.string().transform(val => {
        if (val === "true" || val === "1") {
          return true;
        }
        if (val === "false" || val === "0") {
          return false;
        }
        throw new Error(
          "isTestnet must be a boolean or string representation of boolean"
        );
      }),
    ])
    .describe(
      "Set to true if staking on testnet, false for mainnet. Accepts boolean or string 'true'/'false'."
    ),
  validatorAddress: z
    .string()
    .refine(address => isAddress(address), {
      message: "Must be a valid Ethereum address (0x format)",
    })
    .describe(
      "The address of the validator to stake to (must be a valid Ethereum address starting with 0x)."
    ),
});

export const getUnstakingInputSchema = z.object({
  privateKey: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, {
      message: "Must be a valid private key (0x + 64 hex chars)",
    })
    .describe(
      "Private key in 0x-prefixed hex format, 64 characters long (32 bytes)."
    ),
  amountToUnstake: z
    .string()
    .regex(/^\d+(\.\d+)?$/, {
      message: "Amount must be a positive number (as a string)",
    })
    .describe(
      "The amount of funds to unstake, as a string representing a positive number (e.g., '0.1')."
    ),
  isTestnet: z
    .union([
      z.boolean(),
      z.string().transform(val => {
        if (val === "true" || val === "1") {
          return true;
        }
        if (val === "false" || val === "0") {
          return false;
        }
        throw new Error(
          "isTestnet must be a boolean or string representation of boolean"
        );
      }),
    ])
    .describe(
      "Set to true if unstaking on testnet, false for mainnet. Accepts boolean or string 'true'/'false'."
    ),
  validatorAddress: z
    .string()
    .refine(address => isAddress(address), {
      message: "Must be a valid Ethereum address (0x format)",
    })
    .describe(
      "The address of the validator to stake to (must be a valid Ethereum address starting with 0x)."
    ),
});

export type getStakingInput = z.infer<typeof getStakingInputSchema>;
export type getUnstakingInput = z.infer<typeof getUnstakingInputSchema>;
