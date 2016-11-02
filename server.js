    var express = require('express');
    var http = require('https');
    var app = express();
    var cookieSession = require('cookie-session');
    var bodyParser = require('body-parser');
    var pg = require('pg');
    var querystring = require('querystring');
    var url = require('url');
    //var session = require('express-session');
    var dbUrl = process.env.DATABASE_URL || "postgres://spiced:spiced1@localhost:5432/bookMe";
    //var configSession = require('connect-redis')(session);
    var redis = require('redis');
    var client = redis.createClient(process.env.REDIS_URL || {
        host: 'localhost',
        port: 6379
    });

    client.on('error', function(err) {
        console.log(err);
    });

    //app.use(session({
    //    store: new configSession({
    //        ttl: 3600,
    //        host: 'localhost',
    //        port: 6379
    //    }),
    //    resave: false,
    //    saveUninitialized: true,
    //    secret: 'nothing in my mind now'
    //}));

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
        console.log(target.path)
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

                   console.log(target.path )
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
    // sky scanner api
    /* first way
    app.post('/search', function(req, res, next){
        console.log('here')
        var postData = querystring.stringify({country:'UK',
                    currency:'GBP',
                    locale:'en-GB',
                    locationSchema:'iata',
                    apiKey:'prtl6749387986743898559646983194',
                    grouppricing:'on',
                    originplace:'EDI',
                    destinationplace:'LHR',
                    outbounddate:'2016-10-17',
                    inbounddate:'2016-10-24',
                    adults:1,
                    children:0,
                    infants:0,
                    cabinclass:'Economy'
                    });
        console.log(postData)
        var options = {
            host: 'api.skyscanner.net',
            path: '/apiservices/pricing/v1.0?apikey=prtl6749387986743898559646983194',
            method: 'POST',
            headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                 }
            };
        var request = http.request(options, function(response){
            var time1 = new Date;
            console.log(response.headers)
            console.log('anything')
            response.on('data',function(){
                console.log('data')
            })
              response.on('end', function () {
                var options = {
                  host: 'api.skyscanner.net',
                  path: '/apiservices/pricing/v1.0/'+ response.headers.location.split('v1.0/')[1] + '?apikey=prtl6749387986743898559646983194',
                  method: 'GET'
                };
                  //https://api.skyscanner.net/apiservices/pricing/uk1/v1.0/6db32d9e6b5f42c9bb6f5588045a702b_ecilpojl_A6BDC21B53CE87D447B4556298C6028A?apikey=prtl6749387986743898559646983194
                console.log(options.host.concat(options.path) )
                var request2 = http.request(options,function(response){
                    var str = '';

                    response.on('data',function(chunk){
                        str += chunk        
                    });
                    response.on('end', function(){
                        console.log(0.001*(new Date - time1));
    //var parsedResult = JSON.parse(str)
                        res.end(str);
                    });
                })
                function sendIt() {
                    console.log('send it')
                    request2.end();
                }
                setTimeout(sendIt,150);
                request2.on('error',function(error){
                    console.log(error)
                })
              });
            request.on('error', function(err){
                console.log(err);
            });
        });

        request.write(postData);
        request.end();

    })
    */

    //second way
    app.post('/bookTicket', function(req, res, next) {
        var body = req.body;
        var ticketInfo = body.ticket;
        var client = new pg.Client(dbUrl);
        client.connect(function(err){
        
            if(err){
                //should throw a real error
                console.log('please check the connection with the DB');
            }

            var query = "INSERT INTO purchases ( ticketid, price, carrier, agent) VALUES ($1, $2,$3,$4)";

            client.query(query, [body.journeyId, parseInt(ticketInfo.pricingOptions.price, 10) ,ticketInfo.carrierName, ticketInfo.pricingOptions.agent], function(error,result) {

                if(error){
                    console.log(error);
                } else {
                    console.log(result);
                    res.end('thanks for using our website!!');
                }

            });
        });
    });

    app.get('/newTicket', function(req, res, next) {
        console.log('new ticket')
        var ticketInfo = req.session.formData;
        var client = new pg.Client(dbUrl);
        client.connect(function(err){
        
            if(err){
                //should throw a real error
                console.log('please check the connection with the DB');
            }

            var query = "INSERT INTO tickets (userId, origin, destination, location, depart, return, adult,children,infants,class, country) VALUES ($1, $2,$3,$4, $5,$6,$7,$8,$9,$10, $11) returning *";
            if(!req.session.user) {
                var userEmail = 'visitor'
            } else {
                var userEmail = req.session.user.email;
            }
            console.log(userEmail)
            client.query(query,[userEmail, ticketInfo.originId, ticketInfo.destinationId, ticketInfo.city, ticketInfo.outbounddate.split('T')[0], ticketInfo.inbounddate && ticketInfo.inbounddate.split('T')[0], ticketInfo.adults,ticketInfo.children, ticketInfo.infants, ticketInfo.class, ticketInfo.country], function(error,result){

                if(error){
                    console.log(error);
                } else {
                    console.log(result);
                    res.end(JSON.stringify(result.rows[0].ticketid))
                }

            });
        });
    });

    app.post('/search', function(req, res, next) {
        var ticketInfo = req.body;  
        console.log(ticketInfo);
        var formData = {country:'UK',
                    currency:'USD',
                    locale:'en-GB',
                    locationSchema:'iata',
                    apiKey:'prtl6749387986743898559646983194',
                    grouppricing:'on',
                    originplace: ticketInfo.originId,
                    destinationplace:ticketInfo.destinationId,
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
        console.log(req.session.key)
        var page = req.params.id;
        console.log(page)
        var target = url.parse(req.session.key);
//        var options = {
//            host: target.host,
//            path: target.path + '?apikey=prtl6749387986743898559646983194&pagesize=20&pageindex=' + page,
//            method: 'GET'
//        };
        
//        var request = http.request(options, function(response){
//            console.log(options.host + options.path)
//            console.log(response.statusCode);
            /////
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

                   console.log(target.path )
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
                    
                    setTimeout(redirect, 1000);
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
//           var str = '';
//           response.on('data', function(chunk){
//               str += chunk;
//           });
//
//            response.on('end', function(){
//                if(response.statusCode === 304) {
//                    console.log('redirecting again!!')
//                    function redirect() {
//                        console.log(new Date() - now)
//                        res.redirect('/pollSession/' + page);
//                    }
//                    
//                    setTimeout(redirect, 1000);
//                } else {
//                    console.log(new Date() - now)
//                    res.end(str);
//                }
//
//            }); 
//        });
//        request.on('error', function(err){
//            console.log(err);
//            res.status(500);
//            res.end('server error please try again later');
//        });
//        request.end();
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

                    console.log(target.path )
                    var str = '';
                    response.on('data', function(chunk){
                       str += chunk;
                    });

                    response.on('end', function(){
                        client.hmset('predictions',query, str)
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
    //app.put('/bookingDetails', function(req, res, next){
    //    var options = {
    //        host: 
    //    }
    //})
    //comments
    app.post("/addComment",isLoggedIn, function(req,res) {
        var client = new pg.Client(dbUrl);
        client.connect(function(err){
            if(err){
                //should throw a real error
                console.log('please check the connection with the DB');
            }

            var query = "INSERT INTO comments (linkId,userName,content,date,likes,disLikes,parent) VALUES ($1,$2,$3,$4,$5,$6,$7) returning *";


            client.query(query,[req.body.linkId,req.body.user,req.body.content,req.body.date,req.body.likes,req.body.disLikes,req.body.parent], function(error,result){

                if(error){
                    res.status(403);
                    res.end(error);
                } else {
                     res.json(result.rows);
                    res.end();
                }

            })
        });


    });

    app.get("/getComments",function(req,res) {
    //    if(!req.session.user) {
    //        res.status(404);
    //        res.end();
    //    }
        var client = new pg.Client(dbUrl);
        client.connect(function(err){
            if(err){
                console.log('please check the connection with the DB');
            }

            var query = "SELECT * from comments WHERE linkid = $1";
            client.query(query,[req.query.id],function(err, result){
                if(err){
                    console.log(err);
                }

                res.json(result.rows);
                res.end();
            })
        })
    })
    // the end of comments

    // auth
    app.post("/register", function(req,res) {
        var client = new pg.Client(dbUrl);
        client.connect(function(err){
            if(err){
                console.log('please check the connection with the DB');
            }

            var query = "INSERT INTO users (name,email,password) values ($1,$2,$3)";
            client.query(query,[req.body.user,req.body.email,req.body.password],function(err, result){
                if(err){
                    res.status(403);
                    res.end('duplicate email');
                } else{
                    res.json(result.rows);
                    res.end();
                }

            });
        });
    });


    app.post("/login", function(req,res) {
        var client = new pg.Client(dbUrl);
        client.connect(function(err){
            if(err){
                res.error('please che1ck the connection with the DB');
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
                }

            })
        })
    })

    app.get("/logout", function(req,res) {
        req.session = null;
        res.end('logged out');
    });
    app.listen(process.env.PORT || 8080);
