var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamsSchema = new Schema({
  name: String,
  members: [String]
});

console.log("commit test");

mongoose.model('teams', teamsSchema);