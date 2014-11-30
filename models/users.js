var mongoose = require(process.env.ENV=="dev" ? (process.cwd()+'/mocks/mongoose.js') : 'mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  name: String,
  description: String,
  mail: String,
  date: {type: Date, default: Date.now }
});

mongoose.model('users', usersSchema);