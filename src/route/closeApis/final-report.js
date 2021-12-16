const express = require('express');
const router = express.Router();
const {
  getFinalReportData,
} = require('../../service/final-report');
const { verifyToken } = require('../../service/authentication');


router.get('/by-id', verifyToken, async(req, res) => {
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

module.exports = router;
