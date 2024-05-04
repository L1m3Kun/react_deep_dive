/*
App.tsx의 자식 컴포넌트로, props.todo를 받아 렌더링 하는 역할
그 외에는 일반적으로 볼 수 있는 리액트 컴포넌트와 동일한 모습을 갖추고 있음
*/
import { useState } from 'react'

import { TodoResponse } from '../fetch'

export function Todo({ todo } : { todo: TodoResponse }) {
    const { title, completed, userId, id } = todo
    const [finished, setFinished] = useState(completed)

    function handleClick() {
        setFinished((prev) => !prev)
    }

    return (
        <li>
            <span>
                ({userId}-{id}) {title} {finished ? '완료' : '미완료'}
                <button onClick={handleClick}>토글</button>
            </span>
        </li>
    )
}