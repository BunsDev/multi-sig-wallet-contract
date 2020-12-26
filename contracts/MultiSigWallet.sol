pragma solidity ^0.5.16;

contract MultiSigWallet {
    
    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTransaction(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value,
        bytes data
    );
    
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);
    
    /*
    
    ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"]
    
    */
    
    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        mapping(address => bool) isConfirmed;
        uint numConfirmations;
    }
    
    Transaction[] public transactions;
    
    modifier onlyOwner() {
        require(isOwner[msg.sender]);
        _;
    }
    
    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, 'Transaction does not exist');
        _;
    }
    
    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, 'Transaction already executed');
        _;
    }
    
    modifier notConfirmed(uint _txIndex) {
        require(!transactions[_txIndex].isConfirmed[msg.sender], 'Transaction already confirmed');
        _;
    }
    
    
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public numConfirmationsRequired;
    
    constructor(address[] memory _owners, uint _numConfirmationsRequired) public {
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 && _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }
    
    function() payable external {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }
    
    function submitTransaction(address _to, uint _value, bytes memory _data) 
        public onlyOwner 
    {
        uint txIndex = transactions.length;
        
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            numConfirmations: 0
            }));
            
        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }
    
    function confirmTransaction(uint _txIndex) 
    public 
    onlyOwner
    txExists(_txIndex)
    notExecuted(_txIndex)
    notConfirmed(_txIndex)
    {
        transactions[_txIndex].numConfirmations++;
        
        emit ConfirmTransaction(msg.sender, _txIndex);
    }
    
    function executeTransaction(uint _txIndex) 
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        require(transaction.numConfirmations >= numConfirmationsRequired, 'Cannot execute transaction');
        transaction.executed = true;
        
        //double check this low level call
        (bool success, ) = transaction.to.call.value(transaction.value)(transaction.data);
        require(success, "transaction failed");
        
        emit ExecuteTransaction(msg.sender, _txIndex);
    }
    
    
    
    
}