const FormDataModel = require('../data/models/form-data');
const { getAppointmentById } = require('./appointment');
const mongoose = require('mongoose');

const addFormData = async(data) => {
  try {
    const answerAt = Date.now();
    data.answeredAt = answerAt;
    await getAppointmentById(data.appointmentId);

    const dado = await FormDataModel.create(data);
    return dado;
  } catch (error) {
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }
};

const getFormDataByAppointmentId = async(id) => {
  try {
    const formData = await FormDataModel.findOne({ appointmentId: id}).exec();
    return formData;
  } catch (error) {
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }
};

const checkFormData = async(id) => {
  try {
    const isIdValid = mongoose.Types.ObjectId.isValid(id);

    if (isIdValid) {
      const dado = await getFormDataByAppointmentId(id);
      return dado;
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

module.exports = {
  addFormData: addFormData,
  getFormDataByAppointmentId: getFormDataByAppointmentId,
  checkFormData: checkFormData,
};
