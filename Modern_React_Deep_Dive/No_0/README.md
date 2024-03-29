# 들어가며(~19 page)

## 리액트 장점
1. 명시적인 상태 변경
   - **단방향 바인딩**: 데이터 흐름이 한쪽으로만 흘러감 -> 상태 변화가 일어난 곳을 찾기 쉬움
   - 반의어: 양방향 바인딩
2. **JSX(JavaScript XML)**: Angular 나 Vue.js처럼 템플릿을 사용하지 않고, 기존 Javascript문법에 HTML을 약간 가미한 수준의 문법으로 접근성이 쉬움
    ```text
    // 비교
    // Angular
    // ngIF의 존재를 알아야함
    <div *ngIf = "condition">Content to render when condition is true.</div>


    // React
    // 자바스크립트 문법(3항 연산) + HTML {}
    {condition ? <div>Content to render when coindition is true.</div> : null}
    ```
3. 비교적 배우기 쉽고 간결
    - 기존 Javascript문법에 HTML을 약간 가미한 수준의 문법으로 접근성이 쉬움(vs Angular, Vue)
4. 강력한 커뮤니티 그리고 메타
