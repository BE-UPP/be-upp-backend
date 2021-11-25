const mongoose = require('../../infra/database');

const AppointmentSchema = new mongoose.Schema({
  date: {
    type: Number,
    required: [true, 'date required'],
  },

  patient: {
    type: Object,
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    cellphone: String,
    required: [true, 'patient required'],
  },

  doctor: {
    type: Object,
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    cellphone: String,
    required: [true, 'doctor required'],
  },
});

const AppointmentModel = mongoose.model('AppointmentSchema', AppointmentSchema);

module.exports = AppointmentModel;
