var table_name = 'TB_FABS';
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

// 쪽지정보 저장
router.post('/addToFab', function (req, res, next) {
    var data = req.body, message;
    var FAB_YN = data.FAB_YN;

    var post = {
        PJT_ID: data.PJT_ID,
        MEM_ID: data.FAB_MEM
    };

    async.waterfall([
            function (done) {
                if(data.FAB_YN == 'Y') {
                    db.exec('INSERT INTO ?? SET ?', [table_name, post], function (err, result) {
                        done(err, result);
                    });
                } else {
                    db.exec('DELETE FROM ?? WHERE MEM_ID = ? AND PJT_ID = ?', [table_name, data.FAB_MEM, data.PJT_ID], function (err, result) {
                        done(err, result);
                    });
                }
            }],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                if(FAB_YN == 'Y') {
                    message = '관심프로젝트에 추가되었습니다';
                } else {
                    message = '관심프로젝트에서 삭제되었습니다';
                }
                return res.json({code: 200, message: message, data: []});
            }
        }
    );
});

// 관심 리스트 목록
router.get('/', function (req, res, next) {
    var data = req.query;
    var firstRow = parseInt(data.firstRow), lastRow = parseInt(data.lastRow);
    var values = [];
    //var where = ' WHERE MEM_TYPE != \'T\'';
    var where = '';
    var MEM_ID = data.MEM_ID;

    if (data.COU_NAME) {
        where = cm.whereConcatenator(where, ' COU_NAME LIKE ?');
        values.push('%' + data.COU_NAME + '%');
    }

    values.push(firstRow);
    values.push(lastRow);

    var query = 'SELECT ' +
        '         a.FAB_ID, a.PJT_ID, b.PJT_NAME, b.PJT_DESC, b.PJT_LOGO' +
        '         FROM TB_FABS AS a ' +
        '         LEFT JOIN ' +
        '         TB_PROJECT AS b ON a.PJT_ID = b.PJT_ID' +
        '         WHERE' +
        '            a.MEM_ID = ? AND b.PJT_DEL_YN != \'Y\' ' +
        ' ORDER BY a.FAB_ID DESC' +
        ' LIMIT ?, ?';

    var query2 = 'SELECT ' +
        '    COUNT(1) AS cnt' +
        '         FROM TB_FABS AS a ' +
        '         LEFT JOIN ' +
        '         TB_PROJECT AS b ON a.PJT_ID = b.PJT_ID' +
        '         WHERE' +
        '            a.MEM_ID = ?';

    async.waterfall([
            function (done) {
                db.exec(query, [MEM_ID, firstRow, lastRow], function (err, results) {
                    done(err, results);
                });
            },
            function (results, done) {
                list = results;

                db.select(query2, [MEM_ID],
                    function (err, results) {
                        done(err, results);
                    });
            }],
        function (err, data) {
            if (err) {
                console.error('에러 ====== %s 테이블 검색 에러 : ', '선생님 목록(관리자)', err);
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

// 관심 프로젝트 삭제
router.post('/delete', function (req, res, next) {
    var data = req.body;
    var FAB_ID = data.id;

    async.waterfall([
            function (done) {
                db.exec('DELETE FROM ?? WHERE FAB_ID = ?', [table_name, FAB_ID], function (err, result) {
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
