const mongoose = require('mongoose');

let port = process.env.MONGO_PORT || 27017;
let domain = process.env.MONGO_PORT ? 'mongo' : 'localhost';

mongoose.connect('mongodb://backend:beeUpPass@' + domain + ':' + port + '/admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;

if (!db){
  // console.log("Error connecting db");
} else {
  // console.log("Db connected successfully");
}

db.Promise = global.Promise;

module.exports = mongoose;


