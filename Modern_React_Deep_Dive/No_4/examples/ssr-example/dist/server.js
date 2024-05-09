(()=>{"use strict";var e={878:(e,t,r)=>{r.r(t),r.d(t,{default:()=>n});const n='<script src="https://unpkg.com/react@17.0.2/umd/react.development.js"><\/script>\r\n<script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js"><\/script>\r\n<script src="/browser.js"><\/script>\r\n</body>\r\n</html>'},322:(e,t,r)=>{r.r(t),r.d(t,{default:()=>n});const n='<!DOCTYPE html>\r\n<html>\r\n  <head>\r\n    <meta charset="utf-8" />\r\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\r\n    <title>SSR Example</title>\r\n  </head>\r\n  <body>\r\n\r\n'},710:(e,t,r)=>{r.r(t),r.d(t,{default:()=>n});const n='<!DOCTYPE html>\r\n<html>\r\n  <head>\r\n    <meta charset="utf-8" />\r\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\r\n    <title>SSR Example</title>\r\n  </head>\r\n  <body>\r\n    __placeholder__\r\n    <script src="https://unpkg.com/react@17.0.2/umd/react.development.js"><\/script>\r\n    <script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js"><\/script>\r\n    <script src="/browser.js"><\/script>\r\n  </body>\r\n</html>\r\n'},78:function(e,t,r){var n=this&&this.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r);var o=Object.getOwnPropertyDescriptor(t,r);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,o)}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&n(t,e,r);return o(t,e),t};Object.defineProperty(t,"__esModule",{value:!0});const i=a(r(689)),c=r(328);t.default=function({todos:e}){return(0,i.useEffect)((()=>{console.log("하이!")}),[]),i.default.createElement(i.default.Fragment,null,i.default.createElement("h1",null,"나의 할일!"),i.default.createElement("ul",null,e.map(((e,t)=>i.default.createElement(c.Todo,{key:t,todo:e})))))}},328:function(e,t,r){var n=this&&this.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r);var o=Object.getOwnPropertyDescriptor(t,r);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,o)}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&n(t,e,r);return o(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.Todo=void 0;const i=a(r(689));t.Todo=function({todo:e}){const{title:t,completed:r,userId:n,id:o}=e,[a,c]=(0,i.useState)(r);return i.default.createElement("li",null,i.default.createElement("span",null,n,"-",o,") ",t," ",a?"완료":"미완료",i.default.createElement("button",{onClick:function(){c((e=>!e))}},"토글")))}},454:function(e,t,r){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.fetchTodo=void 0;const o=n(r(583));t.fetchTodo=async function(){const e=await(0,o.default)("https://jsonplaceholder.typicode.com/todos");return await e.json()}},728:function(e,t,r){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=r(685),a=r(147),i=r(684),c=r(689),d=n(r(710)),l=n(r(322)),s=n(r(878)),u=n(r(78)),p=r(454),f=process.env.PORT||3e3;(0,o.createServer)((async function(e,t){const{url:r}=e;switch(r){case"/":{const e=await(0,p.fetchTodo)(),r=(0,c.createElement)("div",{id:"root"},(0,c.createElement)(u.default,{todos:e})),n=(0,i.renderToString)(r),o=d.default.replace("__placeholder__",n);return t.setHeader("Content-Type","text/html"),t.write(o),void t.end()}case"/stream":{t.setHeader("Content-Type","text/html"),t.write(l.default);const e=await(0,p.fetchTodo)(),r=(0,c.createElement)("div",{id:"root"},(0,c.createElement)(u.default,{todos:e})),n=(0,i.renderToNodeStream)(r);return n.pipe(t,{end:!1}),void n.on("end",(()=>{t.write(s.default),t.end()}))}case"/browser.js":return t.setHeader("Content-Type","application/javascript"),void(0,a.createReadStream)("./dist/browser.js").pipe(t);case"/browser.js.map":return t.setHeader("Content-Type","application/javascript"),void(0,a.createReadStream)("./dist/browser.js.map").pipe(t);default:t.statusCode=404,t.end("404 Not Found")}})).listen(f,(()=>{console.log(`Server has been started ${f}...`)}))},583:e=>{e.exports=require("isomorphic-fetch")},689:e=>{e.exports=require("react")},684:e=>{e.exports=require("react-dom/server")},147:e=>{e.exports=require("fs")},685:e=>{e.exports=require("http")}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={exports:{}};return e[n].call(a.exports,a,a.exports,r),a.exports}r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r(728)})();
//# sourceMappingURL=server.js.map