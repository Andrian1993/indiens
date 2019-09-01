'use strict';

var db = require('./connection');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var cm = require('./common.js');

exports.setup = function () {
    // console.log('##### passport.setup #####');

    // app.use(passport.initialize()); // Express 연결
    // app.use(passport.session()); // 로그인 세션 유지

    passport.serializeUser(function (user, done) {
        // done(null, user.email);
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        return done(null, user);
        /*User.findOne({
         where: {
         email: user.email
         }
         }).then(function (user) {
         done(null, user);
         }).catch(function (err) {
         done(err);
         });*/
    });

    // TODO : 비밀번호 암호화 처리 필요
    // http://stackoverflow.com/questions/11784233/using-passportjs-how-does-one-pass-additional-form-fields-to-the-local-authenti
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            console.log('login');
            var gubun = req.body.gubun;
            console.log('##### LocalStrategy ' + email + ' @ ' + password + ' #####');
            // 인증 정보 체크 로직

            var encPassword = cm.encString(password);
            // var encPassword = password;

            if (gubun == 1) { // 회원
                console.log('**** 회원 로그인')


                //db.select('SELECT * FROM ?? WHERE MEM_UID = ? and MEM_PASS = ?',
                db.select('SELECT * FROM ?? WHERE MEM_EMAIL = ? and MEM_PASS = ? and MEM_EXIT_DT IS NULL',
                    ['TB_MEMBER', email, encPassword],
                    function (err, results) {
                        if (err) {
                            console.log("**** 로그인 에러발생 : " + err.message)
                            return done(null, null);
                        }

                        if (results && results.length > 0) {
                            var user = {
                                MEM_EMAIL: results[0].MEM_EMAIL,
                                MEM_ID: results[0].MEM_ID,
                                MEM_NAME: results[0].MEM_NAME,
                                MEM_TEL: results[0].MEM_TEL,
                                MEM_TYPE: results[0].MEM_TYPE,
                                MEM_SKILLS: results[0].MEM_SKILLS,
                                MEM_LANG: results[0].MEM_LANG,
                                MEM_ADMIN_YN: results[0].MEM_ADMIN_YN,
                                MEM_COINS: results[0].MEM_COINS

                                /*MEM_NAME: results[0].MEM_NAME,*/
                                /*MEM_AGE: results[0].MEM_AGE,*/
                                /*MEM_SEX: results[0].MEM_SEX,*/
                                /*MEM_PUSH_TK: results[0].MEM_PUSH_TK,*/
                                /*MEM_IMG: results[0].MEM_IMG,*/
                                /*MEM_TYPE: results[0].MEM_TYPE,*/
                                /*MEM_ROCKET_ID: results[0].MEM_ROCKET_ID,
                                MEM_ROCKET_NM: results[0].MEM_ROCKET_NM*/
                            };

                            console.log("**** 로그인 성공 : ");
                            console.log(user);

                            done(null, user);

                        } else {
                            console.log("**** 로그인 성공 : 해당 회원정보가 없음.")
                            return done(null, null);
                        }
                    });
            } else { // 관리자 로그인
                console.log('관리자 로그인');
                // var encPassword = cm.encString(password);
                var encPassword = password;

                db.select('SELECT * FROM ?? where ADM_USR_ID = ? and ADM_USR_PASS = PASSWORD(?)',
                    // db.select('SELECT ?? FROM ?? where id = ?',
                    //     [columns, 'tb_news', newsid],
                    ['tb_admin', email, encPassword],
                    function (err, results) {
                        if (err) {
                            return done(null, null);
                        }

                        if (results && results.length > 0) {
                            var user = {
                                ADM_EMAIL: results[0].ADM_EMAIL,
                                ADM_NAME: results[0].ADM_NAME,
                                ADM_USR_ID: results[0].ADM_USR_ID,
                                admin_yn: 'Y'/*,
                                level: 0
                                admin_yn: results[0].admin_yn,
                                level: results[0].level*/
                            };
                            done(null, user);
                        } else {
                            return done(null, null);
                        }
                    });
            }
        }
    ));
};
