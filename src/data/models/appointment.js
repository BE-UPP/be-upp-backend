const mongoose = require('../../infra/database');
const { DoctorSchema } = require('./doctor');
const { PatientSchema } = require('./patient');

const AppointmentSchema = new mongoose.Schema({
  date: {
    type: Number,
    required: [true, 'date required'],
  },

  patient: {
    type: PatientSchema,
    required: [true, 'patient required'],
  },

  doctor: {
    type: DoctorSchema,
    required: [true, 'doctor required'],
  },
});

const AppointmentModel = mongoose.model('AppointmentSchema', AppointmentSchema);

module.exports = AppointmentModel;
