DePHY.io on Chainlink PoC
====
This repository is a Proof of Concept rolling DePHY messages up from NoStr network to the blockchain using Chainlink's distributed oracle infrastructure.

The target network is Sepolia testnet and it may work with some other EVM-compatible chains.

## How does it work?
This PoC use Chainlink Functions to run off-chain JavaScript codes to fetch and verify DePHY events from the NoStr network, off-chain codes are located in `src/`. Since Chainlink Functions doesn't support WebSocket to interact with a NoStr relay, the off-chain codes will request data from a [proxy server](https://github.com/dephy-io/nostr-dump-worker) running on Cloudflare Worker and any other Cloud Funtion services. The proxy server will dump messages from NoStr network and upload them to IPFS, then the off-chain codes will verify them within Chainlink Functions' sandboxed JavaScript runtime.

The `DephyOnChainlinkPoc` contract is inherited from the `FunctionsClient` interface so it provides the interface to worker with Chainlink Functions and write the verified IPFS CID in the contract storage.

The `DephyOnChainlinkPoc` contract is inherited from the `AutomationCompatibleInterface` interface to work with Chainlink Automation.

## How to deploy?
1. Deploy and verify the `DephyOnChainlinkPoc` contract to the blockchain.
2. Create a Chainlink Functions subscription [in the web portal](https://functions.chain.link/) and add the contract as an `consumer`.
3. Upload off-chain codes to the contract using `scripts/updateRequest.js`.
4. Register the contract as an `upkeep` on the [web portal](https://automation.chain.link/) of Chainlink Automation.
5. Then it works.

## Inspiration
As we face the mounting urgency of the climate crisis, climate scientists have been vocal about the critical need for energy conservation and a decrease in carbon emissions. Our response at DePHY is to innovate within this space, using the DePHY's decentralized network to provide critical infrastructure services for DePIN devices.

Our team envisioned "Save energy with DePHY!" as a project on this Hackathon that moves beyond simply conserving energy; it aims to inspire a collective shift in behavior, motivating individuals to embrace efficiency in their everyday energy use. By introducing quantifiable and competitive challenges, we seek to create a compelling narrative where energy savings translate into meaningful action for the planet.

## What it does
Higher power factor means more efficiency, less energy will be wasted to damage our environment, we made a regularly updated leaderboard of the power factor of outlet devices which on DePHY Network where we use Chainlink Automation and Functions to roll data up from the NoStr network to the contract on EVM chains verifiably.

## How we built it
- Data of DePIN devices on DePHY are all signed and verifiable, first we roll them up to EVM [contracts](https://github.com/dephy-io/dephy-chainlink-poc/tree/dev/contract):
  - We use Chainlink Function to validate signature and writing them in contract storages
  - Since Chainlink Functions doesn't support WebSocket to interact with a NoStr relay, the off-chain codes will request data from a [proxy server](https://github.com/dephy-io/nostr-dump-worker) running on Cloudflare Worker and any other Cloud Funtion services. The proxy server will dump messages from NoStr network and upload them to IPFS, then the off-chain codes will verify them within Chainlink Functions' sandboxed JavaScript runtime.
  - Off-chain code: https://github.com/dephy-io/dephy-chainlink-poc/tree/dev/src
  - We use Chainlink Automation to make the stack running automatically
- Then we create a simple indexer to process verified data from the contract: https://github.com/dephy-io/dephy-chainlink-poc/tree/dev/indexer
- Finally we deploy the dApp frontend: https://github.com/dephy-io/dephy-chainlink-poc/tree/dev/web

## Challenges we ran into
- Chainlink Functions: the sandboxed JavaScript runtime has limitations on the size of both request body and response body, we bypassed it by moving the IPFS part to the proxy server
- Chainlink Functions: the sandboxed JavaScript runtime has limitation on the size of offchain codes.
- Chainlink Functions: The same code running on Ethereum Sepolia testnet doesn't work with on Polygon Mumbai, since there were no valid references for error returned on the chain, We had to guess what happened with the code.

## Accomplishments that we're proud of
- We made protobuf decoding and secp256k1 signatures verifying possible with Chainlink Functions' limitations.

## What we learned
- Tokenomic of Chainlink LINK
- How an oracle works with Chainlink

## What's next for Save energy with DePHY!
The road ahead for "Save energy with DePHY!" is paved with exciting possibilities to expand and enhance the platform's impact on energy conservation. Recognizing the motivational power of competition, we aim to diversify the scope of contests available on our platform. Beyond just electricity usage, we foresee the integration of a variety of verifiable sensor data that can shape an array of contests to inspire behavior that benefits both individuals and the community at large with DePHY.

As we look to the future, "Save energy with DePHY!" is committed to evolving in a manner that continues to challenge, inspire, and empower individuals to become active participants in the journey towards energy-efficient living and global sustainability.