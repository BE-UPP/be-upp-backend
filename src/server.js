require('dotenv').config();

const express = require('express');
const cors = require('cors');

const openApis = require('./route/openApis');

const app = express();

// Setup server port
var port = process.env.API_PORT || 3001;

app.use(cors({
  origin: process.env.ORIGIN || '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

app.use(express.static('public'));

app.use(express.urlencoded({
  extended: true,
}));

app.use(express.json());

app.use('/open-api', openApis);

if (process.env.REACT_APP_API_DOMAIN === 'localhost') {
  try {
    const swaggerUi = require('swagger-ui-express');
    const swaggerFile = require('./doc/swagger_output.json');
    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  } catch (e) {};
}

let server = null;

const openServer = () => {
  if (server != null && server.readyState === server.OPEN)
    return server;
  const newServer = app.listen(port, function() {
    console.log('Running server on port ' + port);
  });
  return newServer;
};

const closeServer = () => {
  server.close();
};

server = openServer();

module.exports = {
  app: app,
  openServer: openServer,
  closeServer: closeServer,
};
