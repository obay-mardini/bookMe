var URL = require("url-parse");
var pg = require('pg');
var dbUrl = process.env.DATABASE_URL || Buffer(require('./passwords.json').postgres).toString();
var herokuDb = new URL(dbUrl) || null;
var config = {
    user: herokuDb.username,
    database: herokuDb.pathname.slice(1),
    password: herokuDb.password,
    host: herokuDb.hostname,
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};
var pool = new pg.Pool(config);

exports.pool = pool;