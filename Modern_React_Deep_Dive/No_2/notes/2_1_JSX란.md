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

### JSXStrings

## JSX 예제

## JSX는 어떻게 자바스크립트에서 변환될까?

## 정리