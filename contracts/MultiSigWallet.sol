pragma solidity ^0.8.0;

contract MultiSigWallet {

    address[] owners;

    mapping(address => bool) public isOwner;

    event Deposit(address _from, uint _wad);

    /**
    *@notice Arbitrary number. Maybe change?
     */
    uint constant MAX_OWNER_COUNT = 20;
    
    /**
    *@notice Necessary checks.
     */
    modifier validRequirement(uint numOfOwners, uint _required){
        require(numOfOwners <= MAX_OWNER_COUNT
        && _required <= numOfOwners
        && numOfOwners != 0
        && _required != 0
        );
    }


    /**
    *@notice The constructor of the contract.
     */
    function MultiSig(address[] memory _owners, uint _required) 
        public 
        validRequirement(owners.length, _required) 
    {
        for(uint i = 0; i <=owners.length; i++){
            require(!isOwner[_owners[i]] && _owners[i] != 0);
            isOwner[_owners[i]] = true;
        }
    } 

    /**
    *@notice Initial step in performing a transaction
     */
    function submitTransaction(address _destination, uint _value, bytes data) 
        public 
        returns(uint transactionId) 
    {
        transactionId = addTransaction(_destination, _value, _data);
        confirmTransaction(transactionId);
    }

    function confirmTransaction() public {
    }

    function executeTransaction() public {
    }

    function revokeConfirmation() public {
    }

    /**
    *@notice This is the actual deposit function for ether.
     */
    receive() external payable {
        if(msg.value > 0){
            emit Deposit(msg.sender, msg.value);
        }
    }



}