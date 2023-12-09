import { ZERO_ADDR, EthAddress, ADDRESS } from "../constants";
import { db, prisma } from "../db";
import { logger } from "../logger";
import { wait } from "../wait";
import { default as publicClient, abi } from "../client";
import ipfsHasher from "ipfs-only-hash";
import { base58_to_binary } from "base58-js";
import { RawMessage, SignedMessage } from "dephy-proto";
import * as Report from "../generated/messages/ReportMessage";

export const processBlock = async (h: bigint): Promise<void> => {
  const currentNumber = await publicClient.getBlockNumber({ cacheTime: 300 });
  if (currentNumber < h) {
    await wait(500);
    return processBlock(h);
  }
  logger.debug(`processBlock: processing block ${h}`);
  const logs = await getLogs(h, h);
  await processLogs(logs);
};

export const processHistorical = async (fromBlock: bigint): Promise<bigint> => {
  const currentBlock = await publicClient.getBlock({ blockTag: "latest" });
  const currentNumber = currentBlock.number;
  if (currentNumber < fromBlock) return currentNumber;

  const logs = await getLogs(fromBlock, currentNumber);
  await processLogs(logs);

  return currentNumber;
};

async function processLogs(logs: GetLogsReturnType) {
  for (const i of logs) {
    try {
      await processLog(i);
    } catch (error) {
      console.error(error, i);
      process.exit(255);
    }
  }
}

async function processLog(log: GetLogsReturnItemType) {
  const c = await db.lastEvent.count({
    where: {
      txHash: { equals: log.transactionHash as string },
    },
  });
  if (c > 0) return;

  const url = "https://cloudflare-ipfs.com/ipfs/" + log.args.cid;
  const req = await fetch(url, {
    cache: "no-cache",
  });
  const buf = await req.text();
  const calCid = await ipfsHasher.of(buf);
  if (calCid !== log.args.cid) {
    logger.error("Bad data or CID!", log);
    return;
  }

  const events: any[] = JSON.parse(buf).events;

  // no need to check signatures since they are already verified
  const dbItems = events
    .map((i) => {
      try {
        const sm = SignedMessage.decodeBinary(base58_to_binary(i.content));
        const rm = RawMessage.decodeBinary(sm.raw);
        const r = Report.decodeBinary(rm.payload);
        if (r.data.length === 0) return null;

        const from = i.tags.filter(
          (i) => i[0] === "dephy_from"
        )[0][1] as string;
        return db.lastEvent.upsert({
          where: { from },
          update: {
            value: Report.encodeJson(r) as never,
            eventCreatedAt: parseInt(rm.timestamp),
            cid: calCid,
            blockHash: log.blockHash,
            blockNumber: log.blockNumber,
            txHash: log.transactionHash,
            requestId: log.args.requestId as string,
          } as never,
          create: {
            value: Report.encodeJson(r) as never,
            eventCreatedAt: parseInt(rm.timestamp),
            from,
            cid: calCid,
            blockHash: log.blockHash,
            blockNumber: log.blockNumber,
            txHash: log.transactionHash,
            requestId: log.args.requestId as string,
          } as never,
        });
      } catch (error) {
        // do nothing
      }
      return null;
    })
    .filter((i) => i);
  if (dbItems.length === 0) return;
  await prisma.$transaction(dbItems as never);

  console.log(`${Number(log.blockNumber)}: ${log.transactionHash}`);
}

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
export type GetLogsReturnType = Awaited<ReturnType<typeof getLogs>>;
export type GetLogsReturnItemType = GetLogsReturnType extends (infer T)[]
  ? T
  : never;
