const mongoose = require('mongoose');
const { DoctorModel } = require('../data/models/doctor');
const { generateToken } = require('./authentication');
const AppointmentModel = require('../data/models/appointment');

const getDoctorById = async (id) => {
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

const listAppointments = async (idDoctor) => {
  try {
    const appointments = await AppointmentModel.find({
      doctor: mongoose.Types.ObjectId(idDoctor),
    }, '_id date patient').populate('patient', '-password').sort({ date: 'asc' }).exec();

    const newAppointments = appointments.map((item) => {
      const difference = item.date - new Date();
      item.daysToAppointment = Math.floor(difference / 1000 / 60 / 60 / 24);
      return item;
    });

    return newAppointments;
  } catch (error) {
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }
};

const validateDoctorLogin = async (email, password) => {
  const doctor = await DoctorModel.findOne({ email: email }).exec();
  const err = {
    message: 'login authentication failed',
    code: 200,
  };
  if (doctor != null) {
    if (doctor.password === password) {

      const payload = {
        id: doctor._id,
        profile: 'doctor',
      };

      const token = generateToken(payload);
      console.log('token gerado com sucesso');

      return { doctor: doctor, token: token };
    } else {
      throw err;
    }
  } else {
    throw err;
  }
};

const createNewDoctor = async (name, email, password, cellphone, phone, profession) => {
  try {
    const doctor = {
      name: name,
      email: email,
      password: password,
      cellphone: cellphone,
      phone: phone,
      profession: profession,
    };
    const data = await DoctorModel.create(doctor);
    return data;
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
  listAppointments: listAppointments,
  createNewDoctor: createNewDoctor,
  validateDoctorLogin: validateDoctorLogin,
};
