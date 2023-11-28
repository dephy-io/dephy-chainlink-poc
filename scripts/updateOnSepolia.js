const fs = require("fs");
const path = require("path");
const automatedFunctionsConsumerAbi = require("../contract/out/DephyOnChainlinkPoc.sol/DephyOnChainlinkPoc.json").abi;
//const automatedFunctionsConsumerAbi = require("../abi/automatedFunctions.json");
const ethers = require("ethers");
require("dotenv").config();

const consumerAddress = "0x71205790B17E30ebf77069C1717D1A4546244Bcb";
const subscriptionId = 1754;

const updateRequestSepolia = async () => {
    // hardcoded for Polygon Mumbai
    //    const routerAddress = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C";
    const donId = "fun-ethereum-sepolia-1";
    //    const gatewayUrls = [
    //        "https://01.functions-gateway.testnet.chain.link/",
    //        "https://02.functions-gateway.testnet.chain.link/"
    //    ];
    const explorerUrl = "https://sepolia.etherscan.io";

    // Initialize functions settings
    //    const source = "0x" + fs
    //        .readFileSync(path.resolve(__dirname, "../dist/main.js"))
    //        .toString('hex');
    const source = "0x" + fs
        .readFileSync(path.resolve(__dirname, "../dist/main.js"))
        .toString('utf-8');

//    const gasLimit = 500000;
    const gasLimit = 300000;


    // Initialize ethers signer and provider to interact with the contracts onchain
    const privateKey = process.env.PRIVATE_KEY; // fetch PRIVATE_KEYr
    if (!privateKey)
        throw new Error(
            "private key not provided - check your environment variables"
        );

    const rpcUrl = "https://eth-sepolia.g.alchemy.com/v2/Sf0kqnaEayUVWQu_D4jC_1iT7tk5DkFQ"; // fetch mumbai RPC URL

    if (!rpcUrl)
        throw new Error(`rpcUrl not provided  - check your environment variables`);

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider); // create ethers signer for signing transactions

    ///////// START SIMULATION ////////////

    //    console.log("Start simulation...");
    //
    //    const response = await simulateScript({
    //        source: source,
    //        args: args,
    //        bytesArgs: [], // bytesArgs - arguments can be encoded off-chain to bytes.
    //        secrets: secrets,
    //    });

    //    console.log("Simulation result", response);
    //    const errorString = response.errorString;
    //    if (errorString) {
    //        console.log(`❌ Error during simulation: `, errorString);
    //    } else {
    //        const returnType = ReturnType.string;
    //        const responseBytesHexstring = response.responseBytesHexstring;
    //        if (ethers.utils.arrayify(responseBytesHexstring).length > 0) {
    //            const decodedResponse = decodeResult(
    //                response.responseBytesHexstring,
    //                returnType
    //            );
    //            console.log(`✅ Decoded response to ${returnType}: `, decodedResponse);
    //        }
    //    }

    //////// MAKE REQUEST ////////

    console.log("\nMake request...");

    const automatedFunctionsConsumer = new ethers.Contract(
        consumerAddress,
        automatedFunctionsConsumerAbi,
        signer
    );

    // Update request settings
    const transaction = await automatedFunctionsConsumer.updateRequest(
        source,
        subscriptionId,
        gasLimit,
        ethers.utils.formatBytes32String(donId) // jobId is bytes32 representation of donId
    );

    // Log transaction details
    console.log(transaction)
    console.log(
        `\n✅ Automated Functions request settings updated! Transaction hash ${transaction.hash} - Check the explorer ${explorerUrl}/tx/${transaction.hash}`
    );
    console.log(await transaction.wait())
};

updateRequestSepolia().catch((e) => {
    console.error(e);
    process.exit(1);
});