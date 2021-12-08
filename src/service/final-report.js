const Model = require('../data/models/final-report');
const { getAppointmentById } = require('./appointment');


const addFinalReportTemplate = async(data) => {
  try {
    data.isTemplate = true;
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

const getFinalReportTemplateByVersion = async(version) => {

  try {
    const dado = await Model.findOne({version: version, isTemplate: true}).exec();
    return dado;
  } catch (error) {
    const err = {
      err: error,
      code: 500,
    };
    throw err;
  }

};

const addFinalReportData = async(formData, variables) => {
  try {
    const data = await getFinalReportTemplateByVersion(formData.templateVersion);

    delete data.isTemplate;
    await getAppointmentById(formData.appointmentId);
    data.appointmentId = formData.appointmentId;

    for (let i in data.pages) {
      for (let j in data.pages[i].values) {
        data.pages[i].values[j] = String(variables[data.pages[i].values[j]]);
      }
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
  addFinalReportTemplate: addFinalReportTemplate,
  getFinalReportTemplateByVersion: getFinalReportTemplateByVersion,
  addFinalReportData: addFinalReportData,
};
