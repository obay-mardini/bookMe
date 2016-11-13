var queryDb = require('./queryDb');
var pool = queryDb.pool;

//register
function register(query, body, callback) {
    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query(query, [body.user, body.email, body.password, body.country], function(err, result) {
            if (err) {
                callback(err)

            } else {
                callback(null, result.rows);
                done();
            }
        });
    });
}

function login(query, body, callback) {
    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query(query, [body.email, body.password], function(err, result) {
            if (err) {
                callback(err);
            } else if (result.rows.length === 0) {
                callback('the email or password is not correct')
            } else {
                callback(null, result);
                done();
            }
        });
    });
}

exports.register = register;
exports.login = login;