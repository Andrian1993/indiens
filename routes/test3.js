let cm = require('../lib/common.js');
let async = require('async');
let moment = require('moment');
let path = require('path');
let fse = require('fs-extra');
let XLSX = require('xlsx');
// const fs = require('fs');
let db = require('../lib/connection');
let nodemailer = require("nodemailer");


test4();
// test4();
// test2();
// excel2();
// excel1();

// testing NodeMailer
function test5() {

    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let transporter = nodemailer.createTransport({
        host: 'smart.whoismail.net',
        port: 587,
        // secure: true, // use SSL
        secure: false, // use SSL
        auth: {
            user: 'mail@indiens.io',
            pass: 'korea7601!'
        }
    });

    let transporter2 = nodemailer.createTransport({
        host: 'smtp.naver.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'andriantsoy',
            pass: 'tshega93'
        }
    });

    transporter.verify(function(error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    /*var mailOptions = {
        to: 'andriantsoy@gmail.com',
        from: 'andriantsoy@naver.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'mylink' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    transporter.sendMail(mailOptions, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log('info', 'An e-mail has been sent to with further instructions.');
        }
    });*/

}


// encrypt 회원 아이디
function test4() {
    let MEM_ID = 'admin';
    let encString = 'c10b0be6ae5778933d598bf213fce1a76486286c03607e5143769f55fe0ae0cf';

    // let encString = cm.encrypt(MEM_ID);
    /*let encString = cm.encString(MEM_ID);
    console.log(encString);*/

    // let decString = cm.decrypt(encString);
    console.log(encString);

    process.exit(0);
}


function test3() {
    let jsonString = JSON.stringify({
        // GUBUN: 'member',
        // MEM_ID: 78
        GUBUN: 'agency',
        MEM_ID: 26
        // , PWD: 'abc123'
    });

    console.log(jsonString);

    // let encString = cm.encString2(jsonString);
    let encString = cm.encrypt(jsonString);
    console.log(encString);

    // let decString = cm.deccString2(encString);
    let decString = cm.decrypt(encString);
    console.log(decString);

    let jsonObject = JSON.parse(decString);
    console.log(jsonObject['GUBUN'], jsonObject['MEM_ID']);

    process.exit(0);
}

function test2() {
    let emailMessage = {
        fromEmail: '<thelogmap@gmail.com>',
        fromName: '로그맵',
        toEmail: '<hyoseop@hellobiz.kr>',
        toName: '송효섭',
        subject: '[로그맵] 비밀번호 재설정',
        content: []
    };

    emailMessage.content.push('안녕하세요? 로그맵입니다.<br/>');
    emailMessage.content.push('송효섭닙의 비밀번호 재설정을 위해서 아래의 링크를 클릭해 주시기를 바랍니다.<br/>');
    emailMessage.content.push('감사합니다.');

    gmail.sendGmail(emailMessage, function (err, result) {
        if (err) {
            console.error('Gmail 전송 에러', err);
        } else {
            console.log('Gmail 전송 결과', JSON.stringify(result));
        }

        process.exit(0);
    });
}

/*test1();

function test1() {
    console.log('1달', moment().add(1*30, 'days').format('YYYY-MM-DD'));
}*/

/*db.connect(function (err) { // Web이 아니므로 추가
    if (err) {
        console.log('Unable to connect to MySQL.##################');
        process.exit(1)
    } else {
        registerHistory();
    }
});*/

function excel2() {
    let file = 'D:\\Projects\\Express\\logMapWeb\\lib\\코드 입력양식.xlsx';

    let sql = 'INSERT INTO  TB_CODE2(CD_LEVEL1, CD_LEVEL2, CD_NAME)' +
        ' values ?' +
        ' ON DUPLICATE KEY ' +
        ' UPDATE CD_NAME=VALUES(CD_NAME), ADD_DT=NOW()';

    async.waterfall([
            function (done) {
                readSheet2(file, function (err, list) {
                    done(err, list);
                });
            },
            function (insertArry, done) {
                db.connect(function (err) { // Web이 아니므로 추가
                    if (err) {
                        console.log('Unable to connect to MySQL.##################');
                        process.exit(1)
                    } else {
                        console.log('connect to MySQL.############################');

                        db.getConnection(function (err, connection) {
                            if (err) {
                                throw err;
                            }
                            console.log('getConnection!!!!');
                            connection.beginTransaction(function (err) {
                                if (err) {
                                    console.error('====== beginTransaction 에러 : %s' + err);
                                } else {
                                    let mysql = require('mysql');
                                    let insertQuery = mysql.format(sql, [insertArry]);
                                    console.log('insertQuery 쿼리', insertQuery);

                                    connection.query(insertQuery, function (error, results, fields) {
                                        if (error) {
                                            return connection.rollback(function () {
                                                throw error;
                                            });
                                        }
                                        connection.commit(function (err) {
                                            if (err) {
                                                return connection.rollback(function () {
                                                    throw err;
                                                });
                                            }
                                            console.log('success!');
                                            done(null, null);
                                        });
                                    });
                                }
                            });
                        });
                    }
                });

                /*fse.unlink(file.path, function (err) {
                    if (insertArry && insertArry.length > 0) {
                        console.log('insertQuery 쿼리', sql);

                        db.exec(sql, function (err, results) {
                            done(err, results);
                        });
                    } else {
                        done(null, null);
                    }
                });*/
            }],
        function (err, result) {
            if (err) {
                console.error('에러 ====== 엑셀처리 : %s', err);
                // res.json({code: 500, message: err, data: null});
            } else {
                console.log('서비스가격 엑셀 데이터 입력 완료');
                // res.json({code: 200, message: '', data: null});
            }

            process.exit(0);
        }
    );
}

/*
TB_ESTATE_HISTO	매물진행내역
TB_ALERT	알림 메시지 내역
*/
function registerHistory() {
    // let params = {GUBUN: '1', ET_ID: 202, MEM_ID: 2};   // 1. 매물중개 거절 메시지
    let params = {GUBUN: '5', ET_ID: 202, MEM_ID: 9};   // 5. 매물중개 의뢰 수신

    cm.registerHistory(params, function (error, result) {
        process.exit(0);
    });
}

// 서비스가격 엑셀 데이터 입력
function excel1() {
    let file = 'D:\\Projects\\Express\\logMapWeb\\lib\\서비스 가격표 입력양식.xlsx';

    let sql = 'INSERT INTO  TB_PRICETABLE(PT_MONTH, PT_CNT, PT_PRICE) VALUES ?';

    async.waterfall([
            function (done) {
                readSheet(file, function (err, list) {
                    done(err, list);
                });
            },
            function (insertArry, done) {
                let list = [];

                for (let i = 1; i < insertArry.length; i++) {
                    let row = insertArry[i];

                    for (let j = 1; j < row.length; j++) {
                        console.log(row[0], '개월 ', parseInt(insertArry[0][j]) * 10, '건', row[j], '원');
                        list.push([row[0], parseInt(insertArry[0][j]) * 10, row[j]]);
                    }
                }

                db.connect(function (err) { // Web이 아니므로 추가
                    if (err) {
                        console.log('Unable to connect to MySQL.##################');
                        process.exit(1)
                    } else {
                        console.log('connect to MySQL.############################');

                        db.getConnection(function (err, connection) {
                            if (err) {
                                throw err;
                            }
                            console.log('getConnection!!!!');
                            connection.beginTransaction(function (err) {
                                if (err) {
                                    console.error('====== beginTransaction 에러 : %s' + err);
                                } else {
                                    connection.query('truncate table ??', 'TB_PRICETABLE', function (error, results, fields) {
                                        if (error) {
                                            return connection.rollback(function () {
                                                throw error;
                                            });
                                        }

                                        let mysql = require('mysql');
                                        let insertQuery = mysql.format(sql, [list]);
                                        console.log('insertQuery 쿼리', insertQuery);

                                        connection.query(insertQuery, function (error, results, fields) {
                                            if (error) {
                                                return connection.rollback(function () {
                                                    throw error;
                                                });
                                            }
                                            connection.commit(function (err) {
                                                if (err) {
                                                    return connection.rollback(function () {
                                                        throw err;
                                                    });
                                                }
                                                console.log('success!');
                                                done(null, null);
                                            });
                                        });
                                    });
                                }
                            });
                        });
                    }
                });

                /*fse.unlink(file.path, function (err) {
                    if (insertArry && insertArry.length > 0) {
                        console.log('insertQuery 쿼리', sql);

                        db.exec(sql, function (err, results) {
                            done(err, results);
                        });
                    } else {
                        done(null, null);
                    }
                });*/
            }],
        function (err, result) {
            if (err) {
                console.error('에러 ====== 엑셀처리 : %s', err);
                // res.json({code: 500, message: err, data: null});
            } else {
                console.log('서비스가격 엑셀 데이터 입력 완료');
                // res.json({code: 200, message: '', data: null});
            }

            process.exit(0);
        }
    );
}

function readSheet(file, doneCallback) {
    let workbook;

    try {
        // workbook = XLSX.readFile(file.path);
        workbook = XLSX.readFile(file);
    } catch (err) {
        console.error('====== 엑셀 에러 : %s', err);
    }

    let worksheet = workbook.Sheets[workbook.SheetNames[0]];

    let list = XLSX.utils.sheet_to_json(worksheet, {header: 1, skipHeader: true});
    list.splice(0, 2);
    console.log('업로드 데이터 건수', list.length);
    let err = null;
    let result = [];

    list.some(
        function (currentValue, currentIndex, listObj) {
            if (currentValue.length >= 10) result.push(currentValue);
            /*if (!currentValue || currentValue.length < 15) {
                err = '모든 데이터를 입력해 주시기 바랍니다';
                return false;
            }

            for (let i = 0; i < currentValue.length; i++) {
                if (!currentValue[i]) {
                    err = '모든 데이터를 입력해 주시기 바랍니다';
                    return false;
                }

                console.log('[' + currentIndex + '][' + i + '] =', currentValue[i]);
            }*/
        }
    );

    doneCallback(err, result);
}

function readSheet2(file, doneCallback) {
    let workbook;

    try {
        // workbook = XLSX.readFile(file.path);
        workbook = XLSX.readFile(file);
    } catch (err) {
        console.error('====== 엑셀 에러 : %s', err);
    }

    let worksheet = workbook.Sheets[workbook.SheetNames[0]];

    let list = XLSX.utils.sheet_to_json(worksheet, {header: 1, skipHeader: true});
    list.splice(0, 1);
    console.log('업로드 데이터 건수', list.length);

    doneCallback(null, list);
}
