import { render, screen } from '@testing-library/react'

import SataticComponent from './staticComponent'

// 각 테스트(it)를 수행하기 전에 실행하는 함수, 각 테스트를 실행하기 앞서 StaticComponent 실행
beforeEach(() => {
    render(<SataticComponent />)
})

// 비슷한 속성을 가진 테스트를 하나의 그룹으로 묶는 역할
// 필수요소 아님
// describe 내부 describe 선언 가능
describe('링크 확인', () => {
    // test와 완전히 동일하며 test의 축약어(alias)
    // it이라는 축약어를 제공하는 이유는 테스트 코드를 좀 더 사람이 읽기 쉽게 하기 위해서임
    // describe ... it (something)과 같은 형태로 작성해 두면 테스트 코드가 한결 문어체 같이 표현되어 읽기 쉬워짐
    it('링크가 3개 존재한다.', () => {
        // testId는 리액트 테스팅 라이브러리의 예약어로, get 등의 선택자로 선택하기 어렵거나 곤란한 요소를 선택하기 위해 사용 가능
        // HTML의 DOM 요소에 testId 데이터셋을 선언해 두면 이후 테스트 시에 getByTestId, findByTestId 등으로 선택 가능
        // 웹에서 사용하는 querySelector([data-testid="${yourId}"])와 동일한 역할
        const ul = screen.getByTestId('ul')
        expect(ul.children.length).toBe(3)
    })

    it('링크 목록의 스타일이 square다.', () => {
        const ul = screen.getByTestId('ul')
        expect(ul).toHaveStyle('list-style-type: square')
    })
})

describe('리액트 링크 테스트', () => {
    it('리액트 링크가 존재한다.', () => {
        const reactLink = screen.getByText('리액트')
        expect(reactLink).toBeVisible()
    })

    it('리액트 링크가 올바른 주소로 존재한다.', () => {
        const reactLink = screen.getByText('리액트')
        expect(reactLink.tagName).toEqual('A')
        expect(reactLink).toHaveAttribute('href', 'https://reactjs.org')
    })
})

describe('네이버 링크 테스트', () => {
    it('네이버 링크가 존재한다.', () => {
        const naverLink = screen.getByText('네이버')
        expect(naverLink).toBeVisible()
    })

    it('네이버 링크가 올바른 주소로 존재한다.', () => {
        const naverLink = screen.getByText('네이버')
        expect(naverLink.tagName).toEqual('A')
        expect(naverLink).toHaveAttribute('href', 'https://www.naver.com')
    })
})

describe('블로그 링크 테스트', () => {
    it('블로그 링크가 존재한다.', () => {
        const blogLink = screen.getByText('블로그')
        expect(blogLink).toBeVisible()
    })

    it('블로그 링크가 올바른 주소로 존재한다.', () => {
        const blogLink = screen.getByText('블로그')
        expect(blogLink.tagName).toEqual('A')
        expect(blogLink).toHaveAttribute('href', 'https://yceffort.kr')
    })

    it('블로그는 같은 창에서 열려야 한다.', () => {
        const blogLink = screen.getByText('블로그')
        expect(blogLink).not.toHaveAttribute('target')
    })
})

