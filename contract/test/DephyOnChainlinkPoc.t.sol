// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "forge-std/Test.sol";
import {DephyOnChainlinkPoc} from "../src/DephyOnChainlinkPoc.sol";

contract DephyOnChainlinkPocTest is Test {
    DephyOnChainlinkPoc public con;

    function setUp() public {
        con = new DephyOnChainlinkPoc(0xb83E47C2bC239B3bf370bc41e1459A34b41238D0);
        con.updateRequest("return Functions.encodeString('Hello')", 1754, 500000, "fun-ethereum-sepolia-1");
    }

    function testCheckUpkeep() public {
        (bool result,) = con.checkUpkeep("");
        assertEq(result, true);
    }

    function testPerform() public {
        con.performUpkeep("");
    }
}
