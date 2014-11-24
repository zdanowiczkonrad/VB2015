var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  name: String,
  intra: String,
  mail: String
});

mongoose.model('users', usersSchema);