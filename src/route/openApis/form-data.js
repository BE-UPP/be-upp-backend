const express = require('express');
const router = express.Router();
const { addFormData } = require('../../service/form-data');
const { responseError } = require('../../service/helper');

router.post('/new', async (req, res) => {
  try {
    const data = await addFormData(req.body);
    // processData(req.body);
    res.send(data);
  } catch (error) {
    responseError(res, error);
  }
});

module.exports = router;
