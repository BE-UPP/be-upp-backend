const mongoose = require('mongoose');

mongoose.connect('mongodb://backend:beeUpPass@localhost:27017/admin', {
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


