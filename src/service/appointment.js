const AppointmentModel = require('../data/models/appointment');
const { getPatientById } = require('./patient')
const { getDoctorById } = require('./doctor')

const createNewAppointment = async (date, patientId, doctorId) => {
    try {
        const patient = getPatientById(patientId);
        const doctor = getDoctorById(doctorId);
        const appointment = {
            date: date,
            patient: patient,
            doctor: doctor
        }
        const result = await AppointmentModel.create(appointment);
        return result;
    } catch (error){
        throw {
            error: error.message,
            code: 400
        }
    }
}

module.exports = {
    createNewAppointment: createNewAppointment
}