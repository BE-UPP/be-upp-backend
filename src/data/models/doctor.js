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
    validate: s => (typeof s === 'string' || s instanceof String)
        && s.length > 0,
    required: [true, 'phone required'],
  },

  rcn: { /* numero do conselho regional */
    type: String,
    validate: s => (typeof s === 'string' || s instanceof String)
        && s.length > 0 && s.length <= 15,
    required: [true, 'rcn required'],
  },
});

const DoctorModel = mongoose.model('DoctorSchema', DoctorSchema);

module.exports = {
  DoctorModel: DoctorModel,
  DoctorSchema: DoctorSchema,
};
