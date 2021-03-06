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
