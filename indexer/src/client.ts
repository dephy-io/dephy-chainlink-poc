import { logger } from "./logger";
import { waitAndReject } from "./wait";
import {
  PublicClient,
  createPublicClient,
  fallback,
  http,
  webSocket,
} from "viem";
import { sepolia } from "viem/chains";
import abi from "../../contract/out/DephyOnChainlinkPoc.sol/DephyOnChainlinkPoc.json";

export { abi };

const transport = fallback([
  webSocket(process.env.EVM_RPC_ENDPOINT_WS),
  http(process.env.EVM_RPC_ENDPOINT_HTTP),
]);

export const rawClient: PublicClient<typeof transport, typeof sepolia> =
  createPublicClient({
    chain: sepolia,
    transport,
  });

export const client: typeof rawClient = new Proxy(rawClient, {
  get(target, prop, receiver) {
    const fn = (target as never)[prop] as never;
    if (typeof fn !== "function") return fn;
    // @ts-ignore
    return async function wrappedFn(...props) {
      let retryCount = 0;
      let e;
      while (retryCount < 3) {
        try {
          // @ts-ignore
          return Promise.race([fn(...props), waitAndReject(90000)]);
        } catch (error) {
          logger.error(
            { retryCount, prop, error },
            "Error on wallet client call."
          );
          e = error;
          retryCount += 1;
        }
      }
      throw e;
    };
  },
});

export default client;
