require('dotenv').config();
const packageJson = require('../../package.json');
const swaggerAutogen = require('swagger-autogen')();

const outputFile = './src/doc/swagger_output.json';
const endpointsFiles = ['./src/route/openApis.js'];
const config = {
  host: process.env.REACT_APP_API_DOMAIN + ':' + process.env.API_PORT,
  info: {
    version: packageJson.version,
    title: packageJson.name,
    description: packageJson.description,
  },
};

swaggerAutogen(outputFile, endpointsFiles, config).then(() => {
  require('../server.js');
});
