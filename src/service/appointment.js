const AppointmentModel = require('../data/models/appointment');
const { getPatientById } = require('./patient');
const { getDoctorById } = require('./doctor');
const { getLatestTemplate } = require('./template');
// const mailer = require('../data/mail/mailer');

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

const getTemplateWithPatientData = async(appointmentId) => {
  try {
    const template = await getLatestTemplate();
    const appointment = await getAppointmentById(appointmentId);
    const patient = await getPatientById(appointment.patient);
    for (const page of template.pages) {
      console.log(page);
      if (page.questions.hasOwnProperty('name')) {
        page.questions.name.initialValue = patient.name;
      }
      if (page.questions.hasOwnProperty('email')) {
        page.questions.email.initialValue = patient.email;
      }
      // if (page.questions.hasOwnProperty('telephone')) {
      //   page.questions.telephone.initialValue = patient.cellphone;
      // }
    }

    return template;
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
  getTemplateWithPatientData: getTemplateWithPatientData,
};
