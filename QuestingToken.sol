// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract QuestingToken is ERC20, Ownable {
    constructor() ERC20("QuestingToken", "QTK") {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Initial supply of 1,000,000 QTK
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
