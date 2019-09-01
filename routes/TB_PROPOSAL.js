var table_name = 'TB_PROPOSAL';
var express = require('express');
var router = express.Router();
var async = require('async');
var db = require('../lib/connection');
var cm = require('../lib/common.js');
// var rchat = require('../lib/RocketChat.js');
var config = require('../lib/config');
var fse = require('fs-extra');
var path = require('path');


// 받은 제안정보 리스트
router.get('/getSuggestions', function (req, res, next) {
    var data = req.query;
    var firstRow = parseInt(data.firstRow), lastRow = parseInt(data.lastRow);
    var PRO_RECEIVER = data.PRO_RECEIVER, list, MEM_COINS;
    var keyword = data.keyword;
    var values = [];
    var where = '';

    values.push(firstRow);
    values.push(lastRow);

    var query = 'SELECT ' +
        '   a.PRO_ID,' +
        '   a.PRO_DT, ' +
        '   a.PRO_ACCEPT_ST,' +
        '   a.PRO_FINAL_ACCEPT_ST,' +
        '   a.PRO_RECEIVER_READ_YN,' +
        '   b.PJT_NAME,' +
        '   c.MEM_NAME ' +
        '   FROM ' +
        '   TB_PROPOSAL AS a ' +
        '   LEFT JOIN ' +
        '   TB_PROJECT AS b ON a.PJT_ID = b.PJT_ID' +
        '   LEFT JOIN ' +
        '   TB_MEMBER AS c ON a.PRO_SENDER = c.MEM_ID' +
        '   WHERE a.PRO_RECEIVER = ? AND b.PJT_DEL_YN != \'Y\' ' +
        ' ORDER BY a.PRO_ID DESC' +
        ' LIMIT ?, ?';

    var query2 = 'SELECT ' +
        '    COUNT(1) AS cnt' +
        '   FROM ' +
        '   TB_PROPOSAL AS a ' +
        '   LEFT JOIN ' +
        '   TB_PROJECT AS b ON a.PJT_ID = b.PJT_ID' +
        '   LEFT JOIN ' +
        '   TB_MEMBER AS c ON a.PRO_SENDER = c.MEM_ID' +
        '   WHERE a.PRO_RECEIVER = ? AND b.PJT_DEL_YN != \'Y\'';

    var query3 = 'SELECT ' +
        '    a.MEM_COINS' +
        ' FROM' +
        '    TB_MEMBER AS a' +
        '        LEFT JOIN' +
        '    TB_PROPOSAL AS b ON a.MEM_ID = b.PRO_RECEIVER' +
        ' WHERE' +
        '    b.PRO_RECEIVER = ?' +
        ' LIMIT 1;';

    async.waterfall([
            function (done) {
                db.exec(query3, [PRO_RECEIVER], function (err, results) {
                    done(err, results);
                });
            },
            function (results, done) {
                if(results[0]) {
                    MEM_COINS = results[0].MEM_COINS;
                }
                db.exec(query, [PRO_RECEIVER, firstRow, lastRow], function (err, results) {
                    done(err, results);
                });
            },
            function (results, done) {
                list = results;

                db.select(query2, [PRO_RECEIVER],
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
                data[0]['MEM_COINS'] = MEM_COINS;
                res.json(data);
            }
        }
    );
});

// 보낸 제안정보 리스트
router.get('/getSuggestionsOut', function (req, res, next) {
    var data = req.query;
    var firstRow = parseInt(data.firstRow), lastRow = parseInt(data.lastRow);
    var PRO_SENDER = data.PRO_SENDER, list, MEM_COINS;
    var keyword = data.keyword;
    var values = [];
    var where = '';

    values.push(firstRow);
    values.push(lastRow);

    var query = 'SELECT ' +
        '   a.PRO_ID,' +
        '   a.JOB_ID,' +
        '   a.PRO_RECEIVER, ' +
        '   a.PRO_DT, ' +
        // '   a.PRO_ACCEPT_ST,' +
        '    CASE a.PRO_ACCEPT_ST' +
        '        WHEN \'1\' THEN \'제안중\'' +
        '        WHEN \'2\' THEN \'제안수락\'' +
        '        WHEN \'4\' THEN \'제안완료\'' +
        '    END AS PRO_ACCEPT_ST,' +
        '   a.PRO_FINAL_ACCEPT_ST,' +
        '   a.PRO_RECEIVER_READ_YN,' +
        '   b.PJT_NAME,' +
        '   c.MEM_NAME ' +
        '   FROM ' +
        '   TB_PROPOSAL AS a ' +
        '   LEFT JOIN ' +
        '   TB_PROJECT AS b ON a.PJT_ID = b.PJT_ID' +
        '   LEFT JOIN ' +
        '   TB_MEMBER AS c ON a.PRO_RECEIVER = c.MEM_ID' +
        '   WHERE a.PRO_SENDER = ? AND b.PJT_DEL_YN != \'Y\' ' +
        ' ORDER BY a.PRO_ID DESC ' +
        ' LIMIT ?, ?';

    var query2 = 'SELECT ' +
        '    COUNT(1) AS cnt' +
        '   FROM ' +
        '   TB_PROPOSAL AS a ' +
        '   LEFT JOIN ' +
        '   TB_PROJECT AS b ON a.PJT_ID = b.PJT_ID' +
        '   LEFT JOIN ' +
        '   TB_MEMBER AS c ON a.PRO_RECEIVER = c.MEM_ID' +
        '   WHERE a.PRO_SENDER = ? AND b.PJT_DEL_YN != \'Y\'';

    async.waterfall([
            function (done) {
                db.exec(query, [PRO_SENDER, firstRow, lastRow], function (err, results) {
                    done(err, results);
                });
            },
            function (results, done) {
                list = results;

                db.select(query2, [PRO_SENDER],
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

// 받은 제안정보 리스트
router.get('/getProposeInfo', function (req, res, next) {
    var data = req.query;
    var firstRow = parseInt(data.firstRow), lastRow = parseInt(data.lastRow);
    var PRO_ID = data.id;
    var keyword = data.keyword;
    var values = [];
    var where = '';

    values.push(firstRow);
    values.push(lastRow);

    var query = 'SELECT ' +
        '   a.PRO_ID,' +
        '   a.PRO_DT, ' +
        '   a.PRO_CONTENT,' +
        '   a.PRO_SENDER,' +
        '   b.PJT_NAME,' +
        '   c.MEM_NAME ' +
        '   FROM ' +
        '   TB_PROPOSAL AS a ' +
        '   LEFT JOIN ' +
        '   TB_PROJECT AS b ON a.PJT_ID = b.PJT_ID' +
        '   LEFT JOIN ' +
        '   TB_MEMBER AS c ON a.PRO_SENDER = c.MEM_ID' +
        '   WHERE a.PRO_ID = ?';

    async.waterfall([
            function (done) {
                db.exec(query, [PRO_ID], function (err, results) {
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

// 받은 제안을 수락
router.post('/changeState', function (req, res, next) {
    var data = req.body;
    var PRO_ID = data.PRO_ID;

    var post = {
        PRO_ACCEPT_ST: data.PRO_ACCEPT_ST
    };



    async.waterfall([
            function (done) {
                db.exec('UPDATE ?? SET ? WHERE PRO_ID = ?', ['TB_PROPOSAL', post, PRO_ID], function (err, result) {
                    done(err, result);
                });
            }
        ],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                return res.json({code: 200, message: '', data: []});
            }
        }
    );
});

// 보낸 제안을 최종 수락
router.post('/changeStateOut', function (req, res, next) {
    var data = req.body;
    var PRO_ID = data.PRO_ID, JOB_ID = data.JOB_ID;


    var post = {
        PRO_ACCEPT_ST: data.PRO_ACCEPT_ST
    };



    async.waterfall([
            function (done) {
                db.exec('UPDATE ?? SET PRO_ACCEPT_ST = \'2\' WHERE JOB_ID = ? AND PRO_ACCEPT_ST = \'4\'', ['TB_PROPOSAL', JOB_ID], function (err, result) {
                    done(err, result);
                });
            },
            function (results, done) {
                db.exec('UPDATE ?? SET ? WHERE PRO_ID = ?', ['TB_PROPOSAL', post, PRO_ID], function (err, result) {
                    done(err, result);
                });
            }
        ],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                return res.json({code: 200, message: '', data: []});
            }
        }
    );
});

// 코인을 쓰기
router.post('/coinsUse', function (req, res, next) {
    var data = req.body;
    var PRO_ID = data.PRO_ID;
    var MEM_ID = data.MEM_ID;

    var post = {
        MEM_COINS: data.MEM_COINS
    };



    async.waterfall([
            function (done) {
                db.exec('UPDATE ?? SET ? WHERE MEM_ID = ?', ['TB_MEMBER', post, MEM_ID], function (err, result) {
                    done(err, result);
                });
            },
            function (results, done) {
                db.exec('UPDATE ?? SET PRO_RECEIVER_READ_YN = \'Y\' WHERE PRO_ID = ?', [table_name, PRO_ID], function (err, result) {
                    done(err, result);
                });
            }
        ],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                return res.json({code: 200, message: '', data: []});
            }
        }
    );
});

module.exports = router;
