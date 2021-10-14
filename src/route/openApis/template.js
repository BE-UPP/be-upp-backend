const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  console.log('aqui')
  res.send('Hello World with Express')
});

module.exports = router;