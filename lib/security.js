var passport = require('passport');

// 패스포트 세팅
require('./passport').setup();

var filterUser = function (user) {
    if (user) {
        /*return {
            user: {
                MEM_ID: user.MEM_ID,
                MEM_UID: user.MEM_UID,
                MEM_PASS: user.MEM_PASS,
                MEM_NICK: user.MEM_NICK,
                MEM_NAME: user.MEM_NAME,
                MEM_TEL: user.MEM_TEL,
                MEM_AGE: user.MEM_AGE,
                MEM_SEX: user.MEM_SEX,
                MEM_PUSH_TK: user.MEM_PUSH_TK,
                MEM_IMG: user.MEM_IMG,
                MEM_TYPE: user.MEM_TYPE,
                MEM_ROCKET_ID: user.MEM_ROCKET_ID,
                MEM_ROCKET_NM: user.MEM_ROCKET_NM,
                AM_ID: user.AM_ID,
                AM_EMAIL: user.AM_EMAIL,
                AM_NAME: user.AM_NAME
            }
        };*/
        return {user: user};
    } else {
        return {user: null};
    }
};

var security = {
    /*initialize: function(url, apiKey, dbName, authCollection) {
     passport.use(new MongoStrategy(url, apiKey, dbName, authCollection));
     },*/
    authenticationRequired: function (req, res, next) {
        console.log('authRequired');
        if (req.isAuthenticated()) {
            next();
        } else {
            res.json(401, filterUser(req.user));
        }
    },
    adminRequired: function (req, res, next) {
        console.log('adminRequired');
        if (req.user && req.user.admin) {
            next();
        } else {
            res.json(401, filterUser(req.user));
        }
    },
    sendCurrentUser: function (req, res, next) {
        // res.json(200, filterUser(req.user));
        res.status(200).json(filterUser(req.user));
        res.end();
    },

    updateCurrentUser: function (req, res, next) {
        var user_name = req.query.user_name;
        req.user.user_name = user_name;
        res.status(200).json(filterUser(req.user));
        res.end();
    },

    login: function (req, res, next) {
        return passport.authenticate('local', function (err, user, info) {
            var error = err || info;

            if (error) {
                console.log("**** security의 login 함수")
                // return res.json(401, error);
                return res.status(401).send({'message': error});
            }

            if (!user) {
                // return res.json(404, {message: 'Something went wrong, please try again.'});
                console.log('**** security의 login 함수 404 : 이메일 또는 비밀번호가 일치하지 않습니다.');
                return res.status(404).send({message: '이메일 또는 비밀번호가 일치하지 않습니다.'});
                // return res.status(200).json(filterUser(user));
            }

            // 인증된 유저 정보로 응답
            // res.json(req.user);
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }

                var userJson = filterUser(user);

                console.log('**** 로그인 사용자정보 : ');
                console.log(userJson)

                return res.status(200).json(userJson);
            });
        })(req, res, next);
    },

    logout: function (req, res, next) {
        console.log('**** security의 로그아웃 ');
        req.logout();
        res.send(204);
    }
};

module.exports = security;