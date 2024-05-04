/*
create-react-app의 index.jsx와 유사한 역할을 하는 애플리케이션의 시작점
hydrate 포함
*/
import { hydrate } from 'react-dom'

import App from './components/App'
import { fetchTodo } from './fetch'

async function main() {
    const result = await fetchTodo()

    const app = <App todos={result} />
    const el = document.getElementById('root')

    hydrate(app, el)
}

main()