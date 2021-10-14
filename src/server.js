
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
// app.use('/api', auth, protectRoute)
  
app.use((err, req, res, next) => {
  const formattedError = errorFormatter(err)

  res.status(formattedError.status || 500)
  res.json(formattedError)
})




// app.get('/', async (req, res) => { 

//   res.send('Hello World with Express')
//     // const Model = require('./data/models/template');
//     // const body = req.body;
//     // console.log(body)
//     // try{
//     //     const dado = await Model.create({ createAt: 1633020142, pages: []});
//     //     console.log(dado)
//     //     res.send('Hello World with Express')
//     // }
//     // catch(error){
//     //     res.send(error.message)
//     // }
// });

app.listen(port, function () {
    console.log("Running server on port " + port);
});
