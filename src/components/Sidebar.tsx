import React from 'react'
import styled from 'styled-components'

import question from '../assets/question.png'

const Wrapper = styled.div`
    background-color: white;
    border-top: 1px solid #E8E7E6;
    width: 12.4rem;
    height: 92%;
    display: flex;
    align-items: flex-end;
`;

const Container = styled.div`
    height: 9%;
    width: 100%;
    border-top: 2px solid #E8E7E6;
    display: flex;
    justify-content: center;
    `;

const HelpButton = styled.button`
    align-self: center;
    background-color: white;
    height: 60%;
    width: 90%;
    border-radius: 6%;
    border: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-right: 2rem;
    padding-left: .5rem;

    :hover {
        cursor: pointer;
        background-color: #ECECEC;
    }
`;

const Img = styled.img`
    height: 1.3rem;
    width: 1.3rem;
`;

export default function Sidebar() {
    return (
        <div>
            <Wrapper>
                <Container>
                    <HelpButton>
                        <Img src={ question} alt='A question mark in a circle' />
                        Help Center
                    </HelpButton>
                </Container>
            </Wrapper>
        </div>
    )
}
