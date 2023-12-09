// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {CBOR} from "@chainlink/contracts/src/v0.8/vendor/solidity-cborutils/v2.0.0/CBOR.sol";

/**
 * @title Functions contract used for Automation.
 * @notice This contract is a demonstration of using Functions and Automation.
 * @notice NOT FOR PRODUCTION USE
 */

contract DephyOnChainlinkPoc is
    FunctionsClient,
    AutomationCompatibleInterface,
    ConfirmedOwner
{
    using CBOR for CBOR.CBORBuffer;

    bytes16 private constant _SYMBOLS = "0123456789abcdef";

    uint16 public constant REQUEST_DATA_VERSION = 1;
    uint256 internal constant DEFAULT_BUFFER_SIZE = 256;

    uint256 public lastBlockNumber;
    string public source;
    uint64 public subscriptionId;
    uint32 public gasLimit;
    bytes32 public donID;
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    uint256 public s_upkeepCounter;
    uint256 public s_requestCounter;
    uint256 public s_responseCounter;

    uint256 public d_lastNostrTimestamp;
    uint256 public d_lastNostrTimestamp__before;
    bool public d_lastFailed;
    bool public requesting;

    mapping(uint256 => bytes) public proofs;

    error UnexpectedRequestID(bytes32 requestId);

    event Response(bytes32 indexed requestId, bytes response, bytes err);
    event RequestRevertedWithErrorMsg(string reason);
    event RequestRevertedWithoutErrorMsg(bytes data);
    event ResponseWritten(
        bytes32 indexed requestId,
        string cid,
        uint256 indexed targetTimestamp
    );

    constructor(
        address router
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        d_lastNostrTimestamp = 1702083600;
        d_lastNostrTimestamp__before = 0;
        d_lastFailed = false;
    }

    /**
     * @notice Checks if upkeep is needed based on the difference between the current and the last block number.
     * @dev This function checks if the current block number has incremented since the last recorded block number and returns a boolean indicating if upkeep is needed.
     * @return upkeepNeeded A boolean indicating if upkeep is needed (true if the current block number has incremented since the last recorded block number).
     * @return performData An empty bytes value since no additional data is needed for the upkeep in this implementation.
     */
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded =
            (block.number - lastBlockNumber > 0) &&
            (block.timestamp - d_lastNostrTimestamp >= 30 minutes); // Check if the current block number has incremented since the last recorded block number
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
        return (upkeepNeeded && !requesting, ""); // Return an empty bytes value for performData
    }

    function encodeRequest(uint256 toTs) public returns (bytes memory) {
        FunctionsRequest.Request memory req;
        req.codeLocation = FunctionsRequest.Location.Inline;
        req.source = source;
        req.language = FunctionsRequest.CodeLanguage.JavaScript;

        string memory from = uintToString(
            d_lastFailed ? d_lastNostrTimestamp__before : d_lastNostrTimestamp
        );
        string memory to = uintToString(toTs);
        string[] memory reqArgs = new string[](2);
        reqArgs[0] = from;
        reqArgs[1] = to;
        req.args = reqArgs;

        lastBlockNumber = block.number;
        s_upkeepCounter = s_upkeepCounter + 1;
        return encodeCBOR(req);
    }

    /**
     * @notice Send a pre-encoded CBOR request if the current block number has incremented since the last recorded block number.
     */
    function performUpkeep(bytes calldata /* performData */) external override {
        if (
            !requesting &&
            (int256(block.timestamp) - int256(d_lastNostrTimestamp) >=
                30 minutes)
        ) {
            uint256 toTs = d_lastFailed
                ? d_lastNostrTimestamp
                : (
                    (int256(block.timestamp) - int256(d_lastNostrTimestamp) >
                        30 minutes)
                        ? d_lastNostrTimestamp + 30 minutes
                        : block.timestamp
                );
            bytes memory req = encodeRequest(toTs);
            try
                i_router.sendRequest(
                    subscriptionId,
                    req,
                    FunctionsRequest.REQUEST_DATA_VERSION,
                    gasLimit,
                    donID
                )
            returns (bytes32 requestId) {
                s_lastRequestId = requestId;
                s_requestCounter = s_requestCounter + 1;
                if (d_lastFailed == false) {
                    d_lastNostrTimestamp__before = d_lastNostrTimestamp;
                }
                requesting = true;
                d_lastNostrTimestamp = toTs;
                emit RequestSent(requestId);
            } catch Error(string memory reason) {
                requesting = false;
                emit RequestRevertedWithErrorMsg(reason);
            } catch (bytes memory data) {
                requesting = false;
                emit RequestRevertedWithoutErrorMsg(data);
            }
        }
        // We don't use the performData in this example. The performData is generated by the Automation Node's call to your checkUpkeep function
    }

    /// @notice Update the request settings
    /// @dev Only callable by the owner of the contract
    /// @param _source JS code
    /// @param _subscriptionId The new subscription ID to be set
    /// @param _gasLimit The new gas limit to be set
    /// @param _donID The new job ID to be set
    function updateRequest(
        string memory _source,
        uint64 _subscriptionId,
        uint32 _gasLimit,
        bytes32 _donID
    ) external onlyOwner {
        source = _source;
        subscriptionId = _subscriptionId;
        gasLimit = _gasLimit;
        donID = _donID;
    }

    /**
     * @notice Store latest result/error
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        requesting = false;

        s_lastResponse = response;
        s_lastError = err;

        if (response.length > 0) {
            s_responseCounter = s_responseCounter + 1;
            proofs[d_lastNostrTimestamp] = response;
            d_lastFailed = false;
            emit ResponseWritten(
                requestId,
                string(response),
                d_lastNostrTimestamp
            );
        } else {
            d_lastFailed = true;
            emit Response(requestId, s_lastResponse, s_lastError);
        }
    }

    function forceSetRequesting(bool r) external onlyOwner {
        requesting = r;
    }

    function encodeCBOR(
        FunctionsRequest.Request memory self
    ) internal pure returns (bytes memory) {
        CBOR.CBORBuffer memory buffer = CBOR.create(DEFAULT_BUFFER_SIZE);

        buffer.writeString("codeLocation");
        buffer.writeUInt256(uint256(self.codeLocation));

        buffer.writeString("language");
        buffer.writeUInt256(uint256(self.language));

        buffer.writeString("source");
        buffer.writeString(self.source);

        if (self.args.length > 0) {
            buffer.writeString("args");
            buffer.startArray();
            for (uint256 i = 0; i < self.args.length; ++i) {
                buffer.writeString(self.args[i]);
            }
            buffer.endSequence();
        }

        if (self.encryptedSecretsReference.length > 0) {
            if (self.secretsLocation == FunctionsRequest.Location.Inline) {
                revert FunctionsRequest.NoInlineSecrets();
            }
            buffer.writeString("secretsLocation");
            buffer.writeUInt256(uint256(self.secretsLocation));
            buffer.writeString("secrets");
            buffer.writeBytes(self.encryptedSecretsReference);
        }

        if (self.bytesArgs.length > 0) {
            buffer.writeString("bytesArgs");
            buffer.startArray();
            for (uint256 i = 0; i < self.bytesArgs.length; ++i) {
                buffer.writeBytes(self.bytesArgs[i]);
            }
            buffer.endSequence();
        }

        return buffer.buf.buf;
    }

    function uintToString(uint256 value) internal pure returns (string memory) {
        unchecked {
            uint256 length = log10(value) + 1;
            string memory buffer = new string(length);
            uint256 ptr;
            /// @solidity memory-safe-assembly
            assembly {
                ptr := add(buffer, add(32, length))
            }
            while (true) {
                ptr--;
                /// @solidity memory-safe-assembly
                assembly {
                    mstore8(ptr, byte(mod(value, 10), _SYMBOLS))
                }
                value /= 10;
                if (value == 0) break;
            }
            return buffer;
        }
    }

    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }
}
