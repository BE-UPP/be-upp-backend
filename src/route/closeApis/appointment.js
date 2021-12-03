const express = require('express');
const router = express.Router();
const {
  createNewAppointment,
} = require('../../service/appointment');
const { verifyToken } = require('../../service/authentication');
const { responseError } = require('../../service/helper');

router.post('/', verifyToken, async(req, res) => {
  console.log(req.body);
  try {
    const date = req.body.date;
    const patientId = req.body.patientId;
    const doctorId = req.body.doctorId;
    if (! (date && patientId && doctorId)) {
      return responseError(res, {message: "Falha ao ler date, patientId, e doctorId"});
    }
    const appointment = await createNewAppointment(date, patientId, doctorId);
    res.send(appointment._id);
  } catch (error){
    // console.log(error)
    // TODO error
    res.status(error.code).send(error.message);
  }
});

module.exports = router;
