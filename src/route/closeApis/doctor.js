const express = require('express');
const router = express.Router();
const {
  listAppointments,
} = require('../../service/doctor');
const { verifyToken } = require('../../service/authentication');
const { responseError } = require('../../service/helper');

router.get('/appointments', verifyToken, async(req, res) => {

  try {
    const idDoctor = req.body.id;
    if (!idDoctor)
      return responseError(res, {message: "id do doutor não enviado"});
    const appointments = await listAppointments(idDoctor);
    res.send(appointments);
  } catch (error) {
    console.log(error)
    // TODO error
    res.status(error.code).send(error.message);
  }
});

module.exports = router;
