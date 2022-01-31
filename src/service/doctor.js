const mongoose = require('mongoose');
const { DoctorModel, generateHash, checkPassword } = require('../data/models/doctor');
const { generateToken } = require('./authentication');
const AppointmentModel = require('../data/models/appointment');

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

const listUsers = async() => {
  try {
    const users = await DoctorModel.find({role: 'user'}).exec();

    return users;
  } catch (error){
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }
};

const changeAccount = async(id) => {
  try {
    const doctor = await getDoctorById(id);
    doctor.status = !doctor.status;
    doctor.save();

    return doctor;
  } catch (error){
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }
};

const listAppointments = async(idDoctor) => {
  try {
    const appointments = await AppointmentModel.find({
      doctor: mongoose.Types.ObjectId(idDoctor),
    }, '_id date patient').populate('patient', '-password').sort({ date: 'asc' }).exec();

    const newAppointments = appointments.map((item) => {
      const temp = {...item._doc};
      const difference = item.date - new Date();
      temp.daysToAppointment = Math.floor(difference / 1000 / 60 / 60 / 24);
      return temp;
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

const validateDoctorLogin = async(email, password) => {
  const doctor = await DoctorModel.findOne({ email: email }).exec();
  const err = {
    message: 'login authentication failed',
    code: 400,
  };
  if (doctor != null) {
    if (checkPassword(password, doctor.password)) {

      const payload = {
        id: doctor._id,
        status: doctor.status,
        role: doctor.role,
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

const createNewDoctor = async(name, email, password, cellphone, phone, profession) => {
  try {
    const doctor = {
      name: name,
      email: email,
      password: password,
      cellphone: cellphone,
      phone: phone,
      profession: profession,
      status: false,
      role: 'user',
    };

    if (doctor.password.length < 6){
      const err = { message: 'Senha muito curta'};
      throw err;
    }

    doctor.password = generateHash(doctor.password);
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
  listUsers: listUsers,
  changeAccount: changeAccount,
};
