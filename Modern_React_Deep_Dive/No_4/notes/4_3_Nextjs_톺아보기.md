# Next.js 톺아보기
- 직접 리액트 서버 사이드 렌더링 애플리케이션을 만드는건 미친 짓이다. 그러니 이미 있는걸 사용하자(공식 문서에도 추천하지 않는 방법이다.)

## Next.js란?

> Next.js
- Vercel(미국 스타트업)에서 만든 풀스택 웹 애플리케이션을 구축하기 위한 **리액트 기반 프레임워크**
- 리액트 서버 사이드 렌더링의 대명사(Remix나 Hydrogen에 비해 사용자 층이 두껍고, 오래됨)

> 유사 프로젝트: `react-page`
- 페이지를 서버 또는 클라이언트에서 리액트를 손쉽게 사용할 수 있는 것을 목표로 만들어진 프로젝트
- `react-page-middlewares`를 보면 실제로 서버에서 렌더링이 가능하도록 코드를 작성
- 지금은 중단됨, `Next.js`가 영감을 받음
- Next.js의 페이지 구조, 즉 실제 디렉터리 구조가 곧 URL로 변환되는 것은 react-page에서 이미 라우팅을 위해 구현해 놓은 기능으로 Next.js에서도 동일하게 디렉터리 기반 라우팅을 서비스

> Next.js 선택이 합리적인 이유
- 다른 프레임워크에 비해 사용자 층이 많음
- 모기업인 Vercel의 전폭적인 지원을 받을 수 있음
- SWR, SWC, Turbopack, Svelte 등 웹 생태계 전반에 영향력 있는 프로젝트를 계속해서 개발하거나 인수
- 꾸준히 새로운 기능을 추가해 릴리스 중

![Next.js의 앞도적인 사용](../source/images/nextjs_usages.png)

## Next.js 시작하기
- `create-next-app`을 제공(`create-react-app`과 유사)

> 시작(`create-next-app`)

```bash
npx create-next-app@latest --ts
```

### 파일 살펴보기

> [package.json](../examples/next-example/package.json)
- npm 프로젝트를 살펴볼 때는 `package.json`을 먼저 봐야함
- **프로젝트 구동에 필요한 모든 명령어 및 의존성이 포함되어 있음**
- **프로젝트의 대략적인 모습을 확인하는데 매우 유용**

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix",
    "prettier": "prettier . --write"
  },
  "dependencies": {
    "@next/font": "13.1.6",
    "@types/node": "18.13.0",
    "@types/react": "18.0.28",
    "@types/react-dom": "18.0.11",
    "next": "13.1.6",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "4.9.5"
  },
  "devDependencies": {
    "@titicaca/eslint-config-triple": "^5.0.0",
    "@titicaca/prettier-config-triple": "^1.0.2",
    "eslint": "^8.38.0",
    "eslint-config-next": "13.1.6",
    "prettier": "^2.8.7"
  }
}
```
- 의존성(`dependencies`)
    - `next`: Next.js의 기반이 되는 패키지
    - `eslint-config-next`: Next,js 기반 프로젝트에서 사용하도록 만들어진 ESLint 설정, Next.js 기반 프로젝트라면 꼭 사용하는 것을 추천(eslint-config-airbnb 같은 기존 사용 규칙이 있다면 추가하여 함께 사용하는 것을 추천)

> [next.config.js](../examples/next-example/next.config.js)
- Next.js 프로젝트의 환경 설정을 담당
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```
- `@type` : 자바스크립트 파일에 타입스크립트의 타입도움을 위한 코드, next의 NextConfig를 기준으로 타입의 도움을 받을 수 있다.
- `reactStrictMode`: 리액트의 엄격 모드와 관련된 옵션, 리액트 애플리케이션 내부 잠재적인 문제를 개발자에게 알리기 위한 도구(특별한 이유가 없다면 켜두자)
- `swcMinify`: Vecel에서는 `SWC`라 불리는 또 다른 오픈소스를 만듦(번들링과 컴파일을 더욱 빠르게 수행하기 위해), 바벨의 대안이라고 볼 수 있으며, 국내 개발자 강동윤님이 만든 프로젝트(Vercel에 합류해 Next,js에 포함)
    - 바벨보다 `SWC`가 빠른 이유
        1. 자바스크립트 기반의 바벨과는 다르게 러스트(Rust)라는 완전이 다른 언어로 작성(C/C++과 비슷한 속도)
        2. 병렬로 작업을 처리
- [공식 홈페이지](https://nextjs.org/docs/api-reference/next.config.js/introduction)
- [자세한 설정](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/config-shared.ts)

> [pages/_app.tsx](../examples/next-example/src/pages/_app.tsx)
- Next.js에서 제공하는 예약어로 관리하는 페이지
- `pages/`가 경우에 따라 `src/`하단에 존재할 수도 있음(`src/` 혹은 프로젝트 루트에 있어도 동일하게 작동)
- 애플리케이션 페이지 전체를 초기화하는 곳
```tsx
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```
- `default export`로 내보낸 함수는 애플리케이션 전체 페이지의 시작점
- `_app.tsx`에서 할 수 있는 내용
    - 에러 바운더리를 사용해 애플리케이션 전역에서 발생하는 에러 처리
    - `reset.css` 같은 전역 CSS 선언
    - 모든 페이지에 공통으로 사용 또는 제공해야 하는 데이터 제공
- `render()` 내부에 `console.log()` 사용하면 브라우저 콘솔창이 아닌 Next.js를 실행한 터미널에 기록, 페이지 전환 시 서버에 로깅되지 않고, 브라우저에 로깅(최초: 서버 사이드 렌더링/ 이후: 클라이언트 사이드 렌더링)

> [pages/_document.tsx](../examples/next-example/src/pages/_document.tsx)
- Next.js에서 제공하는 예약어로 관리하는 페이지
- `_document.tsx`가 없어도 실행에 지장 없음(최초 `create-next-app` 실행 시 없는 파일)
- 몇 가지 시나리오에서 유용한 도움을 주는 파일
- 애플리케이션의 HTML을 초기화 하는 곳

```tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```
- `_app.tsx`와의 차이점
    - `<html>`이나 `<body>`에 DOM 속성을 추가하고 싶다면 `_document.tsx`를 사용
    - `_app.tsx`는 렌더링이나 라우팅에 따라 서버나 클라이언트에서 실행할 수 있지만, `_document.tsx`는 무조건 서버에서 실행된다.(`onClick`과 같은 이벤트 핸들러 추가 불가능 - hydrate의 몫)
    - Next.js에 존자해는 두 가지 `<head>`
        1. `next/document`에서 제공하는 `head`
            - 오직 `_document.tsx`에서만 사용 가능
            - `<title/>` 사용 불가능(`@next/next/no-title-in-document-head` 경고 발생)
            - 서버에서 사용 가능한 데이터 불러오기 함수 사용 불가(`getServerSideProps`, `getStaticProps` 등)
            - `CSS-in-JS`의 스타일을 서버에서 모아 HTML로 제공
        2. `next/head`에서 기본적으로 제공하는 `head`
            - 페이지에서 사용가능
            - SEO(검색 엔진 최적화)에 필요하나 정보나 title 등을 담을 수 있음
    - `_app.tsx`: Next.js를 초기화하는 파일, Next.js 설정과 관련된 코드를 모아두는 곳
    - `_document.tsx`: **Next.js로 만드는 웹사이트의 뼈대가 되는 HTML 설정과 관련된 코드를 추가하는 곳(반드시 서버에서만 렌더링)**
- 웹 애플리케이션에 공통적인 제목 필요: `_app.tsx`
- 페이지별 제목 필요: 페이지 파일 내부에서 2번 사용

> [pages/_error.tsx](../examples/next-example/src/pages/_error.tsx)
- Next.js에서 제공하는 예약어로 관리하는 페이지
- `create-next-app`이 기본적으로 생성해 주는 파일이 아님(없더라도 실행에 지장 없음)
```tsx
import { NextPageContext } from 'next'

function Error({ statusCode }: { statusCode: number }) {
  return (
    <>
      {statusCode ? `서버에서 ${statusCode}` : '클라이언트에서'} 에러가
      발생했습니다.
    </>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : ''
  return { statusCode }
}

export default Error
```
- 클라이언트에서 발생하는 에러 또는 서버에서 발생하는 `500`에러를 처리할 목적
- Next.js 프로젝트 전역 에러 처리 파일
- **개발 모드에서는 이 페이지에 방문할 수 없고, 에러가 발생하면 Next.js가 제공하는 개발자 에러 팝업(프로덕션으로 빌드해서 확인)**

> [pages/404.tsx](../examples/next-example/src/pages/404.tsx)
- Next.js에서 제공하는 예약어로 관리하는 페이지
- `404`페이지 정의할 수 있는 파일(커스텀 가능)
- 없으면 Next.js 기본 404 페이지 제공
```tsx
import { useCallback } from 'react'

export default function My404Page() {
  const handleClick = useCallback(() => {
    console.log('hi') // eslint-disable-line no-console
  }, [])
  return (
    <h1>
      페이지를 찾을 수 없습니다. <button onClick={handleClick}>클릭</button>
    </h1>
  )
}
```

> [pages/500.tsx](../examples/next-example/src/pages/500.tsx)
- Next.js에서 제공하는 예약어로 관리하는 페이지
- 서버에서 발생하는 에러 핸들링 페이지
- `_error.tsx`와 `500.tsx`가 모두 있다면 `500.tsx`가 우선적으로 실행(없으면 기본 페이지 제공, 커스텀 하는 파일)
```tsx
import { useCallback } from 'react'

export default function My500Page() {
  const handleClick = useCallback(() => {
    console.log('hi') // eslint-disable-line no-console
  }, [])

  return (
    <h1>
      (500페이지) 서버에서 에러가 발생했습니다.{' '}
      <button onClick={handleClick}>클릭</button>
    </h1>
  )
}
```

> [pages/index.tsx](../examples/next-example/src/pages/index.tsx)
- 개발자가 자유롭게 명칭할 수 있는 페이지
- `react-page`에서 영감을 받아 라우팅 명이 파일명으로 이어지는 구조가 현재 Next.js까지 이어진다
- `/pages`디렉터리를 기초로 구성, 각 페이지에 있는 `default export`로 내보낸 함수가 해당 페이지의 루트 컴포넌트
```tsx
import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <ul>
      <li>
        {/* next의 eslint 룰을 잠시 끄기 위해 추가했다. */}
        {/* eslint-disable-next-line */}
        <a href="/hello">A 태그로 이동</a>
      </li>
      <li>
        {/* 차이를 극적으로 보여주기 위해 해당 페이지의 리소스를 미리 가져오는 prefetch를 잠시 꺼두었다. */}
        <Link prefetch={false} href="/hello">
          next/link로 이동
        </Link>
      </li>
    </ul>
  )
}

export default Home
```
- 예제 프로젝트의 구성 정리
    - `/pages/index.tsx` : 웹사이트의 루트, `localhost:3000`과 같은 루트 주소를 의미
    - `/pages/hello.tsx` : `/pages`가 생략되고, 파일명이 주소가 된다. (`localhost:3000/hello`로 접근 가능)
    - `/pages/hello/world.tsx` : 디렉터리 깊이만큼 주소를 설정할 수 있음(`localhost:3000/hello/world`로 접근 가능), `/pages/hello/index.tsx`은 ``/pages/hello.tsx`와 같은 주소
    - `/pages/hello/[greeting].tsx` : `[]`의 의미는 여기에 어떠한 문자도 올 수 있다라는 뜻
        - 서버 사이드에서 greeting이라는 변수에 사용자가 접속한 주소명이 오게 된다.
        - `localhost:3000/hello/1`, `localhost:3000/hello/greeting`모두 유효하며 `localhost:3000/hello/[greeting].tsx`로 접근, 만약 이미 정의된 주소가 있다면 정의해 둔 주소가 우선순위를 갖는다.
    - `/pages/hi/[...props].tsx` : `/hi`를 제외한 `/hi` 모든 주소가 여기로 접근, `[...props]`값은 `props`라는 변수에 배열로 오게 된다. 
    
> [[]의 변수로 지정된 값 사용법](../examples/next-example/src/pages/hi/[...props].tsx)
- 주의할 점
    - 숫자를 넘겨도 형변환되지 않음
    - 하나의 주소가 들어가도 배열 형태를 유지
```tsx
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { NextPageContext } from 'next'

export default function HiAll({ props: serverProps }: { props: string[] }) {
    // 클라이언트에서 값을 가져오는 법
  const {
    query: { props },
  } = useRouter()

  useEffect(() => {
    /* eslint-disable no-console */
    console.log(props)
    console.log(JSON.stringify(props) === JSON.stringify(serverProps)) // true
    /* eslint-enable no-console */
  }, [props, serverProps])

  return (
    <>
      hi{' '}
      <ul>
        {serverProps.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  )
}

export const getServerSideProps = (context: NextPageContext) => {
    // 서버에서 값을 가져오는 법
  const {
    query: { props },
  } = context

  return {
    props: {
      props,
    },
  }
}
```

> [/pages/api/hello.ts](../examples/next-example/src/pages/api/hello.ts)
- 서버의 API를 정의하는 폴더
- 기본적인 디렉터리에 따른 라우팅 구조는 페이지와 동일하되, `/pages/api`가 `/api`라는 접두사가 붙는다는 점만 다름
- `/pages/api/hello`는 다른 페이지 파일과 다르게 HTML요청이 아닌 단순히 서버 요청을 주고 받음

```ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({ name: 'John Doe' })
}
```
- `default export`로 내보낸 함수가 실행
- 오직 서버에서만 실행
- `window`나 `document` 등 브라우저에서만 접근할 수 있는 코드를 작성하면 에러가 발생
- 서버에서 내려주는 데이터를 BFF(backend-for-frontend) 형태로 활용하거나 완전한 풀스택 애플리케이션을 구축하고 싶을 때 혹은 CORS(Cross-Origin Resource Sharing) 문제를 우회하기 위해 사용 가능


### 서버 라우팅과 클라이언트 라우팅의 차이
- Next.js는 서버 사이드 렌더링을 수행하지만 동시에 싱글 페이지 애플리케이션과 같이 클라이언트 라우팅 또한 수행(모두 사용)
- [예제](../examples/next-example/src/pages/hello.tsx)
> 서버 라우팅(`<a/>` 사용)

![a 태그를 사용한 라우팅 요청 리소스](../source/images/a_tag_routing_resource.png)

- 네트워크에는 `hello`라는 이름의 문서를 요청, 이후에는 `webpack`, `framework`, `main`, `hello` 등 페이지를 만드는 데 필요한 모든 리소스를 처음부터 가져옴
- `console.log()`도 서버와 클라이언트에 각각 동시에 기록
- **서버에서 렌더링 수행 후 클라이언트에서 `hydrate` 과정에서 한 번 더 실행**



> 클라이언트 라우팅(`Link 태그 사용(next/Link에서 가져와서 사용)`)

![Link 태그 사용](../source/images/link_tag_routing_resource.png)
- `hello.js`만 요청
- `hello.js` : `hello` 페이지를 위한 자바스크립트, 클라이언트에서 필요한 자바스크립트만 불러온 뒤 라우팅하는 클라이언트 라우팅/렌더링 방식으로 동작


> Next.js 장점 적극 살리기 위한 규칙
- `<a>` 대신 `<Link>`를 사용
- `window.location.push` 대신 `router.push`를 사용 

### 페이지에서 getServerSideProps를 제거하면 어떻게 될까?
- 어떠한 방식으로 접근해도 `<a/>`, `<Link/>`에 상관없이 서버에 로그가 남지 않는다.
- **Next.js는 서버 사이드 렌더링 프레임워크지만 모든 작업이 서버에서 일어나지 않는다.**
```tsx
// pages/hello.tsx
export default function Hello() {
    console.log(typeof window === 'undefined' ? '서버' : '클라이언트')

    return <>hello</>
}
```

> `getServerSideProps`가 있는 빌드
- 서버 사이드 런타임 체크가 되어 있음
![getServerSideProps가 있는 빌드](../source/images/getServerSideProps_O_build.png)

> `getServerSideProps`가 없는 빌드
- 빌드 크기가 약간 줄고, 서버 사이드 렌더링이 필요없는 정적인 페이지로 분류
- `getServerSideProps`가 없기 때문에 서버에서 실행되지 않아도 되는 페이지로 처리(`typeof window === 'undefined' ? '서버' : '클라이언트'`도 `'클라이언트'`로 축약)
![getServerSideProps가 없는 빌드](../source/images/getServerSideProps_X_build.png)



## Data Fetching
- Next.js의 서버 사이드 렌더링 지원을 위한 몇 가지 데이터 불러오기 전략
- `pages/`의 폴더에 있는 라우팅이 되는 파일에서만 사용 가능
- 예약어로 지정되어 반드시 정해진 함수명으로 `export`를 사용해 함수를 파일 외부로 내보내야 함
- 활용 시, 서버에서 미리 필요한 페이지를 제공하거나 해당 페이지에 요청이 있을 때마다 서버에서 데이터를 조회해서 미리 페이지를 만들어서 제공할 수 있음

### getStaticPaths와 getStaticProps
- 어떠한 페이지를 CMS(Contents Management System)나 블로그, 게시판과 같이 사용자와 관계없이 정적으로 결정된 페이지를 보여주고자 할 때 사용되는 함수(fallback을 사용해 사용자의 요청이 있을 때만 빌드하는 등 최적화를 추가 가능)
- `getStaticPaths`와 `getStaticProps`는 반드시 함께 있어야 사용 가능

- 예시(/pages/post/[id]와 같은 페이지가 있고, 해당 페이지에 다음과 같이 두 함수를 사용했다고 가정)
```tsx
import { GetStaticPaths, GetStaticProps } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [{ params: {id: '1' } }, { params: { id: '2' } }],
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { id } = params

    const post = await fetchPost(id)

    return {
        props: { post },
    }
}

export default function Post({ post }: { post: Post }){
    // post로 페이지를 렌더링한다.
}
```

> getStaticPaths
- `/pages/post/[id]`가 접근 가능한 주소를 정의하는 함수
- `params`를 키로 하는 함수에 적절한 값을 배열을 넘겨주면 해당 페이지에서 접근 가능한 페이지를 정의할 수 있음
- 예시에서는 `/post/1`, `/post/2`만 접근 가능함을 의미, 다른 페이지는 404를 반환

- `fallback` 옵션
    - 미리 빌드해야 할 페이지가 너무 많은 경우 사용 가능
    - paths에 미리 빌드해 둘 몇 개의 페이지만 리스트로 반환하고, true나 "blocking"으로 값을 선언할 수 있다
    - next build를 실행할 때 미리 반환해 둔 paths에 기재돼 있는 페이지만 앞서와 마찬가지로 미리 빌드하고, 나머지 페이지의 경우에는 다음과 같이 작동
        - `true`: 사용자가 미리 빌드하지 않은 페이지에 접근할 경우, 빌드되기 전까지는 `fallback` 컴포넌트를 보여주고, 빌드가 완료된 이후에 해당 페이지를 보여주는 옵션
            ```tsx
            function Post({ post } : { post: Post}) {
                const router = useRouter()
                // 아직 빌드되지 않은 페이지에 왔을 경우 사용자에게 노출할 로딩 컴포넌트를 정의할 수 있다.
                if (router.isFallback) {
                    return <div>Loading...</div>
                }

                // post 렌더링
            }
            ``` 
        
        - `"blocking"`: 별도의 로딩과 같은 처리를 하지 않고, 단순히 빌드가 완료될 때까지 사용자를 기다리게 하는 옵션, 서버 사이드에서 렌더링할 때까지 대기한 다음, 렌더링이 완료되면 해당 페이지를 제공 

> getStaticProps
- `getStaticPaths`를 통해 정의한 페이지를 기준으로 해당 페이지로 요청이 왔을 때 제공할 `props`를 반환하는 함수
- 예시에서는 id가 1과 2로 제한돼 있기 때문에 `fetchPost(1)`, `fetchPost(2)`를 기준으로 각각 함수의 응답 결과를 변수로 가져와 `props`의 `{post}`로 반환하게 됨

> Post
- `getStaticProps`가 반환하는 post를 렌더링하는 역할

> 정리
- `getStaticPaths`: 페이지 제한
- `getStaticProps`: 페이지 데이터 요청을 수행해 props로 반환
- `POST`: 페이지 렌더링
- 두 함수를 사용하면 빌드 시점에 미리 데이터를 불러온 다음에 정적인 HTML 페이지를 만들 수 있음

### getSeverSideProps
- 서버에서 실행되는 함수이며 해당 함수가 있다면 무조건 페이지 진입 전에 이 함수를 실행
- 응답값에 따라 페이지의 루트 컴포넌트에 `porps`를 반환할 수도, 혹은 다른 페이지로 리다이렉트시킬 수도 있다.
- Next.js는 꼭 서버에서 실행해야 하는 페이지로 분류해 빌드 시에도 서버용 자바스크립트 파일을 별도로 만듦
```tsx
import type { GetServerSideProps } from 'next'

export default function Post({ post }: { post: Post }) {
    // 렌더링
}

export const getServer
```

## 스타일 적용하기

## _app.tsx 응용하기

## next.config.js 살펴보기

## 정리
