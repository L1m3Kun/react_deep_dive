import * as Babel from '@babel/standardalone'

Babel.registerPlugin(
    '@babel/plugin-transform-react-jsx',
    require('@babel/plugin-transform-react-jsx'),
)

const BABEL_CONFIG = {
    presets: [],
    plugins: [
    [
        '@babel/plugin-transform-react-jsx',
        {
            throwIfNamespace:false,
            runtime: 'automatic',
            importSource: 'custom-jsx-library',
        },
    ],
    ],
}

const SOURCE_CODE = `const ComponentA = <A>안녕하세요.</A>`
// code 변수에 트랜스파일된 결과가 나옴
const { code } = Babel.transform(SOURCE_CODE, BABEL_CONFIG)