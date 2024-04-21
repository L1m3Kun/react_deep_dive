# JSX란
- JSX는 리액트에 종속적이지 않은 독자적인 문법(주로 리액트에서 사용)
- 설계목적
    - 다양한 트랜스파일러에서 다양한 속성을 가진 트리 구조를 토큰화해 ECMAScript로 변환
- JSX는 HTML, XML 외에도 다른 구문으로도 확장될 수 있게끔 고려돼 있으며 최대한 구문을 간결하고 친숙하게 작성할 수 있도록 설계

## JSX의 정의
- `JSXElement`, `JSXAttributes`, `JSXChildren`, `JSXStrings` 컴포넌트 기반으로 구성

### JSXElement
- JSX를 구성하는 가장 기본 요소(HTML 요소와 비슷)

#### 형태
- `JSXOpeningElement`: 일반적으로 볼 수 있는 요소, `JSXClosingElement`가 동일한 요소로 같은 단계에서 선언돼 있어야 올바른 JSX 문법
- `JSXClosingElement`: `JSXOpeningElement`가 종료됐음을 알리는 요소, `JSXOpeningElement`와 쌍으로 사용되어야 함
    - ex) <JSXElement JSXAttributes(optional)> </JSXElement>
- `JSXSelfClosingElement`: 요소가 시작되고, 스스로 종료되는 형태, 자식을 포함할 수 없다. (`<script/>` 와 비슷한 형태)
    - ex) <JSXElement JSXAttributes(optional) />
- `JSXFragment`: 아무런 요소가 없는 형태, `JSXClosingElement` 형태를 띨 수 없다. O :<> </> / X: </>
    - ex) <> JSXChildren(optional) </>

#### 부록
- 리액트에서는 컴포넌트를 만들 때 반드시 대문자로 사용해야하는데 이는 HTML태그명과 구분하기 위해서이다.

#### JSXElementName
- JSXElement의 요소 이름으로 쓸 수 있는 것

    1. `JSXIdentifier` : JSX 내부에서 사용할 수 있는 식별자, 자바스크립트 식별자 규칙과 동일(`$`, `_` 만 가능)
        ```jsx
        // 가능
        function Valid1(){
            return <$></$>
        }
        function Valid2(){
            return <_></_>
        }

        // 불가능
        function Invalid1(){
            return <1></1>
        }
        ```

    2. `JSXNAmespacedName` : `JSXIdentifier`:`JSXIdentifier`의 조합, `:`을 통해 서로 다른 식별자를 이어주는 것도 하나의 식별자로 취급, 여러 개 불가능
        ```jsx
        // 가능
        function Valid1(){
            return <foo:bar></foo:bar>
        }
        

        // 불가능
        function Invalid1(){
            return <foo:bar:baz></foo:bar:baz>
        }
        ```
    3. `JSXMemberExpression` : `JSXIdentifier`.`JSXIdentifier`의 조합, `.`을 통해 서로 다른 식별자를 이어주는 것도 하나의 식별자로 취급, 여러 개 가능
        ```jsx
        // 가능
        function Valid1(){
            return <foo.bar></foo.bar>
        }
        
        function Valid2(){
            return <foo.bar.baz></foo.bar.baz>
        }

        // 불가능
        function Invalid1(){
            return <foo:bar.baz></foo:bar.baz>
        }
        ```
    

### JSXAttributes
- `JSXElement`에 부여할 수 있는 속성을 의미, 단순히 속성을 의미하기 때문에 모든 경우에서 필수값이 아니며, 존재하지 않아도 에러가 나지 않음.

    1. `JSXSpreadAttributes`: 자바스크립트의 전개 연산자와 동일한 역할
        - `{...AssignmentExpression}`: 단순히 객체뿐만 아니라 자바스크립트에서 AssignmentExpression으로 취급되는 모든 표현식이 존재할 수 있음(조건문 표현식, 화살표 함수, 할당식 등)
    2. `JSXAttribute`: 속성을 나타내는 키와 값으로 짝을 이루어서 표기(키: `JSXAttributeName`, 값: `JSXAttributeValue`)
        - `JSXAttributeName`: 속성의 키 값, `JSXElementName`에서 언급했던 `JSXIdentifier`와 `JSXNameSpacedName`이 가능, `:`를 이용해 키를 나타낼 수 있음
            ```jsx
            function valid1(){
                return <foo.bar foo:bar="baz"></foo.bar>
            }
            ```
        - `JSXAttributeValue`: 속성의 키에 할당할 수 있는 값, 다음 중 하나를 만족해야한다.
            1. **"큰따옴표로 구성된 문자열"**: 자바스크립트의 문자열과 동일, 안에 아무런 내용이 없어도 됌
            2. **'작은따옴표로 구성된 문자열'**: 자바스크립트의 문자열과 동일, 안에 아무런 내용이 없어도 됌
            3. **{ AssignmentExpression }**: 자바스크립트에서 값을 할당할 때 쓰는 AssignmentExpression을 의미, 자바스크립트에서 변수에 값을 넣을 수 있는 표현식은 JSX 속성의 값으로도 가능
            4. **`JSXElement`**: 값으로 다른 JSX 요소가 들어갈 수 있음(잘 안 쓰임)
                ```jsx
                function Child({ attribute }){
                    return <div>{attribute}</div>
                }

                export default function App(){
                    return <div>
                        <Child attribute=<div>hello</div> />
                    </div>
                }
                ```

### JSXChildren
- JSXElement의 자식 값을 나타냄
    - JSXChild: JSXChildren을 이루는 기본 단위, JSXChildren은 JSXChild를 0개 이상 가질 수 있음(없어도 상관없음)
      - `JSXText`: `{`,`<`,`>`,`}`을 제외한 문자열(다른 JSX 문법과의 혼동을 줄이기 위함)
        ```jsx
            function vaild(){
                // 다시 문자열로 표현하면 사용 가능
                return <>{'{} <>'}</>
            }
        ```
      - `JSXElement`: 값으로 다른 JSX 요소가 들어갈 수 있음
      - `JSXFragment`: 값으로 빈 JSX 요소인 `<></>`가 들어갈 수 있음
      - `{ JSXChildExpression (optional) }`: 자바스크립트의 AssignmentExpression을 의미
        ```jsx
        // 이 함수를 리액트에서 렌더링하면 "foo"라는 문자열이 출력
        export default function App() {
            return <>{(() => 'foo')()}</>
        }
        ```

### JSXStrings
- HTML에서 사용 가능한 문자열은 모두 JSXString에서도 가능, HTML의 내용을 손쉽게 JSX로 가져올 수 있도록 의도적으로 설계(문자열: "", '', JSXText)
- 예외: `\`로 시작하는 이스케이프 문자 형태소(자바스크립트에서 특수문자를 처리할 때 사용되어 몇 가지 제약 사항을 가짐(`\` -> `\\`))
    ```jsx
    <!-- \을 사용하는데 문제가 없음-->
    <button>\</button>

    // Uncaught SyntaxError: Invalid or unexpected token
    let escape1 = "\"

    // ok
    let escape2 = "\\"
    ```
## JSX 예제
```jsx
// 유효한 형태의 JSX
// 하나의 요소로 구성된 가장 단순한 형태
const ComponentA = <A>안녕하세요.</A>

// 자식이 없이 SelfClosingTag로 닫혀 있는 형태도 가능
const ComponentB = <A />

// 옵션을 { }와 전개 연산자로 넣을 수 있음
const ComponentC = <A {...{ required: true }} />

// 속성만 넣어도 가능
const ComponentD = <A required />

// 속성과 속성값을 넣을 수 있음
const ComponentE = <A required={false} />

const ComponentF = (
    <A>
        {/* 문자열은 콘따옴표 및 작은따옴표 모두 가능 */}
        <B text="리액트" />
    </A>
)

const ComponentG = (
    <A>
        {/* 옵션의 값으로 JSXElement를 넣는 것 또한 올바른 문법임 */}
        <B optionalChildren={<>안녕하세요.</>} />
    </A>
)

const ComponentH = (
    <A>
        {/* 여러 개의 자식도 포함할 수 있음 */}
        안녕하세요
        <B text="리액트" />
    </A>
)

// JSX 문법 자체로는 유효하지만 리액트 내에서는 유효하지 않거나 사용되지 않는 문법
function CompoA() {
    return <A.B></A.B>
}

function CompoB() {
    return <A.B.C></A.B.C>
}

function CompoC() {
    <A:B.C></A:B.C>
}

function CompoD() {
    <$></$>
}

function CompoE() {
    <_></_>
}

```
## JSX는 어떻게 자바스크립트에서 변환될까?
- `@babel/plugin-transform-react-jsx` 플러그인을 통해 JSX가 JS로 변환

```jsx
// 변환 되기 전 JSX 파일
const ComponentA = <A required={true}>Hello World</A>

const ComponentB = <>Hello World</>

const ComponentC = (
    <div>
        <span>hello world</span>
    </div>
)
```

```js
// 변환 후
// React 17, babel 7.9.0 이전
'use strict'

var ComponentA = React.createElement(
    A,
    {
        required: true,
    },
    'Hello World',
)
var ComponentB = React.creactElement(React.Fragment, null, 'Hello World')
var ComponentC = React.createElement(
    'div',
    null,
    React.createElement('span', null, 'hello world')
)

// React 17, babel 7.9.0 이후
'use strict'

var _jsxRuntime = require('custom-jsx-library/jsx-runtime')

var ComponentA = (0, _jsxRuntime.jsx)(
    A,
    {required: true,
    children:'Hello World',
})

var ComponentB = (0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, 
{children: 'Hello World',})

var ComponentC = (0, _jsxRuntime.jsx)(
    'div',
    {
        children: (0, _jsxRuntime.jsx)('span',{
            children: 'hello world'
        }),
    })

```
### 공통점
- JSXElement를 첫 번째 인수로 선언해 요소를 정의
- 옵셔널인 JSXChildren, JSXAttributes, JSXStrings는 이후 인수로 넘겨주어 처리

### 장점
- 경우에 따라 다른 JSXElement를 렌더링해야 할 때 굳이 요소 전체를 감싸지 않더라도 처리할 수 있음
- ex) JSXElement만 다르고 JSXAttributes와 JSXChildren이 같을 때 중복코드 최소화 가능

```jsx
import {createElement, PropsWithChildren } from 'react'

// ❌ props 여부에 따라 children 요소만 달라지는 경우
// 굳이 번거롭게 전체 내용을 삼항 연산자로 처리할 필요가 없음
// 불필요한 코드 중복
function TextOrHeading({
    isHeading,
    children,
}: PropsWithChildren<{ isHeading: boolean }>) {
    return isHeading? (
        <h1 className="text">{children}</h1>
    ) : (
        <span className="text">{children}</span>
    )
}

// ⭕ JSX가 변환되는 특성을 활용하여 간결하게 처리
import { crateElement } from 'react'

function TextOrHeading({
    isHeading,
    children,
}: PropsWithChildren<{ isHeading: boolean }>) {
    return createElement(
        isHeading ? 'hi' : 'span',
        { className : 'text'},
        children,
    )
}
```

## 정리
### JSX의 정의
- `JSXElement`, `JSXAttributes`, `JSXChildren`, `JSXStrings` 컴포넌트 기반으로 구성

- `JSXElement`

    |구분|표현|비고|
    |:---:|:---:|:---:|
    |JSXOpeningElement|<JSXElement>|JSXClosingElement 와 함께 사용|
    |JSXClosingElement|</JSXElement>|JSXOpeningElement 와 함께 사용|
    |JSXSelfClosingElement|<JSXElement JSXAttributes(optional) />|자식을 포함할 수 없음|
    |JSXFragment|<> JSXChildren(optional) </>|요소가 없음|

- `JSXAttributes`

    |구분|설명||
    |:---:|:---:|:---:|
    |JSXSpreadAttributes|조건문 표현식, 화살표 함수, 할당식 등 JS에서 취급되는 모든 표현식을 전개 연산자와 동일하게 사용 가능|
    |JSXAttribute|key:JSXAttributeName|<foo **foo:bar**="baz"></foo>|
    ||value: JSXAttributeValue|문자열 형태|

- `JSXChildren`
  - JSXElement의 자식 값을 나타냄
  - `JSXChild`: JSXChildren을 이루는 기본 단위, JSXChildren은 JSXChild를 0개 이상 가질 수 있음(없어도 상관없음)

- `JSXStrings`
  - HTML에서 사용 가능한 문자열은 모두 JSXString에서도 가능, HTML의 내용을 손쉽게 JSX로 가져올 수 있도록 의도적으로 설계(문자열: "", '', JSXText)
  - 예외: `\`로 시작하는 이스케이프 문자 형태소(자바스크립트에서 특수문자를 처리할 때 사용되어 몇 가지 제약 사항을 가짐(`\` -> `\\`))

### JSX는 어떻게 자바스크립트에서 변환될까

- [직접해보기 예제](../2_1_JSX_변환_직접_해보기.js)
- 활용
    ```jsx
    import {createElement, PropsWithChildren } from 'react'

    // ❌ props 여부에 따라 children 요소만 달라지는 경우
    // 굳이 번거롭게 전체 내용을 삼항 연산자로 처리할 필요가 없음
    // 불필요한 코드 중복
    function TextOrHeading({
        isHeading,
        children,
    }: PropsWithChildren<{ isHeading: boolean }>) {
        return isHeading? (
            <h1 className="text">{children}</h1>
        ) : (
            <span className="text">{children}</span>
        )
    }

    // ⭕ JSX가 변환되는 특성을 활용하여 간결하게 처리
    import { crateElement } from 'react'

    function TextOrHeading({
        isHeading,
        children,
    }: PropsWithChildren<{ isHeading: boolean }>) {
        return createElement(
            isHeading ? 'hi' : 'span',
            { className : 'text'},
            children,
        )
    }
    ```
