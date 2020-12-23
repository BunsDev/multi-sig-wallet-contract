pragma solidity ^0.7.0;

contract MultiSigWallet {

    address[] owners;

    event Deposit(address _from, uint _wad);

    function submitTransaction() public {
    }

    function confirmTransaction() public {
    }

    function executeTransaction() public {
    }

    function revokeConfirmation() public {
    }

    /**
    *@notice This is the actual deposit function. It's sole purpose lies in emitting an event.
     */
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }



}