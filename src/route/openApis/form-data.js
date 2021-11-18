const express = require('express');
const router = express.Router();
const { addFormData } = require('../../service/form-data');

router.post('/', async (req, res) => {
  try {
    const data = await addFormData(req.body);
    ///processData(req.body);
    res.send(data);
  } catch (error) {
    // console.log(error);
    res.status(error.code).send(error.message);
  }
});

module.exports = router;
