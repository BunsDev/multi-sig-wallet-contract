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

contract('MultiSigWallet', ([alice, bob, carol, dave]) => {
    let multiSigInstance, result
    const numRequired = 2

    before(async() => {
        multiSigInstance = await MultiSigWallet.new([alice, bob, carol], numRequired)
    })

    describe('multiSigWallet deployment', async() => {
        it('has owners', async() => {
            //ensure alice's account
            const aliceAcct = await multiSigInstance.owners(0)
            assert.equal(aliceAcct, alice, 'wallet not deployed correctly')

            //ensure bob's account
            const bobAcct = await multiSigInstance.owners(1)
            assert.equal(bobAcct, bob, 'wallet not deployed correctly')

            //ensure carol's account
            const carolAcct = await multiSigInstance.owners(2)
            assert.equal(carolAcct, carol, 'wallet not deployed correctly')
        })

        it('accepts deposits', async() => {
            //check contract balance
            const contractAddress = multiSigInstance.address
            result = await web3.eth.getBalance(contractAddress)
            assert.equal(result, 0)

            //deposit eth into contract
            await multiSigInstance.sendTransaction({from: alice, value: tokens('1')})

            //check contract balance
            result = await web3.eth.getBalance(contractAddress)
            assert.equal(result.toString(), tokens('1'))
        })
    })

    describe('multiSig transaction', async() => {        
        it('submits transactions', async() => {
            const data = '0x00'
            const submit = await multiSigInstance.submitTransaction(dave, tokens('1'), data, { from: alice })

            //begin transaction submission
            submit

            //check emitted event
            truffleAssert.eventEmitted(submit, 'SubmitTransaction', (ev) => {
                return ev.owner === alice
            })

            //non-owner submission attempt should fail
            await multiSigInstance.submitTransaction(alice, tokens('1'), { from: dave }).should.be.rejected
        })

        it('confirms submitted transactions', async() => {
            //check number of confirmations
            result = await multiSigInstance.fetchConfirmations(0)
            assert.equal(result, 0)

            //alice confirmation
            await multiSigInstance.confirmTransaction(0, { from: alice })

            //check number of confirmations
            result = await multiSigInstance.fetchConfirmations(0)
            assert.equal(result, 1)

            //bob confirmation
            await multiSigInstance.confirmTransaction(0, { from: bob })

            //check number of confirmations
            result = await multiSigInstance.fetchConfirmations(0)
            assert.equal(result, 2)
        })

        it('should revoke confirmation', async() => {
            //recheck confirmations
            result = await multiSigInstance.fetchConfirmations(0)
            assert.equal(result, 2)

            //bob revokes confirmation
            await multiSigInstance.revokeConfirmation(0, { from: bob })

            //check number of confirmations subtracted correctly
            result = await multiSigInstance.fetchConfirmations(0)
            assert.equal(result, 1, 'confirmation number did not subtract correctly')
        })

        it('should not execute partially confirmed transaction', async() => {
            await multiSigInstance.executeTransaction(0, { from: alice }).should.be.rejected

            //reconfirm transaction
            await multiSigInstance.confirmTransaction(0, { from: bob })
        })

        it('should execute confirmed transaction', async() => {
            //check confirmations
            result = await multiSigInstance.fetchConfirmations(0)
            assert.equal(result, 2)

            //check recipient's initial balance
            result = await web3.eth.getBalance(dave)
            assert.equal(result, tokens('100'))

            //recheck required confirmations
            result = await multiSigInstance.numConfirmationsRequired.call()
            assert.equal(result, 2)

            //execute transaction
            await multiSigInstance.executeTransaction(0, { from: alice })

            //check recipient's updated balance
            result = await web3.eth.getBalance(dave)
            assert.equal(result, tokens('101'))
        })
    })
})