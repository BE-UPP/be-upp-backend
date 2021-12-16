const express = require('express');
const router = express.Router();
const {
  addFinalReportTemplate,
} = require('../../service/final-report');
const { clone, responseError } = require('../../service/helper');

router.post('/new', async(req, res) => {
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
