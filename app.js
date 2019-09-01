'use strict';

// https://jetalog.net/73
var hostname1 = 'localhost';
var hostname2 = '127.0.0.1';
var hostname3 = '52.78.217.29';
var hostname4 = 'ec2-52-78-217-29.ap-northeast-2.compute.amazonaws.com';
var hostname5 = 'www.indiens.io';
var hostname6 = 'www.indiens.co.kr';
var hostname7 = 'indiens.io';
var hostname8 = 'indiens.co.kr';
/*
var hostname3 = '211.254.215.63';
var hostname4 = 'hellobiz.asuscomm.com';
var hostname5 = 'admin.pocketgo.app';
var hostname6 = 'pocketgo.app';
*/

var db = require('./lib/connection');
var express = require('express');
var app = express();


// MySQL ==================================================================================
db.connect(function (err) {
  if (err) {
    console.log('Unable to connect to MySQL.##################');
    process.exit(1);
  } else {
    console.log('connect to MySQL.############################');

    db.getConnection(function (err, connection) {
      // console.log('DB연결 성공!!!!');

      // rchat.create(function (err) {
      // rchat.login(function (err) {
      //     console.log('Rocket.Chat Login ############################');

      const vhost = require('vhost');

      var vhost1 = createVirtualHost(connection, './public');
      app.use(vhost(hostname1, vhost1));
      app.use(vhost(hostname3, vhost1));
      app.use(vhost(hostname4, vhost1));
      app.use(vhost(hostname5, vhost1));
      app.use(vhost(hostname6, vhost1));
      app.use(vhost(hostname7, vhost1));
      app.use(vhost(hostname8, vhost1));
/*      app.use(vhost(hostname3, vhost1));
      app.use(vhost(hostname4, vhost1));
      app.use(vhost(hostname5, vhost1));
      app.use(vhost(hostname6, vhost1));*/
      /*app.use(vhost(hostname4, vhost1));
      app.use(vhost(hostname5, vhost1));
      app.use(vhost(hostname6, vhost1));*/

      var vhost2 = createVirtualHost(connection, './public_admin');
      app.use(vhost(hostname2, vhost2));
      // app.use(vhost(hostname7, vhost2));
      // app.use(vhost(hostname8, vhost2));
      //     });
      // });
    });
  }
});

function createVirtualHost(connection, dirPath) {
  var app = express();
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');

  var config = require('./lib/config.js');
  var multipart = require('connect-multiparty');

  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(logger('dev'));

  app.set('json replacer', fnReviver);

  // http://expressjs.com/en/4x/api.html
  function fnReviver(key, value) {
    // console.log('########################\n', key, '\t', typeof value, '\n@\n', value);
    if (typeof value === 'number') {
      return value.toString();
    } else if (value == null) {
      return '';
    } else {
      return value;
    }
  }

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());

  // https://github.com/expressjs/cors
  var cors = require('cors');
  app.use(cors());

  app.use(multipart({
    uploadDir: config.tmp
  }));

  // app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, dirPath)));
  app.use(config.imgRoot, express.static(config.uploadDir));
  app.use('/attach', express.static('/home/indiens/upload/attach/'));

// API ====================================================================================
  app.use('/', require('./routes/index'));
  // var users = require('./routes/users');
  app.use('/api/TB_MEMBER', require('./routes/TB_MEMBER'));
  app.use('/api/TB_QUESTION', require('./routes/TB_QUESTION'));
  app.use('/api/TB_PROJECT', require('./routes/TB_PROJECT'));
  app.use('/api/TB_PARTNER', require('./routes/TB_PARTNER'));
  app.use('/api/TB_PORTFOLIO', require('./routes/TB_PORTFOLIO'));
  app.use('/api/TB_FABS', require('./routes/TB_FABS'));
  app.use('/api/TB_BOARD', require('./routes/TB_BOARD'));
  app.use('/api/TB_GAMES', require('./routes/TB_GAMES'));
  app.use('/api/TB_JOBS', require('./routes/TB_JOBS'));
  app.use('/api/TB_PROPOSAL', require('./routes/TB_PROPOSAL'));
  app.use('/api/TB_MESSAGE', require('./routes/TB_MESSAGE'));
  app.use('/api/TB_COIN', require('./routes/TB_COIN'));

/*  app.use('/api/TB_ADMIN', require('./routes/TB_ADMIN'));
  app.use('/api/TB_MEMBER', require('./routes/TB_MEMBER'));
  app.use('/api/TB_CAR', require('./routes/TB_CAR'));
  app.use('/api/TB_SUBSCRIPT', require('./routes/TB_SUBSCRIPT'));

  app.use('/api/member', require('./routes/IF_MEMBER'));
  app.use('/api/subscription', require('./routes/IF_SUBSCRIPT'));

  app.use('/api/IF_KAKAO', require('./routes/IF_KAKAO'));*/

  // 로그인 처리 시작(하단 api 선언보다 나중에 있으면 chat_login 에서 req.user에 값이 비어있다) ==================================================================================
  var sessionStore = new MySQLStore({}/* session store options */, connection);

  app.use(session({
    secret: 'lunch cat',
    resave: false,
    saveUninitialized: false,
    key: 'lunch key',
    store: sessionStore
  }));

  var passport = require('passport');
  app.use(passport.initialize()); // Express 연결
  app.use(passport.session()); // 로그인 세션 유지

  // 로그인 처리 route 추가
  var security = require('./lib/security');
  require('./routes/security').addRoutes(app, security);

  app.use(function (req, res, next) { // Angularjs가 IE8에서 동작하지 않는문제로 redirect 처리
    if (req.user) {
      console.log('Current User:', req.user.email, req.user.user_id, req.user.admin_yn);
    } else {
      console.log('Unauthenticated ' + req.isAuthenticated());
    }
    next();
  });

  // 로그인 처리 끝 ==================================================================================

// catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  })
  ;

  return app;
}

module.exports = app;
