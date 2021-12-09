const express = require('express');
const router = express.Router();
const {
  getTemplateById,
  getLatestTemplate,
  setTemplate,
} = require('../../service/template');
const { responseError } = require('../../service/helper');

router.get('/by-id/:id', async(req, res) => {
  try {
    const id = req.params ? req.params.id : false;
    if (!id)
      throw Object.assign(
        new Error('Ausência de valores (requerido: id)'),
        { code: 400 },
      );
    const template = await getTemplateById(id);
    res.send(template);
  } catch (error) {
    responseError(res, error);
  }
});

router.get('/latest', async(req, res) => {
  try {
    const template = await getLatestTemplate();
    res.send(template);
  } catch (error) {
    responseError(res, error);
  }
});

router.post('/new', async(req, res) => {
  try {
    const pages = req.body.pages;
    const template = await setTemplate(pages);
    res.send(template);
  } catch (error) {
    responseError(res, error);
  }
});

module.exports = router;
