// import modules
const express  = require('express'); // node 에서 간단한 서버를 만들 수 있도록 도와주는 모듈
const mongoose = require('mongoose');
const database = mongoose.connection;
const app      = express(); // express 실행시 반환되는 인스턴스 : 각종 메서드 들이 내장 되어 있음

// model setting - user
const userSchemaModel = {
	userEmail : {type: String, default: ''},
	userPwd   : {type: String, default: ''},
	userName  : {type: String, default: ''},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now}
};
const Schema          = mongoose.Schema;
const userSchema      = new Schema(userSchemaModel);
const userModel       = mongoose.model('user', userSchema);

// app setting
app.set('port', 3000); // 인스턴스에 필드 추가
app.set('databaseUrl', 'mongodb://localhost/test'); // db path 설정

//app database setting
database.on('error', console.error);
database.once('open', () => console.log('log - database:connected to mongo'));
mongoose.connect(app.get('databaseUrl'));

// middleware setting
// express.* : body-parser 를 import 해야만 사용할 수 있었으나 Express4 부터 내장 메서드로 등록됨
app.use(express.json()); // application/json parsing 을 위해 사용됨
app.use(express.urlencoded()); // application x-www-form-urlencoded 을 위해 사용됨

// 모든 요청 url 에 대해서 순차적으로 동작을 합니다.
// middleware 는 순차적으로 실행됨에 따라서 req/res 객체를 통해서 서로 값을 교환 할 수 있습니다
// 조금 더 내부 로직이 궁금하시다면 pipeline pattern 을 찾아 보시기 바랍니다.
app.use((req, res, next) => {
	console.log('middleware fn call : 1');
	console.log('req.test1', req.test1);
	req.test1 = 1;
	console.log('req.test1 = 1');
	console.log('req.test1', req.test1);
	next();
});
// 요청 url 중 /test 로 들어오는 요청에 대해서만 반응하는 미들웨어 입니다. 경로가 지정이 안된 미들웨어는 모든 요청에 대해서 반응 합니다.
app.use('/test', (req, res, next) => {
	console.log('middleware fn call : 2');
	console.log('req.test1', req.test1);
	console.log('req.test2', req.test2);
	req.test2 = 2;
	console.log('req.test2 = 2');
	console.log('req.test2', req.test2);
	next();
});
app.use((req, res, next) => {
	console.log('middleware fn call : 3');
	console.log('req.test1', req.test1);
	console.log('req.test2', req.test2);
	console.log('req.test3', req.test3);
	req.test3 = 3;
	console.log('req.test3 = 3');
	console.log('req.test3', req.test3);
	next();
});

// mongoose model test -> postman 을 이용해서 post 요청을 서버에게 보내 봅시다.
// postman 은 크롬 익스텐션중 하나로 view 배치 없이 데이터 요청을 주고 받는것을 가능하게 해주는 툴입니다.
// REST test 를 빠르게 진행 할 수 있어서 매우 좋습니다.
app.post('/user/signup-test', (req, res) => {
	const newUser     = new userModel();
	newUser.userEmail = req.body.userEmail;
	newUser.userPwd   = req.body.userPwd;
	newUser.userName  = req.body.userName;
	const query       = newUser.save();
	query.then(() => res.json({msg: `created user ${req.body.userName}`}))
			 .catch((err) => res.json(err));
});

// mongoose model test -> db 에 저장된 경로에서 유저 리스트를 가져와 봅시다.
app.get('/user/list-test', (req, res) => {
	const query = mongoose.model('user').find({}, 'userEmail userPwd userName');
	query.select('userEmail userPwd userName')
			 .then((users) => res.json(users))
			 .catch((err) => res.json(err));
});

// 생성되어져 있던 유저의 정보가 중복이라면 로그인 해야할 대상이 여러명이 됨으로 작동되지 않는다.
// 따라서 postman	을 적극 이용하여서 유저의 정보를 서로 다르게 입력해 봅시다.
// 생성된 유저 삭제
app.delete('/user/remove-test', (req, res) => {
	const query = mongoose.model('user').remove({userEmail: req.body.userEmail});
	return query.then(() => res.json({msg:'deleted'})).catch((err) => res.json(err));
});

// passport setting
// passport 를 이용해서 로그인 기능을 구현해 봅시다.

// passport 소개
// passport 모듈은 Strategy 라는 내부 인스턴스를 활용해서 로그인의 방식을 정의 해 줄수 있습니다.
// 각 strategy 의 종류로는 facebook strategy, google strategy, local strategy 등등 다양합니다.
// 지정된 strategy 를 이용해서 로그인 방식을 정의 하고 확장 할 수 있기 때문에 유용합니다.
// 이번에는 가장 기본이 되는 local strategy 를 이용한 로그인방식을 소개하려고 합니다.

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


// route setting "step3-routing.md 에 기록된 내용을 보고 내부를 express.Router() 의 인스턴스를 받아서 모듈화 해보세요!"
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


// server setting
app.listen(app.get('port'), () => console.log(`log - server:listening on port ${app.get('port')}`));
