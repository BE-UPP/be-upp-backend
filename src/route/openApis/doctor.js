const express = require('express');
const router = express.Router();
const {
  createNewDoctor,
  validateDoctorLogin,
} = require('../../service/doctor');
const { omit, responseError } = require('../../service/helper');

router.post('/new', async(req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const cellphone = req.body.cellphone;
    const phone = req.body.phone;
    const profession = req.body.profession;
    const password = req.body.password;
    if (!(name && email && profession && cellphone && password))
      throw Object.assign(
        new Error('Ausência de valores ' +
        '(requerido: name, email, profession, cellphone, password)'),
        { code: 402 },
      );
    let doctor;
    doctor = await createNewDoctor(name, email, password, cellphone, phone, profession);
    res.send(omit(doctor._doc, 'password'));
  } catch (error) {
    responseError(res, error);
  }
});

router.post('/login', async(req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);
    if (!(email && password))
      throw Object.assign(
        new Error('Ausência de valores (requerido: email, password)'),
        { code: 400 },
      );
    const { doctor, token } = await validateDoctorLogin(email, password);
    res.send({ doctor: omit(doctor._doc, 'password'), token: token });
  } catch (error) {
    responseError(res, error);
  }
});

module.exports = router;
