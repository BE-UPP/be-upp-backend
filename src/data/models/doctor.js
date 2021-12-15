const mongoose = require('../../infra/database');

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name required'],
    validate: s => (typeof s === 'string' || s instanceof String)
        && s.length > 0,
  },

  email: {
    type: String,
    required: [true, 'email required'],
    validate: s => (typeof s === 'string' || s instanceof String)
        && s.length > 0,
    unique: true,
  },

  password: {
    type: String,
    validate: s => (typeof s === 'string' || s instanceof String)
        && s.length > 5,
    required: [true, 'password required'],
  },

  cellphone: {
    type: String,
    validate: s => (typeof s === 'string' || s instanceof String)
        && s.length > 0,
    required: [true, 'cellphone required'],
  },

  phone: {
    type: String,
  },

  profession: { /* numero do conselho regional */
    type: String,
    validate: s => (typeof s === 'string' || s instanceof String)
        && s.length > 0,
    required: [true, 'profession required'],
  },
});

const DoctorModel = mongoose.model('DoctorSchema', DoctorSchema);

module.exports = {
  DoctorModel: DoctorModel,
  DoctorSchema: DoctorSchema,
};
