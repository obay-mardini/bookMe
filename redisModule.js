var redis = require('redis');
var client = redis.createClient(process.env.REDIS_URL || {
    host: 'localhost',
    port: 6379
});

client.on('error', function(err) {
    console.log(err);
    return;
});

exports.client = client;
