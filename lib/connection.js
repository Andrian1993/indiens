var mysql = require('mysql');

// https://www.terlici.com/2015/08/13/mysql-node-express.html
var pool = null;

exports.connect = function (done) {
    this.pool = mysql.createPool({
        host: '127.0.0.1',
        // port: '3335',
        user: 'indiens',
        password: 'hellobiz2016!',
        database: 'indiens'
    });

    done();
}

exports.getConnection = function (done) {
    if (!this.pool) {
        return done(new Error('**** DB연결이 끊어짐'));
    }

    this.pool.getConnection(function (err, connection) {
        if (err) return done(err);
        done(null, connection);
    });
}

exports.exec = function (query, values, done) {
    this.getConnection(function (err, connection) {
        // if (err) return done('Database problem');
        if (err) {
            return done(err.message);
        }

        var sql = mysql.format(query, values);
        console.log('**** exec SQL : '+ sql);

        connection.query(query, values, function (err, result) {
            if (err) {
                return done(err);
            }
            connection.release();
            done(null, result);
        });
    });
}

exports.select = function (query, values, done) {
    this.getConnection(function (err, connection) {
        // if (err) return done('Database problem');
        if (err) return done(err.message);

        var sql = mysql.format(query, values);
        console.log('**** SQL : '+ sql);

        // connection.query(query, values, function (err, results) {
        connection.query(sql, function (err, results) {
            if (err) return done(err);
            connection.release();
            done(null, results);
        });
    });
}

exports.selectAll = function (query, done) {
    this.getConnection(function (err, connection) {
        // if (err) return done('Database problem');
        if (err) return done(err.message);

        connection.query(query, function (err, results) {
            if (err) return done(err);
            connection.release();
            done(null, results);
        });
    });
}
