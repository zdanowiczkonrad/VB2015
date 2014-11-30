var mongoose = require(process.env.ENV=="dev" ? (process.cwd()+'/mocks/mongoose.js') : 'mongoose');
var Schema = mongoose.Schema;

var newsSchema = new Schema({
  title: String,
  content: String,
  author: String,
  date: {type: Date, default: Date.now },
  visible: {type: Boolean, default: true}
});

mongoose.model('news', newsSchema);