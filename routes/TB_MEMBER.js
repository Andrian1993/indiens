/*
TB_MEMBER	일반회원
 */
var table_name = 'TB_MEMBER';
var express = require('express');
var router = express.Router();
var async = require('async');
var db = require('../lib/connection');
var cm = require('../lib/common.js');
// var rchat = require('../lib/RocketChat.js');
var config = require('../lib/config');
var fse = require('fs-extra');
var path = require('path');
let nodemailer = require("nodemailer");

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let transporter = nodemailer.createTransport({
    host: 'smart.whoismail.net',
    port: 587,
    // secure: true, // use SSL
    secure: false, // use SSL
    auth: {
        user: 'mail@indiens.io',
        pass: 'korea7601!'
    }
});


// 회원가입(일반회원)
router.post('/signup', function (req, res, next) {
    var data = req.body;
    var MEM_EMAIL = data.MEM_EMAIL, MEM_ID = data.MEM_ID;
    data.MEM_PASS = cm.encString(data.MEM_PASS);
    //var MEM_ROCKET_ID, MEM_ROCKET_NM;
    /*if (data.TEA_TYPE == '1') {
        data.TEA_PRICE_TYPE = '1'
    } else {
        data.TEA_PRICE_TYPE = '2'
    }*/


    delete data.chk1;
    delete data.chk2;
    delete data.confirm_password;

    var promise1 = cm.promiseFindMbrById(MEM_EMAIL, null);

    promise1.then(function (results) {
        if (results) {
            return Promise.reject({code: 405, message: MEM_EMAIL + ' 은 이미 가입된 이메일 입니다!', data: ''});
            // return res.json({code: 405, message: MEM_EMAIL + ' 은 이미 가입된 이메일 입니다!', data: ''});
        }
    }).then(function (results) {
        async.waterfall([
                function (done) { // 회원정보 입력
                    if (!MEM_ID) {
                        db.exec('INSERT INTO ?? SET ?', [table_name, data], function (err, result) {
                            done(err, result);
                        });
                    } else {
                        var post = {
                            MEM_TYPE: data.MEM_TYPE,
                        };
                        db.exec('UPDATE ?? SET ? WHERE MEM_ID = ?', [table_name, post, MEM_ID], function (err, result) {
                            done(err, result);
                        });
                    }
                },
                /*function (result, done) {
                    data['TEA_NUM'] = result.insertId;

                    var user = {
                        id: data.TEA_NUM,
                        name: data.TEA_NAME
                        // username: data.MEM_NICK, // RocketChat username은 중복되면 안되고, 사용자 db를 초기화하면 기존 RocketChat 정보가 남아있어서 문제가 된적이 있다
                    };

                    rchat.userCreate2(user, function (err, result) {
                        done(err, result);
                    });
                },*/
                /*function (result, done) {
                    TEA_ROCKET_NM = result.user.username;
                    db.exec('UPDATE ?? SET ? WHERE TEA_NUM = ?', [table_name, {
                        TEA_ROCKET_NM: TEA_ROCKET_NM
                    }, data.TEA_NUM], function (err, result) {
                        done(err, result);
                    });
                }*/



                /*          function (result, done) {
                              var user = {
                                  id: data.TEA_ID,
                                  name: data.TEA_NAME
                                  // username: data.MEM_NICK, // RocketChat username은 중복되면 안되고, 사용자 db를 초기화하면 기존 RocketChat 정보가 남아있어서 문제가 된적이 있다
                              }

                              /!*rchat.userCreate(user, function (err, result) {
                                  done(err, result);
                              });*!/
                          },*/
                /*                function (result, done) {
                                    MEM_ROCKET_ID = result.user._id, MEM_ROCKET_NM = result.user.username;
                                    db.exec('UPDATE ?? SET ? WHERE MEM_ID = ?', [table_name, {
                                        MEM_ROCKET_ID: MEM_ROCKET_ID,
                                        MEM_ROCKET_NM: MEM_ROCKET_NM
                                    }, data.MEM_ID], function (err, result) {
                                        // 공지사항 비밀그룹에 가입
                                        rchat.Groupsinvite(config.notice_roomt_id, MEM_ROCKET_ID, function (err, result) {
                                            done(err, result);
                                        });
                                    });
                                }*/
            ],
            function (err, data) {
                data['MEM_NUM'] = data.insertId;
                if (err) {
                    console.error('에러 ====== 회원가입(일반회원) : ' + err);
                    return res.json({code: 500, message: '회원가입시 에러가 발생하였습니다.', data: ''});
                } else {
                    return res.json({code: 200, message: '', data: data});
                }
            }
        );
    }, function (error) {
        return res.json(error);
    })


});


// 회원가입(일반회원)
router.post('/signupUpdate', function (req, res, next) {
    var data = req.body;
    var MEM_EMAIL = data.MEM_EMAIL, MEM_ID = data.MEM_ID;

    if(data.MEM_PASS_NEW) {
        data.MEM_PASS_NEW = cm.encString(data.MEM_PASS_NEW);
        data.MEM_PASS = data.MEM_PASS_NEW;
    }

    delete data.chk1;
    delete data.chk2;
    delete data.confirm_password;
    delete data.confirm_password_new;
    delete data.MEM_PASS_NEW;


    var promise1 = cm.promiseFindMbrById(MEM_EMAIL, MEM_ID);

    promise1.then(function (results) {
        if (results) {
            return Promise.reject({code: 405, message: MEM_EMAIL + ' 은 이미 가입된 이메일 입니다!', data: ''});
            // return res.json({code: 405, message: MEM_EMAIL + ' 은 이미 가입된 이메일 입니다!', data: ''});
        }
    }).then(function (results) {
        async.waterfall([
                function (done) { // 회원정보 입력
                    db.exec('UPDATE ?? SET ? WHERE MEM_ID = ?', [table_name, data, MEM_ID], function (err, result) {
                        done(err, result);
                    });
                },
            ],
            function (err, data) {
                data['MEM_NUM'] = MEM_ID;
                if (err) {
                    console.error('에러 ====== 회원가입(일반회원) : ' + err);
                    return res.json({code: 500, message: '회원가입시 에러가 발생하였습니다.', data: ''});
                } else {
                    return res.json({code: 200, message: '', data: data});
                }
            }
        );
    }, function (error) {
        return res.json(error);
    })


});

// 수정
router.post('/', function (req, res, next) {
    var data = req.body;
    var MEM_ID = data.MEM_ID;
    var MEM_STEP = data.MEM_STEP, details = data.details;



    if (MEM_STEP == '2') {
        var post = {
            MEM_TYPE: data.MEM_TYPE
        };

        async.waterfall([
                function (done) {
                    db.exec('UPDATE ?? SET ? WHERE MEM_ID = ?', [table_name, post, MEM_ID], function (err, result) {
                        done(err, result);
                    });
                }],
            function (err, data) {
                if (err) {
                    console.error(err);
                    return res.json({code: 500, message: '내 프로필 수정시 에러가 발생하였습니다.', data: ''});
                } else {
                    return res.json({code: 200, message: '', data: data});
                }
            }
        );
    } else if (MEM_STEP == '3') {
        var post2 = {
            MEM_SKILLS: data.MEM_SKILLS,
            MEM_LANG_ETC: data.MEM_LANG_ETC,
            MEM_LINK: data.MEM_LINK,
            MEM_JOB: data.MEM_JOB
        };

        if (data.MEM_LANG) post2.MEM_LANG = JSON.stringify(data.MEM_LANG);


        async.waterfall([
                function (done) {
                    db.exec('UPDATE ?? SET ? WHERE MEM_ID = ?', [table_name, post2, MEM_ID], function (err, result) {
                        done(err, result);
                    });
                },
                function (result, done) {
                    if (details && details.length > 0) {
                        var TB_GAMES = [];

                        for (var i = 0; i < details.length; i++) {
                            TB_GAMES.push([MEM_ID, details[i].GME_TYPE, details[i].GME_NAME, details[i].GME_ROLE]);
                        }

                        db.exec('INSERT INTO TB_GAMES(MEM_ID, GME_TYPE, GME_NAME, GME_ROLE) VALUES ? ', [TB_GAMES], function (err, result) {
                            if (err) console.error('에러 ====== 레시피 식재료 정보 입력 : ' + err);
                            done(err, result);
                        });
                    } else {
                        done(null, null);
                    }
                }
                ],
            function (err, data) {
                if (err) {
                    console.error(err);
                    return res.json({code: 500, message: '내 프로필 수정시 에러가 발생하였습니다.', data: ''});
                } else {
                    return res.json({code: 200, message: '', data: data});
                }
            }
        );
    }

});

// email로 검색
router.get('/findEmail', function (req, res, next) {
    var MEM_NAME = req.query.MEM_NAME, MEM_TEL = req.query.MEM_TEL;

    var query = 'SELECT ' +
        '    MEM_EMAIL' +
        ' FROM ??' +
        ' WHERE' +
        '    MEM_NAME = ? AND MEM_TEL = ?';

    async.waterfall([
            function (done) {
                db.select(query, [table_name, MEM_NAME, MEM_TEL],
                    function (err, data) {
                        done(err, data);
                    });
            }],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                if (data && data.length > 0) {
                    res.json(data[0]);
                } else {
                    res.json(data);
                }
            }
        }
    );
});

// 멤버 리스트
router.get('/getList2', function (req, res, next) {
    var data = req.query;
    var firstRow = parseInt(data.firstRow), lastRow = parseInt(data.lastRow);
    var keyword = data.keyword;
    var NOTI_CONTENT = data.NOTI_CONTENT;
    var values = [];
    var where = '';


    if (data.MEM_TYPE && data.MEM_TYPE > 0) {
        where = cm.whereConcatenator(where, ' MEM_TYPE = ?');
        values.push(data.MEM_TYPE);
    }

    if (data.MEM_NAME) {
        where = cm.whereConcatenator(where, ' MEM_NAME LIKE ?');
        values.push('%' + data.MEM_NAME + '%');
    }

    values.push(firstRow);
    values.push(lastRow);

    var query = 'SELECT ' +
        '    MEM_ID, MEM_NAME, MEM_TEL, MEM_EMAIL,' +
        '    CASE MEM_TYPE\n' +
        '        WHEN \'1\' THEN \'기획자\'\n' +
        '        WHEN \'2\' THEN \'개발자\'\n' +
        '        WHEN \'3\' THEN \'원화가\'\n' +
        '        WHEN \'4\' THEN \'작곡가\'\n' +
        '        WHEN \'5\' THEN \'작가\'\n' +
        '        WHEN \'6\' THEN \'크리에이터\'\n' +
        '        WHEN \'7\' THEN \'기타\'\n' +
        '    END AS MEM_TYPE' +
        ' FROM' +
        '    TB_MEMBER' + where +
        ' ORDER BY MEM_ID DESC' +
        ' LIMIT ?, ?';

    var query2 = 'SELECT ' +
        '    COUNT(1) AS cnt' +
        ' FROM' +
        '    TB_MEMBER' + where;

    async.waterfall([
            function (done) {
                db.exec(query, values, function (err, results) {
                    done(err, results);
                });
            },
            function (results, done) {
                list = results;

                db.select(query2, values,
                    function (err, results) {
                        done(err, results);
                    });
            }],
        function (err, data) {
            if (err) {
                console.error('에러 ====== %s 테이블 검색 에러 : ', '공지사항 목록', err);
                return res.status(500).send({result: err});
            } else {
                var icount = 0;

                for (var i = 0; i < list.length; i++) {
                    list[i].rownum = data[0].cnt - firstRow - (icount++);
                }

                data[0]['list'] = list;
                res.json(data);
            }
        }
    );
});

// 멤버 직군 받기(포트폴리오 등록 시)
router.get('/getUserType', function (req, res, next) {
    var data = req.query;
    var MEM_ID = data.MEM_ID;

    var query = 'SELECT ' +
        '    MEM_ID, MEM_TYPE ' +
        ' FROM ' +
        '    TB_MEMBER ' +
        ' WHERE MEM_ID = ?';


    async.waterfall([
            function (done) {
                db.select(query, [MEM_ID],function (err, results) {
                        done(err, results);
                    });
            }
            ],
        function (err, data) {
            if (err) {
                console.error('에러 ====== %s 테이블 검색 에러 : ', '공지사항 목록', err);
                return res.status(500).send({result: err});
            } else {
                res.json(data[0]);
            }
        }
    );
});

//회원 상세
router.get('/:id', function (req, res, next) {
    var id = req.params.id, list, ptf;

    var query = 'SELECT ' +
        ' MEM_ID, MEM_ID as id, MEM_IMG, MEM_NAME, MEM_EMAIL, MEM_TEL, MEM_JOB, ' +
        ' MEM_TYPE, ' +
        /*'    CASE MEM_TYPE\n' +
        '        WHEN \'1\' THEN \'기획자\'\n' +
        '        WHEN \'2\' THEN \'개발자\'\n' +
        '        WHEN \'3\' THEN \'원화가\'\n' +
        '        WHEN \'4\' THEN \'작곡가\'\n' +
        '        WHEN \'5\' THEN \'작가\'\n' +
        '        WHEN \'6\' THEN \'크리에이터\'\n' +
        '        WHEN \'7\' THEN \'기타\'\n' +
        '    END AS MEM_TYPE,' +*/
        ' MEM_SKILLS, MEM_LANG, IFNULL(MEM_COINS, 0) AS MEM_COINS, MEM_LANG_ETC, MEM_LINK ' +
        ' FROM ??' +
        ' WHERE' +
        '    MEM_ID = ?';


    var query2 = 'SELECT ' +
        '          GME_ID, GME_TYPE, GME_NAME, GME_ROLE, GME_DT' +
        '                    FROM' +
        '                        TB_GAMES' +
        '                     WHERE' +
        '                        MEM_ID = ?';


    var query3 = 'SELECT * FROM TB_PORTFOLIO WHERE MEM_ID = ?';

    async.waterfall([
            function (done) {
                db.select(query2, [id],
                    function (err, data) {
                        done(err, data);
                    });
            },
            function (results, done) {
                list = results;
                db.select(query3, [id],
                    function (err, data) {
                        done(err, data);
                    });
            },
            function (results, done) {
                ptf = results;
                db.select(query, [table_name, id],
                    function (err, data) {
                        done(err, data);
                    });
            }
            ],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                if (data && data.length > 0) {
                    data[0]['list'] = list;
                    data[0]['ptf'] = ptf;
                    res.json(data[0]);
                } else {
                    res.json(data);
                }
            }
        }
    );
});

//회원가입 2스탭에 '이전' 버튼 누를 때 불러오는 API
router.get('/get/getUserInfo', function (req, res, next) {
    var id = req.query.MEM_ID, list, ptf;

    var query = 'SELECT ' +
        ' MEM_ID, MEM_NAME, MEM_EMAIL, MEM_TEL ' +
        ' FROM ??' +
        ' WHERE' +
        '    MEM_ID = ?';

    async.waterfall([
            function (done) {
                db.select(query, [table_name, id],
                    function (err, data) {
                        done(err, data);
                    });
            }
        ],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                return res.json(data);
            }
        }
    );
});

//회원 상세 수정
router.post('/updateData', function (req, res, next) {
    var data = req.body;
    var MEM_ID = data.MEM_ID;
    var MEM_STEP = data.MEM_STEP;

    var post = {
        MEM_TYPE: data.MEM_TYPE,
        MEM_NAME: data.MEM_NAME,
        MEM_TEL: data.MEM_TEL,
        MEM_EMAIL: data.MEM_EMAIL
    };

    async.waterfall([
            function (done) {
                db.exec('UPDATE ?? SET ? WHERE MEM_ID = ?', [table_name, post, MEM_ID], function (err, result) {
                    done(err, result);
                });
            }],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.json({code: 500, message: '내 프로필 수정시 에러가 발생하였습니다.', data: ''});
            } else {
                return res.json({code: 200, message: '', data: data});
            }
        }
    );


});

//회원 관리 페이지 회원 수정
router.post('/updateDataAdmin', function (req, res, next) {
    var data = req.body;
    var MEM_ID = data.MEM_ID;
    var MEM_STEP = data.MEM_STEP, details = data.details;

    if (data.MEM_LANG) data.MEM_LANG = JSON.stringify(data.MEM_LANG);

    var post = {
        MEM_TYPE: data.MEM_TYPE,
        MEM_NAME: data.MEM_NAME,
        MEM_TEL: data.MEM_TEL,
        MEM_EMAIL: data.MEM_EMAIL,
        MEM_SKILLS: data.MEM_SKILLS,
        MEM_COINS: data.MEM_COINS,
        MEM_LINK: data.MEM_LINK,
        MEM_JOB: data.MEM_JOB,
        MEM_LANG: data.MEM_LANG,
        MEM_LANG_ETC: data.MEM_LANG_ETC
    };

    async.waterfall([
            function (done) {
                db.exec('UPDATE ?? SET ? WHERE MEM_ID = ?', [table_name, post, MEM_ID], function (err, result) {
                    done(err, result);
                });
            },
            function (result, done) {
                if (details && details.length > 0) {
                    var TB_GAMES = [];

                    for (var i = 0; i < details.length; i++) {
                        TB_GAMES.push([MEM_ID, details[i].GME_TYPE, details[i].GME_NAME, details[i].GME_ROLE]);
                    }

                    db.exec('INSERT INTO TB_GAMES(MEM_ID, GME_TYPE, GME_NAME, GME_ROLE) VALUES ? ', [TB_GAMES], function (err, result) {
                        if (err) console.error('에러 ====== 레시피 식재료 정보 입력 : ' + err);
                        done(err, result);
                    });
                } else {
                    done(null, null);
                }
            }
        ],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.json({code: 500, message: '내 프로필 수정시 에러가 발생하였습니다.', data: ''});
            } else {
                return res.json({code: 200, message: '', data: data});
            }
        }
    );


});

// 삭제
router.post('/deleteMember', function (req, res, next) {
    var data = req.body;
    var MEM_ID = data.id;

    async.waterfall([
            function (done) {
                db.exec('DELETE FROM ?? WHERE MEM_ID = ?', [table_name, MEM_ID], function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    done(null, result.changedRows);
                });
            }],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                res.json(data);
            }
        }
    );
});

// 이미지 압로드
router.post('/upload', function (req, res, next) {
    var file = req.files.file;
    var MEM_ID = req.body.MEM_ID, idx = req.body.idx;
    var newFileNm = idx + MEM_ID + path.extname(file.name);
    var post = {};

    var uploadPath = path.normalize(config.uploadDir + '/member/') + newFileNm;

    async.waterfall([

            function (done) { // 파일 tmp -> 폴더로 이동
                fse.move(file.path, uploadPath, {clobber: true}, function (err) {
                    done(err, newFileNm);
                });
            },
            function (newFileNm, done) { //
                var MEM_PROF_IMG_URL = config.imgRoot + '/member/' + newFileNm;
                post['MEM_IMG'] = MEM_PROF_IMG_URL;

                db.exec('UPDATE ?? SET MEM_IMG = ? WHERE MEM_ID = ?', [table_name, MEM_PROF_IMG_URL, MEM_ID], function (err, result) {
                    done(err, result);
                });
            }
        ],
        function (err, result) {
            if (err) {
                console.error(err);
                res.status(500).send();
            } else {
                // res.status(200).send(result.changedRows);
                res.status(200).send(post);
            }
        }
    );
});

router.get('/get/resetPwd', function (req, res, next) {
    let encString = req.query.id;

    let decString = cm.decrypt(encString);
    console.log('############', decString);
    let MEM_ID = decString;

    // let MEM_ID = data.MEM_ID, MEM_NAME = null;
    let query, values = [MEM_ID];

    query = 'SELECT ' +
        '    MEM_ID, MEM_NAME, MEM_EMAIL ' +
        ' FROM' +
        '    TB_MEMBER' +
        ' WHERE MEM_ID = ?';

    async.waterfall([
            function (done) {
                db.select(query, values, function (err, data) {
                    done(err, data);
                });
            }],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                if (data && data.length > 0) {
                    res.json(data[0]);
                } else {
                    res.json(data);
                }
            }
        }
    );
});

// 비밀번호 재설정
router.post('/resetPwd', function (req, res, next) {
    let data = req.body;
    let MEM_ID = data.MEM_ID, MEM_PASS = data.MEM_PASS;
    let values;
    let query = 'UPDATE ?? SET ? WHERE ?? = ?';
    let newPasswd = cm.encString(MEM_PASS);

    values = ['TB_MEMBER', {MEM_PASS: newPasswd}, 'MEM_ID', MEM_ID];


    async.waterfall([
            function (done) {
                db.exec(query, values, function (err, data) {
                    done(err, data);
                });
            }],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                return res.json({code: 200, message: '', data: data});
            }
        }
    );
});

// 비밀번호 찾기
router.post('/findPasswd', function (req, res, next) {
    let data = req.body;
    let MEM_EMAIL = data.MEM_EMAIL, MEM_NAME = data.MEM_NAME, MEM_TEL = data.MEM_TEL, MEM_ID = null;
    let query;

    query = 'SELECT ' +
        '    MEM_ID  ' +
        ' FROM' +
        '    TB_MEMBER' +
        ' WHERE MEM_EMAIL = ? AND MEM_TEL = ? AND MEM_NAME = ?';

    async.waterfall([
            function (done) {
                db.select(query, [MEM_EMAIL, MEM_TEL, MEM_NAME], function (err, data) {
                    done(err, data);
                });
            },
            function (results, done) {
                if (results && results.length > 0) {
                    MEM_ID = results[0]['MEM_ID'];

                    let encString = cm.encrypt(MEM_ID.toString());
                    console.log(encString);

                    let decString = cm.decrypt(encString);
                    console.log(decString);


                    var mailOptions = {
                        to: MEM_EMAIL,
                        from: 'mail@indiens.io',
                        subject: '인디언즈 비밀번호 재설정 안내',
                        text: '안녕하세요! 인디언즈 입니다.\n\n' +
                            '아래 링크를 클릭하신 후 새 비밀번호를 설정해주시기 바랍니다.\n\n' +
                            'http://' + req.headers.host + '/#!/resetPasswd/' + encString + '\n\n' +
                            '비밀번호 재설정 신청을 하지 않으셨다면 고객센터로 연락 주시기 바랍니다.\n\n감사합니다.\n'
                    };

                    transporter.sendMail(mailOptions, function(err) {
                        if(err) {
                            done(err, null)
                        } else {
                            console.log('info', 'An e-mail has been sent to with further instructions.');
                            done(null, null);
                        }
                    });
                } else {
                    done('ERROR', null);
                }
            }],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.json({code: 500, result: err});
            } else {
                return res.json({code: 200, MEM_NAME: MEM_NAME});
            }
        }
    );
});

// 회원 탈퇴
router.post('/delete', function (req, res, next) {
    var data = req.body;
    var MEM_ID = data.id;


    function fnDeleteProjectInfo(obj, doneCallback) {
        async.waterfall([
                function (done) {
                    db.exec('DELETE FROM ?? WHERE PJT_ID = ?', ['TB_PROPOSAL', obj.PJT_ID], function (err, result) {
                        done(null, result.changedRows);
                    });
                },
                function (results, done) {
                    db.exec('DELETE FROM ?? WHERE PJT_ID = ?', ['TB_JOBS', obj.PJT_ID], function (err, result) {
                        done(null, result.changedRows);
                    });
                },
                function (results, done) {
                    db.exec('DELETE FROM ?? WHERE PJT_ID = ?', ['TB_FABS', obj.PJT_ID], function (err, result) {
                        done(null, result.changedRows);
                    });
                },
                function (results, done) {
                    db.exec('DELETE FROM ?? WHERE PJT_ID = ?', ['TB_PROJECT', obj.PJT_ID], function (err, result) {
                        done(null, result.changedRows);
                    });
                }
            ],
            function (err, data) {
                if (err) {
                    doneCallback(err, null);
                } else {
                    doneCallback(null, obj);
                }
            }
        );
    }


    async.waterfall([
            function (done) {
                db.select('SELECT PJT_ID FROM TB_PROJECT WHERE MEM_ID = ?', [MEM_ID],function (err, results) {
                    done(err, results);
                });
            },
            function (results, done) {
                if(results[0]) {
                    async.map(results, fnDeleteProjectInfo, function (err, data) {
                        done(err, data);
                    });
                } else {
                    done(null, null);
                }
            },
            function (results, done) {
                db.exec('DELETE FROM ?? WHERE PRO_RECEIVER = ?', ['TB_PROPOSAL', MEM_ID], function (err, result) {
                    done(null, result.changedRows);
                });
            },
            function (results, done) {
                db.exec('DELETE FROM ?? WHERE MSG_RECEIVER = ? OR MSG_SENDER = ?', ['TB_MESSAGE', MEM_ID, MEM_ID], function (err, result) {
                    done(null, result.changedRows);
                });
            },
            function (results, done) {
                db.exec('UPDATE ?? SET MEM_EXIT_DT = NOW() WHERE MEM_ID = ?', [table_name, MEM_ID], function (err, result) {
                    done(err, result);
                });
            }
        ],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.json({code: 500, message: err, data: []});
            } else {
                return res.json({code: 200, message: '', data: []});
            }
        }
    );
});

module.exports = router;
