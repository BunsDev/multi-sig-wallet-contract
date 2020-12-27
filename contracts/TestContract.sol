pragma solidity ^0.5.16;

contract TestContract{

uint public a;

function callMeMaybe(uint b) public {
    a += b;
}

function fetchData() public view returns(bytes memory){
    return abi.encodeWithSignature('callMeMaybe(uint256)', 732);
}



}