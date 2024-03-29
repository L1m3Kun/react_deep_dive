import {memo, useEffect, useState} from 'react';

type Props = {
    counter:number,
};
// props의 변화 감지 가능
const Component = memo((props:Props) => {
    useEffect(() => {
        console.log('Component has been rendered!');
    });

    return <h1>{props.counter}</h1>
});

type DeeperProps = {
    counter : {
        counter:number,
    },
};

// props의 변화 감지 못함(객체에 쌓여있기 때문!) -> 메모이제이션된 컴포넌트를 반환하지 못함
// 재귀적으로 해결하려면 성능에 악영향을 끼칠 수 있다.
const DeeperComponent = memo((props: DeeperProps) => {
    useEffect(() => {
        console.log('DeeperComponent has been rendered!');
    });

    return <h1>{props.counter.counter}</h1>;
})


export default function App() {
    const [, setCounter] = useState(0);

    function handleClick() {
        setCounter((prev) => prev+1);
    };

    return (
        <div className='App'>
            <Component counter={100}/>
            <DeeperComponent counter={{counter:100}}/>
            <button onClick={handleClick}>+</button>
        </div>
    );
};