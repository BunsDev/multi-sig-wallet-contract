const { assert } = require('chai')
const { default: Web3 } = require('web3')

const MultiSigWallet = artifacts.require('MultiSigWallet')
const TestContract = artifacts.require('TestContract')

require('chai')
    .use(require('chai-as-promised'))
    .should()

const tokens = (n) => {
    return Web3.utils.toWei(n, 'ether')
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
})