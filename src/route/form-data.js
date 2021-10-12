const express = require('express');
const router = express.Router();
router.post('/', async (req, res) => {
    const FormDataModel = require('../data/models/form-data');
    try {
        const data = await FormDataModel.create(req.body);
        res.send('Success');
    } 
    catch(error) {
        res.status(400).send(error.message)
    }
})
module.exports = app => app.use('/form-data', router);