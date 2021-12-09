const express = require('express');
const router = express.Router();

const { addProcessData, getProcessData } = require('../../service/data-processing');

router.get('/by-version/:version', async(req, res) => {
  const version = req.params ? req.params.version : null;
  if (version === null) {
    // TODO error
  }

  try {
    const dataProcessing = await getProcessData(version);
    res.send(dataProcessing);
  } catch (error) {
    // console.log(error);
    // TODO error
    res.status(error.code).send(error.message);
  }
});


router.post('/', async(req, res) => {

  const dataProcessing = req.body;
  try {
    const dp = await addProcessData(dataProcessing);
    res.send(dp);
  } catch (error){
    console.log(error);
    // TODO error
    res.status(error.code).send(error.message);
  }
});

module.exports = router;
