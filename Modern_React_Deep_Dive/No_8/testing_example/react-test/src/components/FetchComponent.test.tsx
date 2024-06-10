import { fireEvent, render, screen } from '@testing-library/react'
import { http } from 'msw'
import { HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { FetchComponent } from './FetchComponent'

const MOCK_TODO_RESPONSE = {
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false,
}
// MSW를 활용해 fetch 응답을 모킹
// setupServer MSW가 제공하는 메서드, 서버를 만드는 역할
// Express나 Koa와 비슷하게 라우트를 선언할 수 있다.

const server = setupServer(
    http.get('/todos/:id', ({params}) => {
        const todoId = params.id
        
        if (Number(todoId)) {   //숫자일때만 id 반환
            return new Response(JSON.stringify({ ...MOCK_TODO_RESPONSE, id: Number(todoId)}))
        } else {
            return new Response(JSON.stringify(404))
        }
    }),
)

// 서버 기동, 테스트 코드 실행이 종료되면 서버를 종료
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

beforeEach(() => {
    render(<FetchComponent />)
})

describe('FetchComponent 테스트', () => {
    it('데이터를 불러오기 전에는 기본 문구가 뜬다.', async () => {
        const nowLoading = screen.getByText(/불러온 데이터가 없습니다./)
        expect(nowLoading).toBeInTheDocument()
    })

    it('버튼을 클릭하면 데이터를 불러온다.', async () => {
        const button = screen.getByRole('button', { name: /1st/ })
        fireEvent.click(button)

        const data = await screen.findByText(MOCK_TODO_RESPONSE.title)
        expect(data).toBeInTheDocument()
    })

    it('버튼을 클릭하고 서버 요청에서 에러가 발생하면 에러 문구를 노출한다.', async () => {
        server.use(
            http.get('/todos/:id', () => {
                return new HttpResponse(null, {
                    status: 503
                })
            }),
        )

        const button = screen.getByRole('button', { name: /1st/ })
        fireEvent.click(button)

        const error = await screen.findByText(/에러가 발생했습니다./)
        expect(error).toBeInTheDocument()
    })
})