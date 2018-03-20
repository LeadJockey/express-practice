# routing

created date : 3.19.18`
updated date : 3.20.18`

mongodb local 설치와 express 내에서 mongoose 모듈을 이용해서 사용해 보기 에 대해서 간략히 알아보기

## quick start
```javascript
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
```

## installation

설치는 벨로퍼트 형이 겁나게 잘 해 두었으니 참고하세요

참고로 설치와 더불어서 데이터 베이스에 대한 기본 지식도 포함되어 있으니 강좌 1-5 까지는 정독 해 보심이 좋아 보입니다.

[velopert](https://velopert.com/436)

## mongoose?
* express 에서 mongoDB 를 사용 할수 있드록 만들어 주는는  모듈입니다.
* mongoose 는 mongoDB 와의 연결을 도와주고 mongoose.Schema 를 통해서 스키마를 생성합니다.
* 스키마에서는 데이터의 구조를 지정해 주어야 하고, mongoose.model('schemaNam', Schema-instance) 를 통해서 모델로 등록하고 관리합니다. 
* 등록된 모델은 mongoDB 의 db-collection 단위에서 제어되며, 소통은 등록된 스키마형식에 의거해서 통신됩니다.
* mongoose 의 또 다른 특징으로는 thanable 아라는 것인데요, 일종의 promise 의 처리 방시으로 볼 수 있습니다.
* 이러한 점이 부각된 이유는 데이터 처리를 위해서 동기식 처리가 필요하기 때문입니다.

[npmjs](https://www.npmjs.com/package/mongoose)

## postman?
* 크롬 익스텐션으로 많이 사용이 되고 있고 개발시 REST 요청에 대한 테스트를 빠르게 할 수 있도록 지원합니다.
* 아주 좋은 툴이니 자주 써주세요~ 

[getpostman](https://www.getpostman.com/products)


## data access layer?
> 예를 들어 삽입 , 삭제 및 업데이트 와 같은 명령을 사용하여 데이터베이스의 특정 테이블에 액세스하는 대신 클래스와 몇 가지 저장 프로 시저를 데이터베이스에 만들 수 있습니다.
> 프로시 저는 클래스 내부의 메소드에서 호출되어 요청 된 값을 포함하는 객체를 리턴합니다.
> 또는 insert, delete 및 update 명령은 데이터 액세스 계층 내에 저장된 registeruser 또는 loginuser 와 같은 간단한 함수 내에서 실행할 수 있습니다.
> 또한 응용 프로그램의 비즈니스 논리 메서드를 데이터 액세스 계층에 매핑 할 수 있습니다. 예를 들어, 여러 테이블에서 모든 사용자를 페치 (fetch)하기 위해 데이터베이스로 쿼리를 작성하는 대신, 애플리케이션은 DAL로부터 하나의 메소드를 호출하여 해당 데이터베이스 호출을 추상화 할 수 있습니다.

* 줄여서 DAL 이라고 명칭을 사용하는데, 제 서버 구조에서는 mongoose 모듈을 이용하여 몽고 디비에 쿼리를 날리는 역할과 예외처리가 담겨 있습니다.
* model : 프로젝트 상에서 모델도 설명을 해야 하는데, mongoose.Schema 를 통해서 인스턴스로 생성이 되고, 데이터의 형태 (스키마) 와 데이터 입출력시 유효성을 담당하는 메서드들로 이루어져 있습니다.
* 이렇게 생성된 mongoose.model() 을 DAL 에서 사용하게 됩니다.

출처 : [wikipedia](https://en.wikipedia.org/wiki/Data_access_layer)

## query?
쿼리는 디비에게 내리는 명령어로, 질의 라고 불리죠, 이러한 질의의 문법과 조합에 따라서 원하는 정보를 수집해서 가져올 수 있습니다.

> 몽고디비 질의문 문서를 보면 Node.js 에서 어떻게 잘의문을 설정해야 하는지에 대해서 설명이 잘 나와있습니다. 참고하세요~

참고 : [docs.mongodb.com](https://docs.mongodb.com/manual/tutorial/query-documents/)

> 하지만 몽구스를 사용하시면 몽구스 사용 예제를 보셔야 겠죵?

참고 : [mongoosejs](http://mongoosejs.com/docs/queries.html)

* 몽구스는 "thenable" 입니다. 다라서 콜백핼을 생성하지 않고도 순차적 처리가 가능합니다.

참고 : [mongoosejs](http://mongoosejs.com/docs/promises.html)

* 실제 적용 예시

```javascript
const User   = require('./user-schema');
const method = {};

// 유저 생성
method.createUser = (userEmail, userPwd, userName) => {
	const newUser     = new User();
	newUser.userEmail = userEmail;
	newUser.userPwd   = userPwd;
	newUser.userName  = userName;
	const query       = newUser.save();
	return query.then(() => `created user ${userName}`)
                 .catch((err) => err);
};

// 모든 유저리스트를 가져온다
method.getUsers = () => {
	const query = User.find({}, 'userEmail userPwd userName');
	return query.select('userEmail userPwd userName')
                 .then((users) => users)
                 .catch((err) => err);
};

// userEmail 으로 유저 한명을 찾기
method.getUserByUserEmail = (userEmail, userPwd, done) => {
	const query = User.findOne({userEmail: userEmail}, 'userEmail userPwd userName');
	return query.select('userEmail userPwd userName')
	             .then((user) => !user ? done(null, false) : user)
                 .then((user) => user.comparePassword(userPwd) ? done(null, user) : done(null, false))
                 .catch((err) => done(err));
};

module.exports = method;
```

## callback hell & promise
* 콜백헬이 생기는 이유와 해결법인 프로미스에 대해서 알아보자

참고 : [medium.com](https://medium.com/@pitzcarraldo/callback-hell-%EA%B3%BC-promise-pattern-471976ffd139)

## pipeline pattern

> 파이프 함수는 n 개의 연산 순서를 취합니다. 각 연산은 인수를 취하고, 그것을 처리합니다.
> 처리 된 출력을 시퀀스의 다음 작업을위한 입력 으로 제공합니다.
> 파이프 함수의 결과는 조작 순서의 묶음 버전입니다.

* 파이프는 함수를 순서에 맞게 실행시기는 일종의 기법입니다. 참고자료를 통해서 알아가시면 좋을것 같아요.

참고 : [medium.com](https://medium.com/@venomnert/pipe-function-in-javascript-8a22097a538e)