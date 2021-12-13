const express = require('express');
const router = express.Router();
const { addFormData } = require('../../service/form-data');
const { responseError } = require('../../service/helper');
const { getVariables } = require('../../service/template');
const { processData } = require('../../service/data-processing');
const { addFinalReportData } = require('../../service/final-report');

router.post('/new', async(req, res) => {
  try {
    const data = await addFormData(req.body);
    const variables = await getVariables(req.body);
    const variables2 = await processData(req.body, variables);
    await addFinalReportData(req.body, variables2);

    res.send(data);
  } catch (error) {
    responseError(res, error);
  }
});

module.exports = router;
