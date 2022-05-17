//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is Ownable {
  
  bytes32 private password;

  constructor (bytes32 _password) {
    password = _password;
  }

  modifier validPassword(bytes32 _word) {
    require(password == _word, "Invalid Password");
    _;
  }

  function deposit() external payable onlyOwner {
    
  }

  function widthdraw(bytes32 thepassword) external validPassword(thepassword) {
    payable(msg.sender).transfer(address(this).balance);
  }
}