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
    let multiSigInstance, testContract
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
            let result

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

        it('should revoke confirmations', async() => {
            let result

            //recheck confirmations
            result = await multiSigInstance.fetchConfirmations(0)
            assert.equal(result, 2)

            //bob revokes confirmation
            await multiSigInstance.revokeConfirmation(0, { from: bob })

            //check number of confirmations subtracted correctly
            result = await multiSigInstance.fetchConfirmations(0)
            assert.equal(result, 1, 'confirmation number did not subtract correctly')
        })
    })
})