
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

app.post('/', async (req, res) => { 
    const Model = require('./data/models/template');
    const body = req.body;
    console.log(body)
    try{
        const dado = await Model.create({ createAt: 1633020142, pages: []});
        console.log(dado)
        res.send('Hello World with Express')
    }
    catch(error){
        res.send(error.message)
    }
});

app.listen(port, function () {
    console.log("Running server on port " + port);
});
