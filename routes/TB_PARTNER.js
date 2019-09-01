var table_name = 'TB_MEMBER';
var express = require('express');
var router = express.Router();
var async = require('async');
var db = require('../lib/connection');
var cm = require('../lib/common.js');
/*var rchat = require('../lib/RocketChat.js');*/
var config = require('../lib/config');
// var FCM = require('fcm-node');
// var serverKey = require('../lib/yonghada-privatekey.json') //put the generated private key path here
// fcm = require('../lib/fcm');

// 목록
router.get('/', function (req, res, next) {
    var data = req.query;
    var firstRow = parseInt(data.firstRow), lastRow = parseInt(data.lastRow);
    var keyword = data.keyword;
    var NOTI_CONTENT = data.NOTI_CONTENT;
    var values = [];
    var where = ' WHERE MEM_ADMIN_YN != \'Y\' AND MEM_EXIT_DT IS NULL ';

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
        '    MEM_ID, MEM_NAME, MEM_IMG, ' +

        '    CASE MEM_SKILLS' +
        '        WHEN \'0\' THEN \'1년미만\'' +
        '        WHEN \'1\' THEN \'1년\'' +
        '        WHEN \'2\' THEN \'2년\'' +
        '        WHEN \'3\' THEN \'3년\'' +
        '        WHEN \'4\' THEN \'4년\'' +
        '        WHEN \'5\' THEN \'5년\'' +
        '        WHEN \'6\' THEN \'6년\'' +
        '        WHEN \'7\' THEN \'7년\'' +
        '        WHEN \'8\' THEN \'8년\'' +
        '        WHEN \'9\' THEN \'9년\'' +
        '        WHEN \'10\' THEN \'10년\'' +
        '        WHEN \'11\' THEN \'10년이상\'' +
        '    END AS MEM_SKILLS,' +

        '    CASE MEM_TYPE' +
        '        WHEN \'1\' THEN \'기획자\'' +
        '        WHEN \'2\' THEN \'개발자\'' +
        '        WHEN \'3\' THEN \'원화가\'' +
        '        WHEN \'4\' THEN \'작곡가\'' +
        '        WHEN \'5\' THEN \'작가\'' +
        '        WHEN \'6\' THEN \'크리에이터\'' +
        '        WHEN \'7\' THEN \'기타\'' +
        '    END AS MEM_TYPE' +
        ' FROM' +
        '    TB_MEMBER ' + where +
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

//파트너 상세
router.get('/:id', function (req, res, next) {
    var id = req.params.id, list, ptf;

    var query = 'SELECT ' +
        ' MEM_ID, MEM_ID as id, MEM_NAME, MEM_LANG, MEM_LANG_ETC, MEM_IMG, MEM_LINK, MEM_JOB, ' +

        '    CASE MEM_SKILLS' +
        '        WHEN \'0\' THEN \'1년미만\'' +
        '        WHEN \'1\' THEN \'1년\'' +
        '        WHEN \'2\' THEN \'2년\'' +
        '        WHEN \'3\' THEN \'3년\'' +
        '        WHEN \'4\' THEN \'4년\'' +
        '        WHEN \'5\' THEN \'5년\'' +
        '        WHEN \'6\' THEN \'6년\'' +
        '        WHEN \'7\' THEN \'7년\'' +
        '        WHEN \'8\' THEN \'8년\'' +
        '        WHEN \'9\' THEN \'9년\'' +
        '        WHEN \'10\' THEN \'10년\'' +
        '        WHEN \'11\' THEN \'10년이상\'' +
        '    END AS MEM_SKILLS,' +

        '    CASE MEM_TYPE' +
        '        WHEN \'1\' THEN \'기획자\'' +
        '        WHEN \'2\' THEN \'개발자\'' +
        '        WHEN \'3\' THEN \'원화가\'' +
        '        WHEN \'4\' THEN \'작곡가\'' +
        '        WHEN \'5\' THEN \'작가\'' +
        '        WHEN \'6\' THEN \'크리에이터\'' +
        '        WHEN \'7\' THEN \'기타\'' +
        '    END AS MEM_TYPE' +
        ' FROM ??' +
        ' WHERE' +
        '    MEM_ID = ?';

    var query2 = 'SELECT * FROM TB_PORTFOLIO WHERE MEM_ID = ?';
    
    var query3 = 'SELECT ' +
        ' CONCAT(GME_NAME, \' \', \'(\', ' +
        '         CASE  ' +
        '         WHEN GME_TYPE = \'1\' THEN \'1인개발\'' +
        '         WHEN GME_TYPE = \'2\' THEN \'개발참여\'' +
        '         END,' +
        '        ' +
        '        \')\') AS GME_INFO ' +
        '                    FROM' +
        '                        TB_GAMES' +
        '                     WHERE' +
        '                        MEM_ID = ?';


    async.waterfall([
            function (done) {
                db.select(query3, [id],
                    function (err, data) {
                        done(err, data);
                    });
            },
            function (results, done) {
                list = results;

                db.select(query2, [id],
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
            },
            function (results, done) {
                async.map(results, cm.getLangNames, function (err, data) {
                    done(err, data)
                });
            }
        ],
        function (err, data) {
            // data['list'] = list;
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                if (data && data.length > 0) {
                    data[0]['list'] = list;
                    data[0]['ptf'] = ptf;
                    res.json(data);
                } else {
                    res.json(data);
                }
            }
        }
    );
});

//프로젝트 리스트 출력
router.get('/get/ProjectList', function (req, res, next) {
    var data = req.query;
    var firstRow = parseInt(data.firstRow), lastRow = parseInt(data.lastRow);
    var keyword = data.keyword;
    var NOTI_CONTENT = data.NOTI_CONTENT;
    var values = [];
    var where = '';
    var MEM_ID = data.currentUser;

    if (data.MEM_TYPE && data.MEM_TYPE > 0) {
        where = cm.whereConcatenator(where, ' MEM_TYPE = ?');
        values.push(data.MEM_TYPE);
    }

    if (data.MEM_NAME) {
        where = cm.whereConcatenator(where, ' MEM_NAME LIKE ?');
        values.push('%' + data.MEM_NAME + '%');
    }

    if (MEM_ID) {
        where = cm.whereConcatenator(where, ' MEM_ID = ?');
        values.push(MEM_ID);
    }


    values.push(firstRow);
    values.push(lastRow);

    var query = 'SELECT ' +
        '    PJT_ID, PJT_NAME ' +
        ' FROM' +
        '    TB_PROJECT ' + where +
        ' ORDER BY PJT_ID DESC';
        // ' LIMIT ?, ?';

    var query2 = 'SELECT ' +
        '    COUNT(1) AS cnt' +
        ' FROM' +
        '    TB_PROJECT' + where;

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

//직군 리스트 출력
router.get('/get/PositionsList', function (req, res, next) {
    var data = req.query;
    var PJT_ID = data.PJT_ID;
    var list;

    var query = 'SELECT ' +
        '   JOB_ID,  ' +
        '    CASE JOB_TYPE' +
        '        WHEN \'1\' THEN \'기획자\'' +
        '        WHEN \'2\' THEN \'개발자\'' +
        '        WHEN \'3\' THEN \'원화가\'' +
        '        WHEN \'4\' THEN \'작곡가\'' +
        '        WHEN \'5\' THEN \'작가\'' +
        '        WHEN \'6\' THEN \'크리에이터\'' +
        '        WHEN \'7\' THEN \'기타\'' +
        '    END AS JOB_TYPE' +
        ' FROM' +
        '    TB_JOBS WHERE PJT_ID = ?';

    async.waterfall([
            function (done) {
                db.exec(query, [PJT_ID], function (err, results) {
                    done(err, results);
                });
            },
            function (results, done) {
                list = results;
                done(null, list)
            }
            ],
        function (err, data) {
            if (err) {
                console.error('에러 ====== %s 테이블 검색 에러 : ', '공지사항 목록', err);
                return res.status(500).send({result: err});
            } else {
                res.json(data);
            }
        }
    );
});

// 제안정보 저장
router.post('/savePropose', function (req, res, next) {
    var data = req.body;

    var post = {
        JOB_ID: data.JOB_ID,
        PJT_ID: data.PJT_ID,
        PRO_CONTENT: data.PRO_CONTENT,
        PRO_SENDER: data.PRO_SENDER,
        PRO_RECEIVER: data.PRO_RECEIVER
    };

    async.waterfall([
            function (done) {
                db.exec('INSERT INTO ?? SET ?', ['TB_PROPOSAL', post], function (err, result) {
                    done(err, result);
                });
            }],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                res.json([]);
            }
        }
    );
});

// 쪽지정보 저장
router.post('/saveMessage', function (req, res, next) {
    var data = req.body;

    var post = {
        MSG_MESSAGE: data.MSG_MESSAGE,
        MSG_SENDER: data.MSG_SENDER,
        MSG_RECEIVER: data.MSG_RECEIVER
    };

    async.waterfall([
            function (done) {
                db.exec('INSERT INTO ?? SET ?', ['TB_MESSAGE', post], function (err, result) {
                    done(err, result);
                });
            }],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                res.json([]);
            }
        }
    );
});


module.exports = router;

