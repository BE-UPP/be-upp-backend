
const express = require('express');

const bodyParser = require('body-parser');

// const router = require('./controllers/router');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// app.use(router); // para adcionar rotas



// Setup server port
var port = process.env.PORT || 3000;

app.post('/', async (req, res) => { 
    const Model = require('./database/models/template');
    const body = req.body;
    console.log(body)
    const dado = await Model.create({ createAt: 1633020142, pages: [], templateVersion: 1});
    console.log(dado)
    res.send('Hello World with Express')
});

app.listen(port, function () {
    console.log("Running server on port " + port);
});
