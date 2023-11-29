export const K_PROCESSED_HEIGHT = "app:ph";
export const START_BLOCK = process.env.START_BLOCK
  ? parseInt(process.env.START_BLOCK)
  : 4791332;
export const START_BLOCK_BN = BigInt(
  process.env.START_BLOCK ? parseInt(process.env.START_BLOCK) : 4791332
);
export const ZERO_ADDR = "0x0000000000000000000000000000000000000000" as const;
export const LOGGER_LEVEL = process.env.LOGGER_LEVEL ?? "info";

export const ADDRESS = "0x01490eA5C6e2A47Cd85C1F50Bb3c2EFc7a92c5D6";

export type EthAddress = `0x${string}`;
