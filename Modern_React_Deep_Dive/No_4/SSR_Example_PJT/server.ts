import { createServer, IncomingMessage, ServerResponse } from 'http'
import { createReadStream } from 'fs'

import { renderToNodeStream, renderToString } from 'react-dom/server'
import { createElement } from 'react'

import html from '../pulbic/index.html'
import indexFront from '../public/index-front.html'
import indexEnd from '../public/index-end.html'

import App from './components/App'
import { fetchTodo } from './fetch'

const PORT = process.env.PORT || 3000

async function serverHandler(req: IncomingMessage, res: ServerResponse) {
    const { url } = req

    switch (url) {
        case '/': {
            const result = await fetchTodo()

            const rootElement = createElement(
                'div',
                {id: 'root'},
                createElement(App, {todos: result}),
            )
            const renderResult = renderToString(rootElement)
            
            const htmlResult = html.replace('__placeholder__', renderResult)

            res.setHeader('Content-Type', 'text/html')
            res.write(htmlResult)
            res.end()
            return
        }
        
        // renderToNodeStream을 사용한 서버 사이들 렌더링
        case '/stream' : {
            res.setHeader('Content-Type', 'text/html')
            res.write(indexFront)

            const result = await fetchTodo()
            const rootElement = createElement(
                'div',
                { id: 'root' },
                createElement(App, { todos: result })
            )

            const stream = renderToNodeStream(rootElement)
            stream.pipe(res, {end:false})
            stream.on('end', () => {
                res.write(indexEnd)
                res.end()
            })
            return            
        }

        // 브라우저에 제공되는 리액트 코드
        case '/browser.js' : {
            res.setHeader('Content-Type', 'application/javascript')
            createReadStream(`./dist/browser.js`).pipe(res)
            return
        }

        // 위 파일의 소스맵
        case '/browser.js.map' : {
            res.setHeader('Content-Type', 'application/javascript')
            createReadStream(`./dist/browser.js.map`).pipe(res)
            return
        }

        default: {
            res.statusCode = 404
            res.end('404 Not Found')
        }
    }
}

function main() {
    // 
    createServer(serverHandler).listen(PORT, () => {
        console.log(`Server has been started ${PORT}...`) // eslint-disable-line no-console
    })
}