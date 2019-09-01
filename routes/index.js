var express = require('express');
var router = express.Router();
var fse = require('fs-extra');
var async = require('async');
var db = require('../lib/connection');
var config = require('../lib/config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/download/:id', function (req, res, next) {
  var id = req.params.id;

  var query = 'SELECT * FROM ?? where PRF_ID = ?';
  var values = ['TB_PORTFOLIO', id];

  async.waterfall([
        function (done) {
          db.select(query, values,
              function (err, results) {
                if (err) return done(err);
                done(null, results);
              });
        }],
      function (err, data) {
        if (err) {
          console.error(err);
          return res.status(500).send({result: err});
        } else if (data && data.length > 0) {
          var fileName = config.downDir + data[0].PRF_FILE;

          var mimetype = data[0].PRF_FILE_MT;
          var file = fileName;
          var origFileNm = data[0].PRF_FILE_NM;

          if (!mimetype) mimetype = 'application/octet-stream';
          mimetype += ';charset=UTF-8';

          origFileNm = encodeURIComponent(origFileNm);

          res.setHeader('Content-type', mimetype);
          res.setHeader('Content-disposition', 'attachment; filename=' + origFileNm); //origFileNm으로 로컬PC에 파일 저장

          var filestream = fse.createReadStream(file);
          filestream.pipe(res);
        } else {
          res.sendStatus(404)
        }
      }
  );
});


module.exports = router;
