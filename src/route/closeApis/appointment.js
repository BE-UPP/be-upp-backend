const express = require('express');
const router = express.Router();
const {
  getAppointmentById,
  createNewAppointment,
} = require('../../service/appointment');
const { verifyToken } = require('../../service/authentication');
const { responseError } = require('../../service/helper');


router.get('/by-id/:id', verifyToken, async(req, res) => {

  try {
    const id = req.params ? req.params.id : false;
    if (!id) {
      throw {
        code: 400,
        message: 'Ausência de valores (requerido: appointmentId)',
      };
    }
    const template = await getAppointmentById(id);
    res.send(template);
  } catch (error) {
    console.log(error);
    // TODO error
    res.status(error.code).send(error.message);
  }
});

router.post('/new', verifyToken, async(req, res) => {
  try {
    const date = req.body.date;
    const patientId = req.body.patientId;
    const doctorId = req.body.doctorId;
    if (!(date && patientId && doctorId))
      throw {
        code: 400,
        message: 'Ausência de valores (requerido: date, patientId, doctorId)',
      };
    const appointment = await createNewAppointment(date, patientId, doctorId);
    res.send(appointment._id);
  } catch (error) {
    responseError(res, error);
  }
});

module.exports = router;
