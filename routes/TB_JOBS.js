var table_name = 'TB_JOBS';
var express = require('express');
var router = express.Router();
var async = require('async');
var db = require('../lib/connection');
var cm = require('../lib/common.js');
/*var rchat = require('../lib/RocketChat.js');*/
var config = require('../lib/config');
var uniqid = require('uniqid');
// var FCM = require('fcm-node');
// var serverKey = require('../lib/yonghada-privatekey.json') //put the generated private key path here
// fcm = require('../lib/fcm');
var fse = require('fs-extra');
var path = require('path');
var mime = require('mime-types');


// 삭제
router.post('/delete', function (req, res, next) {
    var data = req.body;
    var JOB_ID = data.id;

    var query = 'SELECT PRO_ID FROM TB_PROPOSAL WHERE JOB_ID = ?';

    async.waterfall([
        function (done) {
            db.select(query, [JOB_ID],
                function (err, data) {
                    done(err, data);
                });
        },
        function (results, done) {
            if(results[0]) {
                return res.json({code: 405, message: '해당 직군에 제안한 파트너가 있습니다', data: []});
            } else {
                db.exec('DELETE FROM ?? WHERE JOB_ID = ?', [table_name, JOB_ID], function (err, result) {
                    if (err) {
                        return done(err);
                    }
                    done(null, result.changedRows);
                });
            }
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
