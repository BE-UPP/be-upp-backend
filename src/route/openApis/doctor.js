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
    const rcn = req.body.rcn;
    const doctor = await createNewDoctor(name, email, password, cellphone, phone, rcn);
    res.send(omit(doctor._doc, 'password'));
  } catch (error){
    // console.log(error)
    // TODO error
    res.status(error.code).send(error.message);
  }
});

router.post('/login', async(req, res) => {

  try {
    const email = req.body.email;
    const password = req.body.password;
    const doctor = await validateDoctorLogin(email, password);
    res.send(omit(doctor._doc, 'password'));
  } catch (error){
    // console.log(error)
    // TODO error
    res.status(error.code).send(error.message);
  }
});

module.exports = router;
