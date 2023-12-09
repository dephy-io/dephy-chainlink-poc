export const K_PROCESSED_HEIGHT = "app:ph";
export const START_BLOCK = process.env.START_BLOCK
  ? parseInt(process.env.START_BLOCK)
  : 4791332;
export const START_BLOCK_BN = BigInt(
  process.env.START_BLOCK ? parseInt(process.env.START_BLOCK) : 4791332
);
export const ZERO_ADDR = "0x0000000000000000000000000000000000000000" as const;
export const LOGGER_LEVEL = process.env.LOGGER_LEVEL ?? "info";

export const ADDRESS = "0x76192D5D812E4F6120a7D6b9E1793E3Bf982074B";

export type EthAddress = `0x${string}`;
