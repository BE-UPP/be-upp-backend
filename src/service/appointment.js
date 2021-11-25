const AppointmentModel = require('../data/models/appointment');
const { getPatientById } = require('./patient');
const { getDoctorById } = require('./doctor');

const getAppointmentById = async(id) => {
  try {
    const dado = await AppointmentModel.findById(id).exec();
    if (dado === null){
      const err = {
        message: 'Appointment does not exist',
        code: 400,
      };
      throw err;
    }

    return dado;
  } catch (error) {
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }
};

const createNewAppointment = async(date, patientId, doctorId) => {
  try {
    const patient = await getPatientById(patientId);
    const doctor = await getDoctorById(doctorId);
    const patientInfo = {
      id: patient._id,
      name: patient.name,
      email: patient.email,
      cellphone: patient.cellphone,
    };
    const doctorInfo = {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      cellphone: doctor.cellphone,
    };
    const appointment = {
      date: date,
      patient: patientInfo,
      doctor: doctorInfo,
    };
    const result = await AppointmentModel.create(appointment);
    return result;
  } catch (error){
    const err = {
      error: error.message,
      code: 400,
    };
    throw err;
  }
};

module.exports = {
  createNewAppointment: createNewAppointment,
  getAppointmentById: getAppointmentById,
};
