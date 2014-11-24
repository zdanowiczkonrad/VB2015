var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamsSchema = new Schema({
  name: String,
  members: [String]
});

mongoose.model('teams', teamsSchema);