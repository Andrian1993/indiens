var table_name = 'TB_PROJECT';
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
var fse = require('fs-extra');
var path = require('path');
var moment = require('moment');


// 목록
router.get('/', function (req, res, next) {
    var data = req.query;
    var firstRow = parseInt(data.firstRow), lastRow = parseInt(data.lastRow);
    var keyword = data.keyword;
    var values = [];
    var where = ' WHERE PJT_DEL_YN != \'Y\' AND PJT_NAME IS NOT NULL ';

    if (data.PJT_NAME) {
        where = cm.whereConcatenator(where, ' PJT_NAME LIKE ?');
        values.push('%' + data.PJT_NAME + '%');
    }

    values.push(firstRow);
    values.push(lastRow);

    var query = 'SELECT ' +
        '    PJT_ID, PJT_LOGO, PJT_NAME, PJT_DESC ' +
        ' FROM' +
        '    TB_PROJECT' + where +
        ' ORDER BY PJT_ID DESC' +
        ' LIMIT ?, ?';

    var query2 = 'SELECT ' +
        '    COUNT(1) AS cnt' +
        ' FROM' +
        '    TB_PROJECT' + where;

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

// 장르 선택
router.post('/', function (req, res, next) {
    var data = req.body;
    var PJT_ID = data.PJT_ID, INSERT_ID, details = data.details;

    var post = {
        MEM_ID: data.MEM_ID,
        PJT_TYPE: data.PJT_TYPE,
        PJT_TYPE_ETC: data.PJT_TYPE_ETC
    };

    if(data.PJT_DUE_DT) data.PJT_DUE_DT = moment(new Date(data.PJT_DUE_DT)).format('YYYY-MM-DD');

    if(post.PJT_TYPE) post.PJT_TYPE = JSON.stringify(post.PJT_TYPE);

    async.waterfall([
            function (done) {
                    if(!PJT_ID) {
                        db.exec('INSERT INTO ?? SET ?', [table_name, post], function (err, result) {
                            done(err, result);
                        });
                    } else {
                        post = {
                            PJT_STEP: data.PJT_STEP,
                            PJT_NAME: data.PJT_NAME,
                            PJT_DESC: data.PJT_DESC,
                            PJT_DUE_DT: data.PJT_DUE_DT

                        };
                        db.exec('UPDATE ?? SET ? WHERE PJT_ID = ?', [table_name, post, PJT_ID], function (err, result) {
                            done(err, result);
                        });
                    }
            },
            function (result, done) {
                if(!PJT_ID) {
                    INSERT_ID = result.insertId;
                    done(null, result);
                } else {
                    if (details && details.length > 0) {
                        var TB_JOBS = [];

                        for (var i = 0; i < details.length; i++) {
                            TB_JOBS.push([PJT_ID, details[i].JOB_TYPE, details[i].JOB_PAY_TYPE, details[i].JOB_DEV_MM, details[i].JOB_ROLE]);
                        }

                        db.exec('INSERT INTO TB_JOBS(PJT_ID, JOB_TYPE, JOB_PAY_TYPE, JOB_DEV_MM, JOB_ROLE) VALUES ? ', [TB_JOBS], function (err, result) {
                            if (err) console.error('에러 ====== 레시피 식재료 정보 입력 : ' + err);
                            done(err, result);
                        });
                    } else {
                        done(null, null);
                    }


                    /*post = {
                        PJT_ID: PJT_ID,
                        JOB_TYPE: data.JOB_TYPE,
                        JOB_PAY_TYPE: data.JOB_PAY_TYPE,
                        JOB_PERIOD: data.JOB_PERIOD,
                        JOB_STORY: data.JOB_STORY
                    };

                    db.exec('INSERT INTO TB_JOBS SET ?', [post], function (err, result) {
                        done(err, result);
                    });*/
                }
            }
            ],
        function (err, data) {
            if(!PJT_ID) {
                data['PJT_ID'] = INSERT_ID;
            }
            if (err) {
                console.error(err);
                return res.json({code: 500, message: '내 프로필 수정시 에러가 발생하였습니다.', data: ''});
            } else {
                return res.json({code: 200, message: '', data: data});
            }
        }
    );
});

// 장르 업데이트
router.post('/updateGenre', function (req, res, next) {
    var data = req.body;
    var PJT_ID = data.PJT_ID;

    var post = {
        MEM_ID: data.MEM_ID,
        PJT_TYPE: data.PJT_TYPE,
        PJT_TYPE_ETC: data.PJT_TYPE_ETC
    };

    if(post.PJT_TYPE) post.PJT_TYPE = JSON.stringify(post.PJT_TYPE);

    async.waterfall([
            function (done) {
                db.exec('UPDATE ?? SET ? WHERE PJT_ID = ?', [table_name, post, PJT_ID], function (err, result) {
                    done(err, result);
                });
            }
        ],
        function (err, result) {
            if (err) {
                console.error(err);
                return res.json({code: 500, message: '내 프로필 수정시 에러가 발생하였습니다.', data: ''});
            } else {

                return res.json({code: 200, message: '', data: data});
            }
        }
    );
});

//  프로젝트 상세정보
router.get('/:id', function (req, res, next) {
    var id = req.params.id, list, myquery;

    var query = 'SELECT ' +
        ' PJT_NAME, PJT_ID, PJT_DT, PJT_TYPE, PJT_TYPE_ETC, PJT_DUE_DT, PJT_DESC, PJT_LOGO, MEM_ID' +
        ' FROM ??' +
        ' WHERE' +
        '    PJT_ID = ?';

    /*var query = 'SELECT ' +
        '         a.PJT_NAME, a.PJT_ID, a.PJT_DT, a.PJT_TYPE, a.PJT_DUE_DT, a.PJT_DESC, a.PJT_LOGO, a.MEM_ID, b.MEM_NAME' +
        '         FROM TB_PROJECT AS a' +
        '         LEFT JOIN ' +
        '         TB_MEMBER AS b ON a.MEM_ID = b.MEM_ID' +
        '         WHERE' +
        '            a.PJT_ID = ?';*/


    var query2 = 'SELECT ' +
        '    a.JOB_ID,' +
        '    a.JOB_DEV_MM,' +
        '    a.JOB_ROLE,' +
        '    a.JOB_VIEW_YN,' +
        '    CASE a.JOB_PAY_TYPE' +
        '        WHEN \'1\' THEN \'임금 지급형\'' +
        '        WHEN \'2\' THEN \'이익 배분형\'' +
        '    END AS JOB_PAY_TYPE,' +
        '    CASE a.JOB_DEV_MM' +
        '        WHEN \'1\' THEN \'1개월\'' +
        '        WHEN \'2\' THEN \'2개월\'' +
        '        WHEN \'3\' THEN \'3개월\'' +
        '        WHEN \'4\' THEN \'4개월\'' +
        '        WHEN \'5\' THEN \'5개월\'' +
        '        WHEN \'6\' THEN \'6개월\'' +
        '        WHEN \'7\' THEN \'7개월\'' +
        '        WHEN \'8\' THEN \'8개월\'' +
        '        WHEN \'9\' THEN \'9개월\'' +
        '        WHEN \'10\' THEN \'10개월\'' +
        '        WHEN \'11\' THEN \'11개월\'' +
        '        WHEN \'12\' THEN \'12개월\'' +
        '    END AS JOB_DEV_MM,' +
        '    CASE a.JOB_TYPE' +
        '        WHEN \'1\' THEN \'기획자\'' +
        '        WHEN \'2\' THEN \'개발자\'' +
        '        WHEN \'3\' THEN \'원화가\'' +
        '        WHEN \'4\' THEN \'작곡가\'' +
        '        WHEN \'5\' THEN \'작가\'' +
        '        WHEN \'6\' THEN \'크리에이터\'' +
        '        WHEN \'7\' THEN \'기타\'' +
        '    END AS JOB_TYPE' +
        /*'    (SELECT' +
        '                 d.MEM_NAME' +
        '  FROM' +
        '  TB_MEMBER AS d' +
        '                WHERE' +
        '  b.PRO_RECEIVER = d.MEM_ID AND b.PRO_ACCEPT_ST = \'4\'' +
        '               ) AS FAB_YN' +*/
        ' FROM ' +
        '    TB_JOBS AS a' +
       /* '        LEFT JOIN' +
        '    TB_PROPOSAL AS b ON a.JOB_ID = b.JOB_ID' +
        '        LEFT JOIN' +
        '    TB_MEMBER AS c ON b.PRO_RECEIVER = c.MEM_ID' +*/
        ' WHERE' +
        '    a.PJT_ID = ?';



    var query3 = 'SELECT PRO_ID, PRO_RECEIVER FROM TB_PROPOSAL WHERE PRO_ACCEPT_ST = \'4\' AND JOB_ID = ?';

    var query4 = 'SELECT ' +
        '    CASE' +
        '        WHEN a.PRO_RECEIVER = c.MEM_ID THEN 1' +
        '        ELSE 0' +
        '    END AS a' +
        ' FROM ' +
        '    TB_PROPOSAL AS a' +
        '        LEFT JOIN' +
        '    TB_PROJECT AS c ON a.PJT_ID = c.PJT_ID ' +
        ' WHERE' +
        '    a.PRO_ID = ?';

    var query5 = 'SELECT ' +
        '    b.MEM_NAME' +
        '    FROM' +
        '    TB_PROPOSAL AS a ' +
        '    LEFT JOIN ' +
        '    TB_MEMBER AS b ON ' +
        '    a.PRO_RECEIVER = b.MEM_ID ' +
        '    WHERE a.PRO_ID = ?';

    var query6 = 'SELECT ' +
        '    b.MEM_ID,' +
        '    b.MEM_NAME' +
        '    FROM' +
        '    TB_PROPOSAL AS a ' +
        '    LEFT JOIN ' +
        '    TB_MEMBER AS b ON ' +
        '    a.PRO_SENDER = b.MEM_ID ' +
        '    WHERE a.PRO_ID = ?';


    function fnCreateList(obj, doneCallback) {
        var PRO_ID;
        async.waterfall([
                function (done) {
                    db.select(query3, [obj.JOB_ID],
                        function (err, data) {
                            done(err, data);
                        });
                },
                function (results, done) {
                    if(results[0]) {
                        PRO_ID = results[0].PRO_ID;
                        db.select(query4, [PRO_ID],
                            function (err, data) {
                                done(err, data);
                            });
                    } else {
                        doneCallback(null, obj);
                    }
                },
                function (results, done) {
                    if(results[0].a == 0) {
                        myquery = query5;
                    } else {
                        myquery = query6;
                    }
                    db.select(myquery, [PRO_ID],function (err, data) {
                        // list.push(data[0]);
                        obj['MEM_ID'] = data[0].MEM_ID;
                        obj['MEM_NAME'] = data[0].MEM_NAME;
                        doneCallback(null, obj);
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
    }


    async.waterfall([
            function (done) {
                db.select(query2, [id],
                    function (err, data) {
                        done(err, data);
                    });
            },
            function (results, done) {
                async.map(results, fnCreateList, function (err, data) {
                    done(err, data);
                });
            },
            function (results, done) {
                list = results;
                db.select(query, [table_name, id],
                    function (err, data) {
                        done(err, data);
                });
            },
            function (results, done) {
                async.map(results, cm.getGenreNames, function (err, data) {
                    done(err, data)
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

router.get('/get/ProjectsHome', function (req, res, next) {
    var data = req.query;
    var id = data.id, list, myquery, MEM_ID = data.MEM_ID;

    /*var query = 'SELECT ' +
        ' PJT_NAME, PJT_ID, PJT_DT, PJT_TYPE, PJT_DUE_DT, PJT_DESC, PJT_LOGO, MEM_ID' +
        ' FROM ??' +
        ' WHERE' +
        '    PJT_ID = ?';*/

    var query = 'SELECT ' +
        '    PJT_ID, PJT_LOGO, PJT_NAME, PJT_DESC' +
        '   FROM ?? ' +
        '   ORDER BY PJT_ID DESC' +
        '   LIMIT 6';

    async.waterfall([
            function (done) {
                db.select(query, [table_name],
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
                res.json(data);
            }
        }
    );
});

//  프로젝트 상세정보2
router.get('/get/Info', function (req, res, next) {
    var data = req.query;
    var id = data.id, list, myquery, MEM_ID = data.MEM_ID;

    /*var query = 'SELECT ' +
        ' PJT_NAME, PJT_ID, PJT_DT, PJT_TYPE, PJT_DUE_DT, PJT_DESC, PJT_LOGO, MEM_ID' +
        ' FROM ??' +
        ' WHERE' +
        '    PJT_ID = ?';*/

    var query = 'SELECT ' +
        '         a.PJT_NAME, a.PJT_ID, a.PJT_DT, a.PJT_TYPE, a.PJT_TYPE_ETC, a.PJT_DUE_DT, a.PJT_DESC, a.PJT_LOGO, a.MEM_ID, b.MEM_NAME, ' +
        '            CASE a.PJT_STEP' +
        '             WHEN \'1\' THEN \'아이디어 단계\'' +
        '             WHEN \'2\' THEN \'필요기능정리 완료\'' +
        '             WHEN \'3\' THEN \'기획서 작성중\'' +
        '             WHEN \'4\' THEN \'상세기획서 보유\'' +
        '             WHEN \'5\' THEN \'개발중\'' +
        '            END AS PJT_STEP ' +
        '         FROM TB_PROJECT AS a' +
        '         LEFT JOIN ' +
        '         TB_MEMBER AS b ON a.MEM_ID = b.MEM_ID' +
        '         WHERE' +
        '            a.PJT_ID = ?';

    var query2 = 'SELECT ' +
        '    a.JOB_ID,' +
        '    a.JOB_DEV_MM,' +
        '    a.JOB_ROLE,' +
        '    a.JOB_VIEW_YN,' +
        '    CASE a.JOB_PAY_TYPE' +
        '        WHEN \'1\' THEN \'임금 지급형\'' +
        '        WHEN \'2\' THEN \'이익 배분형\'' +
        '    END AS JOB_PAY_TYPE,' +
        '    CASE a.JOB_DEV_MM' +
        '        WHEN \'1\' THEN \'1개월\'' +
        '        WHEN \'2\' THEN \'2개월\'' +
        '        WHEN \'3\' THEN \'3개월\'' +
        '        WHEN \'4\' THEN \'4개월\'' +
        '        WHEN \'5\' THEN \'5개월\'' +
        '        WHEN \'6\' THEN \'6개월\'' +
        '        WHEN \'7\' THEN \'7개월\'' +
        '        WHEN \'8\' THEN \'8개월\'' +
        '        WHEN \'9\' THEN \'9개월\'' +
        '        WHEN \'10\' THEN \'10개월\'' +
        '        WHEN \'11\' THEN \'11개월\'' +
        '        WHEN \'12\' THEN \'12개월\'' +
        '    END AS JOB_DEV_MM,' +
        '    CASE a.JOB_TYPE' +
        '        WHEN \'1\' THEN \'기획자\'' +
        '        WHEN \'2\' THEN \'개발자\'' +
        '        WHEN \'3\' THEN \'원화가\'' +
        '        WHEN \'4\' THEN \'작곡가\'' +
        '        WHEN \'5\' THEN \'작가\'' +
        '        WHEN \'6\' THEN \'크리에이터\'' +
        '        WHEN \'7\' THEN \'기타\'' +
        '    END AS JOB_TYPE' +
        /*'    (SELECT' +
        '                 FAB_ID ' +
        '  FROM ' +
        '  TB_FABS ' +
        '                WHERE' +
        '  PJT_ID = ? AND MEM_ID = ? ' +
        '               ) AS FAB_YN' +*/
        ' FROM ' +
        '    TB_JOBS AS a' +
        /* '        LEFT JOIN' +
         '    TB_PROPOSAL AS b ON a.JOB_ID = b.JOB_ID' +
         '        LEFT JOIN' +
         '    TB_MEMBER AS c ON b.PRO_RECEIVER = c.MEM_ID' +*/
        ' WHERE' +
        '    a.PJT_ID = ?';



    var query3 = 'SELECT PRO_ID, PRO_RECEIVER FROM TB_PROPOSAL WHERE PRO_ACCEPT_ST = \'4\' AND JOB_ID = ?';

    var query4 = 'SELECT ' +
        '    CASE' +
        '        WHEN a.PRO_RECEIVER = c.MEM_ID THEN 1' +
        '        ELSE 0' +
        '    END AS a' +
        ' FROM ' +
        '    TB_PROPOSAL AS a' +
        '        LEFT JOIN' +
        '    TB_PROJECT AS c ON a.PJT_ID = c.PJT_ID ' +
        ' WHERE' +
        '    a.PRO_ID = ?';

    var query5 = 'SELECT ' +
        '    b.MEM_ID,' +
        '    b.MEM_NAME' +
        '    FROM' +
        '    TB_PROPOSAL AS a ' +
        '    LEFT JOIN ' +
        '    TB_MEMBER AS b ON ' +
        '    a.PRO_RECEIVER = b.MEM_ID ' +
        '    WHERE a.PRO_ID = ?';

    var query6 = 'SELECT ' +
        '    b.MEM_ID,' +
        '    b.MEM_NAME' +
        '    FROM' +
        '    TB_PROPOSAL AS a ' +
        '    LEFT JOIN ' +
        '    TB_MEMBER AS b ON ' +
        '    a.PRO_SENDER = b.MEM_ID ' +
        '    WHERE a.PRO_ID = ?';

    var query7 = 'SELECT ' +
        '            FAB_ID ' +
        '        FROM ' +
        '            TB_FABS ' +
        '        WHERE ' +
        '            PJT_ID = ? AND MEM_ID = ?';

    function fnCreateList(obj, doneCallback) {
        var PRO_ID;
        async.waterfall([
                function (done) {
                    db.select(query3, [obj.JOB_ID],
                        function (err, data) {
                            done(err, data);
                        });
                },
                function (results, done) {
                    if(results[0]) {
                        PRO_ID = results[0].PRO_ID;
                        db.select(query4, [PRO_ID],
                            function (err, data) {
                                done(err, data);
                            });
                    } else {
                        doneCallback(null, obj);
                    }
                },
                function (results, done) {
                    if(results[0].a == 0) {
                        myquery = query5;
                    } else {
                        myquery = query6;
                    }
                    db.select(myquery, [PRO_ID],function (err, data) {
                        // list.push(data[0]);
                        obj['MEM_ID'] = data[0].MEM_ID;
                        obj['MEM_NAME'] = data[0].MEM_NAME;
                        doneCallback(null, obj);
                        // done(err, data)
                    });
                },
                /*function (results, done) {
                    db.select(query7, [id, MEM_ID],function (err, data) {
                        if(data[0]) {
                            obj['FAB_YN'] = 'Y';
                        } else {
                            obj['FAB_YN'] = 'N';
                        }
                        doneCallback(null, obj);
                    });
                }*/
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
    }


    async.waterfall([
            function (done) {
                db.select(query2, [id],
                    function (err, data) {
                        done(err, data);
                    });
            },
           /* function (results, done) {
                db.select(query7, [id, MEM_ID],
                    function (err, data) {
                    if(data[0]) {
                        results[0]['FAB_YN'] = 'Y';
                    } else {
                        results[0]['FAB_YN'] = 'N';
                    }
                        done(err, results);
                    });
            },*/
            function (results, done) {
                async.map(results, fnCreateList, function (err, data) {
                    done(err, data);
                });
            },
            function (results, done) {
                list = results;
                db.select(query, [id],
                    function (err, data) {
                        done(err, data);
                    });
            },
            function (results, done) {
                async.map(results, cm.getGenreNames, function (err, data) {
                    done(err, data)
                });
            },
            function (results, done) {
                db.select(query7, [id, MEM_ID],
                    function (err, data) {
                        if(data[0]) {
                            results[0]['FAB_YN'] = 'Y';
                        } else {
                            results[0]['FAB_YN'] = 'N';
                        }
                        done(err, results);
                    });
            },
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

// 프로젝트 정보 출력
router.get('/get/ProjectInfo', function (req, res, next) {
    var data = req.query;
    var id = data.id, list;

    var query = 'SELECT ' +
        ' PJT_NAME, ' +
        ' PJT_ID, PJT_DT, PJT_TYPE, PJT_TYPE_ETC, ' +
        ' PJT_DUE_DT, ' +
        // ' DATE_FORMAT(PJT_DUE_DT, \'%Y-%m-%d\') AS PJT_DUE_DT, ' +
        ' PJT_DESC, PJT_LOGO, PJT_STEP, MEM_ID' +
        ' FROM ??' +
        ' WHERE' +
        '    PJT_ID = ?';


    var query2 = 'SELECT ' +
        '    a.PJT_ID,' +
        '    a.JOB_ID,' +
        '    a.JOB_DEV_MM,' +
        '    a.JOB_ROLE,' +
        '    a.JOB_PAY_TYPE,' +
        '    a.JOB_DEV_MM,' +
        '    a.JOB_TYPE' +
        ' FROM' +
        '    TB_JOBS AS a' +
        ' WHERE' +
        '    a.PJT_ID = ?';

    async.waterfall([
            function (done) {
                db.select(query2, [id],
                    function (err, data) {
                        done(err, data);
                    });
            },
            function (results, done) {
                list = results;
                db.select(query, [table_name, id],
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

// 구성원 정보 출력
router.get('/get/MembersInfo', function (req, res, next) {
    var data = req.query;
    var id = data.id, list, myquery;

    /*var query = 'SELECT ' +
        ' PJT_NAME, ' +
        ' PJT_ID, ' +
        ' PJT_LOGO, MEM_ID' +
        ' FROM ??' +
        ' WHERE' +
        '    PJT_ID = ?';*/


    var query = 'SELECT ' +
        ' a.PJT_NAME, ' +
        ' a.PJT_ID, ' +
        ' a.PJT_LOGO, a.MEM_ID, b.MEM_NAME ' +
        ' FROM ?? AS a ' +
        ' LEFT JOIN ' +
        ' TB_MEMBER AS b ON a.MEM_ID = b.MEM_ID ' +
        ' WHERE' +
        '    PJT_ID = ?';


    var query2 = 'SELECT ' +
        '    a.JOB_ID,' +
        '    a.JOB_VIEW_YN,' +
        /*'    b.PRO_RECEIVER,' +
        '    b.PRO_ACCEPT_ST,' +*/
        '    CASE a.JOB_TYPE' +
        '        WHEN \'1\' THEN \'기획자\'' +
        '        WHEN \'2\' THEN \'개발자\'' +
        '        WHEN \'3\' THEN \'원화가\'' +
        '        WHEN \'4\' THEN \'작곡가\'' +
        '        WHEN \'5\' THEN \'작가\'' +
        '        WHEN \'6\' THEN \'크리에이터\'' +
        '        WHEN \'7\' THEN \'기타\'' +
        '    END AS JOB_TYPE' +
        /*'    (SELECT' +
        '                 d.MEM_NAME' +
        '  FROM' +
        '  TB_MEMBER AS d' +
        '                WHERE' +
        '  b.PRO_RECEIVER = d.MEM_ID AND b.PRO_ACCEPT_ST = \'4\'' +
        '               ) AS MEM_NAME' +*/
        ' FROM ' +
        '    TB_JOBS AS a' +
      /*  '        LEFT JOIN' +
        '    TB_PROPOSAL AS b ON a.JOB_ID = b.JOB_ID' +*/
        ' WHERE' +
        '    a.PJT_ID = ?';





    var query3 = 'SELECT PRO_ID, PRO_RECEIVER FROM TB_PROPOSAL WHERE PRO_ACCEPT_ST = \'4\' AND JOB_ID = ?';

    var query4 = 'SELECT ' +
        '    CASE' +
        '        WHEN a.PRO_RECEIVER = c.MEM_ID THEN 1' +
        '        ELSE 0' +
        '    END AS a' +
        ' FROM ' +
        '    TB_PROPOSAL AS a' +
        '        LEFT JOIN' +
        '    TB_PROJECT AS c ON a.PJT_ID = c.PJT_ID ' +
        ' WHERE' +
        '    a.PRO_ID = ?';

    var query5 = 'SELECT ' +
        '    b.MEM_NAME' +
        '    FROM' +
        '    TB_PROPOSAL AS a ' +
        '    LEFT JOIN ' +
        '    TB_MEMBER AS b ON ' +
        '    a.PRO_RECEIVER = b.MEM_ID ' +
        '    WHERE a.PRO_ID = ?';

    var query6 = 'SELECT ' +
        '    b.MEM_NAME' +
        '    FROM' +
        '    TB_PROPOSAL AS a ' +
        '    LEFT JOIN ' +
        '    TB_MEMBER AS b ON ' +
        '    a.PRO_SENDER = b.MEM_ID ' +
        '    WHERE a.PRO_ID = ?';


    function fnCreateList(obj, doneCallback) {
        var PRO_ID;
        async.waterfall([
                function (done) {
                    db.select(query3, [obj.JOB_ID],
                        function (err, data) {
                            done(err, data);
                        });
                },
                function (results, done) {
                    if(results[0]) {
                        PRO_ID = results[0].PRO_ID;
                        db.select(query4, [PRO_ID],
                        function (err, data) {
                            done(err, data);
                        });
                    } else {
                        doneCallback(null, obj);
                    }
                },
                function (results, done) {
                    if(results[0].a == 0) {
                        myquery = query5;
                    } else {
                        myquery = query6;
                    }
                    db.select(myquery, [PRO_ID],function (err, data) {
                        // list.push(data[0]);
                        obj['MEM_NAME'] = data[0].MEM_NAME;
                        doneCallback(null, obj);
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
    }

    async.waterfall([
            function (done) {
                db.select(query2, [id],
                    function (err, data) {
                        done(err, data);
                    });
            },
            function (results, done) {
                async.map(results, fnCreateList, function (err, data) {
                    done(err, data);
                });
            },
            function (results, done) {
                list = results;
                db.select(query, [table_name, id],
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

// 지원자 리스트 출력
router.get('/get/MembersList', function (req, res, next) {
    var data = req.query;
    var id = data.id, list = [], join, myquery;

    var query = 'SELECT ' +
        '    a.PRO_ID, b.MEM_ID, b.MEM_NAME, b.MEM_TEL ' +
        '    FROM' +
        '    TB_PROPOSAL AS a ' +
        '    LEFT JOIN ' +
        '    TB_MEMBER AS b ON ' +
        '    a.PRO_RECEIVER = b.MEM_ID ' +
        '    WHERE a.PRO_ID = ?';

    var query3 = 'SELECT ' +
        '    a.PRO_ID, b.MEM_ID, b.MEM_NAME, b.MEM_TEL ' +
        '    FROM' +
        '    TB_PROPOSAL AS a ' +
        '    LEFT JOIN ' +
        '    TB_MEMBER AS b ON ' +
        '    a.PRO_SENDER = b.MEM_ID ' +
        '    WHERE a.PRO_ID = ?';


    var query2 = 'SELECT ' +
        '    a.PRO_ID,' +
        '    CASE' +
        '        WHEN a.PRO_RECEIVER = c.MEM_ID THEN 1' +
        '        ELSE 0' +
        '    END AS a' +
        ' FROM ' +
        '    TB_PROPOSAL AS a' +
        '        LEFT JOIN' +
        '    TB_PROJECT AS c ON a.PJT_ID = c.PJT_ID ' +
        ' WHERE' +
        '    a.JOB_ID = ? AND a.PRO_ACCEPT_ST = \'2\'';

    function fnCreateList(obj, doneCallback) {
        if(obj.a == 0) {
            myquery = query;
        } else {
            myquery = query3;
        }

        db.select(myquery, [obj.PRO_ID],function (err, data) {
            list.push(data[0]);
            doneCallback(null, obj);
        });
    }


    async.waterfall([
            function (done) {
                db.select(query2, [data.JOB_ID],
                    function (err, data) {
                        done(err, data);
                    });
            },
            function (results, done) {
                if(results[0]) {
                    async.map(results, fnCreateList, function (err, data) {
                        done(err, list);
                    });
                } else {
                    done(null, null);
                }
            }
        ],
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

// 프로젝트 업데이트
router.post('/updateProject', function (req, res, next) {
    var data = req.body;
    var PJT_ID = data.PJT_ID, INSERT_ID, details = data.details, workers = data.workers;

    if(data.PJT_DUE_DT) data.PJT_DUE_DT = moment(new Date(data.PJT_DUE_DT)).format('YYYY-MM-DD');

    var post = {
        PJT_STEP: data.PJT_STEP,
        PJT_NAME: data.PJT_NAME,
        PJT_DESC: data.PJT_DESC,
        PJT_DUE_DT: data.PJT_DUE_DT,
        PJT_TYPE_ETC: data.PJT_TYPE_ETC
    };

    if(data.PJT_TYPE) post.PJT_TYPE = JSON.stringify(data.PJT_TYPE);



    function fnUpdateWorkers(obj, doneCallback) {
        var job_post = {
            JOB_TYPE: obj.JOB_TYPE,
            JOB_DEV_MM: obj.JOB_DEV_MM,
            JOB_ROLE: obj.JOB_ROLE,
            JOB_PAY_TYPE: obj.JOB_PAY_TYPE
        };


        async.waterfall([
                function (done) {
                    db.select('UPDATE TB_JOBS SET ? WHERE JOB_ID = ?', [job_post, obj.JOB_ID],
                        function (err, data) {
                            doneCallback(null, obj);
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
    }


    async.waterfall([
            function (done) {
                db.exec('UPDATE ?? SET ? WHERE PJT_ID = ?', [table_name, post, PJT_ID], function (err, result) {
                    done(err, result);
                });
            },
            function (result, done) {
                if (details && details.length > 0) {
                    var TB_JOBS = [];

                    for (var i = 0; i < details.length; i++) {
                        TB_JOBS.push([PJT_ID, details[i].JOB_TYPE, details[i].JOB_PAY_TYPE, details[i].JOB_DEV_MM, details[i].JOB_ROLE]);
                    }

                    db.exec('INSERT INTO TB_JOBS(PJT_ID, JOB_TYPE, JOB_PAY_TYPE, JOB_DEV_MM, JOB_ROLE) VALUES ? ', [TB_JOBS], function (err, result) {
                        if (err) console.error('에러 ====== 레시피 식재료 정보 입력 : ' + err);
                        done(err, result);
                    });
                } else {
                    done(null, null);
                }
            },
            function (result, done) {
                if (workers && workers.length > 0) {
                    async.map(workers, fnUpdateWorkers, function (err, data) {
                        done(err, data);
                    });
                } else {
                    done(null, null);
                }
            }
        ],
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

// 구성원 병경
router.post('/updateWorker', function (req, res, next) {
    var data = req.body;

    var post = {
        PJT_ID: data.PJT_ID,
        JOB_ID: data.MEM_ID
    };



    async.waterfall([
            function (done) {
                db.exec('UPDATE ?? SET PRO_ACCEPT_ST = \'1\' WHERE JOB_ID = ? AND PRO_ACCEPT_ST = \'4\'', ['TB_PROPOSAL', data.JOB_ID], function (err, result) {
                    done(err, result);
                });
            },
            function (results, done) {
                db.exec('UPDATE ?? SET PRO_ACCEPT_ST = \'4\' WHERE PRO_ID = ?', ['TB_PROPOSAL', data.PRO_ID], function (err, result) {
                    done(err, result);
                });
            }
            ],
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

// 구성원 리스트 저장
router.post('/updateMembersinfo', function (req, res, next) {
    var JOB_INFO = req.body;

    function fnUpdateInfo(obj, doneCallback) {
        db.exec('UPDATE ?? SET JOB_VIEW_YN = ? WHERE JOB_ID = ?', ['TB_JOBS', obj.JOB_VIEW_YN, obj.JOB_ID], function (err, result) {
            doneCallback(null, obj);
        });
    }

    async.waterfall([
            function (done) {
                async.map(JOB_INFO, fnUpdateInfo, function (err, data) {
                    done(err, data);
                });
            },
        ],
        function (err, data) {
            if (err) {
                console.error(err);
                return res.status(500).send({result: err});
            } else {
                res.json({code: 200, message: '', data: []});
            }
        }
    );
});

// 삭제
router.post('/delete', function (req, res, next) {
    var data = req.body;
    var PJT_ID = data.id;

    async.waterfall([
            function (done) {
                db.exec('DELETE FROM ?? WHERE PJT_ID = ?', [table_name, PJT_ID], function (err, result) {
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

// 삭제
router.post('/deleteProject', function (req, res, next) {
    var data = req.body;
    var PJT_ID = data.id;

    var post = {
        PJT_DEL_YN: 'Y'
    };

    async.waterfall([
            function (done) {
                db.exec('UPDATE ?? SET ? WHERE PJT_ID = ?', [table_name, post, PJT_ID], function (err, result) {
                    done(err, result);
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

// 이미지 압로드
router.post('/upload', function (req, res, next) {
    var file = req.files.file;
    var PJT_ID = req.body.PJT_ID, idx = req.body.idx;
    var newFileNm = idx + PJT_ID + path.extname(file.name);

    var uploadPath = path.normalize(config.uploadDir + '/project/') + newFileNm;

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
});


module.exports = router;
