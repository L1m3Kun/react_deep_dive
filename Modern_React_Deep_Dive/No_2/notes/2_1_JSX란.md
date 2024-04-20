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

    1. `JSXIdentifier`
    2. `JSXNAmespacedName`
    3. `JSXMemberExpression`
    

### JSXAttributes

### JSXChildren

### JSXStrings

## JSX 예제

## JSX는 어떻게 자바스크립트에서 변환될까?

## 정리