# routing

created date : 3.19.18'

express routing 에 대해서 간략히 알아보기

## quick start

```javascript
// route setting
app.get('/', (req, res) => res.json({msg: 'hello-world'})); // index routing
app.get('/user', (req, res) => res.json({msg: 'hello-user'}));
app.get('/user/list', (req, res) => res.json({msg: 'user-list'}));
app.get('/user/signup', (req, res) => res.json({msg: 'user-signup'}));
app.post('/user/signup', (req, res) => res.json({msg: 'user-saved'}));
app.delete('/user/leave', (req, res) => res.json({msg: 'user-removed'}));
app.get('/user/detail', (req, res) => res.json({msg: 'user-detail'}));
app.get('/user/update', (req, res) => res.json({msg: 'user-update'}));
app.put('/user/update', (req, res) => res.json({msg: 'user-updated'}));
app.get('/user/login', (req, res) => res.json({msg: 'user-login'}));
app.get('/user/logout', (req, res) => res.json({msg: 'user-logout'}));

app.get('*', (req, res) => res.json({msg: 'not found'})); // error routing
```
* path 를 " * " 로 지정하면 상단에 지정되지 않은 모든 요청에 대하여 반응하는 라우팅을 만들 수 있다.
* express.Route() 를 통해서 라우팅 인스턴스를 만들면 에러 헨들링을 전담하는 미들 웨어를 지정할 수 있다.
```javascript
const express = require('express');
const app = express();
//...some code
const errorRouter = express.Router();

// index route setting
//... some code

// user route setting
//... some code

// error route setting
app.use('*', errorRouter);
```
* 같은 예로 user 에 대한 라우팅이 여러개 지정된 경우에도 라우팅 인스턴스를 받아서 미들웨어로 지정할 수 있다.
```javascript
const express = require('express');
const app = express();
const userRouter = express.Router();

//user route setting
userRouter.get('/', (req, res) => res.json({msg: 'hello-user'}));
userRouter.get('/list', (req, res) => res.json({msg: 'user-list'}));
userRouter.get('/signup', (req, res) => res.json({msg: 'user-signup'}));
userRouter.post('/signup', (req, res) => res.json({msg: 'user-saved'}));
userRouter.delete('/leave', (req, res) => res.json({msg: 'user-removed'}));
userRouter.get('/detail', (req, res) => res.json({msg: 'user-detail'}));
userRouter.get('/update', (req, res) => res.json({msg: 'user-update'}));
userRouter.put('/update', (req, res) => res.json({msg: 'user-updated'}));
userRouter.get('/login', (req, res) => res.json({msg: 'user-login'}));
userRouter.get('/logout', (req, res) => res.json({msg: 'user-logout'}));

app.use('/user', userRouter);
```
* /user path 로 들어온 요청에 대해서 router 를 지정하면 됨으로, 라우트 인스턴스 내부에는 /user path 를 지정할 필요가 없다.

## route ?
>라우팅은 URI(또는 경로) 및 특정한 HTTP 요청 메소드(GET, POST 등)인 특정 엔드포인트에 대한 클라이언트 요청에 애플리케이션이 응답하는 방법을 결정하는 것을 말합니다.
 각 라우트는 하나 이상의 핸들러 함수를 가질 수 있으며, 이러한 함수는 라우트가 일치할 때 실행됩니다.
 라우트 정의에는 다음과 같은 구조가 필요합니다.
 
 * 라우트의 사용 예시
 ```javascript
app.METHOD(PATH, HANDLER)
/*
* app은 express의 인스턴스입니다.
* METHOD는 HTTP 요청 메소드입니다.
* PATH는 서버에서의 경로입니다.
* HANDLER는 라우트가 일치할 때 실행되는 함수입니다.
* */
```

* 제 코드에서느 라우트의 역할은 요청이 들어온 경로에 대한 HANDLER (controller) 를 매핑해 주는 역할을 수행합니다.

출처 : [expressjs](http://expressjs.com/ko/starter/basic-routing.html)