const { DoctorModel } = require('../data/models/doctor');

const getDoctorById = async(id) => {
  try {
    const dado = await DoctorModel.findById(id).exec();
    return dado;
  } catch (error) {
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }
};

const createNewDoctor = async(name, email, password) => {
  try {
    const doctor = {
      name: name,
      email: email,
      password: password,
    };
    const dado = await DoctorModel.create(doctor);
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
  getDoctorById: getDoctorById,
  createNewDoctor: createNewDoctor,
};
