import React from 'react'
import styled from 'styled-components'
import { useWeb3Context } from '../context/Web3'
import { unlockAccount } from '../api/web3'
import useAsync from './useAsync'

const Wrapper = styled.div`
    height: 3.2rem;
    background-color: white;
    width: 100%;
    display: flex;
    align-items: center;
`;

const Container = styled.div`
    width: 100%;
    display: flex:
    justify-content: space-between;
`;

const WalletWrapper = styled.button`
    background-color: white;
    border-bottom: none;
    border-top: none;
    height: 100%;
    width: 22rem;
    margin-right: 1.25rem;
    margin-bottom: .15rem;
    border-left: 2px solid  #E8E7E6;
    border-right: 2px solid #E8E7E6;
    display: flex;
    align-items: center;
    justify-content: space-between;

    :hover {
        cursor: pointer;
    }
`;

const UserWallet = styled.div`
    font-size: .7rem;
    margin-left: 1rem;
`;


const Title = styled.div`
    padding-left: 2rem;
`;

const Box = styled.div`
    font-size: .8rem;
    height: 1.3rem;
    width: 3.5rem;
    background-color: #ECECEC;
    display: flex;
    justify-content: center;
`;

const BoxText = styled.span`
    flex-direction: row;
    align-self: center;
`;

const Arrow = styled.div`
    margin-right: 1rem;
    margin-left: 1rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
        background-color: #ECECEC;
        cursor: pointer;
    }
`;


const Div = styled.div`
    display: flex;
`;
                

export default function Header() {

    const {
        state: { account },
        updateAccount
    } = useWeb3Context()

    const { pending, error, call } = useAsync(unlockAccount)

    async function onClickConnect() {
        const { error, data } = await call(null)

        if (error) {
            console.log(error)
        }
        if (data) {
            updateAccount(data)
        }
    }

    let walletName : string = 'MetaMask'
    let address: unknown = {account}
    let addSli: string = (address as string).slice(5, 37)
    let network : string = 'Mainnet'

    return (
        <Wrapper>
            <Container>
                <Title>Multisig Wallet</Title>
            </Container>
            <WalletWrapper onClick={() => onClickConnect()}>
                <UserWallet>
                    { walletName }
                    <br/>
                    Address: { addSli }
                </UserWallet>
                <Div>
                <Box>
                    <BoxText>
                        { network }
                    </BoxText>
                </Box>
                <Arrow>
                    &#709;
                </Arrow>
                </Div>
            </WalletWrapper>
        </Wrapper>
    )
}
