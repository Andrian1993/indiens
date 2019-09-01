var table_name = 'TB_QUESTION';
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
    var where = ' ';

    if (data.QUE_QS_TITLE) {
        where = cm.whereConcatenator(where, ' a.QUE_QS_TITLE LIKE ?');
        values.push('%' + data.QUE_QS_TITLE + '%');
    }

    if (data.MEM_ID) {
        where = cm.whereConcatenator(where, ' a.MEM_ID = ?');
        values.push(data.MEM_ID);
    }


    values.push(firstRow);
    values.push(lastRow);

   /* var query = 'SELECT ' +
        '    QUE_ID, QUE_QS_TITLE, QUE_QS_DT,' +

        ' CASE QUE_STATE' +
        '      WHEN \'Y\' THEN \'답변완료\'' +
        '      WHEN \'N\' THEN \'답변대기\'' +
        '    END AS QUE_STATE' +
        ' FROM' +
        '    TB_QUESTION' + where +
        ' ORDER BY QUE_ID DESC' +
        ' LIMIT ?, ?';*/


    var query = 'SELECT ' +
        '    a.QUE_ID,' +
        '    a.QUE_QS_TITLE,' +
        '    a.QUE_QS_DT,' +
        '    b.MEM_NAME,' +
        '    CASE QUE_STATE' +
        '        WHEN \'Y\' THEN \'답변완료\'' +
        '        WHEN \'N\' THEN \'답변대기\'' +
        '    END AS QUE_STATE' +
        ' FROM ' +
        '    TB_QUESTION AS a' +
        '    LEFT JOIN ' +
        '    TB_MEMBER AS b ON a.MEM_ID = b.MEM_ID ' + where +
        '    ORDER BY QUE_ID DESC ' +
        ' LIMIT ?, ?';

    var query2 = 'SELECT ' +
        '    COUNT(1) AS cnt' +
        ' FROM ' +
        '    TB_QUESTION AS a' +
        '    LEFT JOIN ' +
        '    TB_MEMBER AS b ON a.MEM_ID = b.MEM_ID ' + where;

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

router.get('/:id', function (req, res, next) {
    var id = req.params.id;

    var query = 'SELECT ' +
        ' QUE_ID, QUE_ID as id, QUE_QS_TITLE, QUE_QS_CONT, QUE_AN_TITLE, QUE_AN_CONT,' +
        ' QUE_QS_DT, QUE_AN_DT' +
        ' FROM ??' +
        ' WHERE' +
        '    QUE_ID = ?';

    async.waterfall([
            function (done) {
                db.select(query, [table_name, id],
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

router.post('/', function (req, res, next) {
    var data = req.body;
    var QUE_ID = data.QUE_ID,
        MEM_ID = data.MEM_ID,
        MEM_TYPE = data.MEM_TYPE,
        MEM_ADMIN_YN = data.MEM_ADMIN_YN,
        QUE_QS_CONT = data.QUE_QS_CONT,
        QUE_QS_DT = data.QUE_QS_DT,
        QUE_QS_TITLE = data.QUE_QS_TITLE,
        QUE_AN_CONT = data.QUE_AN_CONT,
        QUE_AN_TITLE = data.QUE_AN_TITLE;

    var post = {};

    async.waterfall([
            function (done) {
                if (!QUE_ID) {
                    post = {
                        MEM_ID: MEM_ID,
                        QUE_QS_TITLE: QUE_QS_TITLE,
                        QUE_QS_CONT: QUE_QS_CONT,
                    };

                    db.exec('INSERT INTO ?? SET ?', [table_name, post], function (err, result) {
                        //NOTI_ID = result.insertId;
                        done(err, result);
                    });
                } else {
                    if(MEM_ADMIN_YN == 'Y') {
                        post = {
                            QUE_AN_TITLE: QUE_AN_TITLE,
                            QUE_AN_CONT: QUE_AN_CONT,
                            QUE_STATE: 'Y',
                            QUE_AN_DT: new Date()
                        };
                    } else {
                        post = {
                            QUE_QS_TITLE: QUE_QS_TITLE,
                            QUE_QS_CONT: QUE_QS_CONT
                        };
                    }
                    db.exec('UPDATE ?? SET ? WHERE QUE_ID = ?', [table_name, post, QUE_ID], function (err, result) {
                        done(err, result);
                    });
                }
            }
        ],
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

// 삭제
router.post('/delete', function (req, res, next) {
    var data = req.body;
    var QUE_ID = data.id;

    async.waterfall([
            function (done) {
                db.exec('DELETE FROM ?? WHERE QUE_ID = ?', [table_name, QUE_ID], function (err, result) {
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

module.exports = router;
