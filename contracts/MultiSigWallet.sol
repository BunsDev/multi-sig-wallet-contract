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
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);
    
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
        public payable onlyOwner 
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
        Transaction storage transaction = transactions[_txIndex];

        transaction.isConfirmed[msg.sender] = true;
        transaction.numConfirmations++;
        
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

    function revokeConfirmation(uint _txIndex) 
        public 
        onlyOwner 
        txExists(_txIndex) 
        notExecuted(_txIndex) 
    {
        Transaction storage transaction = transactions[_txIndex];
        
        require(transaction.isConfirmed[msg.sender], 'Transaction not confirmed');
        
        transaction.isConfirmed[msg.sender] = false;
        transaction.numConfirmations--;
        
        emit RevokeConfirmation(msg.sender, _txIndex);
    }
    
    //confirmation getter for testing
    function fetchConfirmations(uint _txIndex) public view returns(uint){
        Transaction storage transaction = transactions[_txIndex];
        uint conf = transaction.numConfirmations;
        return conf;
    }
    
    
    
}