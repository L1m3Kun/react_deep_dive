// 트랜스파일하기 전
const hello = () => {
    console.log(this)
}

function hi(){
    console.log(_this)
}

hello()
hi()

// 트랜스파일된 결과: 바벨에서는 이렇게 변함
var _this = void 0

var hello1 = function hello() {
    // 바벨에서 화살표 함수 내부의 _this 자체를 undefined로 바꿔버림
    console.log(_this)
}

function hi() {
    console.log(this)
}

hello1()
hi()

