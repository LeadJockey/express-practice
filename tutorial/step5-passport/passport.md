# routing

created date : 3.26.18'

passport 섳리와 express 내에서 passport 를 이용해서 로그인 기능을 구현해 봅시다.

각 정보에 대한 출처를 남겨드리오니 확인해 주시기 바랍니다.

[npm:express-session](https://www.npmjs.com/package/express-session)

[npm:passport](https://www.npmjs.com/package/passport)

[npm:passport-local](https://www.npmjs.com/package/passport-local)

[blog:session 과 cookie 차이점](http://soul0.tistory.com/353)

## quick start
```javascript
// passport setting
// passport 를 이용해서 로그인 기능을 구현해 봅시다.

// npm install : 우선 passport 의 구동을 위해서 두개의 모듈을 설치합니다.
// npm i passport
// npm i passport-local

// 설치가 다 되었다면 모듈을 require 를 이용해서 import 합니다.
const passport       = require('passport');
const LocalStrategy  = require('passport-local');
const expressSession = require('express-session');

// passport 구동되기 위해서는 두가지 메서트가 정의되어야만 합니다.

// serializeUser : 첫 로그인 요청때만 작동합니다.
passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
	console.log('passport:serializeUser');
	done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

// deserializeUser : 모든 로그인 요청때에 작동합니다.
passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
	console.log('passport:deserializeUser');
	done(null, user); // 여기의 user가 req.user가 됨
});

// passport 의 기본 메서드를 등록 하였으니 이제 local strategy 인스턴스를 생성합니다.
// localStrategy 인스턴스가 생성되기 위해서는 두개의 인자값들이 필요합니다.
// 1. strategy option, 2. strategy callback
const localStrategyOption   = {
	usernameField    : 'userEmail', // 만들어둔 mongoose 스키마의 아이디에 해당하는 필드명을 기입해 주세요
	passwordField    : 'userPwd',	  // 만들어둔 mongoose 스키마의 비밀번호에 해당하는 필드명을 기입해 주세요
	session          : true, // 세션에 저장 여부
	passReqToCallback: false // 이옵션값은 아직 정확히 모르겠습니다 ㅠ
};
const localStrategyCallback = (usernameField, passwordField, done) => {
	const query = userModel.findOne({userEmail: usernameField}, 'userEmail userPwd userName');
	// mongoose 는 thenable 입니다 콜백헬을 최대한 회피합시다.
	return query.select('userEmail userPwd userName')
							.then((user) => !user ? done(null, false) : user)
							.then((user) => user.userPwd === passwordField ? done(null, user) : done(null, false))
							.catch((err) => done(err));
};
// 인자값들이 취해야 할 행동들이 정의 되었다면 이것을 passport 의 middleware 로 등록합니다.
passport.use('local-login', new LocalStrategy(localStrategyOption, localStrategyCallback));

// 이제 passport 의 설정이 끝났으니 initialize 해보도록 합니다.
// passport 에서 로그인 정보가 들어왔을떄 쌔션에 저장할 수 있도록 express-session 을 활성화합니다.
app.use(expressSession({
												 secret           : 'my key',
												 resave           : true,
												 saveUninitialized: true
											 }));
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결

// 등록된 요청값 'local-login' 이라는 명칭으로 routing 을 시켜 줄 수 있습니다.
// 우선 로그인 성공시와 로그인 실패에 대한 라우팅을 해보겠습니다.
app.get('/user/login-success', (req, res) => {
	res.locals.login = req.isAuthenticated();// req.isAuthenticated 라는 함수를 이용해서 로그인 여부를 확인 할 수 있습니다.
	console.log('*********login check*******', res.locals.login);
	res.json({msg: 'login-success'}); // 로그인 성공 메시지 전송
});
app.get('/user/login-fail', (req, res) => res.json({msg: 'login-fail'}));
// 로그인 요청에 대한 라우팅 입니다.
// passport 에 등록된 'local-login' 은 라우터에서는 authenticate('local-login,options)를 통해서 매핑하게 됩니다.
app.post('/user/login-test', passport.authenticate('local-login', {
	successRedirect: '/user/login-success',
	failureRedirect: '/user/login-fail'
}));
app.get('/user/logout-test', (req, res) => {
	res.logout(); // 로그아웃 실행 : res.logout 이라는 메서드를 통해서 로그아웃을 명령할 수 있습니다.
	res.json({msg: 'logout'}); // 로그아웃 메시지 전송
});
```

## installation

```text
npm i express-session
npm i passport
npm i passport-local
```

## intro

passport 소개

passport 모듈은 Strategy 라는 내부 인스턴스를 활용해서 로그인의 방식을 정의 해 줄수 있습니다.

각 strategy 의 종류로는 facebook strategy, google strategy, local strategy 등등 다양합니다.

지정된 strategy 를 이용해서 로그인 방식을 정의 하고 확장 할 수 있기 때문에 유용합니다.

이번에는 가장 기본이 되는 local strategy 를 이용한 로그인방식을 소개하려고 합니다.

## steps

제가 작성한 예제를 따라하기 위해서는 코드를 크게 4등분으로 볼 필요가 있습니다.

1. 모듈 임포트
2. 모듈 사용 설정
3. 모듈 활성화
4. 라우팅 연결
5. postman 을 이요한 테스트 및 확인

### 임포트

```javascript

const passport       = require('passport');
const LocalStrategy  = require('passport-local');
const expressSession = require('express-session');

```

### 설정

```javascript

// passport 구동되기 위해서는 두가지 메서트가 정의되어야만 합니다.

// serializeUser : 첫 로그인 요청때만 작동합니다.
passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
	console.log('passport:serializeUser');
	done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

// deserializeUser : 모든 로그인 요청때에 작동합니다.
passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
	console.log('passport:deserializeUser');
	done(null, user); // 여기의 user가 req.user가 됨
});

// passport 의 기본 메서드를 등록 하였으니 이제 local strategy 인스턴스를 생성합니다.
// localStrategy 인스턴스가 생성되기 위해서는 두개의 인자값들이 필요합니다.
// 1. strategy option, 2. strategy callback
const localStrategyOption   = {
	usernameField    : 'userEmail', // 만들어둔 mongoose 스키마의 아이디에 해당하는 필드명을 기입해 주세요
	passwordField    : 'userPwd',	  // 만들어둔 mongoose 스키마의 비밀번호에 해당하는 필드명을 기입해 주세요
	session          : true, // 세션에 저장 여부
	passReqToCallback: false // 이옵션값은 아직 정확히 모르겠습니다 ㅠ
};
const localStrategyCallback = (usernameField, passwordField, done) => {
	const query = userModel.findOne({userEmail: usernameField}, 'userEmail userPwd userName');
	// mongoose 는 thenable 입니다 콜백헬을 최대한 회피합시다.
	return query.select('userEmail userPwd userName')
							.then((user) => !user ? done(null, false) : user)
							.then((user) => user.userPwd === passwordField ? done(null, user) : done(null, false))
							.catch((err) => done(err));
};
// 인자값들이 취해야 할 행동들이 정의 되었다면 이것을 passport 의 middleware 로 등록합니다.
passport.use('local-login', new LocalStrategy(localStrategyOption, localStrategyCallback));

```

### 활성화

```javascript

// 이제 passport 의 설정이 끝났으니 initialize 해보도록 합니다.
// passport 에서 로그인 정보가 들어왔을떄 쌔션에 저장할 수 있도록 express-session 을 활성화합니다.
app.use(expressSession({
												 secret           : 'my key',
												 resave           : true,
												 saveUninitialized: true
											 }));
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결

```

### 라우터와 연결

```javascript

// 등록된 요청값 'local-login' 이라는 명칭으로 routing 을 시켜 줄 수 있습니다.
// 우선 로그인 성공시와 로그인 실패에 대한 라우팅을 해보겠습니다.
app.get('/user/login-success', (req, res) => {
	res.locals.login = req.isAuthenticated();// req.isAuthenticated 라는 함수를 이용해서 로그인 여부를 확인 할 수 있습니다.
	console.log('*********login check*******', res.locals.login);
	res.json({msg: 'login-success'}); // 로그인 성공 메시지 전송
});
app.get('/user/login-fail', (req, res) => res.json({msg: 'login-fail'}));
// 로그인 요청에 대한 라우팅 입니다.
// passport 에 등록된 'local-login' 은 라우터에서는 authenticate('local-login,options)를 통해서 매핑하게 됩니다.
app.post('/user/login-test', passport.authenticate('local-login', {
	successRedirect: '/user/login-success',
	failureRedirect: '/user/login-fail'
}));
app.get('/user/logout-test', (req, res) => {
	res.logout(); // 로그아웃 실행 : res.logout 이라는 메서드를 통해서 로그아웃을 명령할 수 있습니다.
	res.json({msg: 'logout'}); // 로그아웃 메시지 전송
});
```
