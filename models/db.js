const mongoose = require('mongoose');

const config = require('../config');
const env_variable = process.env.NODE_ENV;
if (env_variable === 'test') {
  url = config.mongoTestUrl;
 
}
// const  url = config.mongoUrl;

const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => {
  console.log(err);
})

module.exports = connect;