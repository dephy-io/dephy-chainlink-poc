import { Device } from "@prisma/client";
import { ZERO_ADDR, EthAddress, ADDRESS } from "../constants";
import { db, prisma } from "../db";
import { logger } from "../logger";
import { wait } from "../wait";
import { default as publicClient, abi } from "../client";
import PQueue from "p-queue";

export const processBlock = async (h: bigint): Promise<void> => {
  const currentNumber = await publicClient.getBlockNumber({ cacheTime: 300 });
  if (currentNumber < h) {
    await wait(500);
    return processBlock(h);
  }
  logger.debug(`processBlock: processing block ${h}`);
  const logs = await getLogs(h, h);
  console.log(logs);
  // await processLogs(logs);
};

export const processHistorical = async (fromBlock: bigint): Promise<bigint> => {
  const currentBlock = await publicClient.getBlock({ blockTag: "latest" });
  const currentNumber = currentBlock.number;
  if (currentNumber < fromBlock) return currentNumber;

  const logs = await getLogs(fromBlock, currentNumber);
  console.log(logs);
  // await processLogs(logs);

  return currentNumber;
};

export const getLogs = (fromBlock: bigint, toBlock: bigint) =>
  publicClient.getLogs({
    address: ADDRESS,
    events: [
      {
        type: "event",
        name: "ResponseWritten",
        inputs: [
          {
            name: "requestId",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "cid",
            type: "string",
            indexed: false,
            internalType: "string",
          },
          {
            name: "targetTimestamp",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
    ],
    fromBlock,
    toBlock,
  });
