/*
*
*   공통으로 사용하는 함수 정의
*
* */
var async = require('async');
var nodemailer = require('nodemailer');
var config = require('../lib/config.js');
var crypto = require('crypto');
var db = require('../lib/connection');
// var FCM = require('fcm-node');
var XLSX = require('xlsx');
var uniqid = require('uniqid');
var fse = require('fs-extra');
const path = require('path');
var request = require('request');

var promiseDownloadExcel = function (res, title, data, wscols) {
    function datenum(v, date1904) {
        if (date1904) v += 1462;
        var epoch = Date.parse(v);
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    }

    function sheet_from_array_of_arrays(data, opts) {
        var ws = {};
        var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
        for (var R = 0; R != data.length; ++R) {
            for (var C = 0; C != data[R].length; ++C) {
                if (range.s.r > R) range.s.r = R;
                if (range.s.c > C) range.s.c = C;
                if (range.e.r < R) range.e.r = R;
                if (range.e.c < C) range.e.c = C;
                var cell = {v: data[R][C]};
                if (cell.v == null) continue;
                var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

                if (typeof cell.v === 'number') cell.t = 'n';
                else if (typeof cell.v === 'boolean') cell.t = 'b';
                else if (cell.v instanceof Date) {
                    cell.t = 'n';
                    cell.z = XLSX.SSF._table[14];
                    cell.v = datenum(cell.v);
                }
                else cell.t = 's';

                ws[cell_ref] = cell;
            }
        }
        if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
        return ws;
    }

    var ws_name = title;

    function Workbook() {
        if (!(this instanceof Workbook)) return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
    }

    var wb = new Workbook();
    var ws = sheet_from_array_of_arrays(data);

    // http://stackoverflow.com/questions/24395693/how-to-set-cell-width-when-export-xlsx-files-with-js-xlsx
    ws['!cols'] = wscols;

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    /* write file */
    var fileName = path.join('public/temp/', uniqid() + '.xlsx');
    XLSX.writeFile(wb, fileName);

    res.download(fileName, title + '.xlsx', function (err) {
        if (err) console.log('엑셀 에러', err);
        fse.unlink(path.normalize(fileName), function (err) {
            if (err) console.log(err);
        });
    });
};

var whereConcatenator = function (strSQL, strWhere) {
    if (strSQL && strSQL.length > 0 &&  strSQL.toUpperCase().indexOf("WHERE") >= 0) {
        strWhere = " AND " + strWhere;
    }
    else {
        strWhere = " WHERE " + strWhere;
    }

    return strSQL + strWhere;
}

//푸시 이력 저장TEA
var promiseInsertPushHistory = function (ME_NUM, TC_NUM, message, success) {
    var msg;

    return new Promise(function (resolve, reject) {
        if (!ME_NUM && !TC_NUM) {
            msg = '푸시를 전송할 부모ID 또는 선생님ID를 입력해 주세요!';
            console.log(msg);
            return reject(new Error(msg));
        }

        if (!message) {
            msg = '푸시를 전송할 데이터를 입력해 주세요!';
            console.log(msg);
            return reject(new Error(msg));
        }

        var post = {
            ME_NUM: ME_NUM,
            TC_NUM: TC_NUM,
            TO: message.to,
            NOTIFICATION: JSON.stringify(message.notification),
            DATA: JSON.stringify(message.data),
            SUCCESS: success,
            GUBUN: message.data.gubun,
            TITLE: message.data.title,
        };

        db.select('INSERT INTO TB_PUSH_HISTORY SET ?', [post],
            function (err, result) {
                if (err) {
                    console.log('푸쉬 히스토리 저장 에러! %s', err);
                    // return reject(new Error(err));
                }

                resolve(result);
            });
    });
};

// FCM 푸쉬 메세지 전송(특정 회원)
var promiseSendFCM2 = function (ME_NUM, TC_NUM, data, title, body) {
    return new Promise(function (resolve, reject) {
        if (!ME_NUM && !TC_NUM) {
            console.log('푸시를 전송할 클라이언트ID 또는 파트너ID를 입력해 주세요!');
            reject(new Error('푸시를 전송할 클라이언트ID 또는 파트너ID를 입력해 주세요!'));
        }

        if (!data) {
            console.log('푸시를 전송할 데이터를 입력해 주세요!');
            reject(new Error('푸시를 전송할 데이터를 입력해 주세요!'));
        }

        var notification = {
            title: title,
            body: body,
            sound: 'default'
        };

        var values = ['TB_TOKEN'];

        /*var data = {  //you can send only notification or only data(or include both)
         my_key: 'my value',
         my_another_key: 'my another value'
         };*/

        var serverKey; // put the generated private key path here

        if (ME_NUM) {
            // serverKey = require('./appmade-client-firebase-adminsdk.json');
            serverKey = config.fcm_client_api_key;
            values.push('CT_NUM');
            values.push(ME_NUM);
        } else {
            // serverKey = require('.//google-services-partner.json');
            serverKey = config.fcm_partner_api_key;
            values.push('PT_NUM');
            values.push(TC_NUM);
        }

        db.select('SELECT TOKEN FROM ?? WHERE ?? = ?', values,
            function (err, result) {
                if (err) {
                    console.log('푸쉬처리 에러!' + err);
                    return reject(new Error(err));
                }

                if (!result || result.length <= 0) {
                    console.log('푸쉬 토큰이 존재하지 않습니다!' + values);
                    return reject(new Error('푸쉬 토큰이 존재하지 않습니다!' + values));
                }

                var success = 'N', push_response;
                var fcm = new FCM(serverKey);

                var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: result[0].TOKEN,
                    // collapse_key: 'your_collapse_key',
                    notification: notification,
                    data: data
                };

                fcm.send(message, function (err, response) {
                    if (err) {
                        console.log('푸쉬전송 에러!' + err);
                        // reject(new Error(err));
                        success = 'N';
                    } else {
                        console.log('Sent with message ID: ' + response);
                        // resolve({message: message, result: response});
                        success = 'Y';
                    }

                    // 푸시 전송이력 저장
                    push_response = response;

                    promiseInsertPushHistory(0, ME_NUM, TC_NUM, message, success).then(function (result) {
                        resolve(push_response);
                    }, function (error) {
                        reject(new Error(err));
                    });
                });
            });
    });
};

// 랜덤 문자열 생성
var randomString = function (len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    // charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var randomString = '';
    var hasNumber = /\d/;

    do {
        randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
    } while(!hasNumber.test(randomString));

    return randomString;
};

var getTransport = function () {
    return nodemailer.createTransport({
        host: 'smtp.worksmobile.com',
        port: 587,
        // secure: true, // use SSL
        secure: false, // use SSL
        auth: {
            user: 'vrfetus@girjae.com',
            pass: 'vrfetus20!^'
        }
    });
}

var promiseSendEmail = function (subject, to, text, html) {
    return new Promise(function (resolve, reject) {
// create reusable transporter object using the default SMTP transport
//         var transporter = nodemailer.createTransport('smtps://구글이메일:비밀번호@smtp.gmail.com');
        var transporter = getTransport();
        /*        var transporter = nodemailer.createTransport({
         host: 'smtp.worksmobile.com',
         port: 587,
         // secure: true, // use SSL
         secure: false, // use SSL
         auth: {
         user: '사용자명',
         pass: '비밀번호'
         }
         });*/

// setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"길재 소프트" <admin@vrfetus.co.kr>', // sender address
            // to: 'hyoseop@synapsetech.co.kr', // list of receivers
            // to: 'hyoseop@gmail.com, hyoseop@synapsetech.co.kr', // list of receivers
            to: to,
            subject: subject, // Subject line
            text: text, // plaintext body
            html: html // html body
        };

// send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                reject(new Error(error));
            } else {
                console.log('Message sent: ' + info.response);
                resolve('Message sent: ' + info.response);
            }
        });
    });
};

// 문자열 암호화
var encString = function (str) {
    var hmac = crypto.createHmac(config.enc_type, config.enc_key);
    var enc_string = hmac.update(str).digest(config.enc_out_type);
    return enc_string;
};

// 년, 월, 식단, 시설
var getRecipeMmString = function (RM_YEAR, RM_MONTH, RM_TYPE, SH_NUM) {
    var sql = '(SELECT ' +
        '        *' +
        '    FROM' +
        '        TB_RECIPE_MM AS b' +
        '    WHERE' +
        '        b.RM_YEAR = \''+ RM_YEAR + '\' AND b.RM_MONTH = \''+ RM_MONTH + '\'' +
        '            AND b.RM_TYPE = \''+ RM_TYPE + '\'' +
        '            AND NOT EXISTS( SELECT ' +
        '                1' +
        '            FROM' +
        '                TB_CHANGE_DIET AS c' +
        '            WHERE' +
        '                c.RM_YEAR = b.RM_YEAR' +
        '                    AND c.RM_MONTH = b.RM_MONTH' +
        '                    AND c.RM_DAY = b.RM_DAY' +
        '                    AND c.RM_TYPE_OLD = b.RM_TYPE' +
        '                    AND c.SH_NUM = '+ SH_NUM + ') UNION ALL SELECT ' +
        '        *' +
        '    FROM' +
        '        TB_RECIPE_MM AS b' +
        '    WHERE' +
        '        (RM_YEAR , RM_MONTH, RM_DAY, RM_TYPE) IN (SELECT ' +
        '                RM_YEAR, RM_MONTH, RM_DAY, RM_TYPE' +
        '            FROM' +
        '                TB_CHANGE_DIET AS c' +
        '            WHERE' +
        '                c.RM_YEAR = \''+ RM_YEAR + '\' AND c.RM_MONTH = \''+ RM_MONTH + '\'' +
        '                    AND c.SH_NUM = '+ SH_NUM +
        '                    AND c.RM_TYPE_OLD = \''+ RM_TYPE + '\')) AS ';

    return sql;
}

// 아이디로 회원찾기
var promiseFindMbrById = function (mem_email, mem_id) {
    return new Promise(function (resolve, reject) {
        var query = 'SELECT ' +
            '    MEM_EMAIL' +
            ' FROM' +
            '   TB_MEMBER ' +
            ' WHERE' +
            '    MEM_EMAIL = ? AND MEM_ID != ?';

        db.select(query, [mem_email, mem_id], function (err, result) {
            if (err) {
                console.error('아이디로 회원찾기 에러!', err);
                reject(new Error('아이디로 회원찾기 에러! ' + err));
            } else {
                var doc = null;
                if (result && result.length > 0) doc = result[0];
                resolve(doc);
            }
        });
    });
};

// 닉네임으로 회원찾기
var promiseFindMbrByNick = function (mem_name) {
    return new Promise(function (resolve, reject) {
        var query = 'SELECT ' +
            '    MEM_SNS_ID, MEM_NAME' +
            ' FROM' +
            '    tb_member' +
            ' WHERE' +
            '    MEM_NAME = ? AND MEM_EXIT_DT is null';

        db.select(query, [mem_name], function (err, result) {
            if (err) {
                console.error('닉네임로 회원찾기 에러!', err);
                reject(new Error('닉네임로 회원찾기 에러! ' + err));
            } else {
                var doc = null;
                if (result && result.length > 0) doc = result[0];
                resolve(doc);
            }
        });
    });
};

// 아이디로 선생님찾기
var promiseFindTchrById = function (tchr_id) {
    return new Promise(function (resolve, reject) {
        var query = 'SELECT ' +
            '    TEA_ID' +
            ' FROM' +
            '    TB_TEACHER' +
            ' WHERE' +
            '    TEA_ID = ? AND TEA_EXIT_DT is null';

        db.select(query, [tchr_id], function (err, result) {
            if (err) {
                console.error('아이디로 회원찾기 에러!', err);
                reject(new Error('아이디로 회원찾기 에러! ' + err));
            } else {
                var doc = null;
                if (result && result.length > 0) doc = result[0];
                resolve(doc);
            }
        });
    });
}

//닉네임으로 선생님찾기
var promiseFindTchrByNick = function (tchr_nick) {
    return new Promise(function (resolve, reject) {
        var query = 'SELECT ' +
            '    TEA_ID, TEA_NAME' +
            ' FROM' +
            '    TB_TEACHER' +
            ' WHERE' +
            '    TEA_NAME = ? AND TEA_EXIT_DT is null';

        db.select(query, [tchr_nick], function (err, result) {
            if (err) {
                console.error('닉네임로 회원찾기 에러!', err);
                reject(new Error('닉네임로 회원찾기 에러! ' + err));
            } else {
                var doc = null;
                if (result && result.length > 0) doc = result[0];
                resolve(doc);
            }
        });
    });
}

// 쿠폰 시리얼번호 찾기
var promiseFindCoupBySerial = function(COU_SERIAL){
    /*return new Promise(function (resolve, reject) {
        var query = 'SELECT ' +
            '                COU_NUM' +
            '             FROM' +
            '                TB_COUPON' +
            '             WHERE' +
            '                COU_SERIAL = ?;';

        db.select(query, [COU_SERIAL], function (err, result) {
            if (err) {
                console.error('아이디로 회원찾기 에러!', err);
                reject(new Error('아이디로 회원찾기 에러! ' + err));
            } else {
                var doc = null;
                if (result && result.length > 0) doc = result[0];
                resolve(doc);
            }
        });
    });*/

    var query = 'SELECT ' +
        '                COU_NUM' +
        '             FROM' +
        '                TB_COUPON' +
        '             WHERE' +
        '                COU_SERIAL = ?;';

    db.select(query, [COU_SERIAL], function (err, result) {
        if (err) {
            console.error('아이디로 회원찾기 에러!', err);
            reject(new Error('아이디로 회원찾기 에러! ' + err));
        } else {
            var doc = null;
            if (result && result.length > 0) doc = result[0];
            resolve(doc);
        }
    });


}

var getTokenById = function(mem_id) {
    return new Promise(function (resolve, reject) {
        var query = 'SELECT ' +
            '    MEM_TOKEN' +
            ' FROM' +
            '    tb_member' +
            ' WHERE' +
            '    MEM_ID = ? AND MEM_EXIT_DT is null';

        db.select(query, [mem_id], function (err, result) {
            if (err) {
                console.error('아이디로 회원찾기 에러!', err);
                reject(new Error('아이디로 회원찾기 에러! ' + err));
            } else {
                var doc = null;
                if (result && result.length > 0) doc = result[0];
                resolve(result);
            }
        });
    });
}

exports.getGuList = function (admCode, doneCallback) {
    const http = require('http');
    const xml2js = require('xml2js');
    const parser = new xml2js.Parser();

    var HttpUrl = "http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admSiList.xml"; /*URL*/
    var parameter = '?' + encodeURIComponent("authkey") + "=" + encodeURIComponent('9c35711509ae65edc74536'); /*authkey Key*/
    parameter += "&" + encodeURIComponent("admCode") + "=" + encodeURIComponent(admCode); /* 시도 코드(2자리) */

    console.log('호출주소 = ' + HttpUrl + parameter);

    http.get(HttpUrl + parameter, (resp) => {
        let data = '', list = [];

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(data);

            parser.parseString(data, function (err, result) {
                console.log(result);
                var list = [];

                if (result['admVOList'] && result['admVOList']['admVOList']) {
                    for (var i = 0; i < result['admVOList']['admVOList'].length; i++) {
                        list.push({
                            admCodeNm: result['admVOList']['admVOList'][i]['admCodeNm'][0],
                            admCode: result['admVOList']['admVOList'][i]['admCode'][0],
                            lowestAdmCodeNm: result['admVOList']['admVOList'][i]['lowestAdmCodeNm'][0]
                        });
                    }
                }

                doneCallback(null, list);
            });
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        doneCallback(err, null);
    });
}

exports.promiseGetIdToken = function (mkr_id) {
    var query = "  SELECT MKR_CHAT_NAME,MKR_CHAT_ID FROM TB_MAKER WHERE ID = ? ";
    var chat_name = null;
    var id = '';
    return new Promise(function (resolve, reject) {
        async.waterfall([
                function (done) {
                    db.select(query, [mkr_id], function (err, results) {
                        done(err, results);
                    });
                },
                function (results, done) {
                    if (results && results.length > 0) {
                        id = results[0].MKR_CHAT_ID;
                        chat_name = results[0].MKR_CHAT_NAME;
                    }

                    var headers = {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };
                    var options = {
                        url: config.rocket_url() + 'api/v1/login',
                        method: 'POST',
                        headers: headers,
                        form: {
                            username: chat_name,
                            password: '1234'
                        }
                    };
                    request(options, function (err, resp, body) {
                        done(err, body);
                    });
                }],
            function (err, results) {
                if (err) {
                    console.error(err);
                    reject(new Error(err));
                } else {
                    var jsonBody = JSON.parse(results);
                    resolve({token: jsonBody.data.authToken, id: id});
                }
            }
        );
    });
};

exports.promiseGetToken = function (id) {
    var query = "  SELECT TEA_ROCKET_NM FROM TB_TEACHER WHERE TEA_NUM = ? ";
    var chat_name = null;

    return new Promise(function (resolve, reject) {
        async.waterfall([
                function (done) {
                    db.select(query, [id], function (err, results) {
                        done(err, results);
                    });
                },
                function (results, done) {
                    if (results && results.length > 0) chat_name = results[0].TEA_ROCKET_NM;

                    var headers = {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };
                    var options = {
                        url: 'http://chat.nareunapp.com/api/v1/login',
                        method: 'POST',
                        headers: headers,
                        form: {
                            username: chat_name,
                            password: 'passwd'
                        }
                    };
                    request(options, function (err, resp, body) {
                        done(err, body);
                    });
                }],
            function (err, results) {
                if (err) {
                    console.error(err);
                    reject(new Error(err));
                } else {
                    var jsonBody = JSON.parse(results);

                    if(jsonBody['data']) {
                        resolve(jsonBody.data.authToken);
                    } else { // 해당되는 로캣챗 사용자가 없을경우
                        resolve(null);
                    }
                }
            }
        );
    });
};

var curlGet = function (url, val, authToken, userId, data) {
    return new Promise(function (resolve, reject) {
        var Curl = require('node-libcurl').Curl, curl = new Curl();
        // var curl = new Curl();

        curl.setOpt(Curl.option.URL, url);
        curl.setOpt(Curl.option.FOLLOWLOCATION, true);
        curl.setOpt(Curl.option.HTTPHEADER, ['X-Auth-Token:' + authToken, 'X-User-Id:' + userId, 'Content-type: application/json']);

        /*if (data) {
            curl.setOpt(curl.option.HTTPPOST, [
                {
                    user: userId,
                    password: 'passsed'
                }
            ]);
        }*/

        curl.on('end', function (statusCode, body, headers) {
            this.close();
            var jsonResult = JSON.parse(body);
            // console.info(jsonResult);
            resolve(jsonResult[val]);
        });

        // https://github.com/JCMais/node-libcurl/blob/87e197117faaded259b6635feda612f6353fa2ae/examples/simple-request.js
        // curl.on('error', curl.close.bind(curl));
        curl.on('error', function (err, curlErrCode) {
            console.error('Err: ', err);
            console.error('Code: ', curlErrCode);
            this.close();
            reject(new Error('curlGet 에러! ' + err));
        });

        curl.perform();
    });
};

function getLangNames(objMember, doneCallback) {
    if (!objMember['MEM_LANG']) {
        return doneCallback(null, objMember);
    }

    var languages = '', str;
    var codes = JSON.parse(objMember['MEM_LANG']);

    async.waterfall([
            function (done) {
                let iCount = 0;

                for (var key in codes) {
                    if (codes[key]) {
                        if(iCount > 0) languages += ', ';

                        switch (key) {
                            case '1': {
                                languages += 'JAVA';
                                break;
                            }

                            case '2': {
                                languages += 'C';
                                break;
                            }

                            case '3': {
                                languages += 'C++';
                                break;
                            }

                            case '4': {
                                languages += 'python';
                                break;
                            }

                            case '5': {
                                languages += objMember['MEM_LANG_ETC'];
                                break;
                            }
                        }

                            // chartypes.push(key);
                        ++iCount
                    }

                }
                done(null, languages)
            }
            ],
        function (err, data) {
            if (err) {
                console.error('에러 ====== %s 테이블 검색 에러 : ', '공지사항 목록', err);
                return res.status(500).send({result: err});
            } else {
                objMember['MEM_LANG'] = data;
                doneCallback(null, objMember);
            }
        }
    );




      // need to delete later

    /*if (chartypes && chartypes.length > 0) {
        db.select(query, [chartypes],
            function (err, results) {
                if (results && results.length > 0) {
                    objTeacher['TEA_TYPES'] = results[0]['CHA_NAMES'];
                } else {
                    objTeacher['TEA_TYPES'] = null;
                }
                doneCallback(err, objTeacher);
            });
    } else {
        objTeacher['TEA_TYPES'] = null;
        doneCallback(null, objTeacher);
    }*/
}

function getGenreNames(objMember, doneCallback) {
    if (!objMember['PJT_TYPE']) {
        return doneCallback(null, objMember);
    }

    var genres = '', str;
    var codes = JSON.parse(objMember['PJT_TYPE']);

    async.waterfall([
            function (done) {
                let iCount = 0;

                for (var key in codes) {
                    if (codes[key]) {
                        if(iCount > 0) genres += '/';

                        switch (key) {
                            case '1': {
                                genres += '액션';
                                break;
                            }

                            case '2': {
                                genres += '슈팅';
                                break;
                            }

                            case '3': {
                                genres += '전략전술';
                                break;
                            }

                            case '4': {
                                genres += 'RPG';
                                break;
                            }

                            case '5': {
                                genres += '어드밴처';
                                break;
                            }

                            case '6': {
                                genres += '호러';
                                break;
                            }

                            case '7': {
                                genres += '시뮬레이션';
                                break;
                            }

                            case '8': {
                                genres += '탈출';
                                break;
                            }

                            case '9': {
                                genres += '롤플레잉';
                                break;
                            }

                            case '10': {
                                genres += '서바이벌';
                                break;
                            }

                            case '11': {
                                genres += '스포츠';
                                break;
                            }

                            case '12': {
                                genres += '교육';
                                break;
                            }

                            case '13': {
                                genres += 'FPS';
                                break;
                            }

                            case '14': {
                                genres += '비트';
                                break;
                            }

                            case '15': {
                                genres += objMember['PJT_TYPE_ETC'];
                                break;
                            }
                        }

                        // chartypes.push(key);
                        ++iCount
                    }

                }
                done(null, genres)
            }
        ],
        function (err, data) {
            if (err) {
                console.error('에러 ====== %s 테이블 검색 에러 : ', '공지사항 목록', err);
                return res.status(500).send({result: err});
            } else {
                objMember['PJT_TYPE'] = data;
                doneCallback(null, objMember);
            }
        }
    );




    // need to delete later

    /*if (chartypes && chartypes.length > 0) {
        db.select(query, [chartypes],
            function (err, results) {
                if (results && results.length > 0) {
                    objTeacher['TEA_TYPES'] = results[0]['CHA_NAMES'];
                } else {
                    objTeacher['TEA_TYPES'] = null;
                }
                doneCallback(err, objTeacher);
            });
    } else {
        objTeacher['TEA_TYPES'] = null;
        doneCallback(null, objTeacher);
    }*/
}


exports.encrypt = function (text) {
    const password = config.enc_key;
    let m = crypto.createHash('md5');
    m.update(password)
    let key = m.digest('hex');
    m = crypto.createHash('md5');
    m.update(password + key)
    let iv = m.digest('hex');

    let data = new Buffer(text, 'utf8').toString('binary');

    let cipher = crypto.createCipher('aes-256-cbc', key, iv.slice(0,16));

    let encrypted = cipher.update(data,'utf8','hex');
    encrypted += cipher.final('hex');
    let crypted = new Buffer(encrypted, 'binary').toString('base64');

    return crypted;
}

exports.decrypt = function (text) {
    const password = config.enc_key;
    let m = crypto.createHash('md5');
    m.update(password)
    let key = m.digest('hex');
    // Create iv from password and key
    m = crypto.createHash('md5');
    m.update(password + key)
    let iv = m.digest('hex');
    let input = text.replace(/\-/g, '+').replace(/_/g, '/');
    let edata = new Buffer(input, 'base64').toString('binary');

    let decipher = crypto.createDecipher('aes-256-cbc', key, iv.slice(0,16));

    let decrypted = decipher.update(edata,'hex','utf8');
    decrypted += decipher.final('utf8');
    let dec = new Buffer(decrypted, 'binary').toString('utf8');
    return dec;
}


exports.promiseSendEmail = promiseSendEmail;
exports.encString = encString;
exports.randomString = randomString;
exports.getTransport = getTransport;
exports.promiseSendFCM2 = promiseSendFCM2;
exports.promiseInsertPushHistory = promiseInsertPushHistory;
exports.whereConcatenator = whereConcatenator;
exports.promiseDownloadExcel = promiseDownloadExcel;
exports.getRecipeMmString = getRecipeMmString;
exports.promiseFindMbrById = promiseFindMbrById;
exports.promiseFindMbrByNick = promiseFindMbrByNick;
exports.promiseFindTchrById = promiseFindTchrById;
exports.promiseFindTchrByNick = promiseFindTchrByNick;
exports.promiseFindCoupBySerial = promiseFindCoupBySerial;
exports.curlGet = curlGet;
exports.getTokenById = getTokenById;
exports.getLangNames = getLangNames;
exports.getGenreNames = getGenreNames;
