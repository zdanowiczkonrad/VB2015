var mongoose = require(process.env.ENV=="dev" ? (process.cwd()+'/mocks/mongoose.js') : 'mongoose');
var Schema = mongoose.Schema;

var teamsSchema = new Schema({
  name: String,
  members: [String]
});

mongoose.model('teams', teamsSchema);