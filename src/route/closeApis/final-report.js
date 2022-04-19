const express = require('express');
const router = express.Router();
const {
  getFinalReportData,
} = require('../../service/final-report');
const {
  getFormDataByAppointmentId,
} = require('../../service/form-data');
const { addFinalReportData } = require('../../service/final-report');
const { getVariables } = require('../../service/template');
const { processData } = require('../../service/data-processing');
const { authorize } = require('../../service/authentication');

router.get('/by-id', authorize(), async(req, res) => {
  try {
    const id = req.query ? req.query.id : false;
    if (!id) {
      throw Object.assign(
        new Error('Ausência de valores (requerido: appointmentId)'),
        { code: 402 },
      );
    }
    console.log('ID -> ', id);

    const frData = await getFinalReportData(id);

    res.send(frData);
  } catch (error) {
    console.log(error);
    // TODO error
    res.status(error.code).send(error.message);
  }
});

router.get('/recompute', authorize('admin'), async(req, res) => {
  try {
    const id = req.query ? req.query.id : false;
    if (!id) {
      throw Object.assign(
        new Error('Ausência de valores (requerido: appointmentId)'),
        { code: 402 },
      );
    }

    const formData = await getFormDataByAppointmentId(id);
    const variables = await getVariables(formData);
    const variables2 = await processData(formData, variables);

    const data = await addFinalReportData(formData, variables2);

    res.send(data);
  } catch (error) {
    console.log(error);
    // TODO error
    res.status(error.code).send(error.message);
  }
});

module.exports = router;
