var table_name = 'TB_GAMES';
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
    var GME_ID = data.id;

    async.waterfall([
            function (done) {
                db.exec('DELETE FROM ?? WHERE GME_ID = ?', [table_name, GME_ID], function (err, result) {
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
