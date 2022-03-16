const AppointmentModel = require('../data/models/appointment');
const { getPatientById } = require('./patient');
const { getDoctorById } = require('./doctor');
const mongoose = require('mongoose');
// const mailer = require('../data/mail/mailer');

const getAppointmentById = async(id) => {
  try {
    const dado = await AppointmentModel.findById(id).exec();

    return dado;
  } catch (error) {
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }
};

const checkAppointment = async(id) => {
  try {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);

    if (isIdValid) {
      const dado = await getAppointmentById(id);
      return dado != null;
    }

    return false;
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
    const appointment = {
      date: date,
      patient: patient._id,
      doctor: doctor._id,
    };
    const result = await AppointmentModel.create(appointment);
    // const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    // const mailmessage = `
    //   Olá, ${patient.name} <br/> <br/>
    //   O profissional ${doctor.name} agendou uma consulta para
    //   ${new Date(date).toLocaleDateString('pt-br', options)}.
    //   <a href='http://${process.env.REACT_APP_API_DOMAIN}/fpc/${result._id}'
    //   target='_blank'>
    //   Clique aqui para preencher o formulário pré-consulta.
    //   </a>
    //   <br/> <br/>
    //   Atenciosamente, <br/>
    //   Equipe Qualime
    // `;
    // const mailOptions = {
    //   to: `${patient.email}`,
    //   subject: 'Qualime - Consulta Agendada',
    //   html: mailmessage,
    // };
    // mailer.sendMail(mailOptions, (error, response) => {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log('Mensagem enviada: ', response);
    //   }
    // });
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
  checkAppointment: checkAppointment,
};
