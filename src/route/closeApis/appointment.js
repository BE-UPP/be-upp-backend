const express = require('express');
const router = express.Router();
const {
  getAppointmentById,
  createNewAppointment,
} = require('../../service/appointment');
const { authorize } = require('../../service/authentication');
const { responseError } = require('../../service/helper');


router.get('/by-id/:id', authorize(), async(req, res) => {

  try {
    const id = req.params ? req.params.id : false;
    if (!id) {
      throw Object.assign(
        new Error('Ausência de valores (requerido: appointmentId)'),
        { code: 400 },
      );
    }
    const template = await getAppointmentById(id);
    res.send(template);
  } catch (error) {
    console.log(error);
    // TODO error
    res.status(error.code).send(error.message);
  }
});

router.post('/new', authorize(), async(req, res) => {
  try {
    const date = req.body.date;
    const patientId = req.body.patientId;
    const doctorId = req.body.doctorId;
    if (!(date && patientId && doctorId)) {
      throw Object.assign(
        new Error('Ausência de valores (requerido: date, patientId, doctorId)'),
        { code: 400 },
      );
    }
    const appointment = await createNewAppointment(date, patientId, doctorId);
    res.send(appointment._id);
  } catch (error) {
    responseError(res, error);
  }
});

module.exports = router;
