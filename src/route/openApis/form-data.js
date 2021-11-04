const express = require('express');
const router = express.Router();
const { addFormData } = require('../../service/form-data');

router.post('/', async (req, res) => {
  try {
    const data = await addFormData(req.body);
    res.send(data);
  } catch (error) {
    // console.log(error);
    res.status(error.code).send(error.err.message);
  }
});

module.exports = router;