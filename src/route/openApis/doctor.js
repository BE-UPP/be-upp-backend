const express = require('express');
const router = express.Router();
const {
  createNewDoctor,
  validateDoctorLogin,
} = require('../../service/doctor');
const { omit, responseError } = require('../../service/helper');

router.post('/new', async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const cellphone = req.body.cellphone;
    const phone = req.body.phone;
    const profession = req.body.profession;
    const password = req.body.password;
    if (!(name && email && profession && cellphone && phone && password))
      throw { code: 400, message: "Ausência de valores (requerido: name, email, profession, cellphone, phone, password" };
    const doctor = await createNewDoctor(name, email, password, cellphone, phone, profession);
    res.send(omit(doctor._doc, 'password'));
  } catch (error) {
    responseError(res, error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!(email && password))
      throw { code: 400, message: "Ausência de valores (requerido: email, password" };
    const { doctor, token } = await validateDoctorLogin(email, password);
    res.send({ doctor: omit(doctor._doc, 'password'), token: token });
  } catch (error) {
    responseError(res, error);
  }
});

module.exports = router;
