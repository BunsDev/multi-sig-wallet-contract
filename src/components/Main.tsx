import React from 'react'
import Header from './Header'

export default function Main() {

    let greeting : string = 'hello'

    return (

        <div>
            <Header />
            { greeting }
        </div>
    )
}
