
const express = require('express');

const bodyParser = require('body-parser');
const formDataRoutes = require('./route/form-data')

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

formDataRoutes(app);

// Setup server port
var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("Running server on port " + port);
});
