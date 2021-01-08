import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    height: 6rem;
`;

const Title = styled.h1`
    display: flex;
    justify-content: center;
`;



export default function Header() {
    return (
        <Wrapper>
            <Title>
                Multi-Sig Wallet
            </Title>
        </Wrapper>
    )
}
