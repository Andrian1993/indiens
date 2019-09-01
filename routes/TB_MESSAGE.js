var table_name = 'TB_MESSAGE';
var express = require('express');
var router = express.Router();
var async = require('async');
var db = require('../lib/connection');
var cm = require('../lib/common.js');
// var rchat = require('../lib/RocketChat.js');
var config = require('../lib/config');
var fse = require('fs-extra');
var path = require('path');

// 받은 쪽지정보 리스트
router.get('/getNotes', function (req, res, next) {
    var data = req.query;
    var firstRow = parseInt(data.firstRow), lastRow = parseInt(data.lastRow);
    var MSG_RECEIVER = data.MSG_RECEIVER, list;
    var keyword = data.keyword;
    var values = [];
    var where = '';

    values.push(firstRow);
    values.push(lastRow);

    var query = 'SELECT ' +
        '   a.MSG_ID,' +
        '   a.MSG_DT, ' +
        '   a.MSG_MESSAGE,' +
        '   a.MSG_SENDER,' +
        '   a.MSG_RECEIVER,' +
        '   b.MEM_NAME ' +
        '   FROM ' +
        '   TB_MESSAGE AS a ' +
        '   LEFT JOIN ' +
        '   TB_MEMBER AS b ON a.MSG_SENDER = b.MEM_ID' +
        '   WHERE a.MSG_RECEIVER = ?' +
        ' ORDER BY a.MSG_ID DESC' +
        ' LIMIT ?, ?';

    var query2 = 'SELECT ' +
        '    COUNT(1) AS cnt' +
        '   FROM ' +
        '   TB_MESSAGE AS a ' +
        '   LEFT JOIN ' +
        '   TB_MEMBER AS b ON a.MSG_SENDER = b.MEM_ID' +
        '   WHERE a.MSG_RECEIVER = ?';

    async.waterfall([
            function (done) {
                db.exec(query, [MSG_RECEIVER, firstRow, lastRow], function (err, results) {
                    done(err, results);
                });
            },
            function (results, done) {
                list = results;

                db.select(query2, [MSG_RECEIVER],
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

// 보낸 쪽지정보 리스트
router.get('/getNotesOut', function (req, res, next) {
    var data = req.query;
    var firstRow = parseInt(data.firstRow), lastRow = parseInt(data.lastRow);
    var MSG_SENDER = data.MSG_SENDER, list;
    var keyword = data.keyword;
    var values = [];
    var where = '';

    values.push(firstRow);
    values.push(lastRow);

    var query = 'SELECT ' +
        '   a.MSG_ID,' +
        '   a.MSG_DT, ' +
        '   a.MSG_MESSAGE,' +
        '   a.MSG_SENDER,' +
        '   a.MSG_RECEIVER,' +
        '   b.MEM_NAME ' +
        '   FROM ' +
        '   TB_MESSAGE AS a ' +
        '   LEFT JOIN ' +
        '   TB_MEMBER AS b ON a.MSG_RECEIVER = b.MEM_ID' +
        '   WHERE a.MSG_SENDER = ?' +
        ' ORDER BY a.MSG_ID DESC' +
        ' LIMIT ?, ?';

    var query2 = 'SELECT ' +
        '    COUNT(1) AS cnt' +
        '   FROM ' +
        '   TB_MESSAGE AS a ' +
        '   LEFT JOIN ' +
        '   TB_MEMBER AS b ON a.MSG_RECEIVER = b.MEM_ID' +
        '   WHERE a.MSG_SENDER = ?';

    async.waterfall([
            function (done) {
                db.exec(query, [MSG_SENDER, firstRow, lastRow], function (err, results) {
                    done(err, results);
                });
            },
            function (results, done) {
                list = results;

                db.select(query2, [MSG_SENDER],
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

module.exports = router;