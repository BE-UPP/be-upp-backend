const express = require('express');
const router = express.Router();
const {
  getAppointmentById,
  createNewAppointment,
} = require('../../service/appointment');


router.get('/by-id/:id', async(req, res) => {
  const id = req.params ? req.params.id : false;
  if (!id) {
    // TODO error
  }

  try {
    const template = await getAppointmentById(id);
    res.send(template);
  } catch (error) {
    // console.log(error);
    // TODO error
    res.status(error.code).send(error.message);
  }
});

router.post('/', async(req, res) => {

  try {
    const date = req.body.date;
    const patientId = req.body.patientId;
    const doctorId = req.body.doctorId;
    const appointment = await createNewAppointment(date, patientId, doctorId);
    res.send(appointment._id);
  } catch (error){
    // console.log(error)
    // TODO error
    res.status(error.code).send(error.message);
  }
});

module.exports = router;
