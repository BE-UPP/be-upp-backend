const express = require('express');
const router = express.Router();
const { getTemplateById, getLastestTemplate } = require('../../service/template');

router.get('/by-id/:id', async (req, res) => {
  const id = req.params ? req.params.id : false;
  if(!id) {
    // TODO error
  }

  try {
    const template = await getTemplateById(id);
    res.send(template);
  }catch (error){
    console.log(error)
    // TODO error
    res.send(error.message);
  }
});

router.get('/latest', async (req, res) => {
  try {
    const template = await getLastestTemplate();
    res.send(template);
  }catch (error){
    console.log(error)
    // TODO error
    res.send(error.message);
  }
});

module.exports = router;