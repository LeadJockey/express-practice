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
