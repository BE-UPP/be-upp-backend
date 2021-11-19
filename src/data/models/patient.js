const mongoose = require('../../infra/database');

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
    unique: true,
  },

  cpf: {
    type: String,
    validate: s => (typeof s === 'string' || s instanceof String)
        && s.length === 11,
    required: [true, 'cpf required'],
    unique: true,
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
});

const PatientModel = mongoose.model('PatientSchema', PatientSchema);

module.exports = {
  PatientModel: PatientModel,
  PatientSchema: PatientSchema,
};
