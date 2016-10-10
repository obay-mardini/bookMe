var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var pg = require('pg');
var dbUrl = process.env.DATABASE_URL || "postgres://spiced:spiced1@localhost:5432/encounter";

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
            
        })
    })
})


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
                    user: result.rows[0].name
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
