const mongoose = require('../../infra/database');
const { DoctorModel } = require('./doctor');
const { PatientModel } = require('./patient');

const AppointmentSchema = new mongoose.Schema({
  date: {
    type: Number,
    required: [true, 'date required'],
  },

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PatientModel,
    required: [true, 'patient required'],
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: DoctorModel,
    required: [true, 'doctor required'],
  },
});

const AppointmentModel = mongoose.model('AppointmentSchema', AppointmentSchema);

module.exports = AppointmentModel;
