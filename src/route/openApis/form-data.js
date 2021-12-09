const express = require('express');
const router = express.Router();
const { addFormData } = require('../../service/form-data');
const { responseError } = require('../../service/helper');
const { getVariables } = require('../../service/template');
const { processData } = require('../../service/data-processing');

router.post('/new', async(req, res) => {
  try {
    const data = await addFormData(req.body);
    const variables = await getVariables(req.body);
    await processData(req.body, variables);

    res.send(data);
  } catch (error) {
    responseError(res, error);
  }
});

module.exports = router;
