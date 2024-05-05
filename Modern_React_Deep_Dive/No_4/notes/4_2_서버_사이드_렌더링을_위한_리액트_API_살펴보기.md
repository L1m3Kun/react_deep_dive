# 서버 사이드 렌더링을 위한 리액트 API 살펴보기
- `window` 환경이 아닌 `Node.js`와 같은 서버 환경에서만 실행할 수 있음
- `window` 환경에서 실행 시 에러 발생할 수 있음
- 리액트 서버 사이드 렌더링을 실행할 때 사용되는 API 확인: 리액트 저장소의 `react-dom/server.js` 
- `React 18` 릴리스 이후 `react-dom/server`에 `renderToPipeableStream` 추가 및 나머지 대부분의 지원 중단 등 큰 변화
- 기존에도 있었던 기본적인 4개의 함수(`renderToString`, `renderToStaticMarkup`, `renderToNodeStream`, `hydrate`)

## renderToString
- 인수로 넘겨받은 리액트 컴포넌트를 렌더링해 HTML 문자열로 반환
- 서버 사이드 렌더링을 구현하는데 가장 기초적인 API
- **최초 페이지를 HTML로 먼저 렌더링하는데 그 역할을 하는 함수(초기 렌더링에서 뛰어난 성능)**
- 클라이언트에서 실행되는 자바스크립트 코드를 포함시키거나 렌더링하는 역할까지 해주지 않음
- 필요한 자바스크립트 코드는 여기에서 생성된 HTML과는 별도로 제공해 브라우저에 제공돼야 함
    ```tsx
    import ReactDOMServer from 'react-dom/server'

    function ChildrenComponent({ fruits }: { fruits: Array<string>} ) {
        // useEffect와 handleClick은 result에 포함되지 않음
        useEffect(() => {
            console.log(fruits)
        }, [fruits])

        function handleClick() {
            console.log('hello')
        }

        return (
            <ul>
                {fruits.map((fruit) => (
                    <li key={fruit} onClick={handleClick}>
                        {fruit}
                    </li>
                ))}
            </ul>
        )
    }

    function SampleComponent(){
        return (
            <>
                <div>hello</div>
                <ChildrenComponent fruits={['apple', 'banana', 'peach']} />
            </>
        )
    }

    const result = ReactDOMServer.renderToString(
        React.createElement('div', {id: 'root' }, <SampleComponent />),
    )
    ```
    - result 결과
    ```tsx
    // data-reactroot: 리액트 컴포넌트의 루트 엘리먼트가 무엇인지 식별하는 기준점 및 자바스크립트 실행을 위한 hydrate 함수에서 루트를 식별하는 기준
    <div id="root" data-reactroot="">
        <div>hello</div>
        <ul>
            <li>apple</li>
            <li>banana</li>
            <li>peach</li>
        </ul>
    </div>
    ```

## renderToStaticMarkup
- 블로그 글이나 상품의 약관 정보와 같이 아무런 브라우저 액션이 없는 정적인 내용만 필요한 경우에 유용
- 리액트 컴포넌트를 기준으로 HTML 문자열을 만드는 함수(`renderToString`과 매우 유사한 함수)
- 차이점: `data-reatroot`와 같은 리액트에서만 사용하는 추가적인 DOM 속성을 만들지 않는다는 점(**리액트에서만 사용하는 속성을 제거하여 HTML크기를 약간 줄일 수 있음**): **hydrate함수를 실행하지 않음**
- useEffect와 같은 브라우저 API를 절대로 실행할 수 없음
- `hydrate`(리액트의 자바스크립트 이벤트 리스너를 등록하는 역할)을 수행하면 서버 클라이언트의 내용이 맞지 않는다는 에러 발생(renderToStaticMarkup의 결과물은 hydrate를 수행하지 않는다는 가정하에 HMTL만 반환)
- `hydrate`를 수행하더라도 브라우저에서 클라이언트에 완전히 새롭게 렌더링

```tsx
// ...이하 생략(renderToString -> renderToStaticMarkup)
const result = ReactDOMServer.renderToStaticMarkup(
    React.createElement('div', {id: 'root'}, <SampleComponent>),
)
// result(data-reactroot가 사라진 완전히 순수한 HTML 문자열 반환)
<div id="root">
    <div>hello</div>
    <ul>
        <li>apple</li>
        <li>banana</li>
        <li>peach</li>
    </ul>
</div>
```

## renderToNodeStream
- `renderToString`과 결과물이 완전히 동일하지만 두 가지 차이점이 있다.
- 차이점
    1. `renderToString`, `renderToStaticMarkup`은 브라우저에서도 실행 가능하지만, `renderToNodeStream`은 브라우저에서 사용이 완전히 불가능(**Node.js환경에 의존**)
        > 에러코드 <br/>
        > ReactDOMServer.renderToNodeStream(): The streaming API is not available in the browser. Use ReactDOMServer.renderToString() instead.
    2. `renderToString`의 결과물은 `string`인 문자열이지만, `renderToNodeStream`의 결과물은 `Node.js`의 `ReadableStream`이다.
        - `ReadableStream`은 `utf-8`로 인코딩된 바이트 스트림(Node.js나 Deno, Bun 같은 서버 환경에서만 사용 가능)
- ReadableStream 자체는 브라우저에서도 사용 가능하지만, ReadableStream을 만드는 과정이 브라우저에서 실행 불가능
###  `renderToNodeStream`이 필요한 이유
> 스트림?
- 큰 데이터를 다룰 때 데이털르 청크(chunk, 작은 단위)로 분할해 조금씩 가져오는 방식

> renderToString으로 생성해야 하는 HTML이 매우 크다면?
- 큰 문자열을 한 번에 메모리에 올려두고 응답을 수행해야 해서 Node.js가 실행되는 서버에 큰 부담이 될 수 있음
- **스트림을 활용하여 청크 단위로 분리해 순차적으로 처리할 수 있다는 장점**

> 예제
```tsx
export default function App({ todos }:{ todos: Array<TodoResponse> }) {
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
```
- `todos`가 엄펑나게 많다고 가정하면,
    - renderToString은 이를 모두 한 번에 렌더링하려고 하기 때문에 시간이 많이 소요
    - renderToNodeStream으로 렌더링하면 다음과 같은 차이가 있다.
    ```tsx
    // Node.js 코드
    ;(async () => {
        const response = await fetch('http://localhost:3000')
        
        try {
            for await (const chunk of response.body) {
                console.log('------chunk------')
                console.log(Buffer.from(chunk).toString())
            }
        } catch(err) {
            console.error(err.stack)
        }
    })()
    ```
    ```
    >> node watch-stream.js

    ~/private ... react-deep-dive-example/chapter3/ssr-example main x
    + 130 ⚠
    » node watch-stream.js
    ------chunk------
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SSR Example</title>
      </head>
      <body>
    <!-- 생략 -->
    ------chunk------
    <!-- 생략 -->
    ------chunk------
    <!-- 생략 -->
    ------chunk------
    <!-- 생략 -->
    ------chunk------
    <!-- 생략 -->
        <script src="https://unpkg.com/react@17.0.2/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js"></script>
        <script src="/browser.js"></script>
      </body>
    </html>
    ```
- `renderToString`을 사용했다면 HTTP응답은 거대한 HTML 파일이 완성될 때까지 기다려야하지만 `renderToNodeStream`으로 사용했기에 HTML이 여러 청크로 분리돼 내려온다.
- 대부분 널리 알려진 리액트 서버사이드 렌더링 프레임워크는 모두 renderToString 대신 renderToNodeStream을 채택하고 있다.

## renderToStaticNodeStream
- `renderToNodeStream`과 제공하는 결과물은 동일하나, `rederToStaticMarkup`과 마찬가지로 리액트 자바스크립트에 필요한 리액트 속성이 제공되지 않는다.
- `hydrate`를 할 필요가 없는 순수 HTML 결과물이 필요할 때 사용하는 메서드

## hydrate
- `renderToString`과 `renderToNodeStream`으로 생성된 HTML 콘턴츠에 자바스크립트 핸들러나 이벤트를 붙이는 역할
- 정적으로 생성된 HTML에 이벤트 핸들러를 붙여 완전한 웹페이지 결과물을 만든다.

### 브라우저에서만 사용되는 render 메서드
```jsx
import * as ReactDOM from 'react-dom'
import App from './App'

const rootElement = document.getElementById('root')

ReactDOM.render(<App />, rootElement)
```
- render 함수는 컴포넌트와 HTML의 요소를 인수로 받아 해당 컴포넌트를 렌더링하며, 이벤트 핸들러를 붙이는 작업까지 모두 한번에 수행
- 렌더링과 이벤트 핸들러 추가 등 리액트를 기반으로 한 온전한 웹페이지를 만드는 데 필요한 모든 작업을 수행

### hydrate 역할
> 이벤트 핸들러를 정적 HTML 파일에 추가

```jsx
import * as ReactDOM from 'react-dom'
import App from './App'

// containerId를 가리키는 element는 서버에서 렌더링된 HTML의 특정 위치를 의미
const element = document.getElementById(containerId)
// 해당 element를 기준으로 리액트 이벤트 핸들러를 붙인다
ReactDOM.hydrate(<App />, element)
```
- `render`함수와 인수 넘기는 것이 유사
- 차이점: `hydrate`는 기본적으로 이미 렌더링된 HTML이 있다는 가정하에 작업이 수행되고, 렌더링된 HTML을 기준으로 이벤트를 붙이는 작업만 실행

```jsx
<!-- 리액트 정보가 없는 renderToStaticMarkup 등으로 생성된 순수한 HTML정보를 넘기면 -->
<!DOCTYPE html>
<head>
    <title>React App</title>
</head>
<body>
    <!-- root에 아무런 HTML도 없다. -->
    <div id="root"></div>
</body>
</html>
function App() {
    return <span>안녕하세요.</span>
}

import * as ReactDOM from 'react-dom'

import App from './App'

const rootElement = document.getElementById('root')

// 요소가 없어 경고 문구 출력
// Warning: Expected server HTML to contain a matching <span> in <div>
//      at span
//      at App

ReactDOM.hydrate(<App />, rootElement)
```
- rootElement 내부에는 <App />을 렌더링한 정보가 이미 포함되어야 hydrate를 실행시킬 수 있음(**두번째 인수 내부에는 renderToString 등으로 렌더링된 정적인 HTML 정보가 반드시 들어가 있어야함**)

> 렌더링을 한 번 수행하면서 hydrate가 수행한 렌더링 결과물 HTML과 인수로 넘겨받은 HTML을 비교하는 작업
- 위 예제에서 경고문구가 나는 이유
- 불일치가 발생하면 hydrate가 렌더링한 기준으로 웹페이지를 그리게 됨(올바른 사용법은 아님)
    - 두 번의 렌더링
    - 결국 서버 사이드 렌더링의 장점을 포기하는 것

- 불가피하게 결과물이 다를 수 밖에 없는 경우
    - 예시
        - HTML 내부에서 현재 시간을 초 단위까지 기록해야 하면, 서버사이드 렌더링과 hydrate가 아무리 빨리 끝난다하더라도 1초 단위로 끝나지 않는 이상 불일치가 일어날 수 밖에 없다.
        - 에러 발생
            ```jsx
            <!-- Warning: Text content did not match. Server: "167641135828" Client: "1676461137621" -->
            <div>{new Date().getTime()}</div>
            ```
    - `suppressHydrationWarning`을 추가해 경고를 끌 수 있음(**필요한 곳에만 제한적 사용**)
        ```jsx
        <!-- 에러 없음 -->
        <div suppressHydrationWarning>{new Date().getTime()}</div>
        ```

## [서버 사이드 렌더링 예제 프로젝트](../examples/ssr-example/)
- 서버 사이드 렌더링 내부 함수들이 어떻게 실행되는지 보기위한 예제이며, 실제 프로덕션에서 사용하기엔 무리가 있다.
- 직접 구현하는 것보다 Next.js같은 프레임워크를 사용하는 것이 권장된다.
- `renderToStaticMarkup`과 `renderToStaticNodeStream`에 대해선 다루지 않음(자바스크립트 이벤트 핸들러가 필요하기 때문)

### [index.tsx](../SSR_Example_PJT/index.tsx)
- 애플리케이션의 시작점
- `hydrate`가 포함
- 서버로 부터 받은 HTML을 hydrate를 통해 완성된 웹 애플리케이션으로 만드는 것
- `fetchTodo`를 호출해 필요한 데이터를 주입
- `hydrate`의 역할: 서버에서 완성한 HTML과 대상 HTML을 비교하여 동일한지 검사

### [App.tsx](../SSR_Example_PJT/components/App.tsx)
- todos를 props로 받는데 이 props는 서버에서 요청하는 todos를 받음
- 사용자가 만드는 리액트 애플리케이션의 시작점


### [Todo.tsx](../SSR_Example_PJT/components/Todo.tsx)
- App.tsx의 자식 컴포넌트, porps.todo를 받아 렌더링

### [index.html](../SSR_Example_PJT/index.html)
- 서버 사이드 렌더링을 수행할 때 기본이 되는 HTML
- 이 HTML을 기반으로 리액트 애플리케이션이 완성

> __placeholder__
- 서버에서 리액트 컴포넌트를 기반으로 만드는 HTML 코드를 삽입하는 자리(단순한 방식 처럼 보이지만 실제로 단순하지 않음)

> unpkg
- npm라이브러리를 CDN으로 제공하는 웹 서비스
- react와 react-dom을 추가해 둠
- 실제와 다르게 webpack과 같은 도구로 번들링하는 것은 생략

> browser.js
- 클라이언트 리액트 애플리케이션 코드를 번들링했을 때 제공되는 리액트 자바스크립트 코드
- __placeholder__에 먼저 리액트에서 만든 HTML이 삽입되면 이후에 이 코드가 실행되면서 필요한 자바스크립트 이벤트 핸들러가 붙음

### [server.ts](../SSR_Example_PJT/server.ts)
- 서버에서 동작하는 파일
- 사용자의 요청 주소에 따라 어떠한 리소스를 내려 줄지 결정하는 역할
- 서버 사이드 렌더링을 위해 이 파일에서 리액트 트리를 만드는 역할도 담당
> createServer
- http 모듈을 이용해 간단한 서버를 만들 수 있는 Node.js 기본 라이브러리(3000번 포트를 이용하는 http 서버를 만든다)
```jsx
// 생략...
// 이후에 다룬다

function main() {
    createServer(serverHandler).listen(PORT, () => {
        console.log(`Server has been started ${PORT}...`)   // eslint-disable-line no-console
    })
}
```

> serverHandler
- `createServer`로 넘겨주는 인수, HTTP 서버가 라우트(주소)별로 어떻게 작동할지 정의하는 함수
```tsx
async function serverHandler(req: IncomingMessage, res: ServerResponse){
    const {url} = req

    switch (url) {
        // ...

        default : {
            res.statusCode = 404
            res.end('404 Not Found')
        }
    }
}
```

> server.ts의 루트 라우터 `/`
- 사용자가 `/`로 접근했을 때 실행되는 코드
```tsx
const result = await fetchTodo()
const rootElement = createElement(
    'div',
    {id: 'root'},
    createElement(App, {todo:result}),
)

const renderRequst = renderToString(rootElement)

const htmlResult = html.replace('__placeholder__', renderResult)

res.setHeader('Content-Type', 'text/html')
res.write(htmlResult)
res.end()
return
```

> server.ts의 `/stream` 라우터
- rootElement를 만드는 과정까지는 동일
```tsx
async function serverHandler(req: IncomingMessage, res: ServerResponse) {
    const { url } = req

    switch (url) {
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
    }
}
```
>  `res.write(indexFront)`와 `res.write(indexEnd)`, 그 사이 `renderNodeStream`
1. index.html의 `__placeholder__`부분을  indexFront와 indexEnd으로 나누어 절반을 먼저 응답을 통해 기록하고 `renderToNodeStream`을 통해 나머지 부분을 스트림 형태로 생성한다.
2. 스트림을 활용했기에, `pipe`와 `res`에 걸어두고 청크가 생성될 때마다 `res`에 기록
3. 스트림이 종료되면 index.html의 나머지 반쪽을 붙여 최종 결과물을 브라우저에 제공
4. 결과물은 `renderToString`과 `renderToNodeStream`이 동일(**서버에서만 차이남**)
5. 차이를 보기 위해 실행 후 브라우저 콘솔창에 다음 코드 실행
```js
const main = async () => {
    const response = await fetch('http://localhost:3000/stream')
    const reader = response.body.getReader()

    while (true) {
        const {value, done} = await reader.read()
        const str = new TextDecoder().decode(value)
        if (done) { break}
        console.log(`=====================================`)
        console.log(str)
    }

    console.log('Response fully received')
}
main()
```

> 그 외 라우터들

```tsx
switch (url){
    // 브라우저에 제공되는 리액트 코드(웹팩이 생성)
    case '/browser.js' : {
        res.setHeader('Content-Type', 'application/javascript')
        createReadStream(`./dist/browser.js`).pipe(res)
        return
    }

    // 위 파일의 소스맵(디버깅 용도)
    case '/browser.js.map' : {
        res.setHeader('Content-Type', 'application/javascript')
        createReadStream(`./dist/browser.js.map`).pipe(res)
        return
    }
}
```

### [webpack.config.js](../SSR_Example_PJT/webpack.config.js)
- 웹팩 설정 파일
- config 배열은 각 브라우저 코드와 서버 코드 번들링하는 방식 선언
> 설정
1. `entry`를 선언해 시작점을 선언
2. 필요한 팡리과 그에 맞는 `loader` 제공
3. 번들링에서 제외할 내용을 선언 
4. `output`으로 보냄

### fetchTodo가 두번 일어나지 않나?
- 서버사이드 렌더링에만 초첨을 두어 구현했기에 해당 처리가 생략되었다
- Next.js의 경우 fetchTodo를 getServerSideProps라는 예약 함수에서 딱 한 번만 호출
- 호출 결과를 HTML에 포함시켜 HTML 파싱이 끝나면 자연스럽게 window 객체에서 접근할 수 있도록 설정

## 정리