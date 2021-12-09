const express = require('express');
const router = express.Router();
const {
  createNewPatient, getAllPatients,
} = require('../../service/patient');
const { verifyToken } = require('../../service/authentication');
const { responseError } = require('../../service/helper');

router.post('/new', verifyToken, async(req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const cpf = req.body.cpf;
    const cellphone = req.body.cellphone;
    const birth = req.body.birth;
    const password = req.body.password;
    if (!(name && email && cpf && cellphone && birth)) {
      throw Object.assign(
        new Error('Ausência de valores (requerido: name, email, cpf, cellphone, birth)'),
        { code: 400 },
      );
    }
    const patient = await createNewPatient(name, email, cpf, cellphone, birth, password);
    res.send(patient);
  } catch (error) {
    responseError(res, error);
  }
});

router.get('/all', verifyToken, async(req, res) => {
  try {
    const patients = await getAllPatients();
    res.send(patients);
  } catch (error) {
    responseError(res, error);
  }
});

module.exports = router;
