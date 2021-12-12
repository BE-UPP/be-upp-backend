const express = require('express');
const router = express.Router();
const {
  addFinalReportTemplate,
  //  getFinalReportTemplateByVersion,
  getFinalReportData,
} = require('../../service/final-report');
const { verifyToken } = require('../../service/authentication');
const { clone, responseError } = require('../../service/helper');


router.get('/by-id', verifyToken, async(req, res) => {
  try {
    const id = req.query ? req.query.id : false;
    if (!id) {
      throw Object.assign(
        new Error('Ausência de valores (requerido: appointmentId)'),
        { code: 402 },
      );
    }

    const frData = await getFinalReportData(req.params.id);

    res.send(frData);
  } catch (error) {
    console.log(error);
    // TODO error
    res.status(error.code).send(error.message);
  }
});

router.post('/new', verifyToken, async(req, res) => {
  try {
    const data = clone(req.body);
    const fr = await addFinalReportTemplate(data);

    res.send(fr._id);
  } catch (error) {
    console.log(error);
    responseError(res, error);
  }
});

module.exports = router;
