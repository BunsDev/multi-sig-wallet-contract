import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

import styled from 'styled-components'

const Side = styled.div`
    position: fixed;
    display: flex;
    justify-content: flex-start;
    height: 48rem;
`;

export default function Main() {

    let greeting : string = 'hello'

    return (

        <div>
            <Header />
            <Side>
                <Sidebar />
            </Side>
            { greeting }
        </div>
    )
}
