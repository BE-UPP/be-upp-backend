const Model = require('../data/models/form-data');
const { getAppointmentById } = require('./appointment');
const { getTemplateByVersion } = require('./template');

const addFormData = async(data) => {
  try {
    const answerAt = Date.now();
    data.answeredAt = answerAt;
    await getAppointmentById(data.appointmentId);
    let version = data.templateVersion;
    let template = await getTemplateByVersion(version);

    for (let i = 0; i < data.questions.lenght; i++) {
      let id = data.questions[i].id;
      let variables = template['questions'][id]['variables'];
      data.questions[i].variables = variables;
    }

    const dado = await Model.create(data);
    return dado;
  } catch (error) {
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }
};


module.exports = {
  addFormData: addFormData,
};
