#Hello World

created date : 3.15.18`

updated date : 3.19.18`

express 이용해서 간단한 서버 띄워보기

## quick start
```javascript
// import modules
const express = require('express'); // node 에서 간단한 서버를 만들 수 있도록 도와주는 모듈
const app     = express(); // express 실행시 반환되는 인스턴스 : 각종 메서드 들이 내장 되어 있음

// app setting
app.set('port', 3000); // 인스턴스에 필드 추가

// middleware setting
	// express.* : body-parser 를 import 해야만 사용할 수 있었으나 Express4 부터 내장 메서드로 등록됨
app.use(express.json()); // application/json parsing 을 위해 사용됨
app.use(express.urlencoded()); // application x-www-form-urlencoded 을 위해 사용됨

// route setting
app.get('/', (req, res) => res.json({msg: 'hello-world'})); // index routing
app.get('*', (req, res) => res.json({msg: 'not found'})); // error routing

// server setting
app.listen(app.get('port'), () => console.log(`log - server:listening on port ${app.get('port')}`));
```
문법 : node 파일경로

싫행 : node ./tutorial/step1-hello-world.js

실행 (nodemon) : nodemon ./tutorial/step1-hello-world.js
## installation
Homebrew 버젼 체크 후 설치 : [brew install](https://docs.brew.sh/Installation)
> terminal - 설치는 링크 참조
> ```text
> brew --version
> ```
Homebrew 로 node 설치 : brew install node 
> terminal
> ```text
> node --version
> brew install node   
> ```
프로젝트 파일 생성 후 : npm 초기화
> project-directory-terminal
> ```text
> npm init
> ```
express 설치 
> project-directory-terminal
> ```text
> npm install express
> ```
nodemon 설치 
> project-directory-terminal
> ```text
> npm install nodemon
> ```
### Homebrew?
> [맥 패키지관리자 - Homebrew](http://www.popit.kr/%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%A5%BC-%EC%9C%84%ED%95%9C-%EB%A7%A5mac-%EC%A0%95%EB%B3%B4-%ED%8C%A8%ED%82%A4%EC%A7%80%EA%B4%80%EB%A6%AC%EC%9E%90-homebrew/)
### npm?
> [노드 패키지관리자 - NPM](https://velopert.com/241)

## node?
> Node.js는 확장성 있는 네트워크 애플리케이션(특히 서버 사이드) 개발에 사용되는 소프트웨어 플랫폼이다. 작성 언어로 자바스크립트를 활용하며 Non-blocking I/O와 단일 스레드 이벤트 루프를 통한 높은 처리 성능을 가지고 있다.
  내장 HTTP 서버 라이브러리를 포함하고 있어 웹 서버에서 아파치 등의 별도의 소프트웨어 없이 동작하는 것이 가능하며 이를 통해 웹 서버의 동작에 있어 더 많은 통제를 가능케 한다.
  
출처 : [wikipedia](https://ko.wikipedia.org/wiki/Node.js)  

## express?
> 익스프레스(Express.js)는 노드(NodeJS) 상에서 동작하는 웹 개발 프레임웍이다. 이외에도 Hapi.js, Koa.js 등 다양한 웹프레임웍이 있지만 현재까지 가장 많이 사용하는 것이 바로 익스프레스이다.

출처 : [webFrameworks](http://webframeworks.kr/getstarted/expressjs/)  

## app?
> app 은 express module 을 실행시켰을때 반환되는 함수이다. 어플리케이션을 생성해 주는 역할을 하고있다.

```javascript
/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init();
  return app;
}
```
## dependency?

> 의존성이라는 뜻으로 풀이되는 dependency 를 이해하려고 할 때 커플 링에 대해서 알아보면 좋을 것 같다.
서로간에 결합도를 낮추고 재사용성을 고려하거나 교체가 가능하도록 만들려고 분리 시켜둔 일종의 부품이다.

참조 : [wikipedia](https://en.wikipedia.org/wiki/Coupling_(computer_programming))

## module?
> module 의 이미는 많겠자만, 이번 express-practice 에서 말하고자 하는 module 이란 npm install 을 통해서 설치되고
> node 환경에서 require 를 이용해서 하나의 부품으로 가져다 쓸 수 있는 것들을 모듈로 칭하려고 한다.

## server?
> 서버(영어: server)는 클라이언트에게 네트워크를 통해 정보나 서비스를 제공하는 컴퓨터(server computer) 또는 프로그램(server program)을 말한다.  
> 참고 : [서버에 관하여 - 백과](https://ko.wikipedia.org/wiki/%EC%84%9C%EB%B2%84)

* express 는 app 이라는 인스턴스를 이용해서 클라이언트와 소통 할수 있는 수단을 제공합니다.
* express 없이 node 에서 요청과 반응을 처리하기 위해서는 http 모듈이 필요합니다. [http 로 서버구현](https://mylko72.gitbooks.io/node-js/content/chapter7/chapter7_4.html)
* 서버가 작동하기 위해서는 port 라는 개념이 필요합니다. [server port](https://en.wikipedia.org/wiki/Port_(computer_networking))
* 지정된 port 를 통해서 client -> server 로 request(req) 를 보내옵니다. 그리고 서버는 해당하는 요청에 대해 서버에서 지정해 둔 response(res) 를 발생시키게 됩니다.  [http protocol](https://developer.mozilla.org/ko/docs/Web/HTTP/Messages)
* quick start 에서 제공된 부분중 app.get(경로, 핸들러) 이 부분을 주목해 보면 express 에서 요청은 url 경로가 해당이 됩니다 그리고 해당 url 요청에 알맞은 핸들러를 달아주게 됩니다.
* 핸들러의 기본은 첫번째 인자로 req 를, 두번째 인자로 res 를 받습니다.
* node 에서도 console.log 가 가능하니 req/res 객체를 찍어서 확인해 보는것을 권장합니다. 이것을 많이 사용할테니까요.
* 서버에서 url path 과 같이 req 를 통해서 들어온 요청에 대한 핸들러를 달아주는 이 행위를 routing 이라고 표현합니다.
```javascript
//...some code
// step1-hello-world.js
// route setting
    app.get('/', (req, res) => res.json({msg: 'hello-world'})); // index routing
    app.get('*', (req, res) => res.json({msg: 'not found'})); // error routing
//...some code
```