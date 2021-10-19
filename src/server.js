
const express = require('express');
const cors = require('cors')

const bodyParser = require('body-parser');
const openApis = require('./route/openApis');

const app = express();


// Setup server port
var port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.ORIGIN || '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.static('public'))


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use('/open-api', openApis);

app.listen(port, function () {
    console.log("Running server on port " + port);
});
