const express = require('express');
const router = express.Router();
const {
  getTemplateById,
  getLatestTemplate,
  setTemplate
} = require('../../service/template');

router.get('/by-id/:id', async (req, res) => {
  const id = req.params ? req.params.id : false;
  if (!id) {
    // TODO error
  }

  try {
    const template = await getTemplateById(id);
    res.send(template);
  } catch (error) {
    console.log(error)
    // TODO error
    res.status(error.code).send(error.message);
  }
});

router.get('/latest', async (req, res) => {
  try {
    const template = await getLatestTemplate();
    res.send(template);
  } catch (error) {
    console.log(error)
    // TODO error
    res.status(error.code).send(error.message);
  }
});

router.post('/', async (req, res) => {

  const pages = req.body.pages

  try {
    const template = await setTemplate(pages);
    res.send(template);
  }catch (error){
    console.log(error)
    // TODO error
    res.status(error.code).send(error.message);
  }
});

module.exports = router;