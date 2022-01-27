const mongoose = require('../../infra/database');
const bcrypt = require('bcryptjs');

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
    validate: s => (typeof s === 'string' || s instanceof String),
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

const generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

const checkPassword = (passA, passB) => {
  return bcrypt.compareSync(passA, passB);
};

DoctorSchema.methods.generateHash = function hashPassword(){
  this.password = generateHash(this.password);
};

const DoctorModel = mongoose.model('DoctorSchema', DoctorSchema);

module.exports = {
  DoctorModel: DoctorModel,
  DoctorSchema: DoctorSchema,
  generateHash: generateHash,
  checkPassword: checkPassword,
};
