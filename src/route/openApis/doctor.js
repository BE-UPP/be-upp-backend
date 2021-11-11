const express = require('express');
const router = express.Router();
const {
  createNewDoctor,
  validateDoctorLogin,
} = require('../../service/doctor');

router.post('/', async(req, res) => {

  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const doctor = await createNewDoctor(name, email, password);
    res.send(doctor);
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
    res.send(doctor);
  } catch (error){
    // console.log(error)
    // TODO error
    res.status(error.code).send(error.message);
  }
});

module.exports = router;
