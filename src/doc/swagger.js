const swaggerAutogen = require('swagger-autogen')();

const outputFile = './src/doc/swagger_output.json';
const endpointsFiles = ['./src/route/openApis.js'];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('../server.js');
});
