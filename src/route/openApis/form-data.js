const express = require('express');
const router = express.Router();
const { addFormData, checkFormData } = require('../../service/form-data');
const { responseError } = require('../../service/helper');
const { getVariables } = require('../../service/template');
const { processData } = require('../../service/data-processing');
const { addFinalReportData } = require('../../service/final-report');

router.get('/check', async(req, res) => {
  try {
    const id = req.query ? req.query.id : false;
    if (!id) {
      throw Object.assign(
        new Error('Ausência de valores (requerido: appointmentId)'),
        { code: 400 },
      );
    }
    const appointment = await checkFormData(id);
    res.send(appointment);
  } catch (error) {
    console.log(error);
    // TODO error
    res.status(error.code).send(error.message);
  }
});

router.post('/new', async(req, res) => {
  try {
    const data = await addFormData(req.body);
    const variables = await getVariables(req.body);
    const variables2 = await processData(req.body, variables);
    await addFinalReportData(req.body, variables2);

    res.send(data);
  } catch (error) {
    console.log(error);
    responseError(res, error);
  }
});

module.exports = router;
