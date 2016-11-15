var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var url = require('url');

//custom modules
var auth = require('./auth');
var skyscanner = require('./skyscanner');

app.use(express.static(__dirname + '/Static'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json({
    extended: false
}));

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));

//SkyScanner 
//add tickets and data to the DB
app.post('/bookTicket', function(req, res, next) {
    var body = req.body;
    var query = "INSERT INTO purchases ( ticketid, price, carrier, agent) VALUES ($1, $2,$3,$4) returning *";
    skyscanner.bookTicket(query, body, function(error, response) {
        if (error) {
            console.log(error);
            return;
        }

        if (response) {
            res.end(response);
        }
    });

});

app.get('/newTicket', function(req, res, next) {
    var query = "INSERT INTO tickets (userId, origin, destination, location, depart, return, adult,children,infants,class, country, destinationcountry) VALUES ($1, $2,$3,$4, $5,$6,$7,$8,$9,$10, $11, $12) returning *";

    skyscanner.newTicket(query, req.session, function(err, response) {
        if (response) {
            res.end(JSON.stringify(response));
        }
    });

});

// search for new routes
app.post('/search', function(req, res, next) {

    skyscanner.search(req.body, function(err, header) {
        if (err === 500) {
            res.status(500);
            res.end('oobs... server error can you search again in a moment');
            return;
        } else if (err) {
            res.status(400);
            res.end(err);
        } else if (header) {
            req.session.key = header;
            req.session.formData = req.body;
            setTimeout(function() {
                res.redirect('/pollSession/0');
            }, 500);
        }

    });

});

app.get('/pollSession/:id', function(req, res, next) {
    var now = new Date();
    var page = req.params.id;
    var target = url.parse(req.session.key);
    skyscanner.pollSession(target, page, function(response, str) {
        if (response === 500) {
            res.status(500);
            res.end('Server error please try again in a moment!');
        } else if (response === 304) {
            setTimeout(redirect, 1000);
        } else if (response === 'notComplete') {
            res.end(str);
        } else {
            res.end(str);
        }

        function redirect() {
            res.redirect('/pollSession/' + page);
        }

    });


});

//autosuggest
app.post('/predict', function(req, res, next) {
    var target = url.parse(req.body.link);
    skyscanner.predict(target, function(err, result) {
        if (err) {
            res.status(500);
            res.end('Error in the sever, try again in a moment');
            return;
        }
        res.end(result);
    });

});

// auth
var isLoggedIn = function(req, res, next) {
    if (!req.session.user) {
        res.status(403);
        res.end('please log in or sign up!');
    } else {
        next();
    }
}

app.get('/isLoggedIn', isLoggedIn, function(req, res) {
    res.json({
        name: req.session.user.user,
        isLoggedIn: req.session.user.loggedin
    })
});

app.post("/register", function(req, res) {
    var query = "INSERT INTO users (name,email,password, country) values ($1,$2,$3, $4)";
    auth.register(query, req.body, function(err, result) {
        if (err) {
            res.status(404);
            res.end('You are already a member');
        } else {
            res.json(result);
            res.end();
        }
    });

});


app.post("/login", function(req, res) {
    auth.login(req.body, function(err, result) {
        if (err) {
            res.status(403);
            res.end(err)
        } else {
            var respnose = {
                loggedin: true,
                user: result.rows[0].name,
                email: result.rows[0].email
            }
            req.session.user = respnose;
            res.json(respnose);
        }
    });
})

app.get("/logout", function(req, res) {
    req.session = null;
    res.end('logged out');
});

app.listen(process.env.PORT || 8080);