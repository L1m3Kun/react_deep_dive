import React from 'react'
import { useState } from 'react'

import useEffectDebugger from './useEffectDebugger'

function Test(props: {a: string; b: number}) {
    const { a, b } = props
    useEffectDebugger('TestComponent', props)

    return (
        <>
            <div>{a}</div>
            <div>{b}</div>
        </>
    )
}

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <button onClick={() => setCount((count) => count+1)}>up</button>
            <Test a={count % 2 === 0 ? '짝수' : '홀수'} b={count} />
        </>
    )
}

export default App