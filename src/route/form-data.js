const express = require('express');
const router = express.Router();
router.post('/test', (req, res) => {
    console.log(req.body)
    res.send('ok');
})
module.exports = app => app.use('/form-data', router);