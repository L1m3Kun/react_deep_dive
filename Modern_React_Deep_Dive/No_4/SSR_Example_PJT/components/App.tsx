/*
일반적으로 사용자가 만드는 리액트 애플리케이션의 시작점
todos를 props로 받는데, 이 props는 서버에서 요청하는 todos를 받는다
props.todo를 기반으로 렌더링하는 평범한 컴포넌트
*/

import { useEffect } from 'react'

import { TodoResponse } from '../fetch'

import { Todo } from './Todo'

export default function App({ todos } : { todos : Array<TodoResponse> }) {
    useEffect(() => {
        console.log('하이!') // eslint-disable-line no console
    }, [])

    return (
        <>
            <h1>나의 할 일!</h1>
            <ul>
                {todos.map((todo, index) => (
                    <Todo key={index} todo={todo} />
                ))}
            </ul>
        </>
    )
}