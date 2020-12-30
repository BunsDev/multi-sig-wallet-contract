const { assert } = require('chai')
const { default: Web3 } = require('web3')
const truffleAssert = require('truffle-assertions')

const MultiSigWallet = artifacts.require('MultiSigWallet')
const TestContract = artifacts.require('TestContract')

require('chai')
    .use(require('chai-as-promised'))
    .should()

const tokens = (n) => {
    return web3.utils.toWei(n, 'ether')
}

contract('MultiSigDataTransfer', ([alice, bob, carol]) => {
    let multiSigInstance, testContract, result
    const numRequired = 2

    before(async() => {
        multiSigInstance = await MultiSigWallet.new([alice, bob, carol], numRequired)
        testContract = await TestContract.new()
    })

    describe('multisig data transfer', async() => {
        it('should show base data in testContract', async() => {
            result = await testContract.a.call()
            assert.equal(result, 0, 'Test variable not starting at zero')
        })

        it('should submit, confirm, and execute transaction to testContract', async() => {
            let testAddress = await testContract.address
            let abi = await testContract.fetchData()

            await multiSigInstance.sendTransaction({ from: alice, value: tokens('1') })

            //sending data to call callMeMaybe() function
            await multiSigInstance.submitTransaction(testAddress, 0, abi, { from: alice })

            //get confirmations
            await multiSigInstance.confirmTransaction(0, { from: alice })
            await multiSigInstance.confirmTransaction(0, { from: bob })

            //execute transaction
            await multiSigInstance.executeTransaction(0, { from: alice })
        })

        it('should show updated uint in testContract', async() => {
            result = await testContract.a.call()
            assert.equal(result, '732')
        })
    })


})

