var express = require('express');
var http = require('https');
var app = express();
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var pg = require('pg');
var querystring = require('querystring');
var URL = require("url-parse");
var url = require('url');
//var session = require('express-session');
var dbUrl = process.env.DATABASE_URL || "postgres://spiced:spiced1@localhost:5432/bookMe";
var redis = require('redis');
var client = redis.createClient(process.env.REDIS_URL || {
    host: 'localhost',
    port: 6379
});

var herokuDb = new URL(process.env.DATABASE_URL) || null;
var config = {
  user: herokuDb.username || 'spiced', 
  database: herokuDb.pathname.slice(1) || 'bookMe', 
  password: herokuDb.password || 'spiced1', 
  host: herokuDb.hostname || 'localhost', 
  port: 5432,
  max: 10, 
  idleTimeoutMillis: 30000
};
var pool = new pg.Pool(config);

client.on('error', function(err) {
    console.log(err);
});

app.use(express.static(__dirname + '/Static'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json({
    extended: false
}));
//ask David how to separate your sessions so some are stored in Redis and others in memory
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

var isLoggedIn = function(req,res,next){
    if(!req.session.user){
        res.status(403);
        res.end('please log in or sign up!');
    } else {
        next();
    }
}

app.get('/isLoggedIn',isLoggedIn, function(req,res){
   res.json({name: req.session.user.user,
            isLoggedIn: req.session.user.loggedin
            })
});

function cashNextPage(target,page) {
    var query = target.path + '?apikey=prtl6749387986743898559646983194&pagesize=20&pageindex=' + page; 
    client.get(query, function(err, data) {
        if (err) {
            return console.log(err);
        }
        if(!data || data === {}) {
            console.log('the page is not here anymore');
            var options = {
                host: target.host,
                path: target.path + '?apikey=prtl6749387986743898559646983194&pagesize=20&pageindex=' + page,
                method: 'GET'
            };
            var request = http.request(options, function(response) {
                var str = '';
               response.on('data', function(chunk){
                   str += chunk;
               });

        response.on('end', function(){
            if(response.statusCode === 304) {
                console.log('redirecting again!!')
                function redirect() {

                    cashNextPage(target,page)
                }

                setTimeout(redirect, 1000);
                } else {
                    console.log('setting the next page to redis')
                    client.set(query, str);
                    client.expire(query, 300);
                    return;
                }


                }); 
            });
            request.on('error', function(err){
                console.log(err);
            });
            request.end();
            } else {
               console.log('thank you redis')
               return;
            }
});
}

//second way
app.post('/bookTicket', function(req, res, next) {
    var body = req.body;
    var ticketInfo = body.ticket;
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        
        var query = "INSERT INTO purchases ( ticketid, price, carrier, agent) VALUES ($1, $2,$3,$4)";

        client.query(query, [body.journeyId, parseInt(ticketInfo.pricingOptions.price, 10) ,ticketInfo.carrierName, ticketInfo.pricingOptions.agent], function(error,result) {

            if(error){
                console.log(error);
            } else {
                res.end('thanks for using our website!!');
                done();
            }

        });
    });
});

app.get('/newTicket', function(req, res, next) {
    var ticketInfo = req.session.formData;
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        
        var query = "INSERT INTO tickets (userId, origin, destination, location, depart, return, adult,children,infants,class, country, destinationcountry) VALUES ($1, $2,$3,$4, $5,$6,$7,$8,$9,$10, $11, $12) returning *";
        if(!req.session.user) {
            var userEmail = 'visitor'
        } else {
            var userEmail = req.session.user.email;
        }
        client.query(query,[userEmail, ticketInfo.originId, ticketInfo.destinationId, ticketInfo.city, ticketInfo.outbounddate.split('T')[0], ticketInfo.inbounddate && ticketInfo.inbounddate.split('T')[0], ticketInfo.adults,ticketInfo.children, ticketInfo.infants, ticketInfo.class, ticketInfo.country, ticketInfo.destinationCountry], function(error,result){

            if(error){
                console.log(error);
            } else {
                res.end(JSON.stringify(result.rows[0].ticketid))
                done();
            }

        });
        
    });
});

app.post('/search', function(req, res, next) {
    var ticketInfo = req.body;  
    var formData = {country:'UK',
                currency:'USD',
                locale:'en-GB',
                locationSchema:'iata',
                apiKey:'prtl6749387986743898559646983194',
                grouppricing:'on',
                originplace: ticketInfo.originId,
                destinationplace:ticketInfo.destinationId,
                destinationCountry: ticketInfo.destinationplacecountry,
                outbounddate: ticketInfo.outbounddate.split('T')[0],
                inbounddate: ticketInfo.inbounddate && ticketInfo.inbounddate.split('T')[0],
                adults:ticketInfo.adults,
                children:ticketInfo.children,
                infants:ticketInfo.infants,
                cabinclass: ticketInfo.class,
                groupPricing:true
                };
    var data = querystring.stringify(formData);
    var options = {
        host: 'api.skyscanner.net',
        path: '/apiservices/pricing/v1.0?apikey=prtl6749387986743898559646983194',
        method: 'POST',
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json',
                'Content-Length': Buffer.byteLength(data)
             }
        };
    var request = http.request(options, function(response){
        console.log(response.statusCode)
        if(response.statusCode != 200 && response.statusCode != 201 && response.statusCode != 304) {
            response.on('data',function(chunks){
                res.status(400);
                res.end(chunks);
            });
        } else {
            req.session.key = response.headers.location;
            response.on('data',function(){
                //
            });

            response.on('end', function(){   
               console.log('end');
               req.session.formData = ticketInfo;
               res.redirect('/pollSession/0');
            });
        }

    });
    request.on('error', function(err){
        console.log(err)
        res.status(500);
        res.end('oobs... server error can you search again in a moment');
    });
    request.write(data);
    request.end()
});

app.get('/pollSession/:id', function(req, res, next){
    var now = new Date();
    var page = req.params.id;
    var target = url.parse(req.session.key);
        var query = target.path + '?apikey=prtl6749387986743898559646983194&pagesize=20&pageindex=' + page;
        client.get(query, function(err, data) {

        if (err) {
            return console.log(err);
        }
        if(!data || data === {}) {
            console.log('the page is not here anymore');
            var options = {
                host: target.host,
                path: target.path + '?apikey=prtl6749387986743898559646983194&pagesize=20&pageindex=' + page,
                method: 'GET'
            };
            var request = http.request(options, function(response) {
                var str = '';
               response.on('data', function(chunk){
                   str += chunk;
               });

        response.on('end', function(){
            if(response.statusCode === 304) {
                console.log('redirecting again!!')
                function redirect() {
                    console.log(new Date() - now)
                    res.redirect('/pollSession/' + page);
                }

                setTimeout(redirect, 200);
                } else {
                    console.log(new Date() - now);
                    console.log('setting the page to redis')
                    client.set(query, str);
                    client.expire(query, 300);
                    res.end(str);
                    cashNextPage(target,parseInt(page,10) + 1);
                }


                }); 
            });
            request.on('error', function(err){
                console.log(err);
                res.status(500);
                res.end('server error please try again later');
            });

            request.end();
            } else {
               console.log('thank you redis')
               res.end(data)
               cashNextPage(target,parseInt(page,10) + 1);
            }

    })
        ///////
});

app.post('/predict', function(req, res, next){
    var target = url.parse(req.body.link);
    var query = querystring.parse(target.query).query;
    client.hgetall('predictions', function(err, data) {
        if (err) {
            return console.log(err);
        }
        data = data || {};
        if(data[query] === undefined) {
            console.log('send a request');
            var options = {
                host: 'api.skyscanner.net',
                path: target.path + '&apiKey=prtl6749387986743898559646983194',
                method: 'GET'
            };
            var request = http.request(options, function(response) {
                var str = '';
                response.on('data', function(chunk){
                   str += chunk;
                });

                response.on('end', function(){
                    client.hmset('predictions',query, str);
                    res.end(str)
                });
            });

            request.on('error', function(err) {
                console.log(err)
                res.status(500);
                res.end('error in the sever');
            });

            request.end();
        } else {
           res.end(data[query])
        }
    })


});

// auth
app.post("/register", function(req,res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        var query = "INSERT INTO users (name,email,password, country) values ($1,$2,$3, $4)";
        client.query(query,[req.body.user,req.body.email,req.body.password, req.body.country],function(err, result){
            if(err){
                res.status(403);
                res.end('duplicate email');
            } else{
                res.json(result.rows);
                res.end();
                done();
            }
        });
    });
});


app.post("/login", function(req,res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        var query = "SELECT * FROM users where email = $1 and password = $2";
        client.query(query,[req.body.email,req.body.password],function(err, result){ 
            if(err){
                res.status(403);
                res.end()
            } else if (result.rows.length === 0 ) {
                res.status(403);
                res.end('the email or password is not correct')
            }else {
                req.session.user = {
                    loggedin: true,
                    user: result.rows[0].name,
                    email: result.rows[0].email
                }
                res.json(result.rows);
                done();
            }

        })
    })
})

app.get("/logout", function(req,res) {
    req.session = null;
    res.end('logged out');
});
app.listen(process.env.PORT || 8080);