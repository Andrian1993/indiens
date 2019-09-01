var table_name = 'TB_PORTFOLIO';
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


// 이미지 압로드

// 이미지 업로드
router.post('/upload', function (req, res, next) {
    let file = req.files.file;
    let id = req.body.id, colName = req.body.colName, idx = req.body.idx;
    let newFileNm, uid = uniqid();


    newFileNm =  path.normalize(uid + path.extname(file.name));


    let uploadPath = path.normalize(config.attachRoot + '/portfolio/' + id + '/') + newFileNm;
    let post = {
        MEM_ID: id
    };

    post['PRF_FILE_NM'] = file.name;
    post['PRF_FILE_MT'] = mime.contentType(file.name);


    async.waterfall([
            function (done) { // 파일 tmp -> 폴더로 이동
                fse.move(file.path, uploadPath, {clobber: true}, function (err) {
                    done(err, newFileNm);
                });
            },
            function (newFileNm, done) { //
                let DRAWING_URL = '/attach' + '/portfolio/' + id + '/' + newFileNm;
                post['PRF_FILE'] = DRAWING_URL;

                db.exec('INSERT INTO ?? SET ?', ['TB_PORTFOLIO', post], function (err, result) {
                    done(err, result);
                });
            }
        ],
        function (err, result) {
            if (err) {
                console.error(err);
                return res.json({code: 500, message: '이미지 업로드시 에러가 발생하였습니다.', data: err});
            } else {
                return res.json({code: 200, message: '', data: ''});
            }
        }
    );
});

// 삭제
router.post('/delete', function (req, res, next) {
    var data = req.body;
    var PRF_ID = data.id;

    async.waterfall([
            function (done) {
                db.exec('DELETE FROM ?? WHERE PRF_ID = ?', [table_name, PRF_ID], function (err, result) {
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

/*router.post('/upload', function (req, res, next) {
    var file = req.files.file;
    var PJT_ID = req.body.PJT_ID, idx = req.body.idx;
    var newFileNm = idx + PJT_ID + path.extname(file.name);

    var uploadPath = path.normalize(config.uploadDir + '/portfolio/') + newFileNm;

    async.waterfall([

            function (done) { // 파일 tmp -> 폴더로 이동
                fse.move(file.path, uploadPath, {clobber: true}, function (err) {
                    done(err, newFileNm);
                });
            },
            function (newFileNm, done) { //
                var MEM_PROF_IMG_URL = config.imgRoot + '/project/' + newFileNm;

                db.exec('UPDATE ?? SET PJT_LOGO = ? WHERE PJT_ID = ?', [table_name, MEM_PROF_IMG_URL, PJT_ID], function (err, result) {
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
                res.status(200).send();
            }
        }
    );
});*/

module.exports = router;
