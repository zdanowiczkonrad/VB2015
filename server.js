// server.js

// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var fs = require('fs');
var mongoose = require(process.env.ENV == "dev" ? (process.cwd() + '/mocks/mongoose.js') : 'mongoose');

mongoose.connect('mongodb://localhost:27017/vb');

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

app.listen(8000);
console.log("app up.");
fs.readdirSync(__dirname + '/models').forEach(function(fileName) {
    if (~fileName.indexOf('.js')) require(__dirname + '/models/' + fileName);
});

app.get('/users', function(req, res) {
    mongoose.model('users').find(
        function(err, users) {
            res.send(users);
        });
});

app.post('/users', function(req, res) {
    var newUser = mongoose.model('users')({
        name: req.body.name,
        intra: req.body.intra,
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

app.get('/users/:userId', function(req, res) {
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

app.post('/teams', function(req,res) {
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
