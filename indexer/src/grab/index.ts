import { K_PROCESSED_HEIGHT, START_BLOCK_BN } from "../constants";
import { processBlock, processHistorical } from "./process";
import { logger } from "../logger";
import { db, getKey, initKey, setKey } from "../db";

await initKey(K_PROCESSED_HEIGHT, START_BLOCK_BN.toString());

const h: string = await getKey(K_PROCESSED_HEIGHT);
let processedHeight = h ? BigInt(h) : START_BLOCK_BN;
await setKey(K_PROCESSED_HEIGHT, processedHeight.toString());

const t1 = Date.now();
const historicalHeight = await processHistorical(processedHeight + 1n);
const t2 = Date.now();

logger.info(
  `Processed historical from ${processedHeight} to ${historicalHeight} in ${
    t2 - t1
  }ms.`
);

// await setKey(K_PROCESSED_HEIGHT, historicalHeight.toString());
// processedHeight = historicalHeight;

// while (true) {
//   const t1 = Date.now();
//   await processBlock(processedHeight + 1n);
//   const t2 = Date.now();
//   processedHeight = processedHeight + 1n;
//   logger.info(`Processed block ${processedHeight} in ${t2 - t1}ms.`);
//   await setKey(K_PROCESSED_HEIGHT, processedHeight.toString());
// }
