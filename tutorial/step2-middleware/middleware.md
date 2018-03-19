# middleware

created date : 3.19.18`

express middleware 에 대해서 간략히 알아보기

## quick start
```javascript
// middleware setting
// express.* : body-parser 를 import 해야만 사용할 수 있었으나 Express4 부터 내장 메서드로 등록됨
app.use(express.json()); // application/json parsing 을 위해 사용됨
app.use(express.urlencoded()); // application x-www-form-urlencoded 을 위해 사용됨

// 모든 요청 url 에 대해서 순차적으로 동작을 합니다.
// middleware 는 순차적으로 실행됨에 따라서 req/res 객체를 통해서 서로 값을 교환 할 수 있습니다
// 조금 더 내부 로직이 궁금하시다면 pipeline pattern 을 찾아 보시기 바랍니다.
app.use((req,res,next)=>{
	console.log('middleware fn call : 1');
	console.log('req.test1', req.test1);
	req.test1 = 1;
	console.log('req.test1 = 1');
	console.log('req.test1', req.test1);
	next();
});

// 요청 url 중 /test 로 들어오는 요청에 대해서만 반응하는 미들웨어 입니다. 경로가 지정이 안된 미들웨어는 모든 요청에 대해서 반응 합니다.
app.use('/test', (req,res,next)=>{
	console.log('middleware fn call : 2');
	console.log('req.test1', req.test1);
	console.log('req.test2', req.test2);
	req.test2 = 2;
	console.log('req.test2 = 2');
	console.log('req.test2', req.test2);
	next();
});

app.use((req,res,next)=>{
	console.log('middleware fn call : 3');
	console.log('req.test1', req.test1);
	console.log('req.test2', req.test2);
	console.log('req.test3', req.test3);
	req.test3 = 3;
	console.log('req.test3 = 3');
	console.log('req.test3', req.test3);
	next();
});
```

## middleware?
>미들웨어는 양 쪽을 연결하여 데이터를 주고 받을 수 있도록 중간에서 매개 역할을 하는 소프트웨어, 네트워크를 통해서 연결된 여러 개의 컴퓨터에 있는 많은 프로세스들에게 어떤 서비스를 사용할 수 있도록 연결해 주는 소프트웨어를 말한다. 3계층 클라이언트/서버 구조에서 미들웨어가 존재한다. 
>웹 브라우저에서 데이터베이스로부터 데이터를 저장하거나 읽어올 수 있게 중간에 미들웨어가 존재한다.

출처 : [wikipedia](https://ko.wikipedia.org/wiki/%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4)

* 익스프레스에서 middleware 사용 예시
>미들웨어 함수는 요청 오브젝트(req), 응답 오브젝트 (res), 그리고 애플리케이션의 요청-응답 주기 중 그 다음의 미들웨어 함수 대한 액세스 권한을 갖는 함수입니다. 그 다음의 미들웨어 함수는 일반적으로 next라는 이름의 변수로 표시됩니다.
> 미들웨어 함수는 다음과 같은 태스크를 수행할 수 있습니다.
 
> 1. 모든 코드를 실행.
> 2. 요청 및 응답 오브젝트에 대한 변경을 실행.
> 3. 요청-응답 주기를 종료.
> 4. 스택 내의 그 다음 미들웨어를 호출.

```javascript
var express = require('express');
var app = express();

var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

app.use(myLogger);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000);
```
출처 : [expressjs](http://expressjs.com/ko/guide/writing-middleware.html)