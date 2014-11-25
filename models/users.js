var mongoose = require(process.env.ENV=="dev" ? (process.cwd()+'/mocks/mongoose.js') : 'mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  name: String,
  intra: String,
  mail: String
});

mongoose.model('users', usersSchema);