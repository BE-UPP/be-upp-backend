const express = require('express');
const router = express.Router();
const {
    createNewAppointment,
} = require('../../service/appointment');

router.post('/', async (req, res) => {

    try {
        const date = req.body.date;
        const patientId = req.body.patientId;
        const doctorId = req.body.doctorId;
        const appointment = await createNewAppointment(date, patientId, doctorId);
        res.send(appointment._id);
    } catch (error){
        console.log(error)
        // TODO error
        res.status(error.code).send(error.message);
    }
});

module.exports = router;