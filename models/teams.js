var mongoose = require(process.env.ENV=="dev" ? (process.cwd()+'/mocks/mongoose.js') : 'mongoose');
var Schema = mongoose.Schema;

var teamsSchema = new Schema({
  name: String,
  number: Number,
  date: {type: Date, default: Date.now },
  approved: {type: Boolean, default: false},
  captain: String,
  mail: String,
  description: String,
  reserve: {type: Boolean, default: true},
  members: String
});

mongoose.model('teams', teamsSchema);