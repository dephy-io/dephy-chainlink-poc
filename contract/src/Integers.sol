// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * https://github.com/willitscale/solidity-util/blob/master/lib/Integers.sol
 * Integers Library
 *
 * In summary this is a simple library of integer functions which allow a simple
 * conversion to and from strings
 *
 * @author James Lockhart <james@n3tw0rk.co.uk>
 */
library Integers {
    function parseInt(string memory _value) public pure returns (uint256 _ret) {
        bytes memory _bytesValue = bytes(_value);
        uint256 j = 1;
        for (uint256 i = _bytesValue.length - 1; i >= 0 && i < _bytesValue.length; i--) {
            assert(uint8(_bytesValue[i]) >= 48 && uint8(_bytesValue[i]) <= 57);
            _ret += (uint8(_bytesValue[i]) - 48) * j;
            j *= 10;
        }
    }

    function toString(uint256 _base) internal pure returns (string memory) {
        bytes memory _tmp = new bytes(32);
        uint256 i;
        for (i = 0; _base > 0; i++) {
            _tmp[i] = bytes1(uint8((_base % 10) + 48));
            _base /= 10;
        }
        bytes memory _real = new bytes(i--);
        for (uint256 j = 0; j < _real.length; j++) {
            _real[j] = _tmp[i--];
        }
        return string(_real);
    }
}
