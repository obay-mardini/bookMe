var queryDb = require('./queryDb');
var pool = queryDb.pool;
var crypt = require('./crypting.js');

//register
function register(query, body, callback) {
    crypt.hashPassword(body.password).then(function(password) {
        pool.connect(function(err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }

            client.query(query, [body.user, body.email, password, body.country], function(err, result) {
                if (err) {
                    callback(err)

                } else {
                    callback(null, result.rows);
                    done();
                }
            });
        });
    })

}

function login(body, callback) {
    checkUserAuth(body.email, body.password, function(err, result) {
        if (err) {
            callback('the email or password is not correct');
        } else {
            crypt.checkPassword(body.password, result.rows[0].password, function(err, doesMatch) {
                if (err) {
                    callback(err);
                }

                if (doesMatch) {
                    callback(null, result);
                } else {
                    callback('the email or password is not correct');
                }
            });
        }
    });

}

function checkUserAuth(email, password, callback) {
    var query = 'select * from users where email = $1';

    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query(query, [email], function(err, result) {
            if (!result.rows[0]) {
                callback('err');
                done();
            } else {
                callback(null, result);
                done();
            }
        });

    });

}


exports.register = register;
exports.login = login;