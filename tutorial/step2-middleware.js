// import modules
const express = require('express'); // node 에서 간단한 서버를 만들 수 있도록 도와주는 모듈
const app     = express(); // express 실행시 반환되는 인스턴스 : 각종 메서드 들이 내장 되어 있음

// app setting
app.set('port', 3000); // 인스턴스에 필드 추가

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

// route setting
app.get('/', (req, res) => res.json({msg: 'hello-world'})); // index routing
app.get('*', (req, res) => res.json({msg: 'not found'})); // error routing

// server setting
app.listen(app.get('port'), () => console.log(`log - server:listening on port ${app.get('port')}`));
