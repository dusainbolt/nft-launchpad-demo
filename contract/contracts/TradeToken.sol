// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TradeToken is ERC20 {
    constructor(string memory _name, string memory _symbol)
        ERC20(_name, _symbol)
    {
        _mint(msg.sender, 100000000 * 10**decimals());
    }

    function faucet() public {
        _mint(msg.sender, 100 * 10**decimals());
    }
}
