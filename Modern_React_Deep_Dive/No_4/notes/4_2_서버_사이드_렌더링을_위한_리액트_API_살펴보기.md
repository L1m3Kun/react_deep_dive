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

## 서버 사이드 렌더링 예제 프로젝트
- 서버 사이드 렌더링 내부 함수들이 어떻게 실행되는지 보기위한 예제이며, 실제 프로덕션에서 사용하기엔 무리가 있다.
- 직접 구현하는 것보다 Next.js같은 프레임워크를 사용하는 것이 권장된다.
- `renderToStaticMarkup`과 `renderToStaticNodeStream`에 대해선 다루지 않음(자바스크립트 이벤트 핸들러가 필요하기 때문)


## 정리