const mongoose = require('../../infra/database');
const { DoctorModel } = require('./doctor');

const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: s => (typeof s === 'string' || s instanceof String)
        && s.length > 0,
    required: [true, 'name required'],
  },

  email: {
    type: String,
    validate: s => (typeof s === 'string' || s instanceof String)
        && s.length > 0,
    required: [true, 'email required'],
  },

  cpf: {
    type: String,
    validate: s => (typeof s === 'string' || s instanceof String)
        && s.length === 11,
    // required: [true, 'cpf required'],
  },

  cellphone: {
    type: String,
    validate: s => (typeof s === 'string' || s instanceof String)
        && s.length > 0,
    required: [true, 'cellphone required'],
  },

  birth: {
    type: Number,
    required: [true, 'birth required'],
  },

  password: {
    type: String,
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: DoctorModel,
    // required: [true, 'doctor required'], // TODO
  },
});

const PatientModel = mongoose.model('PatientSchema', PatientSchema);

module.exports = {
  PatientModel: PatientModel,
  PatientSchema: PatientSchema,
};
