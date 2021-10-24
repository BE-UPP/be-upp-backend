const Model = require('../data/models/form-data');

const addFormData = async (data) => {
  try {
    const answerAt = Date.now();
    data.answeredAt = answerAt;
    const dado = await Model.create(data);
    return dado;
  } catch (error) {
    throw {
      message: error.message,
      code: 400
    }
  }

}


module.exports = {
  addFormData: addFormData
};