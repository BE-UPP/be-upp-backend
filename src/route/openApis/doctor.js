const express = require('express');
const router = express.Router();
const {
  createNewDoctor,
  validateDoctorLogin,
} = require('../../service/doctor');
const { omit } = require('../../service/helper');

router.post('/', async(req, res) => {

  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const cellphone = req.body.cellphone;
    const phone = req.body.phone;
    const profession = req.body.profession;
    const doctor = await createNewDoctor(name, email, password, cellphone,
      phone, profession);
    res.send(omit(doctor._doc, 'password'));
  } catch (error){
    res.status(error.code).send(error.message);
  }
});

router.post('/login', async(req, res) => {
  console.log(req.body);
  try {
    const email = req.body.emailLogin;
    const password = req.body.passwordLogin;
    const {doctor, token} = await validateDoctorLogin(email, password);
    res.send({doctor: omit(doctor._doc, 'password'), token: token});
  } catch (error){
    res.status(error.code).send(error.message);
  }
});

module.exports = router;
