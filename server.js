// server.js

// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var fs = require('fs');
var session = require('express-session');
var mongoose = require(process.env.ENV == "dev" ? (process.cwd() + '/mocks/mongoose.js') : 'mongoose');
var ObjectId = mongoose.Types.ObjectId;
mongoose.connect('mongodb://localhost:27017/vb');

var credentials = require('./settings/credentials.json');
console.log(credentials);

var ADMIN_LOGIN = credentials.login;
var ADMIN_PASSWORD = credentials.password;
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());

app.listen(process.env.VB_APP_PORT || 8000);

console.log("app up.");
fs.readdirSync(__dirname + '/models').forEach(function(fileName) {
    if (~fileName.indexOf('.js')) require(__dirname + '/models/' + fileName);
});

app.use(session({
    'secret': 'Konrad Zdanowicz jest spoko'
}));

app.get('/players', function(req, res) {
    mongoose.model('users').find(
        function(err, users) {
            res.send(users);
        });
});

app.post('/players', function(req, res) {
    var newUser = mongoose.model('users')({
        name: req.body.name,
        description: req.body.description,
        mail: req.body.mail
    });
    newUser.save(function(err) {
        if (err) {
            console.log('Cannot save user' + err);
            res.send({
                error: err
            });
            return;
        } else {
            console.log('user created');
            return res.send({
                status: 'OK',
                user: newUser
            });
        }
    });
});

app.get('/players/:userId', function(req, res) {
    mongoose.model('users').find({
        _id: req.params.userId
    }, function(err, users) {
        res.send(users);
    });
});

app.get('/teams', function(req, res) {
    mongoose.model('teams').find(function(err, teams) {
        res.send(teams);
    });
});

app.post('/teams', function(req, res) {
    var newTeam = mongoose.model('teams')({
        name: req.body.name,
        captain: req.body.captain,
        description: req.body.description,
        mail: req.body.mail,
        members: req.body.members
    });

    newTeam.save(function(err) {
        if (err) {
            console.log('Cannot save team' + err);
            res.send({
                status: 'ERR',
                error: err
            });
            return;
        } else {
            console.log('team created');
            return res.send({
                status: 'OK',
                team: newTeam
            });
        }
    });
});
var filterResponseForCredentials = function(req, res) {
    if (req.session.authorized) {
        return true;
    } else {
        res.status(403);
        res.send({
            error: "You are not authorized to do such operation!"
        });
    }
    return false;
}

var updateTeam = function(query, req, res) {
    if (!filterResponseForCredentials(req, res)) return false;
    console.log("authorized to update team");
    mongoose.model('teams').update({
        "_id": req.params.teamId
    }, {
        $set: query
    }, {
        upsert: true
    }, function(error, team) {
        console.log('found team', team);
        if (error) {
            res.send({
                error: 'Failed for ID' + req.params.id
            });
        } else {
            console.log("updated");
            res.send({
                'message': 'OK'
            });
        }
    });
}

app.post('/teams/:teamId/approve', function(req, res) {
    updateTeam({
        approved: true
    }, req, res);
    console.log("exitting approve team method");
});

app.post('/teams/:teamId/unapprove', function(req, res) {
    updateTeam({
        approved: false
    }, req, res);
    console.log("exitting unapprove team method");
});

app.post('/teams/:teamId/addToReserve', function(req, res) {
    updateTeam({
        reserve: true
    }, req, res);
    console.log("exitting approve team method");
});

app.post('/teams/:teamId/removeFromReserve', function(req, res) {
    updateTeam({
        reserve: false
    }, req, res);
    console.log("exitting unapprove team method");
});

app.get('/news', function(req, res) {
    mongoose.model('news').find(
        function(err, news) {
            res.send(news);
        });
});

app.post('/news', function(req, res) {
    if (!filterResponseForCredentials(req, res)) return false;
    var newNews = mongoose.model('news')({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });

    newNews.save(function(err) {
        if (err) {
            console.log('Cannot save news' + err);
            res.send({
                error: err
            });
            return;
        } else {
            console.log('news created');
            return res.send({
                status: 'OK',
                news: newNews
            });
        }
    });
});

app.post('/admin', function(req, res) {
    if (req.body.login == ADMIN_LOGIN && new Buffer(req.body.password).toString('base64') == ADMIN_PASSWORD)
        req.session.authorized = true;

    res.send(req.session.authorized==true ? {
        message: "OK"
    } : {
        message: "denied"
    });
});
app.get('/admin/logged', function(req, res) {
    if (!req.session.authorized) {
        res.status(403);
        res.send({
            error: "You are not authorized to do such operation"
        });
    } else {
        res.status(200);
        res.send({
            message: "OK"
        });
    }
})
app.get('/admin/logout', function(req, res) {
    console.log("logging out");
    req.session.authorized = false;
    res.redirect("/admin");
});
