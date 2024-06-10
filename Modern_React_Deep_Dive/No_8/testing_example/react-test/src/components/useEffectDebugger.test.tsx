import { renderHook } from "@testing-library/react"
// react 18 이전버전: @testing-library/react-hooks
import useEffectDebugger, { CONSOLE_PREFIX } from "./useEffectDebugger"

const consoleSpy = jest.spyOn(console, 'log')
const componentName = 'TestComponent'

describe('useEffectDebugger', () => {
    afterAll(() => {
        //eslint-diable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // 매번 테스트가 끝난 후에는 process.env.NODE_ENV를 development로 변경(typescript에서 읽기전용으로 간주 당함)
        process.env.NODE_ENV = 'development'
    })
    // ...
})

it('props가 없으면 호출되지 않는다.', () => {
    renderHook(() => useEffectDebugger(componentName))

    expect(consoleSpy).not.toHaveBeenCalled()
})

it('최초에는 호출되지 않는다.', () => {
    const props = { hello: 'world'}
    // 훅을 렌더링 하기 위해서는 renderHook 래핑해서 사용
    renderHook(() => useEffectDebugger(componentName, props))

    expect(consoleSpy).not.toHaveBeenCalled()
})

it('props가 변경되면 다시 호출한다.', () => {
    const props = { hello: 'world' }

    const { rerender } = renderHook(
        ({ componentName, props }) => useEffectDebugger(componentName, props),
        {
            initialProps: {
                componentName,
                props,
            }
        }
    )

    const newProps = { hello: 'world2' }

    rerender({ componentName, props: newProps })

    expect(consoleSpy).toHaveBeenCalled()
})

it('process.env.NODE_ENV가 production이면 호출하지 않는다.', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.env.NODE_ENV = 'production'

    const props = { hello: 'world' }

    const { rerender } = renderHook(
        ({ componentName, props }) => useEffectDebugger(componentName, props),
        {
            initialProps: {
                componentName,
                props,
            }
        }
    )

    const newProps = { hello: 'world2' }

    rerender({ componentName, props: newProps })

    expect(consoleSpy).toHaveBeenCalled()
})