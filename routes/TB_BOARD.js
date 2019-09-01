var table_name = 'TB_BOARD';
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
    var where = '';

    /*if (data.BRD_MAIN_TITLE) {
        where = cm.whereConcatenator(where, ' a.BRD_MAIN_TITLE LIKE ?');
        values.push('%' + data.BRD_MAIN_TITLE + '%');
    }*/

    if (data.BRD_MAIN_TITLE) {
        where = cm.whereConcatenator(where, ' a.BRD_MAIN_TITLE LIKE ? OR b.MEM_NAME LIKE ? ');
        values.push('%' + data.BRD_MAIN_TITLE + '%');
        values.push('%' + data.BRD_MAIN_TITLE + '%');
    }


    values.push(firstRow);
    values.push(lastRow);

    var query = 'SELECT a.BRD_ID, a.BRD_MAIN_TITLE, a.BRD_MAIN_DT, b.MEM_NAME FROM TB_BOARD AS a LEFT JOIN TB_MEMBER AS b ON a.BRD_MAIN_MEM_ID = b.MEM_ID ' + where + ' ORDER BY a.BRD_ID DESC LIMIT ? , ?';

    var query2 = 'SELECT     COUNT(1) AS cnt FROM    TB_BOARD AS a     LEFT JOIN      TB_MEMBER AS b ON a.BRD_MAIN_MEM_ID = b.MEM_ID' + where;

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

// id로 검색
router.get('/:id', function (req, res, next) {
    var id = req.params.id, list;

    var query = 'SELECT a.BRD_ID, ' +
        '   a.BRD_MAIN_TITLE, ' +
        '   a.BRD_MAIN_CONTENTS, ' +
        '   a.BRD_MAIN_MEM_ID, ' +
        '   a.BRD_MAIN_DT, ' +
        '   b.MEM_NAME ' +
        '   FROM ' +
        '   TB_BOARD AS a ' +
        '   LEFT JOIN ' +
        '   TB_MEMBER AS b ON a.BRD_MAIN_MEM_ID = b.MEM_ID' +
        '   WHERE a.BRD_ID = ?';

    var query2 = 'SELECT ' +
        '    a.BRD_SUB_CONTENTS, ' +
        '    a.BRD_SUB_MEM_ID, ' +
        '    a.BRD_SUB_DT,' +
        '    b.MEM_NAME,' +
        '    b.MEM_EMAIL' +
        ' FROM' +
        '    TB_BOARD_SUB AS a' +
        '    LEFT JOIN ' +
        '    TB_MEMBER AS b ON a.BRD_SUB_MEM_ID = b.MEM_ID ' +
        '    WHERE a.BRD_ID = ? ' +
        '    ORDER BY a.BRD_SUB_ID DESC';

    async.waterfall([
            function (done) {
                db.select(query2, [id],
                    function (err, data) {
                        done(err, data);
                    });
            },
            function (results, done) {
                list = results;
                db.select(query, [id],
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
                    res.json(data[0]);
                } else {
                    res.json(data);
                }
            }
        }
    );
});

// id로 검색
router.get('/get/detail', function (req, res, next) {
    var id = req.query.id, list;

    var query = 'SELECT a.BRD_ID, ' +
        '   a.BRD_MAIN_TITLE, ' +
        '   a.BRD_MAIN_CONTENTS, ' +
        '   a.BRD_MAIN_MEM_ID, ' +
        '   a.BRD_MAIN_DT, ' +
        '   b.MEM_NAME ' +
        '   FROM ' +
        '   TB_BOARD AS a ' +
        '   LEFT JOIN ' +
        '   TB_MEMBER AS b ON a.BRD_MAIN_MEM_ID = b.MEM_ID' +
        '   WHERE a.BRD_ID = ?';

    var query2 = 'SELECT ' +
        '    a.BRD_SUB_ID, ' +
        '    a.BRD_SUB_MEM_ID, ' +
        '    a.BRD_SUB_CONTENTS, ' +
        '    a.BRD_SUB_DT,' +
        '    b.MEM_NAME,' +
        '    b.MEM_EMAIL' +
        ' FROM' +
        '    TB_BOARD_SUB AS a' +
        '    LEFT JOIN ' +
        '    TB_MEMBER AS b ON a.BRD_SUB_MEM_ID = b.MEM_ID ' +
        '    WHERE a.BRD_ID = ? ' +
        '    ORDER BY a.BRD_SUB_ID DESC';

    async.waterfall([
            function (done) {
                db.select(query2, [id],
                    function (err, data) {
                        done(err, data);
                    });
            },
            function (results, done) {
                list = results;
                db.select(query, [id],
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
                    res.json(data[0]);
                } else {
                    res.json(data);
                }
            }
        }
    );
});

// 상담사 신규
router.post('/', function (req, res, next) {
    var data = req.body;
    var id = data.id;

    var post = {
        BRD_MAIN_TITLE: data.BRD_MAIN_TITLE,
        BRD_MAIN_CONTENTS: data.BRD_MAIN_CONTENTS,
        BRD_MAIN_MEM_ID: data.BRD_MAIN_MEM_ID
    };

    async.waterfall([
            function (done) {
                if(id) {
                    db.exec('UPDATE ?? SET ? WHERE BRD_ID = ?', [table_name, post, id], function (err, result) {
                        done(err, result);
                    });
                } else {
                    db.exec('INSERT INTO ?? SET ?', [table_name, post], function (err, result) {
                        done(err, result);
                    });
                }
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

// 수정
router.put('/:id', function (req, res, next) {
    var data = req.body;
    var id = data.id;

    var post = {
        BRD_MAIN_TITLE: data.BRD_MAIN_TITLE,
        BRD_MAIN_CONTENTS: data.BRD_MAIN_CONTENTS,
        BRD_MAIN_MEM_ID: data.BRD_MAIN_MEM_ID
    };

    async.waterfall([
            function (done) {
                if(id) {
                    db.exec('UPDATE ?? SET ? WHERE BRD_ID = ?', [table_name, post, id], function (err, result) {
                        done(err, result);
                    });
                } else {
                    db.exec('INSERT INTO ?? SET ?', [table_name, post], function (err, result) {
                        done(err, result);
                    });
                }
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

// 댓글 저장
router.post('/saveComment', function (req, res, next) {
    var data = req.body;

    var post = {
        BRD_ID: data.BRD_ID,
        BRD_SUB_CONTENTS: data.BRD_SUB_CONTENTS,
        BRD_SUB_MEM_ID: data.BRD_SUB_MEM_ID
    };

    async.waterfall([
            function (done) {
                db.exec('INSERT INTO ?? SET ?', ['TB_BOARD_SUB', post], function (err, result) {
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

// 댓글 수정
router.post('/updateComment', function (req, res, next) {
    var data = req.body;

    var post = {
        BRD_SUB_CONTENTS: data.BRD_SUB_CONTENTS
    };

    async.waterfall([
            function (done) {
                db.exec('UPDATE ?? SET ? WHERE BRD_SUB_ID = ?', ['TB_BOARD_SUB', post, data.BRD_SUB_ID], function (err, result) {
                    done(err, result);
                });
            }],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                return res.json({code: 200, message: '수정되었습니다', data: []});
            }
        }
    );
});

// 댓글 삭제
router.post('/deleteComment', function (req, res, next) {
    var data = req.body;

    async.waterfall([
            function (done) {
                db.exec('DELETE FROM ?? WHERE BRD_SUB_ID = ?', ['TB_BOARD_SUB', data.BRD_SUB_ID], function (err, result) {
                    done(err, result);
                });
            }],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                return res.json({code: 200, message: '삭제되었습니다', data: []});
            }
        }
    );
});


// 삭제
router.post('/delete', function (req, res, next) {
    var data = req.body;
    var BRD_ID = data.id;

    async.waterfall([
            function (done) {
                db.exec('DELETE FROM ?? WHERE BRD_ID = ?', ['TB_BOARD_SUB', BRD_ID], function (err, result) {
                    if (err) {
                        return done(err);
                    }
                    done(null, result.changedRows);
                });
            },
            function (results, done) {
                db.exec('DELETE FROM ?? WHERE BRD_ID = ?', [table_name, BRD_ID], function (err, result) {
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
