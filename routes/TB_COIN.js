var table_name = 'TB_COIN';
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


//코인 충전 페이지, 코인 받기
router.get('/getCoins', function (req, res, next) {
    var data = req.query;
    var MEM_ID = data.MEM_ID;

    var query = 'SELECT ' +
        '    MEM_ID, IFNULL(MEM_COINS, 0) AS MEM_COINS ' +
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

// 코인 구입
router.post('/buyCoins', function (req, res, next) {
    var data = req.body;

    var post = {
        MEM_ID: data.MEM_ID,
        CON_GOODS_TYPE: data.CON_GOODS_TYPE,
        CON_GOODS_PRICE: data.CON_GOODS_PRICE
    };

    async.waterfall([
            function (done) {
                db.exec('INSERT INTO ?? SET ?', ['TB_COIN', post], function (err, result) {
                    done(err, result);
                });
            }],
        function (err, result) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                return res.json({code: 200, message: '', data: data});
            }
        }
    );
});


module.exports = router;
