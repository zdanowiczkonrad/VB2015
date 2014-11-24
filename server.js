// server.js

// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var fs = require('fs');

// configuration =================

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

// listen (start app with node server.js) ======================================
app.listen(80);
console.log("App listening on port 80!");

fs.readdirSync(__dirname + '/models').forEach(function(fileName){
  console.log("loading model " + fileName);
  if(~fileName.indexOf('.js')) require(__dirname+'/models/'+fileName);
});

// mongoose.model('news', {
//   author: String,
//   content: String,
//   date: Date
// });

// mongoose.model('freeplayers', {
//   name: String,
//   joiningDate: Date,
//   acceppted: Boolean
// });


app.get('/users', function(req, res) {
  mongoose.model('users').find(
    function(err, users) {
      res.send(users);
    });
});

app.post('/users', function(req, res) {
  var newUser = mongoose.model('users')({
      name : req.body.name,
      intra: req.body.intra,
      mail: req.body.mail
    });
  newUser.save(function(err){
    if(err) {
      console.log("Cannot save user"+err);
      res.send({error:err});
      return;
    }
    else {
      console.log("Tshirt created");
      return res.send({status: 'OK', user: newUser});
    }
  });
});

app.get('/users/:userId', function(req, res) {
  mongoose.model('users').find({_id: req.params.userId}, function(err, users) {
      res.send(users);
    });
});

app.get('/teams', function(req, res) {
  mongoose.model('teams').find(function(err, teams) {
    res.send(teams);
  });
});