var queryDb = require('./queryDb');
var pool = queryDb.pool;
var querystring = require('querystring');
var fs = require('fs');
var apiKey = Buffer(require('./passwords.json').apiKey).toString();
var http = require('https');
var redis = require('./redisModule');
var client = redis.client;

function bookTicket(query, body, callback) {
    var ticketInfo = body.ticket;
    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query(query, [body.journeyId, parseInt(ticketInfo.pricingOptions.priceNoCurrency, 10), ticketInfo.carrierName, ticketInfo.pricingOptions.agent], function(error, result) {

            if (error) {
                callback(error)
            } else {
                callback(null, 'thanks for using our website!!');
                done();
            }

        });
    });
}

function newTicket(query, session, callback) {
    var ticketInfo = session.formData;
    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        if (!session.user) {
            var userEmail = 'visitor'
        } else {
            var userEmail = session.user.email;
        }

        client.query(query, [userEmail, ticketInfo.originId, ticketInfo.destinationId, ticketInfo.city, ticketInfo.outbounddate.split('T')[0], ticketInfo.inbounddate && ticketInfo.inbounddate.split('T')[0], ticketInfo.adults, ticketInfo.children, ticketInfo.infants, ticketInfo.class, ticketInfo.country, ticketInfo.destinationCountry], function(error, result) {

            if (error) {
                console.log(error);
            } else {
                callback(null, result.rows[0].ticketid)
                done();
            }

        });

    });
}

function search(ticketInfo, callback) {
    var formData = {
        country: 'DE',
        currency: ticketInfo.currency,
        locale: 'de-DE',
        locationSchema: 'iata',
        apiKey: apiKey,
        grouppricing: 'on',
        originplace: ticketInfo.originId,
        destinationplace: ticketInfo.destinationId,
        destinationCountry: ticketInfo.destinationplacecountry,
        outbounddate: ticketInfo.outbounddate.split('T')[0],
        inbounddate: ticketInfo.inbounddate && ticketInfo.inbounddate.split('T')[0],
        adults: ticketInfo.adults,
        children: ticketInfo.children,
        infants: ticketInfo.infants,
        cabinclass: ticketInfo.class,
        groupPricing: true,
    };
    if (ticketInfo.filter) {
        formData.sortorder = 'asc'
        formData.sorttype = 'price'
    }
    var data = querystring.stringify(formData);
    var options = {
        host: 'api.skyscanner.net',
        path: '/apiservices/pricing/v1.0?apikey=' + apiKey,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    var request = http.request(options, function(response) {
        if (response.statusCode != 200 && response.statusCode != 201 && response.statusCode != 304) {
            response.on('data', function(chunks) {
                callback(chunks)
            });
        } else {
            response.on('data', function() {
                //
            });
            response.on('end', function() {
                callback(null, response.headers.location);
            });
        }

    });
    request.on('error', function(err) {
        callback(500, 'oobs... server error can you search again in a moment')
    });
    request.write(data);
    request.end()
}

function pollSession(target, page, callback) {
    var query = target.path + '?apikey=' + apiKey + '&pagesize=20&pageindex=' + page;

    // check if the data is available in redis or not
    client.get(query, function(err, data) {

            if (err) {
                console.log(err)
                return;
            }

            if (!data || data === {}) {
                var options = {
                    host: target.host,
                    path: target.path + '?apikey=' + apiKey + '&pagesize=20&pageindex=' + page,
                    method: 'GET'
                };
                var request = http.request(options, function(response) {
                    var str = '';
                    response.on('data', function(chunk) {
                        str += chunk;
                    });

                    response.on('end', function() {
                        if (response.statusCode === 304) {
                            callback(304)
                                ///////////////// 
                        } else {
                            try {
                                var status = JSON.parse(str).Status;
                            } catch (err) {
                                return;
                            }

                            if (status === "UpdatesPending" || JSON.parse(str).Itineraries.length === 0) {
                                callback('notComplete', str);
                                return;
                            }

                            client.set(query, str);
                            client.expire(query, 300);
                            callback('complete', str);
                            cashNextPage(target, parseInt(page, 10) + 1);
                        }


                    });
                });
                request.on('error', function(err) {
                    callback(500);
                    return;
                });

                request.end();
            } else {
                callback('complete', data);
                cashNextPage(target, parseInt(page, 10) + 1);
            }

        })
        ///////
}

function cashNextPage(target, page) {
    var query = target.path + '?apikey=' + apiKey + '&pagesize=20&pageindex=' + page;
    client.get(query, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }
        if (!data || data === {}) {
            var options = {
                host: target.host,
                path: target.path + '?apikey=' + apiKey + '&pagesize=20&pageindex=' + page,
                method: 'GET'
            };
            var request = http.request(options, function(response) {
                var str = '';
                response.on('data', function(chunk) {
                    str += chunk;
                });

                response.on('end', function() {
                    if (response.statusCode === 304) {

                        function redirect() {
                            cashNextPage(target, page);
                        }

                        setTimeout(redirect, 1000);
                    } else {
                        client.set(query, str);
                        client.expire(query, 300);
                        return;
                    }

                });
            });

            request.on('error', function(err) {
                console.log(err);
                return;
            });

            request.end();
        } else {
            return;
        }
    });
}

function predict(target, callback) {
    var query = querystring.parse(target.query).query;
    client.hgetall('predictions', function(err, data) {
        if (err) {
            callback(err);
            return;
        }

        data = data || {};
        if (data[query] === undefined) {
            var options = {
                host: 'api.skyscanner.net',
                path: target.path + '&apiKey=' + apiKey,
                method: 'GET'
            };
            var request = http.request(options, function(response) {
                var str = '';
                response.on('data', function(chunk) {
                    str += chunk;
                });

                response.on('end', function() {
                    client.hmset('predictions', query, str);
                    callback(null, str)
                });
            });

            request.on('error', function(err) {
                calback(err);
            });

            request.end();
        } else {
            callback(null, data[query])
        }

    })
}

exports.bookTicket = bookTicket;
exports.newTicket = newTicket;
exports.search = search;
exports.pollSession = pollSession;
exports.predict = predict;