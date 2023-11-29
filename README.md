DePHY.io on Chainlink PoC
====
This repository is a Proof of Concept rolling DePHY messages up from NoStr network to the blockchain using Chainlink's distributed oracle infrastructure.

The target network is Polygon Mumbai testnet and it may work with some other EVM-compatible chains.

### How does it work?
This PoC use Chainlink Functions to run off-chain JavaScript codes to fetch and verify DePHY events from the NoStr network, off-chain codes are located in `src/`. Since Chainlink Functions doesn't support WebSocket to interact with a NoStr relay, the off-chain codes will request data from a [proxy server](https://github.com/dephy-io/nostr-dump-worker) running on Cloudflare Worker and any other Cloud Funtion services. The proxy server will dump messages from NoStr network and upload them to IPFS, then the off-chain codes will verify them within Chainlink Functions' sandboxed JavaScript runtime.

The `DephyOnChainlinkPoc` contract is inherited from the `FunctionsClient` interface so it provides the interface to worker with Chainlink Functions and write the verified IPFS CID in the contract storage.

The `DephyOnChainlinkPoc` contract is inherited from the `AutomationCompatibleInterface` interface to work with Chainlink Automation.

### How to deploy?
1. Deploy and verify the `DephyOnChainlinkPoc` contract to the blockchain.
2. Create a Chainlink Functions subscription [in the web portal](https://functions.chain.link/) and add the contract as an `consumer`.
3. Upload off-chain codes to the contract using `scripts/updateRequest.js`.
4. Register the contract as an `upkeep` on the [web portal](https://automation.chain.link/) of Chainlink Automation.
5. Then it works.
